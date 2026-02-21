"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const task_model_1 = require("./task.model");
class TaskRepository {
    create(attributes) {
        return task_model_1.TaskModel.create(attributes);
    }
    findOwnedTask(taskId, ownerId) {
        return task_model_1.TaskModel.findOne({ _id: taskId, ownerId }).exec();
    }
    listByOwner(ownerId, filters = {}) {
        const query = { ownerId };
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.search) {
            query.title = { $regex: filters.search, $options: 'i' };
        }
        return task_model_1.TaskModel.find(query).sort({ createdAt: -1 }).exec();
    }
    updateOwnedTask(taskId, ownerId, update) {
        return task_model_1.TaskModel.findOneAndUpdate({ _id: taskId, ownerId }, update, { new: true }).exec();
    }
    updateStatusAtomically(taskId, ownerId, expectedStatus, targetStatus) {
        return task_model_1.TaskModel.findOneAndUpdate({ _id: taskId, ownerId, status: expectedStatus }, {
            $set: {
                status: targetStatus,
                updatedAt: new Date(),
            },
        }, { new: true }).exec();
    }
    deleteOwnedTask(taskId, ownerId) {
        return task_model_1.TaskModel.deleteOne({ _id: taskId, ownerId })
            .exec()
            .then((result) => result.deletedCount === 1);
    }
}
exports.TaskRepository = TaskRepository;
//# sourceMappingURL=task.repository.js.map