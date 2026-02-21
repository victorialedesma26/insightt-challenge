"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z
        .string()
        .optional()
        .transform((value) => Number(value ?? '3000')),
    MONGO_URI: zod_1.z.string().min(1).default('mongodb://localhost:27017/task_management'),
    AUTH_AUDIENCE: zod_1.z.string().optional(),
    AUTH_ISSUER: zod_1.z.string().optional(),
    AUTH_JWKS_URI: zod_1.z.string().optional(),
    AUTH_ALGORITHMS: zod_1.z.string().optional().default('RS256'),
    JWT_SECRET: zod_1.z.string().optional(),
    LOG_LEVEL: zod_1.z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
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
    .filter(Boolean);
const algorithms = parsedAlgorithms.length > 0 ? parsedAlgorithms : ['RS256'];
exports.env = {
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
//# sourceMappingURL=env.js.map