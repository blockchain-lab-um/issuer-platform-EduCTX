import { FastifyPluginAsync } from 'fastify';
import { testCredential } from '../../utils/constants.js';

const issue: FastifyPluginAsync = async (fastify): Promise<void> => {
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
    const vc = await agent.createVerifiableCredential({
      proofFormat: 'jwt',
      credential: {
        issuer: issuerIdentifier.did,
        ...testCredential,
      },
    });

    await reply.code(200).send({ credential: vc });
  });
};

export default issue;
