import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import AutoLoad, { type AutoloadPluginOptions } from '@fastify/autoload';
import type { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import fastifyPrintRoutes from 'fastify-print-routes';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  await fastify.register(fastifyPrintRoutes);

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  await fastify.register(AutoLoad, {
    dir: path.join(dirname, 'plugins'),
    // ignorePattern: /(authServer|issuerServer)/,
    options: opts,
    forceESM: true,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  await fastify.register(AutoLoad, {
    dir: path.join(dirname, 'routes'),
    options: opts,
    forceESM: true,
  });
};

export default app;
export { app, options };
