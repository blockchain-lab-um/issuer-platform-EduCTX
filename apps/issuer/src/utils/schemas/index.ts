import { DidSchema } from './didSchema.js';
import { ProgramSchema} from './programSchema.js';
import { de4aSchema } from './de4aSchema.js';

export const routeSchemas = {
  oneOf: [
    DidSchema,
    ProgramSchema,
    de4aSchema,
    // {$id: '#testSchema', type: 'object', properties: {test: {type: 'string'}}},
  ],
};

export function getSchemaIds(schemas: typeof routeSchemas) {
  return schemas.oneOf.map((schema) => schema.$id);
}
