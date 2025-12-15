import Fastify from 'fastify';
import { fastifyMiddie } from '@fastify/middie';
import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { x402Client, wrapFetchWithPayment } from '@x402/fetch';
import { registerExactEvmScheme } from '@x402/evm/exact/client';
import { privateKeyToAccount } from 'viem/accounts';
import { paywallMiddleware } from '../src/middlewares/paywall.js';
import x402Test from '../src/routes/x402-test/index.js';

import * as dotenv from 'dotenv';

dotenv.config();

const hasBuyerEnv = !!process.env.X402_TEST_PRIVATE_KEY;

// Only run the full buyer flow test when env vars are configured
const maybeIt = hasBuyerEnv ? it : it.skip;

let app: ReturnType<typeof Fastify>;
let baseUrl: string;

beforeAll(async () => {
  app = Fastify({ logger: false });

  await app.register(fastifyMiddie, { hook: 'onRequest' });
  app.use(paywallMiddleware() as any);

  await app.register(x402Test, { prefix: '/x402-test' });

  const address = await app.listen({ port: 0, host: '127.0.0.1' });
  baseUrl =
    typeof address === 'string' ? address : `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await app.close();
});

describe('x402 buyer flow for /x402-test', () => {
  maybeIt('can use x402-fetch to pay for the /x402-test endpoint', async () => {
    const privateKey = process.env.X402_TEST_PRIVATE_KEY! as `0x${string}`;
    const signer = privateKeyToAccount(privateKey);

    const client = new x402Client();
    registerExactEvmScheme(client, { signer });

    const fetchWithPayment = wrapFetchWithPayment(fetch, client);

    const response = await fetchWithPayment(`${baseUrl}/x402-test`, {
      method: 'GET',
    });

    // If payment succeeds, the endpoint should eventually return 200
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual(
      expect.objectContaining({
        message: 'Hello, world from x402 test!',
      }),
    );

    // x402 server should include a payment response header
    const paymentResponseHeader = response.headers.get('x-payment-response');
    expect(paymentResponseHeader).toBeTruthy();
  });
});
