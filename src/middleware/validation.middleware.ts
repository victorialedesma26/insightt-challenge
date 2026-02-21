import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../shared/errors/AppError';
import { ErrorCodes } from '../shared/errors/errorCodes';

type RequestSegment = 'body' | 'query' | 'params';

export const validateRequest = (schema: ZodSchema, segment: RequestSegment = 'body'): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req[segment]);

    if (!result.success) {
      return next(new AppError('Validation failed', 422, ErrorCodes.VALIDATION_ERROR, result.error.flatten()));
    }

    Object.assign(req[segment], result.data);
    return next();
  };
};
