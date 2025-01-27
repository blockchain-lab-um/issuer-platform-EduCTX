import type { FastifyReply, FastifyRequest } from 'fastify';

export const apiKeyAuth = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const apiKey = request.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return reply.status(401).send('Unauthorized');
  }
};
