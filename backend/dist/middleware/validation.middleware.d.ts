import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';
type RequestSegment = 'body' | 'query' | 'params';
export declare const validateRequest: (schema: ZodSchema, segment?: RequestSegment) => RequestHandler;
export {};
