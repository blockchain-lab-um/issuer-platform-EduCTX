import { randomUUID } from 'node:crypto';
import type {
  CredentialSubject,
  ICreateVerifiableCredentialArgs,
  VerifiableCredential,
} from '@veramo/core';
import type { FastifyPluginAsync } from 'fastify';
import SchemaConstraint from 'fastify-schema-constraint';

import type { CredentialsTable } from '../../db/types/index.js';
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

const issueDeferred: FastifyPluginAsync = async (fastify): Promise<void> => {
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
        description: 'Issue Credential and store into DB',
      },
    },
    async (request, reply) => {
      const data = request.body as any; // TODO: fix type
      const agent = fastify.veramoAgent;

      const credentialArgs = {
        proofFormat: 'jwt',
        credential: {
          issuer: fastify.issuerIdentifier.did,
          type: ['VerifiableCredential', 'EducationCredential'],
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          credentialSubject: data.credentialSubject,
        },
      };

      let vc;
      try {
        vc = await agent.createVerifiableCredential(
          credentialArgs as ICreateVerifiableCredentialArgs
        );
        if (!vc) {
          throw new Error('Could not create Verifiable Credential');
        }
      } catch (error) {
        await reply.code(400).send({
          error: (error as Error).message,
        });
        return;
      }

      const { pool } = fastify.pg;
      const id = randomUUID();
      await pool.query<CredentialsTable>(
        'INSERT INTO credentials (id, did, credential, created_at) VALUES ($1, $2, $3, $4)',
        [id, vc.credentialSubject.id, vc, vc.issuanceDate]
      );
      return reply.code(201).send(true);
    }
  );

  fastify.post(
    '/batch',
    {
      schema: {
        body: routeSchemas,
      },
      config: {
        description: 'Issue multiple Credentials and store them in DB',
      },
    },
    async (request, reply) => {
      const data = request.body as any; // TODO: fix type

      const agent = fastify.veramoAgent;

      const promises: Promise<VerifiableCredential>[] = data.map(
        (subject: CredentialSubject) => {
          const credentialArgs = {
            proofFormat: 'jwt',
            credential: {
              issuer: fastify.issuerIdentifier.did,
              type: ['VerifiableCredential', 'EducationCredential'],
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              ...subject,
            },
          };

          return agent.createVerifiableCredential(
            credentialArgs as ICreateVerifiableCredentialArgs
          );
        }
      );

      const promiseResults = await Promise.allSettled(promises);

      const rejectedSubjects: {
        credential: VerifiableCredential;
        reason: Error;
      }[] = [];

      const { pool } = fastify.pg;

      promiseResults.forEach(async (result, index) => {
        if (result.status === 'fulfilled') {
          const vc = result.value;
          if (vc.credentialSubject.id) {
            const id = randomUUID();
            await pool.query<CredentialsTable>(
              'INSERT INTO credentials (id, did, credential, created_at) VALUES ($1, $2, $3, $4)',
              [id, vc.credentialSubject.id, vc, vc.issuanceDate]
            );
          }
        } else if (result.status === 'rejected') {
          rejectedSubjects.push({
            credential: data[index],
            reason: (promiseResults[index] as PromiseRejectedResult).reason
              .message,
          });
        }
      });

      let status = 201;
      if (rejectedSubjects.length) {
        if (rejectedSubjects.length === data.length) status = 400;
        else status = 207;
        return reply.code(status).send({
          rejectedSubjects,
        });
      }

      return reply.code(status).send(true);
    }
  );
};

export default issueDeferred;
