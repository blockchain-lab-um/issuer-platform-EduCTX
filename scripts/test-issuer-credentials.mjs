import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import credentials from '../apps/issuer-service/dist/routes/credentials/index.js';
import revocation from '../apps/issuer-service/dist/routes/revocation/index.js';

const fromIssuer = createRequire(
  new URL('../apps/issuer-service/package.json', import.meta.url),
);
const server = fromIssuer('fastify')();
process.env.API_KEY = 'credential-list-test';

const base64 = (value) =>
  Buffer.from(JSON.stringify(value)).toString('base64url');
const jwt = (payload) =>
  `${base64({ alg: 'ES256', typ: 'JWT' })}.${base64(payload)}.c2lnbmF0dXJl`;
const types = ['VerifiableCredential', 'CouponCredential'];
const sdId = 'urn:uuid:00000000-0000-4000-8000-000000000001';
const credentialSubject = { _sd: ['digest'] };

const issued = {
  'issuance-key': {
    issuedAt: '2026-02-01',
    format: 'sd-jwt',
    types,
    credential: `${jwt({ id: sdId, vct: types.join(','), credentialSubject })}~disclosure~`,
  },
  'legacy-issuance-key': {
    issuedAt: '2026-02-02',
    types,
    credential: `${jwt({ id: 'legacy-sd', vct: types.join(','), credentialSubject })}~disclosure~`,
  },
  regular: {
    issuedAt: '2026-01-01',
    credential: jwt({ vc: { id: 'regular' } }),
  },
  pending: { issuedAt: '2026-03-01', credential: null },
};
const revoked = new Map([
  ['regular', 'revocation'],
  ['legacy-sd', 'revocation'],
]);
const headers = { 'x-api-key': process.env.API_KEY };
server.decorate('issuedCredentialCache', {
  all: () => issued,
  get: (id) => issued[id],
});
server.decorate('revocationCache', {
  get: (id) => revoked.get(id),
  set: (id, value) => revoked.set(id, value),
});
server.decorate('config', {
  KEY_ALG: 'ES256K',
  PRIVATE_KEY: '1'.padStart(64, '0'),
  SERVER_URL: 'https://issuer.example',
  NETWORK: 'pilot',
});
server.decorate('issuerServerConfig', {
  did: 'did:example:issuer',
  kid: 'did:example:issuer#key-1',
});
server.register(credentials, { prefix: '/credentials' });
server.register(revocation, { prefix: '/revocation' });

try {
  const missing = await server.inject({
    method: 'POST',
    url: '/revocation/unknown',
    headers,
  });
  assert.equal(missing.statusCode, 404, missing.body);
  const before = await server.inject({ url: '/credentials', headers });
  assert.equal(before.statusCode, 200, before.body);
  assert.equal(before.json()[1].isRevoked, false);

  const revoke = await server.inject({
    method: 'POST',
    url: `/revocation/${encodeURIComponent(sdId)}`,
    headers,
  });
  assert.equal(revoke.statusCode, 200, revoke.body);
  assert.ok(revoked.has(sdId));
  assert.ok(!revoked.has('issuance-key'));

  const response = await server.inject({
    url: '/credentials',
    headers,
  });
  assert.equal(response.statusCode, 200, response.body);
  const rows = response.json();
  assert.deepEqual(rows[1].credential.vc, {
    id: sdId,
    type: types,
    credentialSubject,
  });
  assert.deepEqual(
    rows.map(({ credential, isRevoked }) => ({
      id: credential?.vc.id ?? null,
      isRevoked,
    })),
    [
      { id: 'regular', isRevoked: true },
      { id: sdId, isRevoked: true },
      { id: 'legacy-sd', isRevoked: true },
      { id: null, isRevoked: false },
    ],
  );
} finally {
  await server.close();
}
