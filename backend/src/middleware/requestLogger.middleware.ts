import type { RequestHandler } from 'express';
import { logger } from '../config/logger';

export const requestLogger: RequestHandler = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    logger.info(
      {
        event: 'http.request',
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        latencyMs: Number(elapsedMs.toFixed(2)),
        userId: req.auth?.sub ?? 'anonymous',
      },
      `${req.method} ${req.originalUrl} -> ${res.statusCode} (${elapsedMs.toFixed(1)} ms)`,
    );
  });

  next();
};
