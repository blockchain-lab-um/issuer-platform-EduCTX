// import { DidSchema, DidSchemaBatch } from './didSchema.js';
import {
  EducationCredential,
  EducationCredentialBatch,
} from './educationCredential.js';

// import { ProgramSchema } from './programSchema.js';

export const routeSchemas = {
  oneOf: [
    // DidSchema,
    // DidSchemaBatch,
    // ProgramSchema,
    EducationCredential,
    EducationCredentialBatch,
    // {$id: '#testSchema', type: 'object', properties: {test: {type: 'string'}}},
  ],
};

export const Schemas = [
  // DidSchema,
  // DidSchemaBatch,
  // ProgramSchema,
  EducationCredential,
  EducationCredentialBatch,
];

export function getSchemaIds(schemas: typeof routeSchemas) {
  return schemas.oneOf.map((schema) => schema.$id);
}
