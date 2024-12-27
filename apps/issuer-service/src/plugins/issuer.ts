import fp from 'fastify-plugin';
import {
  getKeyPair,
  getPublicJwk,
  type JWKWithKid,
} from '@blockchain-lab-um/eductx-platform-shared';
import {
  util as didKeyUtil,
  getResolver as getDidKeyResolver,
} from '@cef-ebsi/key-did-resolver';
import {
  util as didEbsiUtil,
  getResolver as getDidEbsiResolver,
} from '@cef-ebsi/ebsi-did-resolver';
import { Resolver } from 'did-resolver';

type IssuerServerConfig = {
  did: string;
  kid: string;
  url: string;
  authorizationServerPublicJwk: JWKWithKid;
  resolver: Resolver;
  credentialTypesSupported: string[][];
};

declare module 'fastify' {
  export interface FastifyInstance {
    issuerServerConfig: IssuerServerConfig;
    privateKeyJwk: JWKWithKid;
  }
}

const CONFORMANCE_TEST_SUPPORTED_CREDENTIALS: string[][] = [
  [
    'VerifiableCredential',
    'VerifiableAttestation',
    'CTWalletSameAuthorisedInTime',
  ],
  [
    'VerifiableCredential',
    'VerifiableAttestation',
    'CTWalletSameAuthorisedDeferred',
  ],
  [
    'VerifiableCredential',
    'VerifiableAttestation',
    'CTWalletSamePreAuthorisedInTime',
  ],
  [
    'VerifiableCredential',
    'VerifiableAttestation',
    'CTWalletSamePreAuthorisedDeferred',
  ],
];

const SUPPORTED_CREDENTIALS: string[][] = [
  ['VerifiableCredential', 'EducationCredential'],
  ['VerifiableCredential', 'EventTicketCredential'],
  ['VerifiableCredential', 'CouponCredential'],
];

export const CREDENTIAL_TYPE_TO_SCHEMA: Map<string, string> = new Map([
  [
    '["VerifiableCredential","EducationCredential"]',
    'https://raw.githubusercontent.com/blockchain-lab-um/credential-schema-registry/main/schemas/education/education-credential-schema.json',
  ],
  [
    '["VerifiableCredential","EventTicketCredential"]',
    'https://raw.githubusercontent.com/blockchain-lab-um/credential-schema-registry/main/schemas/event-ticket-credential-schema.json',
  ],
  [
    '["VerifiableCredential", "CouponCredential"]',
    'https://raw.githubusercontent.com/blockchain-lab-um/credential-schema-registry/refs/heads/main/schemas/coupon-credential-schema.json',
  ],
]);

export default fp(async (fastify, _) => {
  if (fastify.config.DID_METHOD === 'ebsi' && !fastify.config.EBSI_SUBJECT_ID) {
    throw new Error('EBSI_SUBJECT_ID is required when DID_METHOD is ebsi');
  }

  const authorizationServerPublicJwk = await getPublicJwk(
    fastify.config.AUTHORIZATION_SERVER_PUBLIC_KEY,
    fastify.config.AUTHORIZATION_SERVER_KEY_ALG,
  );

  const { privateKeyJwk, publicKeyJwk } = await getKeyPair(
    fastify.config.PRIVATE_KEY,
    fastify.config.KEY_ALG,
  );

  let ebsiSubjectId;
  if (fastify.config.DID_METHOD === 'ebsi') {
    ebsiSubjectId = Buffer.from(fastify.config.EBSI_SUBJECT_ID, 'hex');

    if (ebsiSubjectId.length !== 16) {
      throw new Error('EBSI_SUBJECT_ID must be 16 bytes');
    }
  }

  const did =
    fastify.config.DID_METHOD === 'key'
      ? didKeyUtil.createDid({
          kty: publicKeyJwk.kty!,
          crv: publicKeyJwk.crv,
          x: publicKeyJwk.x,
          y: publicKeyJwk.y,
        })
      : didEbsiUtil.createDid(ebsiSubjectId!);

  // TODO: Verify this works and is correct for `did:ebsi`
  const kid = `${did}#${
    fastify.config.DID_METHOD === 'key' ? did.split(':')[2] : publicKeyJwk.kid
  }`;

  console.log(`Using DID: ${did}`);

  fastify.decorate('privateKeyJwk', privateKeyJwk);

  // Initialize resolver
  const didKeyResolver = getDidKeyResolver();
  const didEbsiResolver = getDidEbsiResolver({
    registry: `https://api-${fastify.config.NETWORK}.ebsi.eu/did-registry/v5/identifiers"`,
  });

  const didResolver = new Resolver({
    ...didKeyResolver,
    ...didEbsiResolver,
  });

  const credentialTypesSupported = [
    ...SUPPORTED_CREDENTIALS,
    ...(fastify.config.CONFORMANCE_TEST_ENABLED
      ? CONFORMANCE_TEST_SUPPORTED_CREDENTIALS
      : []),
  ];

  // Create the issuer server configuration
  const issuerServerConfig = {
    did: did,
    kid: kid,
    url: `${fastify.config.SERVER_URL}/oidc`,
    authorizationServerPublicJwk: authorizationServerPublicJwk,
    resolver: didResolver,
    credentialTypesSupported: credentialTypesSupported,
    timeout: undefined,
  };

  fastify.decorate('issuerServerConfig', issuerServerConfig);
});
