import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const dashboard = new URL('../apps/dashboard/', import.meta.url);
const require = createRequire(new URL('package.json', dashboard));
const { encode } = require('next-auth/jwt');
const secret = randomBytes(32).toString('hex');
const listener = createServer();
listener.listen(0, '127.0.0.1');
await once(listener, 'listening');
const port = listener.address().port;
await new Promise((resolve) => listener.close(resolve));
const origin = `http://127.0.0.1:${port}`;

// Exercise the same standalone server used by the Docker image, with test-only credentials.
const server = spawn(
  process.execPath,
  [
    fileURLToPath(
      new URL('.next/standalone/apps/dashboard/server.js', dashboard),
    ),
  ],
  {
    cwd: fileURLToPath(dashboard),
    env: {
      PATH: process.env.PATH,
      NODE_ENV: 'production',
      HOSTNAME: '127.0.0.1',
      PORT: String(port),
      NEXTAUTH_URL: origin,
      NEXTAUTH_SECRET: secret,
      AZURE_AD_CLIENT_ID: '00000000-0000-0000-0000-000000000000',
      AZURE_AD_CLIENT_SECRET: 'local-auth-test',
      AZURE_AD_TENANT_ID: '00000000-0000-0000-0000-000000000000',
      AUTHORIZED_ACCOUNTS: 'admin@example.test',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);
let logs = '';
for (const stream of [server.stdout, server.stderr]) {
  stream.on('data', (chunk) => {
    logs = (logs + chunk).slice(-8000);
  });
}
const exited = once(server, 'exit');

async function request(path, options = {}) {
  return fetch(`${origin}${path}`, {
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
    ...options,
  });
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw new Error('Standalone server exited');
    try {
      const response = await request('/api/auth/providers');
      if (response.ok) {
        const providers = await response.json();
        assert.ok(providers['azure-ad']);
        assert.equal(providers.credentials, undefined);
        ready = true;
        break;
      }
    } catch {
      // Wait for the production server to bind its loopback port.
    }
    await delay(250);
  }
  assert.ok(ready, 'Standalone server did not become ready');

  const attacks = [
    {},
    { 'x-middleware-subrequest': 'middleware' },
    { 'x-middleware-subrequest': Array(5).fill('middleware').join(':') },
    { 'X-Middleware-Subrequest': Array(5).fill('src/middleware').join(':') },
  ];
  for (const headers of attacks) {
    for (const path of ['/issue', '/credentials']) {
      const response = await request(path, { headers });
      assert.equal(
        response.status,
        307,
        `Unauthenticated ${path} must redirect`,
      );
      assert.equal(
        new URL(response.headers.get('location'), origin).pathname,
        '/',
      );
    }
    for (const path of [
      '/api/issue-oidc',
      '/api/issue-deferred',
      '/api/revoke-credential/test',
    ]) {
      const response = await request(path, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'x-api-key': 'wrong-key',
        },
        body: '{}',
      });
      assert.equal(
        response.status,
        401,
        `Unauthenticated ${path} must be denied`,
      );
    }
  }

  const jwt = await encode({
    secret,
    token: {
      sub: 'test-member',
      email: 'member@example.test',
      name: 'Test Member',
    },
  });
  const headers = { cookie: `next-auth.session-token=${jwt}` };
  assert.equal(
    (await request('/issue', { headers })).status,
    200,
    'A signed-in user can open issuance',
  );
  const login = await request('/api/login', { headers });
  assert.equal(login.status, 200);
  assert.deepEqual(await login.json(), { id: 1 });
  const credentials = await request('/credentials', { headers });
  assert.equal(credentials.status, 200);
  assert.match(await credentials.text(), /Not authorized/);
  const revoke = await request('/api/revoke-credential/test', {
    method: 'POST',
    headers,
    body: '{}',
  });
  assert.equal(
    revoke.status,
    401,
    'A non-allowlisted user cannot revoke credentials',
  );
  console.log(
    'PASS: production middleware bypass cases, API denial, signed-session access, and email allowlist',
  );
} catch (error) {
  console.error(logs);
  throw error;
} finally {
  server.kill('SIGTERM');
  const timeout = setTimeout(() => server.kill('SIGKILL'), 5000);
  await exited;
  clearTimeout(timeout);
}
