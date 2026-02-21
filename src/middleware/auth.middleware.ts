import type { RequestHandler } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { AppError } from '../shared/errors/AppError';
import { ErrorCodes } from '../shared/errors/errorCodes';
import { env } from '../config/env';

const jwksClient = env.auth.jwksUri
  ? jwksRsa({
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 10 * 60 * 1000,
      jwksUri: env.auth.jwksUri,
    })
  : undefined;

const extractBearerToken = (headerValue?: string): string => {
  if (!headerValue || !headerValue.startsWith('Bearer ')) {
    throw new AppError('Authorization header missing', 401, ErrorCodes.AUTH_REQUIRED);
  }

  return headerValue.replace('Bearer ', '').trim();
};

const verifyWithJwks = async (token: string): Promise<JwtPayload> => {
  if (!jwksClient) {
    throw new AppError('JWKS configuration is missing', 500, ErrorCodes.INTERNAL_ERROR);
  }

  const decoded = jwt.decode(token, { complete: true });

  if (!decoded || typeof decoded !== 'object' || !decoded.header?.kid) {
    throw new AppError('Invalid token header', 401, ErrorCodes.INVALID_TOKEN);
  }

  const signingKey = await jwksClient.getSigningKey(decoded.header.kid);
  const publicKey = signingKey.getPublicKey();
  return jwt.verify(token, publicKey, {
    audience: env.auth.audience,
    issuer: env.auth.issuer,
    algorithms: env.auth.algorithms,
  }) as JwtPayload;
};

const verifyWithSecret = (token: string): JwtPayload => {
  if (!env.auth.jwtSecret) {
    throw new AppError('JWT secret is not configured', 500, ErrorCodes.INTERNAL_ERROR);
  }

  return jwt.verify(token, env.auth.jwtSecret, {
    audience: env.auth.audience,
    issuer: env.auth.issuer,
    algorithms: env.auth.algorithms,
  }) as JwtPayload;
};

const resolvePayload = async (token: string): Promise<JwtPayload> => {
  if (env.auth.jwksUri) {
    return verifyWithJwks(token);
  }

  return verifyWithSecret(token);
};

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization);
    const payload = await resolvePayload(token);

    if (!payload.sub) {
      throw new AppError('Token does not include subject', 401, ErrorCodes.INVALID_TOKEN);
    }

    req.auth = {
      sub: payload.sub,
      email: (payload.email as string | undefined) ?? (payload['https://schemas.auth0.com/email'] as string | undefined),
      permissions: Array.isArray(payload.permissions) ? (payload.permissions as string[]) : undefined,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError('Authentication failed', 401, ErrorCodes.AUTH_REQUIRED));
  }
};
