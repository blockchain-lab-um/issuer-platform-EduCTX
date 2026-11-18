const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');

async function main() {
  assert.equal(process.versions.node, '24.22.1');
  assert.equal(process.versions.undici, '7.30.1');
  assert.equal(process.getuid(), 1001);
  const app = process.argv[2];
  const fromApp = createRequire(`/app/apps/${app}/package.json`);
  if (app === 'dashboard' || app === 'testing-frontend') {
    const fromNext = createRequire(fromApp.resolve('next'));
    const sharp = fromNext('sharp');
    const png = await sharp({
      create: { width: 2, height: 2, channels: 3, background: 'white' },
    })
      .png()
      .toBuffer();
    assert.equal((await sharp(png).metadata()).width, 2);
  } else {
    const fastify = fromApp('fastify')();
    fastify.get('/health', async () => ({ ok: true }));
    assert.equal((await fastify.inject('/health')).statusCode, 200);
    await fastify.close();
    const directory = await mkdtemp(path.join(tmpdir(), 'eductx-level-'));
    try {
      const { Level } = fromApp('level');
      const db = new Level(directory);
      await db.put('key', 'value');
      assert.equal(await db.get('key'), 'value');
      await db.close();
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
    if (app !== 'eductx-platform-backend') {
      const { getKeyPair } = fromApp(
        '@blockchain-lab-um/eductx-platform-shared',
      );
      assert.equal(
        (await getKeyPair('01'.padStart(64, '0'), 'ES256K')).publicKeyJwk.crv,
        'secp256k1',
      );
    }
  }
  console.log(
    `${app}: Node ${process.versions.node}, Undici ${process.versions.undici}, native modules OK`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
