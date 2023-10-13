import { FastifyPluginAsync } from 'fastify';

const config: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async (request, reply) => 'Config');
};

export default config;
