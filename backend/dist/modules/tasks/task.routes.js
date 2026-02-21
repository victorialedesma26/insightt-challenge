"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = require("express");
const task_controller_1 = require("./task.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const task_validation_1 = require("./task.validation");
const router = (0, express_1.Router)();
const controller = new task_controller_1.TaskController();
router.post('/', (0, validation_middleware_1.validateRequest)(task_validation_1.createTaskSchema), controller.create);
router.get('/', (0, validation_middleware_1.validateRequest)(task_validation_1.taskFiltersSchema, 'query'), controller.list);
router.get('/:taskId', (0, validation_middleware_1.validateRequest)(task_validation_1.taskIdParamSchema, 'params'), controller.getById);
router.patch('/:taskId', (0, validation_middleware_1.validateRequest)(task_validation_1.taskIdParamSchema, 'params'), (0, validation_middleware_1.validateRequest)(task_validation_1.updateTaskSchema), controller.update);
router.delete('/:taskId', (0, validation_middleware_1.validateRequest)(task_validation_1.taskIdParamSchema, 'params'), controller.delete);
router.post('/:taskId/transition', (0, validation_middleware_1.validateRequest)(task_validation_1.taskIdParamSchema, 'params'), (0, validation_middleware_1.validateRequest)(task_validation_1.statusTransitionSchema), controller.transitionStatus);
router.post('/:taskId/done', (0, validation_middleware_1.validateRequest)(task_validation_1.taskIdParamSchema, 'params'), controller.markAsDone);
exports.taskRouter = router;
//# sourceMappingURL=task.routes.js.map