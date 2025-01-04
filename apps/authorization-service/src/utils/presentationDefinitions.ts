import type { PresentationDefinitionV2 } from '@sphereon/pex-models';

// Presentation Definition for testing verifiers
// See https://api-conformance.ebsi.eu/docs/ct/verifier-functional-flows
export const VERIFIER_TEST_PRESENTATION_DEFINITION = {
  id: '<any id, random or static>',
  format: { jwt_vp: { alg: ['ES256'] }, jwt_vp_json: { alg: ['ES256'] } },
  input_descriptors: [
    {
      id: '<any id, random or static>',
      format: { jwt_vc: { alg: ['ES256'] }, jwt_vc_json: { alg: ['ES256'] } },
      constraints: {
        fields: [
          {
            path: ['$.vc.type'],
            filter: {
              type: 'array',
              contains: { const: 'VerifiableAttestation' },
            },
          },
        ],
      },
    },
    {
      id: '<any id, random or static>',
      format: { jwt_vc: { alg: ['ES256'] }, jwt_vc_json: { alg: ['ES256'] } },
      constraints: {
        fields: [
          {
            path: ['$.vc.type'],
            filter: {
              type: 'array',
              contains: { const: 'VerifiableAttestation' },
            },
          },
        ],
      },
    },
    {
      id: '<any id, random or static>',
      format: { jwt_vc: { alg: ['ES256'] }, jwt_vc_json: { alg: ['ES256'] } },
      constraints: {
        fields: [
          {
            path: ['$.vc.type'],
            filter: {
              type: 'array',
              contains: { const: 'VerifiableAttestation' },
            },
          },
        ],
      },
    },
  ],
} as const satisfies PresentationDefinitionV2;

export const COUPON_DEMO_PRESENTATION_DEFINITION = {
  id: 'id-1',
  format: { jwt_vp: { alg: ['ES256'] }, jwt_vp_json: { alg: ['ES256'] } },
  input_descriptors: [
    {
      id: 'id-2',
      format: { jwt_vc: { alg: ['ES256'] }, jwt_vc_json: { alg: ['ES256'] } },
      constraints: {
        fields: [
          {
            path: ['$.vc.type'],
            filter: {
              type: 'array',
              contains: { const: 'CouponCredential' },
            },
          },
          // {
          //   path: ['$.vc.issuer.id'],
          //   filter: {
          //     type: 'string',
          //     const:
          //       'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbpFsJKZb6Mewn3RtbBPNx2xVSGebW9pikQiGGiyownmugYcE2UudpY1wePsu1mNB1hfDcQHfY7ZybzYmnSBPEMw3QtUGWcaDP2scivzX8MqChDs8XoBAiNarHT2jmajpAag',
          //   },
          // },
          // {
          //   path: ['$.vc.credentialSubject.couponId'],
          //   filter: {
          //     type: 'string',
          //     const: 'asdf',
          //   },
          // },
        ],
      },
    },
  ],
} as const satisfies PresentationDefinitionV2;
