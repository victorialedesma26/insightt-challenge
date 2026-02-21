import type { RequestHandler } from 'express';
import { logger } from '../config/logger';

const maskOutput = (payload: unknown) => {
  if (payload === undefined) {
    return undefined;
  }

  if (Array.isArray(payload)) {
    return { count: payload.length };
  }

  if (typeof payload === 'object' && payload !== null) {
    const objectPayload = payload as Record<string, unknown>;
    return {
      keys: Object.keys(objectPayload).slice(0, 10),
    };
  }

  return payload;
};

export const activityLogger: RequestHandler = (req, res, next) => {
  const start = process.hrtime.bigint();
  const inputSnapshot = {
    params: req.params,
    query: req.query,
    body: req.body,
  };

  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    res.locals.activityPayload = body;
    return originalJson(body);
  };

  res.on('finish', () => {
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    logger.info(
      {
        event: 'api.activity',
        timestamp: new Date().toISOString(),
        userId: req.auth?.sub ?? 'anonymous',
        email: req.auth?.email,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        latencyMs: elapsedMs,
        input: inputSnapshot,
        output: maskOutput(res.locals.activityPayload),
      },
      'API activity recorded',
    );
  });

  next();
};
