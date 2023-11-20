import { DidSchema, DidSchemaBatch } from './didSchema.js';
import {
  educationCredential,
  educationCredentialBatch,
} from './educationalCredential.js';
import { ProgramSchema } from './programSchema.js';

export const routeSchemas = {
  oneOf: [
    DidSchema,
    DidSchemaBatch,
    ProgramSchema,
    educationCredential,
    educationCredentialBatch,
    // {$id: '#testSchema', type: 'object', properties: {test: {type: 'string'}}},
  ],
};

export const Schemas = [
  DidSchema,
  DidSchemaBatch,
  ProgramSchema,
  educationCredential,
  educationCredentialBatch,
];

export function getSchemaIds(schemas: typeof routeSchemas) {
  return schemas.oneOf.map((schema) => schema.$id);
}
