import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import credentials from '../apps/issuer-service/dist/routes/credentials/index.js';

const fromIssuer = createRequire(
  new URL('../apps/issuer-service/package.json', import.meta.url),
);
const server = fromIssuer('fastify')();
process.env.API_KEY = 'credential-list-test';

const base64 = (value) =>
  Buffer.from(JSON.stringify(value)).toString('base64url');
const jwt = (id) =>
  `${base64({ alg: 'ES256', typ: 'JWT' })}.${base64({
    vc: { id },
  })}.c2lnbmF0dXJl`;

server.decorate('issuedCredentialCache', {
  all: () => ({
    sd: { issuedAt: '2026-02-01', credential: `${jwt('sd')}~disclosure~` },
    regular: { issuedAt: '2026-01-01', credential: jwt('regular') },
    pending: { issuedAt: '2026-03-01', credential: null },
  }),
});
server.decorate('revocationCache', {
  get: (id) => (id === 'sd' ? 'revocation' : undefined),
});
server.register(credentials, { prefix: '/credentials' });

try {
  const response = await server.inject({
    url: '/credentials',
    headers: { 'x-api-key': process.env.API_KEY },
  });
  assert.equal(response.statusCode, 200, response.body);
  assert.deepEqual(
    response.json().map(({ credential, isRevoked }) => ({
      id: credential?.vc.id ?? null,
      isRevoked,
    })),
    [
      { id: 'regular', isRevoked: false },
      { id: 'sd', isRevoked: true },
      { id: null, isRevoked: false },
    ],
  );
} finally {
  await server.close();
}
