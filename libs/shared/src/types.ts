import type { JWK } from 'jose';

export type JWKWithKid = JWK & { kid: string };

export type KeyPair = {
  privateKeyJwk: JWKWithKid;
  publicKeyJwk: JWKWithKid;
};
