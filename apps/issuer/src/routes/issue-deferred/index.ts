import { randomUUID } from 'node:crypto';
import { FastifyPluginAsync } from 'fastify';
import { CredentialSchema } from '../../utils/schemas.js';
import { CredentialsTable } from '../../db/types/index.js';

const issueDeferred: FastifyPluginAsync = async (fastify): Promise<void> => {
  // Add attachValidation to the schema if you want to handle validation errors yourself
  fastify.post('/', { schema: { body: CredentialSchema } }, async (request, reply) => {
    const data = request.body as any; // TODO: fix type
    const agent = fastify.veramoAgent();
    const issuerIdentifier = await agent.didManagerGetByAlias({ alias: 'issuer-primary', provider: 'did:key' });

    const vc = await agent.createVerifiableCredential({
      credential: {
        issuer: issuerIdentifier.did,
        ...data.credential,
      },
      proofFormat: data.proofFormat,
    });

    const { pool } = fastify.pg;
    const id = randomUUID();
    const { rows } = await pool.query<CredentialsTable>(
      'INSERT INTO credentials (id, did, credential, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, vc.credentialSubject.id, vc, vc.issuanceDate]
    );
const issueDeferred: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  await fastify.register(fastifyPostgres, {
    connectionString: fastify.config.DATABASE_URL,
  });

  // const { pool } = fastify.pg;

  fastify.get('/', async (request, reply) => 'Issue Deferred');
    await reply.code(201).send({ id });
  });
};

export default issueDeferred;
