import { randomUUID } from 'node:crypto';
import { ICreateVerifiableCredentialArgs } from '@veramo/core';
import { FastifyPluginAsync } from 'fastify';
import SchemaConstraint from 'fastify-schema-constraint';

import { CredentialsTable } from '../../db/types/index.js';
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
        // default: return null // it means "don't apply any constraint"
      }
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

      testCredential.credentialSubject.id = data.did;
      const credentialArgs = {
        proofFormat: 'jwt',
        credential: {
          issuer: issuerIdentifier.did,
          ...testCredential,
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
