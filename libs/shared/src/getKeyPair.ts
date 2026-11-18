import { secp256k1 } from '@noble/curves/secp256k1';
import { p256 } from '@noble/curves/p256';
import type { ProjPointType } from '@noble/curves/abstract/weierstrass';
import * as utils from '@noble/curves/abstract/utils';
import { base64url, calculateJwkThumbprint } from 'jose';
import type { JWK } from 'jose';
import type { KeyPair } from './types.js';

export async function getKeyPair(
  privateKey: string,
  alg: 'ES256' | 'ES256K',
): Promise<KeyPair> {
  if (!privateKey) {
    throw new Error('You must provide a non-empty hexadecimal private key');
  }

  const privateKeyBytes = utils.hexToBytes(privateKey);
  let pubPoint: ProjPointType<bigint>;
  if (alg === 'ES256') {
    if (!p256.utils.isValidPrivateKey(privateKeyBytes)) {
      throw new Error('Invalid secp256k1 private key');
    }
    pubPoint = p256.ProjectivePoint.fromPrivateKey(privateKeyBytes);
  } else if (alg === 'ES256K') {
    if (!secp256k1.utils.isValidPrivateKey(privateKeyBytes)) {
      throw new Error('Invalid secp256k1 private key');
    }
    pubPoint = secp256k1.ProjectivePoint.fromPrivateKey(privateKeyBytes);
  } else {
    throw new Error(`alg ${alg as string} not supported`);
  }

  // Format as JWK
  const jwk = {
    kty: 'EC',
    crv: alg === 'ES256' ? 'P-256' : 'secp256k1',
    alg,
    x: base64url.encode(utils.numberToBytesBE(pubPoint.x, 32)),
    y: base64url.encode(utils.numberToBytesBE(pubPoint.y, 32)),
  } satisfies JWK;

  const d = base64url.encode(privateKeyBytes);

  const thumbprint = await calculateJwkThumbprint(jwk);

  const publicKeyJwk = {
    ...jwk,
    kid: thumbprint,
  };

  const privateKeyJwk = {
    ...publicKeyJwk,
    d,
  };

  return {
    publicKeyJwk,
    privateKeyJwk,
  };
}
