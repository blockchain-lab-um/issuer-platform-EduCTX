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
