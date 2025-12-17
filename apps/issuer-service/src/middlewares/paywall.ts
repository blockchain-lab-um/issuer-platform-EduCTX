import { paymentMiddleware } from 'x402-express';
import type { IncomingMessage, ServerResponse } from 'node:http';

type NextFunction = (err?: unknown) => void;

// Pre-configured x402-express middleware instance
const expressPaywall = paymentMiddleware(
  '0x32B1172E786a31A65b46710Cd946b2521e13ac96',
  {
    // Route configurations for protected endpoints
    '/x402-test': {
      // USDC amount in dollars
      price: '$0.0001',
      network: 'base-sepolia',
    },
    '/oidc/create-credential-offer': {
      // USDC amount in dollars
      price: '$0.0001',
      network: 'base-sepolia',
    },
  },
  {
    url: 'https://x402.org/facilitator',
  },
);

// Fastify + middie compatible wrapper
export function paywallMiddleware() {
  return (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
    const anyReq = req as any;
    const anyRes = res as any;

    // Ensure Express-like URL fields
    anyReq.originalUrl = anyReq.originalUrl ?? anyReq.url;
    anyReq.path =
      anyReq.path ??
      (typeof anyReq.url === 'string' ? anyReq.url.split('?')[0] ?? '/' : '/');

    // Express-style header(name) helper
    if (!anyReq.header) {
      anyReq.header = (name: string) =>
        anyReq.headers?.[String(name).toLowerCase()];
    }

    // Express-style response helpers
    if (!anyRes.status) {
      anyRes.status = (code: number) => {
        res.statusCode = code;
        return anyRes;
      };
    }

    if (!anyRes.json) {
      anyRes.json = (body: unknown) => {
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(body));
      };
    }

    if (!anyRes.send) {
      anyRes.send = (body: unknown) => {
        if (typeof body === 'object') {
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify(body));
        } else {
          res.end(String(body));
        }
      };
    }

    // Delegate to x402-express middleware
    void (expressPaywall as any)(req, res, next);
  };
}
