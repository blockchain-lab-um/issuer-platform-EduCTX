import Fastify from 'fastify';
import { fastifyMiddie } from '@fastify/middie';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { paywallMiddleware } from '../src/middlewares/paywall.js';
import x402Test from '../src/routes/x402-test/index.js';

let app: ReturnType<typeof Fastify>;

beforeAll(async () => {
  app = Fastify({ logger: false });

  await app.register(fastifyMiddie, { hook: 'onRequest' });
  app.use(paywallMiddleware() as any);

  // Register only the x402 test route under the same prefix used in production
  await app.register(x402Test, { prefix: '/x402-test' });

  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('x402 test endpoint', () => {
  it('returns 402 for GET /x402-test without X-PAYMENT header', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/x402-test',
    });

    expect(response.statusCode).toBe(402);
  });
});
