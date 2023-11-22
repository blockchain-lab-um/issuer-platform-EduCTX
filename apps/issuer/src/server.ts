// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace from 'close-with-grace';
import * as dotenv from 'dotenv';
// Require the framework
import Fastify from 'fastify';

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
const app = Fastify({
  logger: envToLogger[env],
  maxParamLength: 300,
});

// Register your application as a normal plugin.
await app.register(import('./app.js'));

// delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace({ delay: 500 }, (async ({ err }) => {
  if (err) {
    app.log.error(err);
  }
  await app.close();
}) as closeWithGrace.CloseWithGraceAsyncCallback);

app.addHook('onClose', (_, done) => {
  closeListeners.uninstall();
  done();
});

// Start listening.
app.listen(
  {
    port: parseInt(process.env.PORT ?? '3001', 10),
    host: process.env.HOST ?? 'localhost',
  },
  (err: any) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  }
);
