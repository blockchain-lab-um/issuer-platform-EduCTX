import type { SupportedCredential } from '@blockchain-lab-um/oidc-types';

/**
 * This file is used to store environment variables that are used in the app.
 *
 * Needs to include:
 * - Supported DID methods
 * - Supported curves
 * - Supported digital signatures
 * - Supported credentials
 */

export const SUPPORTED_DID_METHODS = ['did:key:jwk_jcs-pub'];
export const SUPPORTED_CURVES = ['P-256'];
export const SUPPORTED_DIGITAL_SIGNATURES = ['ES256K'];

export const SUPPORTED_CREDENTIALS: SupportedCredential[] = [
  {
    id: 'EducationCredential',
    credentialSchema: {
      id: 'https://raw.githubusercontent.com/blockchain-lab-um/credential-schema-registry/356bce18f61e8d8d6ec0244510e56300f931dc2d/schemas/education/education-credential-schema.json',
      type: 'JsonSchema',
    },
    format: 'jwt_vc_json',
    types: ['VerifiableCredential', 'EducationCredential'],
    cryptographic_binding_methods_supported: ['did'],
    cryptographic_suites_supported: ['ES256K'],
  },
];
