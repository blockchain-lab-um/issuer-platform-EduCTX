import { FastifyPluginAsync } from 'fastify';

const query: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async (request, reply) => 'Query');
};

export default query;
