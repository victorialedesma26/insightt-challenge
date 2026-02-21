"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const task_routes_1 = require("../modules/tasks/task.routes");
const auth_middleware_1 = require("../middleware/auth.middleware");
const activity_log_middleware_1 = require("../middleware/activity-log.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use(activity_log_middleware_1.activityLogger);
router.use('/tasks', task_routes_1.taskRouter);
exports.apiRouter = router;
//# sourceMappingURL=index.js.map