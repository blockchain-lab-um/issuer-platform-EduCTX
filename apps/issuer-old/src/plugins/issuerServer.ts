import fp from 'fastify-plugin';
import { getKeyPair, type JWKWithKid } from '../utils/getKeyPair.js';
import type {
  LevelDbKeyIssuer,
  LevelDbObjectIssuer,
} from '@cef-ebsi/credential-issuer';
import { Level } from 'level';
import { Resolver } from 'did-resolver';
import { ebsiDidResolver } from '@blockchain-lab-um/did-provider-ebsi';
import { getDidKeyResolver as keyDidResolver } from '@blockchain-lab-um/did-provider-key';
declare module 'fastify' {
  export interface FastifyInstance {
    dbIssuerServer: Level<LevelDbKeyIssuer, LevelDbObjectIssuer>;

    issuerServerConfig: {
      did: string;
      url: string;
      authorizationMockPublicKeyJwk: JWKWithKid;
      resolver: Resolver;
      credentialTypesSupported: string[][];
      timeout: number | undefined;
    };
  }
}

export default fp(async (fastify, _) => {
  const db = new Level<LevelDbKeyIssuer, LevelDbObjectIssuer>(
    'db/issuer-server',
    { keyEncoding: 'json', valueEncoding: 'json' },
  );

  const did = await fastify.veramoAgent.didManagerGetByAlias({
    alias: 'issuer-primary',
  });

  const { publicKeyJwk } = await getKeyPair(
    process.env.ISSUER_PRIVATE_KEY!,
    'ES256',
  );

  const resolver = new Resolver({
    ...keyDidResolver(),
    ...ebsiDidResolver(),
  });

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

  const issuerServerConfig = {
    did: did.did,
    url: `${fastify.config.ISSUER_URL}/oidc/issuer`,
    authorizationMockPublicKeyJwk: publicKeyJwk,
    resolver,
    credentialTypesSupported,
    timeout: undefined,
  };

  fastify.decorate('dbIssuerServer', db);
  fastify.decorate('issuerServerConfig', issuerServerConfig);
});
