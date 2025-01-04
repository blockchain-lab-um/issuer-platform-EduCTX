import { AuthServer } from '@cef-ebsi/auth-server';
import fp from 'fastify-plugin';
import type { VerifyPresentationJwtOptions } from '@cef-ebsi/verifiable-presentation';
import {
  getKeyPair,
  getPublicJwk,
} from '@blockchain-lab-um/eductx-platform-shared';
import { util as didKeyUtil } from '@cef-ebsi/key-did-resolver';
import { util as didEbsiUtil } from '@cef-ebsi/ebsi-did-resolver';
import type { PresentationDefinitionV2 } from '@sphereon/pex-models';
import {
  COUPON_DEMO_PRESENTATION_DEFINITION,
  VERIFIER_TEST_PRESENTATION_DEFINITION,
} from '../utils/presentationDefinitions.js';

declare module 'fastify' {
  export interface FastifyInstance {
    did: string;
    kid: string;
    auth: AuthServer;
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

export default fp(async (fastify, _) => {
  if (fastify.config.DID_METHOD === 'ebsi' && !fastify.config.EBSI_SUBJECT_ID) {
    throw new Error('EBSI_SUBJECT_ID is required when DID_METHOD is ebsi');
  }

  const verifyPresentationJwtOptions: VerifyPresentationJwtOptions = {
    network: fastify.config.NETWORK,
    hosts: [`api-${fastify.config.NETWORK}.ebsi.eu`],
    skipSignatureValidation: true,
    validateAccreditationWithoutTermsOfUse: false,
  };

  const didRegistryApiUrl = `https://api-${fastify.config.NETWORK}.ebsi.eu/did-registry/v5`;

  const issuerPublicJwk = await getPublicJwk(
    fastify.config.ISSUER_SERVER_PUBLIC_KEY,
    fastify.config.ISSUER_SERVER_KEY_ALG,
  );

  const { privateKeyJwk, publicKeyJwk } = await getKeyPair(
    fastify.config.PRIVATE_KEY,
    fastify.config.KEY_ALG,
  );

  let ebsiSubjectId;
  if (fastify.config.DID_METHOD === 'ebsi') {
    ebsiSubjectId = Buffer.from(fastify.config.EBSI_SUBJECT_ID);

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

  console.log(`Using DID: ${did}`);

  const kid = `${did}#${
    fastify.config.DID_METHOD === 'key' ? did.split(':')[2] : publicKeyJwk.kid
  }`;

  fastify.decorate('did', did);
  fastify.decorate('kid', kid);

  // Wait for DB to be ready
  await fastify.dbOidc.open();

  // Store the DID and its private key in the database
  await fastify.dbOidc.put({ did: did, jwks: true }, [privateKeyJwk]);

  const credentialTypesSupported = [
    ...SUPPORTED_CREDENTIALS,
    ...(fastify.config.CONFORMANCE_TEST_ENABLED
      ? CONFORMANCE_TEST_SUPPORTED_CREDENTIALS
      : []),
  ];

  // Create the auth server
  const auth = new AuthServer({
    db: fastify.dbOidc,
    did: did,
    url: `${fastify.config.SERVER_URL}/oidc`,
    didRegistryApiUrl: didRegistryApiUrl,
    verifyPresentationJwtOptions,
    ebsiAuthority: '',
    issuerMockPublicKeyJwk: issuerPublicJwk,
    presentationDefinitionSelector: (
      scope: string,
      requestedTypes: string[],
    ) => {
      {
        let presentationDefinition: PresentationDefinitionV2 | null = null;
        switch (scope) {
          case 'openid ver_test:vp_token': {
            presentationDefinition = VERIFIER_TEST_PRESENTATION_DEFINITION;
            break;
          }
          // TODO: Change to `openid custom:<UUID>` and read presentation definition from cache
          // TODO: We also need to add a route to create/store the presentation definitions
          case 'openid coupon:demo': {
            presentationDefinition = COUPON_DEMO_PRESENTATION_DEFINITION;
            break;
          }
          default:
            break;
        }

        return presentationDefinition;
      }
    },
    credentialTypesSupported: credentialTypesSupported,
  });

  fastify.decorate('auth', auth);
});
