"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogger = void 0;
const logger_1 = require("../config/logger");
const maskOutput = (payload) => {
    if (payload === undefined) {
        return undefined;
    }
    if (Array.isArray(payload)) {
        return { count: payload.length };
    }
    if (typeof payload === 'object' && payload !== null) {
        const objectPayload = payload;
        return {
            keys: Object.keys(objectPayload).slice(0, 10),
        };
    }
    return payload;
};
const activityLogger = (req, res, next) => {
    const start = process.hrtime.bigint();
    const inputSnapshot = {
        params: req.params,
        query: req.query,
        body: req.body,
    };
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        res.locals.activityPayload = body;
        return originalJson(body);
    };
    res.on('finish', () => {
        const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;
        logger_1.logger.info({
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
        }, 'API activity recorded');
    });
    next();
};
exports.activityLogger = activityLogger;
//# sourceMappingURL=activity-log.middleware.js.map