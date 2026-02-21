"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
const mongoose_1 = require("mongoose");
const task_types_1 = require("./task.types");
const TaskSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: task_types_1.TASK_STATUSES, default: 'PENDING', index: true },
    ownerId: { type: String, required: true, index: true },
}, { timestamps: true });
TaskSchema.index({ ownerId: 1, status: 1 });
TaskSchema.index({ ownerId: 1, createdAt: -1 });
TaskSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        const output = ret;
        if (output._id) {
            output.id = output._id.toString();
            Reflect.deleteProperty(output, '_id');
        }
    },
});
TaskSchema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        const output = ret;
        if (output._id) {
            output.id = output._id.toString();
            Reflect.deleteProperty(output, '_id');
        }
    },
});
exports.TaskModel = (0, mongoose_1.model)('Task', TaskSchema);
//# sourceMappingURL=task.model.js.map