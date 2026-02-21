"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDITABLE_STATUSES = exports.STATUS_TRANSITIONS = exports.TASK_STATUSES = void 0;
exports.TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE', 'ARCHIVED'];
exports.STATUS_TRANSITIONS = {
    PENDING: ['IN_PROGRESS'],
    IN_PROGRESS: ['DONE'],
    DONE: ['ARCHIVED'],
    ARCHIVED: [],
};
exports.EDITABLE_STATUSES = ['PENDING', 'IN_PROGRESS'];
//# sourceMappingURL=task.types.js.map