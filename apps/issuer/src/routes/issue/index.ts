import { FastifyPluginAsync } from 'fastify';

const issue: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async (request, reply) => 'Issue');
};

export default issue;
