import { de4aSchema, de4aSchemaBatch } from './de4aSchema.js';
import { DidSchema, DidSchemaBatch } from './didSchema.js';
import { ProgramSchema } from './programSchema.js';

export const routeSchemas = {
  oneOf: [
    DidSchema,
    DidSchemaBatch,
    ProgramSchema,
    de4aSchema,
    de4aSchemaBatch,
    // {$id: '#testSchema', type: 'object', properties: {test: {type: 'string'}}},
  ],
};

export function getSchemaIds(schemas: typeof routeSchemas) {
  return schemas.oneOf.map((schema) => schema.$id);
}
