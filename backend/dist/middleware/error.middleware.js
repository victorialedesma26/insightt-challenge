"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../shared/errors/AppError");
const errorCodes_1 = require("../shared/errors/errorCodes");
const logger_1 = require("../config/logger");
const errorHandler = (error, _req, res, _next) => {
    const isAppError = error instanceof AppError_1.AppError;
    const statusCode = isAppError ? error.statusCode : 500;
    const code = isAppError ? error.code : errorCodes_1.ErrorCodes.INTERNAL_ERROR;
    const payload = {
        error: {
            code,
            message: error.message || 'Unexpected error occurred',
            details: isAppError ? error.details : undefined,
        },
    };
    if (statusCode >= 500) {
        logger_1.logger.error({ err: error, code }, 'Unhandled application error');
    }
    else {
        logger_1.logger.warn({ err: error, code }, 'Handled error');
    }
    res.status(statusCode).json(payload);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map