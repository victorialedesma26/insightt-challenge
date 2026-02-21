"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const start = async () => {
    try {
        await (0, database_1.connectDatabase)();
        app_1.app.listen(env_1.env.port, () => {
            logger_1.logger.info(`Task Management API listening on port ${env_1.env.port}`);
        });
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to start server');
        process.exit(1);
    }
};
void start();
//# sourceMappingURL=server.js.map