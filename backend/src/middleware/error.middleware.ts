import type { ErrorRequestHandler } from 'express';
import { AppError } from '../shared/errors/AppError';
import { ErrorCodes } from '../shared/errors/errorCodes';
import { logger } from '../config/logger';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const isAppError = error instanceof AppError;
  const statusCode = isAppError ? error.statusCode : 500;
  const code = isAppError ? error.code : ErrorCodes.INTERNAL_ERROR;
  const payload = {
    error: {
      code,
      message: error.message || 'Unexpected error occurred',
      details: isAppError ? error.details : undefined,
    },
  };

  if (statusCode >= 500) {
    logger.error({ err: error, code }, 'Unhandled application error');
  } else {
    logger.warn({ err: error, code }, 'Handled error');
  }

  res.status(statusCode).json(payload);
};
