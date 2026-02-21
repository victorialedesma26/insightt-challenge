"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const AppError_1 = require("../shared/errors/AppError");
const errorCodes_1 = require("../shared/errors/errorCodes");
const env_1 = require("../config/env");
const jwksClient = env_1.env.auth.jwksUri
    ? (0, jwks_rsa_1.default)({
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 10 * 60 * 1000,
        jwksUri: env_1.env.auth.jwksUri,
    })
    : undefined;
const extractBearerToken = (headerValue) => {
    if (!headerValue || !headerValue.startsWith('Bearer ')) {
        throw new AppError_1.AppError('Authorization header missing', 401, errorCodes_1.ErrorCodes.AUTH_REQUIRED);
    }
    return headerValue.replace('Bearer ', '').trim();
};
const verifyWithJwks = async (token) => {
    if (!jwksClient) {
        throw new AppError_1.AppError('JWKS configuration is missing', 500, errorCodes_1.ErrorCodes.INTERNAL_ERROR);
    }
    const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
    if (!decoded || typeof decoded !== 'object' || !decoded.header?.kid) {
        throw new AppError_1.AppError('Invalid token header', 401, errorCodes_1.ErrorCodes.INVALID_TOKEN);
    }
    const signingKey = await jwksClient.getSigningKey(decoded.header.kid);
    const publicKey = signingKey.getPublicKey();
    return jsonwebtoken_1.default.verify(token, publicKey, {
        audience: env_1.env.auth.audience,
        issuer: env_1.env.auth.issuer,
        algorithms: env_1.env.auth.algorithms,
    });
};
const verifyWithSecret = (token) => {
    if (!env_1.env.auth.jwtSecret) {
        throw new AppError_1.AppError('JWT secret is not configured', 500, errorCodes_1.ErrorCodes.INTERNAL_ERROR);
    }
    return jsonwebtoken_1.default.verify(token, env_1.env.auth.jwtSecret, {
        audience: env_1.env.auth.audience,
        issuer: env_1.env.auth.issuer,
        algorithms: env_1.env.auth.algorithms,
    });
};
const resolvePayload = async (token) => {
    if (env_1.env.auth.jwksUri) {
        return verifyWithJwks(token);
    }
    return verifyWithSecret(token);
};
const authenticate = async (req, _res, next) => {
    try {
        const token = extractBearerToken(req.headers.authorization);
        const payload = await resolvePayload(token);
        if (!payload.sub) {
            throw new AppError_1.AppError('Token does not include subject', 401, errorCodes_1.ErrorCodes.INVALID_TOKEN);
        }
        req.auth = {
            sub: payload.sub,
            email: payload.email ?? payload['https://schemas.auth0.com/email'],
            permissions: Array.isArray(payload.permissions) ? payload.permissions : undefined,
        };
        return next();
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            return next(error);
        }
        return next(new AppError_1.AppError('Authentication failed', 401, errorCodes_1.ErrorCodes.AUTH_REQUIRED));
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map