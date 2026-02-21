import type { Algorithm } from 'jsonwebtoken';
export declare const env: {
    nodeEnv: "test" | "development" | "production";
    isProduction: boolean;
    isTest: boolean;
    port: number;
    mongoUri: string;
    logLevel: "error" | "fatal" | "warn" | "info" | "debug" | "trace";
    auth: {
        audience: string | undefined;
        issuer: string | undefined;
        jwksUri: string | undefined;
        algorithms: Algorithm[];
        jwtSecret: string | undefined;
    };
};
type Env = typeof env;
export type AuthConfig = Env['auth'];
export {};
