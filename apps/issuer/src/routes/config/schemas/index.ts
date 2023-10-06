import { DidSchema } from './didSchema.js';
import { ProgramSchema} from './programSchema.js';

export const routeSchemas = {
  oneOf: [
    DidSchema,
    ProgramSchema,
    // {$id: '#testSchema', type: 'object', properties: {test: {type: 'string'}}},
  ],
};

export function getSchemaIds(schemas: typeof routeSchemas) {
  return schemas.oneOf.map((schema) => schema.$id);
}
