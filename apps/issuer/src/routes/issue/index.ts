import { FastifyPluginAsync } from 'fastify';
import { CredentialSchema } from '../../utils/schemas.js';

const issue: FastifyPluginAsync = async (fastify): Promise<void> => {
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

    await reply.code(200).send({ credential: vc });
  });
};

export default issue;
