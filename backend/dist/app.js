"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const error_middleware_1 = require("./middleware/error.middleware");
const AppError_1 = require("./shared/errors/AppError");
const request_log_middleware_1 = require("./middleware/request-log.middleware");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json({ limit: '1mb' }));
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use(request_log_middleware_1.requestLogger);
exports.app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
exports.app.use('/api', routes_1.apiRouter);
exports.app.use((_req, _res, next) => {
    next(new AppError_1.AppError('Route not found', 404));
});
exports.app.use(error_middleware_1.errorHandler);
//# sourceMappingURL=app.js.map