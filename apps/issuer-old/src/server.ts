// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace from 'close-with-grace';
import * as dotenv from 'dotenv';
// Require the framework
import Fastify from 'fastify';

// Import the app and options
import { app, options } from './app.js';

// Read the .env file.
dotenv.config();

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

type LogEnv = keyof typeof envToLogger;
const env = (process.env.NODE_ENV ?? 'development') as LogEnv;

// Instantiate Fastify with some config
const server = Fastify({
  logger: envToLogger[env],
  maxParamLength: 300,
});

// Register your application as a normal plugin.
await server.register(app, options);

// Exits process gracefully if possible
const closeListeners = closeWithGrace({ delay: 500 }, (async ({ err }) => {
  if (err) {
    server.log.error(err);
  }
  await server.close();
}) as closeWithGrace.CloseWithGraceAsyncCallback);

// On Close, remove all listeners
server.addHook('onClose', (_, done) => {
  closeListeners.uninstall();
  done();
});

// Start listening
// Read the PORT from the .env file. Defaults to 3003.
server.listen(
  {
    port: Number.parseInt(process.env.PORT ?? '3001', 10),
    host: process.env.HOST ?? '0.0.0.0',
  },
  (err: any) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  },
);
