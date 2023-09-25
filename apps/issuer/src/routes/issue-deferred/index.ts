import { FastifyPluginAsync } from 'fastify';

const issueDeferred: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get('/', async (request, reply) => 'Issue Deferred');
};

export default issueDeferred;
