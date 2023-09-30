import { randomUUID } from 'node:crypto';
import { ICreateVerifiableCredentialArgs } from '@veramo/core';
import { FastifyPluginAsync } from 'fastify';
import { CredentialsTable } from '../../db/types/index.js';
import { testCredential } from '../../utils/constants.js';

const issueDeferred: FastifyPluginAsync = async (fastify): Promise<void> => {
  // Add attachValidation to the schema if you want to handle validation errors yourself
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        properties: {
          did: { type: 'string' },
        },
        required: ['did'],
      }
    }
  }, async (request, reply) => {
    const data = request.body as any; // TODO: fix type
    const agent = fastify.veramoAgent();
    const issuerIdentifier = await agent.didManagerGetByAlias({ alias: 'issuer-primary', provider: 'did:key' });

    testCredential.credentialSubject.id = data.did;
    const credentialArgs = {
      proofFormat: 'jwt',
      credential: {
        issuer: issuerIdentifier.did,
        ...testCredential,
      },
    }
    const vc = await agent.createVerifiableCredential(credentialArgs as ICreateVerifiableCredentialArgs);

    const { pool } = fastify.pg;
    const id = randomUUID();
    await pool.query<CredentialsTable>(
      'INSERT INTO credentials (id, did, credential, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, vc.credentialSubject.id, vc, vc.issuanceDate]
    );

    await reply.code(201);
  });
};

export default issueDeferred;
