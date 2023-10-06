import { FastifyPluginAsync } from 'fastify';
import SchemaConstraint from 'fastify-schema-constraint';

import { testCredential } from '../../utils/constants.js';
import { routeSchemas } from '../config/schemas/index.js';

const constraint = {
  body: {
    constraint(request: any) {
      switch (request.headers.schematype) {
        case 'did':
          return '#didSchema';
        case 'programCompletion':
          return '#programCompletionSchema';
        default:
          throw new Error();
      }
    },
    statusCode: 412, // Optionally define a custom status code in case of errors
    errorMessage: 'Request body not matching selected validation schema.', // Optionally define a custom error message
  },
};

const issue: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(SchemaConstraint, constraint);
  // Add attachValidation to the schema if you want to handle validation errors yourself
  fastify.post(
    '/',
    {
      schema: {
        body: routeSchemas,
      },
    },
    async (request, reply) => {
      const data = request.body as any; // TODO: fix type
      const agent = fastify.veramoAgent();
      const issuerIdentifier = await agent.didManagerGetByAlias({
        alias: 'issuer-primary',
        provider: 'did:key',
      });

      testCredential.credentialSubject.id = data.did;
      const vc = await agent.createVerifiableCredential({
        proofFormat: 'jwt',
        credential: {
          issuer: issuerIdentifier.did,
          ...testCredential,
        },
      });

      await reply.code(200).send({ credential: vc });
    }
  );
};

export default issue;
