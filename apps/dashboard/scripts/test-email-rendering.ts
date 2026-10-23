import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import { renderBasicEmail } from '../src/components/EmailTemplates/BasicEmail';
import { renderPinEmail } from '../src/components/EmailTemplates/PinEmail';

async function main() {
  const [basic, pin] = await Promise.all([
    renderBasicEmail({ qrCodeUrl: 'https://example.test/qr.png' }),
    renderPinEmail({ pin: '123456' }),
  ]);
  assert.ok(basic.includes('https://example.test/qr.png'));
  assert.ok(pin.includes('123456'));

  const transport = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
  });
  for (const html of [basic, pin]) {
    const result = await transport.sendMail({
      from: 'issuer@example.test',
      to: 'recipient@example.test',
      subject: 'Offline compatibility check',
      html,
    });
    assert.ok(Buffer.isBuffer(result.message));
    assert.ok(result.message.length > 0);
  }
  console.log(
    'PASS: credential and PIN emails render and compose without SMTP',
  );
}

const timeout = setTimeout(() => {
  console.error('Email rendering timed out');
  process.exit(1);
}, 15000);

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => clearTimeout(timeout));
