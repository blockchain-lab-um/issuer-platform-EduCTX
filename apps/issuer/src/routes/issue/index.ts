import type { FastifyPluginAsync } from 'fastify';
import SchemaConstraint from 'fastify-schema-constraint';

import { apiKeyAuth } from '../../middlewares/apiKeyAuth.js';
import { routeSchemas } from '../../utils/schemas/index.js';

const constraint = {
  body: {
    constraint(request: any) {
      if (request.headers.schematype)
        return request.headers.schematype as string;
      throw new Error();
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
      preValidation: apiKeyAuth,
      schema: {
        body: routeSchemas,
      },
      config: {
        description: 'Issue a credential and return it',
      },
    },
    async (request, reply) => {
      const data = request.body as any; // TODO: fix type
      const agent = fastify.veramoAgent;

      const vc = await agent.createVerifiableCredential({
        proofFormat: 'jwt',
        credential: {
          issuer: fastify.issuerIdentifier.did,
          type: ['VerifiableCredential', 'EducationCredential'],
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          credentialSchema: {
            id: 'https://raw.githubusercontent.com/blockchain-lab-um/credential-schema-registry/356bce18f61e8d8d6ec0244510e56300f931dc2d/schemas/education/education-credential-schema.json',
            type: 'JsonSchema',
          },
          ...data,
        },
      });

      return reply.code(200).send(vc);
    },
  );
};

export default issue;
