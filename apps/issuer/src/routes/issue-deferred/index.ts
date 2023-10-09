import { randomUUID } from 'node:crypto';
import { ICreateVerifiableCredentialArgs } from '@veramo/core';
import { FastifyPluginAsync } from 'fastify';
import SchemaConstraint from 'fastify-schema-constraint';

import { CredentialsTable } from '../../db/types/index.js';
import { routeSchemas } from '../../utils/schemas/index.js';

const constraint = {
  body: {
    constraint(request: any) {
      if (request.headers.schematype) return request.headers.schematype as string;
      throw new Error();
    },
    statusCode: 412, // Optionally define a custom status code in case of errors
    errorMessage: 'Request body not matching selected validation schema.', // Optionally define a custom error message
  },
};

const issueDeferred: FastifyPluginAsync = async (fastify): Promise<void> => {
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

      const credentialArgs = {
        proofFormat: 'jwt',
        credential: {
          issuer: issuerIdentifier.did,
          ...data,
        },
      };
      const vc = await agent.createVerifiableCredential(
        credentialArgs as ICreateVerifiableCredentialArgs
      );

      const { pool } = fastify.pg;
      const id = randomUUID();
      await pool.query<CredentialsTable>(
        'INSERT INTO credentials (id, did, credential, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, vc.credentialSubject.id, vc, vc.issuanceDate]
      );

      await reply.code(201);
    }
  );
};

export default issueDeferred;
