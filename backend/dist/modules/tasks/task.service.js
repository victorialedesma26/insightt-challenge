"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const errorCodes_1 = require("../../shared/errors/errorCodes");
const mongo_1 = require("../../shared/utils/mongo");
const task_repository_1 = require("./task.repository");
const task_types_1 = require("./task.types");
class TaskService {
    constructor(repository = new task_repository_1.TaskRepository()) {
        this.repository = repository;
    }
    async createTask(payload, ownerId) {
        return this.repository.create({ ...payload, ownerId });
    }
    async listTasks(ownerId, filters = {}) {
        return this.repository.listByOwner(ownerId, filters);
    }
    async getTask(taskId, ownerId) {
        (0, mongo_1.assertValidObjectId)(taskId, 'Task');
        const task = await this.repository.findOwnedTask(taskId, ownerId);
        if (!task) {
            throw new AppError_1.AppError('Task not found', 404, errorCodes_1.ErrorCodes.TASK_NOT_FOUND);
        }
        return task;
    }
    async updateTask(taskId, ownerId, payload) {
        const task = await this.getTask(taskId, ownerId);
        this.assertEditable(task, payload);
        const updated = await this.repository.updateOwnedTask(task.id, ownerId, {
            $set: {
                ...payload,
                updatedAt: new Date(),
            },
        });
        if (!updated) {
            throw new AppError_1.AppError('Task update conflict', 409, errorCodes_1.ErrorCodes.CONCURRENT_UPDATE);
        }
        return updated;
    }
    async deleteTask(taskId, ownerId) {
        (0, mongo_1.assertValidObjectId)(taskId, 'Task');
        const deleted = await this.repository.deleteOwnedTask(taskId, ownerId);
        if (!deleted) {
            throw new AppError_1.AppError('Task not found', 404, errorCodes_1.ErrorCodes.TASK_NOT_FOUND);
        }
    }
    async transitionStatus(taskId, ownerId, payload) {
        const task = await this.getTask(taskId, ownerId);
        const { targetStatus } = payload;
        if (task.status === targetStatus) {
            return task;
        }
        this.ensureValidTransition(task.status, targetStatus);
        const updated = await this.repository.updateStatusAtomically(task.id, ownerId, task.status, targetStatus);
        if (!updated) {
            throw new AppError_1.AppError('Status update conflict', 409, errorCodes_1.ErrorCodes.STATUS_CONFLICT);
        }
        return updated;
    }
    async markAsDone(taskId, ownerId) {
        const task = await this.getTask(taskId, ownerId);
        if (task.status === 'DONE') {
            return task;
        }
        if (task.status !== 'IN_PROGRESS') {
            throw new AppError_1.AppError('Tasks must be in progress before being marked as done', 422, errorCodes_1.ErrorCodes.INVALID_STATUS_TRANSITION);
        }
        const updated = await this.repository.updateStatusAtomically(task.id, ownerId, 'IN_PROGRESS', 'DONE');
        if (!updated) {
            const latest = await this.repository.findOwnedTask(task.id, ownerId);
            if (latest && latest.status === 'DONE') {
                return latest;
            }
            throw new AppError_1.AppError('Task was already marked as done', 409, errorCodes_1.ErrorCodes.STATUS_CONFLICT);
        }
        return updated;
    }
    ensureValidTransition(current, next) {
        const allowed = task_types_1.STATUS_TRANSITIONS[current] ?? [];
        if (!allowed.includes(next)) {
            throw new AppError_1.AppError('Invalid status transition', 422, errorCodes_1.ErrorCodes.INVALID_STATUS_TRANSITION);
        }
    }
    assertEditable(task, payload) {
        if (task_types_1.EDITABLE_STATUSES.includes(task.status)) {
            return;
        }
        const providedFields = Object.entries(payload)
            .filter(([, value]) => value !== undefined)
            .map(([key]) => key);
        const onlyTitleChange = providedFields.length === 1 && providedFields[0] === 'title';
        if (task.status === 'DONE' && onlyTitleChange) {
            return;
        }
        throw new AppError_1.AppError('Task cannot be edited in its current status', 422, errorCodes_1.ErrorCodes.TASK_LOCKED);
    }
}
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map