import pino from 'pino';
import { env } from './env';

export const logger = pino({
  level: env.isTest ? 'silent' : env.logLevel,
  transport: env.isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
      },
});
