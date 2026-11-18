import path from 'node:path';
import axios, {
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosHeaderValue,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { FlatCache } from 'flat-cache';

type CachedAxiosResponse = {
  data: unknown;
  headers: Record<string, AxiosHeaderValue>;
  status: number;
  statusText: string;
  cachedAt: number;
};

type EbsiAxiosCacheOptions = {
  host: string;
  cacheDir?: string;
  ttlMs?: number;
  logger?: {
    debug: (message: string) => void;
    warn: (message: string) => void;
  };
};

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const CACHEABLE_PATH_PREFIXES = [
  '/did-registry/',
  '/trusted-issuers-registry/',
  '/trusted-policies-registry/',
  '/trusted-schemas-registry/',
];
const TRUSTED_ISSUER_ATTRIBUTE_PATH =
  /^\/trusted-issuers-registry\/[^/]+\/issuers\/[^/]+\/attributes\//;

function getRequestUrl(config: InternalAxiosRequestConfig): URL | undefined {
  try {
    return new URL(axios.getUri(config));
  } catch {
    return undefined;
  }
}

function getCacheKey(config: InternalAxiosRequestConfig, url: URL): string {
  const acceptHeader =
    AxiosHeaders.from(config.headers).get('accept')?.toString() ?? '';

  return `${config.method?.toUpperCase() ?? 'GET'} ${url.toString()} ${acceptHeader}`;
}

function isCacheableEbsiGet(
  config: InternalAxiosRequestConfig,
  url: URL | undefined,
  host: string,
): url is URL {
  if (!url) {
    return false;
  }

  return (
    (config.method ?? 'get').toLowerCase() === 'get' &&
    url.protocol === 'https:' &&
    url.host === host &&
    !TRUSTED_ISSUER_ATTRIBUTE_PATH.test(url.pathname) &&
    CACHEABLE_PATH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))
  );
}

function fromCache(
  cached: CachedAxiosResponse,
  config: InternalAxiosRequestConfig,
): AxiosResponse {
  return {
    data: cached.data,
    headers: AxiosHeaders.from(cached.headers),
    status: cached.status,
    statusText: cached.statusText,
    config,
    request: undefined,
  };
}

function toCacheHeaders(
  headers: AxiosResponse['headers'],
): Record<string, AxiosHeaderValue> {
  const jsonHeaders =
    headers instanceof AxiosHeaders ? headers.toJSON() : headers;

  return Object.fromEntries(
    Object.entries(jsonHeaders).filter(([, value]) => value !== undefined),
  ) as Record<string, AxiosHeaderValue>;
}

function isFresh(cached: CachedAxiosResponse, ttlMs: number): boolean {
  return Date.now() - cached.cachedAt < ttlMs;
}

export function installEbsiAxiosCache({
  host,
  cacheDir = path.join(process.cwd(), 'db/ebsi-http-cache'),
  ttlMs = DEFAULT_TTL_MS,
  logger,
}: EbsiAxiosCacheOptions): void {
  const cache = new FlatCache({
    cacheDir,
    lruSize: 5000,
    persistInterval: 1000 * 30,
  });
  cache.load();

  const baseAdapter = axios.getAdapter(axios.defaults.adapter);

  const cachedAdapter: AxiosAdapter = async (config) => {
    const url = getRequestUrl(config);

    if (!isCacheableEbsiGet(config, url, host)) {
      return baseAdapter(config);
    }

    const cacheKey = getCacheKey(config, url);
    const cached = cache.get<CachedAxiosResponse>(cacheKey);

    if (cached && isFresh(cached, ttlMs)) {
      logger?.debug(`EBSI HTTP cache hit: ${url.toString()}`);
      return fromCache(cached, config);
    }

    try {
      const response = await baseAdapter(config);

      if (response.status >= 200 && response.status < 300) {
        cache.set(cacheKey, {
          data: response.data,
          headers: toCacheHeaders(response.headers),
          status: response.status,
          statusText: response.statusText,
          cachedAt: Date.now(),
        } satisfies CachedAxiosResponse);
      }

      return response;
    } catch (error) {
      const stale = cache.get<CachedAxiosResponse>(cacheKey);

      if (stale) {
        logger?.warn(`EBSI HTTP cache stale fallback: ${url.toString()}`);
        return fromCache(stale, config);
      }

      throw error;
    }
  };

  axios.defaults.adapter = cachedAdapter;
  logger?.debug(`EBSI HTTP cache enabled for ${host}`);
}
