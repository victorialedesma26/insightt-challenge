"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const AppError_1 = require("../shared/errors/AppError");
const errorCodes_1 = require("../shared/errors/errorCodes");
const validateRequest = (schema, segment = 'body') => {
    return (req, _res, next) => {
        const result = schema.safeParse(req[segment]);
        if (!result.success) {
            return next(new AppError_1.AppError('Validation failed', 422, errorCodes_1.ErrorCodes.VALIDATION_ERROR, result.error.flatten()));
        }
        Object.assign(req[segment], result.data);
        return next();
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validation.middleware.js.map