import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/error.middleware';
import { AppError } from './shared/errors/AppError';
import { logger } from './config/logger';

export const app = express();

app.use(
  pinoHttp({
    logger,
    autoLogging: true,
  }),
);
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRouter);

app.use((_req, _res, next) => {
  next(new AppError('Route not found', 404));
});

app.use(errorHandler);
