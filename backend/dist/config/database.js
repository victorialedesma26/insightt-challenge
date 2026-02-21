"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = require("./logger");
const connectDatabase = async () => {
    if (mongoose_1.default.connection.readyState === 1) {
        return;
    }
    try {
        await mongoose_1.default.connect(env_1.env.mongoUri);
        logger_1.logger.info('MongoDB connection established');
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'MongoDB connection failed');
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map