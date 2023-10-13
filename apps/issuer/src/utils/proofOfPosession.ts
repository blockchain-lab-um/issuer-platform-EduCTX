import { JsonWebKey } from 'node:crypto';
import {
  _ExtendedVerificationMethod,
  bytesToBase64url,
  extractPublicKeyHex,
} from '@veramo/utils';
import { VerificationMethod } from 'did-resolver';
import elliptic from 'elliptic';
import { decodeProtectedHeader, importJWK, jwtVerify } from 'jose';

import { NoncesTable } from '../db/types/index.js';
import { Agent } from '../plugins/veramoAgent.js';
import { ProofOfPossesionArgs } from '../types/index.js';

const { ec: EC } = elliptic;

export async function proofOfPossession(
  args: ProofOfPossesionArgs,
  agent: Agent
): Promise<string> {
  const { proof, pool } = args;

  if (!proof) throw new Error('invalid_or_missing_proof: Proof is required.');

  // Check proof format
  if (proof.proof_type !== 'jwt')
    throw new Error(
      'invalid_or_missing_proof. Proof format missing or not supported.'
    );

  // Check if jwt is present
  if (!proof.jwt)
    throw new Error('invalid_or_missing_proof: Missing or invalid jwt.');

  // Decode protected header to get algorithm and key
  let protectedHeader;
  try {
    protectedHeader = decodeProtectedHeader(proof.jwt);
  } catch (e) {
    throw new Error('invalid_request: Invalid jwt header.');
  }

  // Check if more than 1 is present (kid, jwk, x5c)
  if (
    [protectedHeader.kid, protectedHeader.jwk, protectedHeader.x5c].filter(
      (value) => value != null
    ).length !== 1
  )
    throw new Error(
      'invalid_request: Exactly one of kid, jwk, x5c must be present.'
    );

  let payload;
  let publicKey;
  let did;

  if (protectedHeader.typ !== 'JWT') {
    throw new Error(
      `invalid_request: Invalid JWT typ. Expected "JWT" but got "${
        protectedHeader.typ ?? 'undefined'
      }".`
    );
  }

  // Check kid
  if (protectedHeader.kid) {
    // Split kid
    const [extractedDid, extractedKeyId] = protectedHeader.kid.split('#');
    did = extractedDid;

    // Check if did and keyId are present
    if (!did || !extractedKeyId)
      throw new Error('invalid_request: Invalid kid.');

    const resolvedDid = await agent.resolveDid({ didUrl: did });
    if (resolvedDid.didResolutionMetadata.error || !resolvedDid.didDocument) {
      throw new Error(
        `invalid_request: Error resolving did. Reason: ${
          resolvedDid.didResolutionMetadata.error ?? 'Unknown error'
        }.`
      );
    }

    let fragment;

    try {
      fragment = (await agent.getDIDComponentById({
        didDocument: resolvedDid.didDocument,
        didUrl: protectedHeader.kid,
        section: 'authentication',
      })) as VerificationMethod;
    } catch (e) {
      throw new Error('invalid_request: Invalid kid.');
    }

    if (fragment.publicKeyJwk) {
      publicKey = await importJWK(fragment.publicKeyJwk, protectedHeader.alg);
    } else {
      const publicKeyHex = extractPublicKeyHex(
        fragment as _ExtendedVerificationMethod
      );

      if (publicKeyHex === '') {
        throw new Error(
          'invalid_request: Invalid kid or no public key present.'
        );
      }

      const supportedTypes = ['EcdsaSecp256k1VerificationKey2019'];
      if (!supportedTypes.includes(fragment.type)) {
        throw new Error('invalid_request: Unsupported key type.');
      }

      let ctx: elliptic.ec;
      let curveName: string;

      if (fragment.type === 'EcdsaSecp256k1VerificationKey2019') {
        ctx = new EC('secp256k1');
        curveName = 'secp256k1';
      } else {
        throw new Error('invalid_request: Unsupported key type.');
      }

      const pubPoint = ctx.keyFromPublic(publicKeyHex, 'hex').getPublic();

      const publicKeyJwk: JsonWebKey = {
        kty: 'EC',
        crv: curveName,
        x: bytesToBase64url(pubPoint.getX().toBuffer('be', 32)),
        y: bytesToBase64url(pubPoint.getY().toBuffer('be', 32)),
      };

      publicKey = await importJWK(publicKeyJwk, protectedHeader.alg);
    }
  } else if (protectedHeader.jwk) {
    // publicKey = await importJWK(protectedHeader.jwk);
    throw new Error('invalid_request: jwk not supported.');
  } else if (protectedHeader.x5c) {
    throw new Error('invalid_request: x5c not supported.');
  } else {
    // Should never happen (here for type safety)
    throw new Error('invalid_request: Invalid jwt header.');
  }

  try {
    payload = (
      await jwtVerify(proof.jwt, publicKey, {
        audience: process.env.PROOF_AUDIENCE,
      })
    ).payload;
  } catch (e: unknown) {
    throw new Error(`invalid_or_missing_proof: ${(e as Error).toString()}`);
  }

  // Check if jwt is valid
  const { nonce } = payload;
  let nonceRows;

  try {
    nonceRows = await pool.query<NoncesTable>(
      'SELECT * FROM nonces WHERE did = $1',
      [did]
    );
  } catch (e: unknown) {
    throw new Error(`invalid_or_missing_proof: ${(e as Error).toString()}`);
  }

  if (nonceRows.rowCount === 0)
    throw new Error('invalid_or_missing_proof: No matching nonce.');

  const cNonce = nonceRows.rows[0]?.nonce;
  const cNonceExpiresIn = nonceRows.rows[0]?.expires_at;

  // Check if db contains cNonce
  if (cNonce) {
    // Check if nonce is valid
    if (nonce !== cNonce)
      throw new Error('invalid_or_missing_proof: Invalid or missing nonce.');

    // Check if cNonce is expired
    if (cNonceExpiresIn && Date.parse(cNonceExpiresIn) < Date.now()) {
      throw new Error('invalid_or_missing_proof: nonce expired.');
    }
  }

  return did;
}
