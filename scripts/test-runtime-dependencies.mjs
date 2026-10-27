import assert from 'node:assert/strict';
import { createHash, pbkdf2Sync } from 'node:crypto';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const from = (file) => createRequire(path.join(root, file));
const shared = from('libs/shared/package.json');
const issuer = from('apps/issuer-service/package.json');
const axios = (
  await import(
    pathToFileURL(
      path.join(path.dirname(shared.resolve('axios/package.json')), 'index.js'),
    )
  )
).default;
const directory = await mkdtemp(path.join(tmpdir(), 'eductx-runtime-'));

try {
  assert.equal(process.versions.node.split('.')[0], '24');
  // Check every locked copy, including vendor dependencies with exact pins.
  const expected = {
    axios: '1.21.0',
    'form-data': '4.0.6',
    elliptic: '6.6.1',
    secp256k1: '5.0.2',
    pbkdf2: '3.1.7',
    'sha.js': '2.4.12',
    'cipher-base': '1.0.6',
    undici: '6.29.1',
  };
  const entries = await readdir(path.join(root, 'node_modules/.pnpm'));
  const lock = await readFile(path.join(root, 'pnpm-lock.yaml'), 'utf8');
  for (const [name, version] of Object.entries(expected)) {
    const copies = lock
      .split('\n')
      .filter((entry) => entry.startsWith(`  ${name}@`));
    assert.ok(copies.length, `${name} is installed`);
    for (const copy of copies) {
      assert.equal(
        copy.trim().split('@')[1].split('(')[0].split(':')[0],
        version,
        copy,
      );
    }
  }

  for (const name of [
    '@cef-ebsi/ebsi-did-resolver',
    '@cef-ebsi/verifiable-credential',
  ]) {
    const vendor = createRequire(issuer.resolve(name));
    assert.equal(
      vendor.resolve('axios/package.json'),
      shared.resolve('axios/package.json'),
      `${name} shares the EBSI cache adapter`,
    );
  }

  const server = createServer(async (request, response) => {
    let body = '';
    for await (const chunk of request) body += chunk;
    assert.match(
      request.headers['content-type'],
      /^multipart\/form-data; boundary=/,
    );
    assert.match(body, /name="credential"/);
    assert.match(body, /test-credential/);
    response.setHeader('content-type', 'application/json');
    response.end('{"received":true}');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const FormData = createRequire(shared.resolve('axios'))('form-data');
    const form = new FormData();
    form.append('credential', 'test-credential');
    const response = await axios.post(
      `http://127.0.0.1:${server.address().port}`,
      form,
      {
        headers: form.getHeaders(),
        proxy: false,
        timeout: 5000,
      },
    );
    assert.deepEqual(response.data, { received: true });
    // Data URLs must not allocate an unbounded decoded response.
    await assert.rejects(
      axios.get(
        `data:text/plain;base64,${Buffer.alloc(1024).toString('base64')}`,
        {
          maxContentLength: 32,
        },
      ),
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }

  for (const app of [
    'authorization-service',
    'issuer-service',
    'eductx-platform-backend',
  ]) {
    const require = from(`apps/${app}/package.json`);
    const fastify = require('fastify')({ bodyLimit: 128 });
    fastify.post(
      '/credential',
      {
        schema: {
          body: {
            type: 'object',
            required: ['credential'],
            properties: { credential: { type: 'string' } },
          },
        },
      },
      async (request) => request.body,
    );
    try {
      assert.equal(
        (
          await fastify.inject({
            method: 'POST',
            url: '/credential',
            payload: { credential: 'ok' },
          })
        ).statusCode,
        200,
      );
      assert.equal(
        (
          await fastify.inject({
            method: 'POST',
            url: '/credential',
            payload: {},
          })
        ).statusCode,
        400,
      );
      assert.equal(
        (
          await fastify.inject({
            method: 'POST',
            url: '/credential',
            payload: { credential: 'x'.repeat(256) },
          })
        ).statusCode,
        413,
      );
    } finally {
      await fastify.close();
    }
    const { Level } = require('level');
    const location = path.join(directory, app);
    let db = new Level(location);
    await db.put('credential', 'retained');
    await db.close();
    db = new Level(location);
    assert.equal(await db.get('credential'), 'retained');
    await db.close();
  }

  const { getKeyPair, getPublicJwk, installEbsiAxiosCache } = await import(
    '../libs/shared/dist/index.js'
  );
  const privateKey = '01'.padStart(64, '0');
  for (const alg of ['ES256', 'ES256K']) {
    const pair = await getKeyPair(privateKey, alg);
    const publicKey = `04${Buffer.from(pair.publicKeyJwk.x, 'base64url').toString('hex')}${Buffer.from(pair.publicKeyJwk.y, 'base64url').toString('hex')}`;
    assert.deepEqual(await getPublicJwk(publicKey, alg), pair.publicKeyJwk);
    await assert.rejects(getPublicJwk('00', alg));
  }
  const { createJWT, verifyJWT, ES256KSigner } = issuer('did-jwt');
  const pair = await getKeyPair(privateKey, 'ES256K');
  const token = await createJWT(
    { example: true },
    {
      issuer: 'did:example:runtime',
      signer: ES256KSigner(Buffer.from(privateKey, 'hex')),
    },
    { alg: 'ES256K' },
  );
  const resolver = {
    resolve: async () => ({
      didResolutionMetadata: {},
      didDocumentMetadata: {},
      didDocument: {
        id: 'did:example:runtime',
        verificationMethod: [
          {
            id: 'did:example:runtime#key',
            type: 'JsonWebKey2020',
            controller: 'did:example:runtime',
            publicKeyJwk: pair.publicKeyJwk,
          },
        ],
        assertionMethod: ['did:example:runtime#key'],
      },
    }),
  };
  assert.equal((await verifyJWT(token, { resolver })).payload.example, true);
  await assert.rejects(
    verifyJWT(
      `${token.slice(0, token.lastIndexOf('.') + 1)}${Buffer.alloc(64).toString('base64url')}`,
      { resolver },
    ),
  );

  // Native secp256k1 plus the patched browser crypto dependencies remain usable.
  const store = path.join(root, 'node_modules/.pnpm');
  const load = (name) =>
    createRequire(
      path.join(
        store,
        entries.find((entry) =>
          entry.startsWith(`${name.replace('/', '+')}@${expected[name] ?? ''}`),
        ),
        'package.json',
      ),
    )(name);
  const secp = load('secp256k1');
  const message = createHash('sha256').update('credential').digest();
  const key = Buffer.from(privateKey, 'hex');
  const signature = secp.ecdsaSign(message, key).signature;
  assert.equal(
    secp.ecdsaVerify(signature, message, secp.publicKeyCreate(key)),
    true,
  );
  assert.deepEqual(
    load('pbkdf2').pbkdf2Sync('password', 'salt', 2, 32, 'sha256'),
    pbkdf2Sync('password', 'salt', 2, 32, 'sha256'),
  );
  assert.deepEqual(
    load('sha.js')('sha256').update('credential').digest(),
    message,
  );
  load('cipher-base');

  // Exercise the compatibility adapter's Undici Agent with real local HTTP.
  const httpClient = load('@digitalbazaar/http-client');
  const http = await import('node:http');
  const agent = new http.Agent({ keepAlive: false });
  const endpoint = createServer((_request, response) => {
    response.setHeader('content-type', 'application/json');
    response.end('{"credential":"ok"}');
  });
  await new Promise((resolve) => endpoint.listen(0, '127.0.0.1', resolve));
  try {
    const response = await httpClient.httpClient.get(
      `http://127.0.0.1:${endpoint.address().port}`,
      { agent },
    );
    assert.equal(response.data.credential, 'ok');
  } finally {
    agent.destroy();
    await new Promise((resolve) => endpoint.close(resolve));
  }

  let requests = 0;
  axios.defaults.adapter = async (config) => {
    requests++;
    return {
      data: { credential: 'ok' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  };
  installEbsiAxiosCache({
    host: 'ebsi.example',
    cacheDir: path.join(directory, 'cache'),
  });
  await axios.get('https://ebsi.example/did-registry/v5/identifiers/example');
  await axios.get('https://ebsi.example/did-registry/v5/identifiers/example');
  assert.equal(requests, 1);
  await axios.get(
    'https://ebsi.example/trusted-issuers-registry/v5/issuers/example/attributes/one',
  );
  await axios.get(
    'https://ebsi.example/trusted-issuers-registry/v5/issuers/example/attributes/one',
  );
  assert.equal(requests, 3, 'issuer attributes stay fresh');
  console.log('Runtime dependency compatibility checks passed');
} finally {
  await rm(directory, { recursive: true, force: true });
}
// FlatCache owns a persistence timer; all resources used by this test are closed.
process.exit(0);
