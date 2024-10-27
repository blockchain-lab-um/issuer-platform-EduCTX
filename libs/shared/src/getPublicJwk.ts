import { base64url, calculateJwkThumbprint } from 'jose';
import type { JWK } from 'jose';
import elliptic from 'elliptic';
import type { JWKWithKid } from './types.js';

const { ec: EC } = elliptic;

export async function getPublicJwk(
  publicKey: string,
  alg: 'ES256' | 'ES256K',
): Promise<JWKWithKid> {
  if (!publicKey) {
    throw new Error('You must provide a non-empty hexadecimal public key');
  }

  const ctx = new EC(alg === 'ES256K' ? 'secp256k1' : 'p256');

  // Create key pair from hex public key
  const keyPair = ctx.keyFromPublic(publicKey, 'hex');

  // Validate key pair
  const validation = keyPair.validate();
  if (validation.result === false) {
    throw new Error(validation.reason);
  }

  // Format as JWK
  const pubPoint = keyPair.getPublic();
  const jwk: JWK = {
    kty: 'EC',
    crv: alg === 'ES256' ? 'P-256' : 'secp256k1',
    alg: alg,
    x: base64url.encode(pubPoint.getX().toBuffer('be', 32)),
    y: base64url.encode(pubPoint.getY().toBuffer('be', 32)),
  };

  const thumbprint = await calculateJwkThumbprint(jwk);

  return {
    ...jwk,
    kid: thumbprint,
  };
}
