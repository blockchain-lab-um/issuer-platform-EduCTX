import {
  AuthServer,
  type LevelDbKeyAuth,
  type LevelDbObjectAuth,
} from '@cef-ebsi/auth-server';
import fp from 'fastify-plugin';
import { getKeyPair, type JWKWithKid } from '../utils/getKeyPair.js';
import type { VerifyPresentationJwtOptions } from '@cef-ebsi/verifiable-presentation';
import { Level } from 'level';

declare module 'fastify' {
  export interface FastifyInstance {
    dbAuthServer: Level<LevelDbKeyAuth, LevelDbObjectAuth>;
    authServer: AuthServer;
    authServerConfig: {
      did: string;
      url: string;
      didRegistryApiUrl: string;
      verifyPresentationJwtOptions: VerifyPresentationJwtOptions;
      ebsiAuthority: string;
      issuerMockPublicKeyJwk: JWKWithKid;
      presentationDefinitionSelector: (
        scope: string,
        requestedTypes: string[],
      ) => null;
      credentialTypesSupported: string[][];
    };
  }
}

export default fp(async (fastify, _) => {
  const db = new Level<LevelDbKeyAuth, LevelDbObjectAuth>(
    'db/authorization-server',
    { keyEncoding: 'json', valueEncoding: 'json' },
  );

  fastify.decorate('dbAuthServer', db);

  const did = await fastify.veramoAgent.didManagerGetByAlias({
    alias: 'issuer-primary',
  });

  const verifyPresentationJwtOptions: VerifyPresentationJwtOptions = {
    network: 'conformance',
    hosts: ['api-conformance.ebsi.eu'],
    skipSignatureValidation: true,
    validateAccreditationWithoutTermsOfUse: false,
  };

  const { privateKeyJwk, publicKeyJwk } = await getKeyPair(
    process.env.ISSUER_PRIVATE_KEY!,
    'ES256',
  );

  await db.open();

  await db.put({ did: did.did, jwks: true }, [privateKeyJwk]);

  const authServerUrl = `${fastify.config.ISSUER_URL}/oidc/authorization`;
  const didRegistryApiUrl = 'https://api-conformance.ebsi.eu/did-registry/v5';
  const credentialTypesSupported = [
    [
      'VerifiableCredential',
      'VerifiableAttestation',
      'CTWalletSameAuthorisedInTime',
    ],
    [
      'VerifiableCredential',
      'VerifiableAttestation',
      'CTWalletSamePreAuthorisedInTime',
    ],
  ];

  const authServer = new AuthServer({
    db: db,
    did: did.did,
    url: authServerUrl,
    didRegistryApiUrl: didRegistryApiUrl,
    verifyPresentationJwtOptions,
    ebsiAuthority: '',
    issuerMockPublicKeyJwk: publicKeyJwk,
    presentationDefinitionSelector: (
      scope: string,
      requestedTypes: string[],
    ) => {
      return null;
    },
    credentialTypesSupported: credentialTypesSupported,
  });

  fastify.decorate('authServer', authServer);
  fastify.decorate('authServerConfig', {
    did: did.did,
    url: authServerUrl,
    didRegistryApiUrl: didRegistryApiUrl,
    verifyPresentationJwtOptions,
    ebsiAuthority: '',
    issuerMockPublicKeyJwk: publicKeyJwk, // FIXME
    presentationDefinitionSelector: (
      scope: string,
      requestedTypes: string[],
    ) => {
      return null;
    },
    credentialTypesSupported: credentialTypesSupported,
  });
});
