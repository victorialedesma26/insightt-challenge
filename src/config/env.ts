import { config as loadEnv } from 'dotenv';
import type { Algorithm } from 'jsonwebtoken';
import { z } from 'zod';

loadEnv();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .optional()
    .transform((value) => Number(value ?? '3000')),
  MONGO_URI: z.string().min(1).default('mongodb://localhost:27017/task_management'),
  AUTH_AUDIENCE: z.string().optional(),
  AUTH_ISSUER: z.string().optional(),
  AUTH_JWKS_URI: z.string().optional(),
  AUTH_ALGORITHMS: z.string().optional().default('RS256'),
  JWT_SECRET: z.string().optional(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const raw = parsed.data;
const algorithmSource = raw.AUTH_ALGORITHMS ?? 'RS256';
const parsedAlgorithms = algorithmSource
  .split(',')
  .map((algorithm) => algorithm.trim())
  .filter(Boolean) as Algorithm[];

const algorithms: Algorithm[] = parsedAlgorithms.length > 0 ? parsedAlgorithms : (['RS256'] as Algorithm[]);

export const env = {
  nodeEnv: raw.NODE_ENV,
  isProduction: raw.NODE_ENV === 'production',
  isTest: raw.NODE_ENV === 'test',
  port: raw.PORT ?? 3000,
  mongoUri: raw.MONGO_URI,
  logLevel: raw.LOG_LEVEL,
  auth: {
    audience: raw.AUTH_AUDIENCE,
    issuer: raw.AUTH_ISSUER,
    jwksUri: raw.AUTH_JWKS_URI,
    algorithms,
    jwtSecret: raw.JWT_SECRET,
  },
};

type Env = typeof env;
export type AuthConfig = Env['auth'];
