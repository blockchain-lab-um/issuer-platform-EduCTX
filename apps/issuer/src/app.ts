import * as path from 'path';
import { fileURLToPath } from 'url';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import fastifyPrintRoutes from 'fastify-print-routes';

import { Schemas } from './utils/schemas/index.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  Schemas.forEach((schema) => {
    fastify.addSchema(schema);
  });
  // Place here your custom code!
  await fastify.register(fastifyPrintRoutes);

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  await fastify.register(AutoLoad, {
    dir: path.join(dirname, 'plugins'),
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
