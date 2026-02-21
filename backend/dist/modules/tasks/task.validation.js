"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskIdParamSchema = exports.statusTransitionSchema = exports.taskFiltersSchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const task_types_1 = require("./task.types");
const statusEnum = zod_1.z.enum(task_types_1.TASK_STATUSES);
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(3).max(140),
    description: zod_1.z.string().trim().max(2000).optional(),
});
exports.updateTaskSchema = zod_1.z
    .object({
    title: zod_1.z.string().trim().min(3).max(140).optional(),
    description: zod_1.z.string().trim().max(2000).optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update a task',
});
exports.taskFiltersSchema = zod_1.z.object({
    status: statusEnum.optional(),
    search: zod_1.z.string().trim().min(1).max(140).optional(),
});
exports.statusTransitionSchema = zod_1.z.object({
    targetStatus: statusEnum,
});
exports.taskIdParamSchema = zod_1.z.object({
    taskId: zod_1.z.string().trim().min(1),
});
//# sourceMappingURL=task.validation.js.map