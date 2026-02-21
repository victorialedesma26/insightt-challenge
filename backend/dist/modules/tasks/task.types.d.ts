export declare const TASK_STATUSES: readonly ["PENDING", "IN_PROGRESS", "DONE", "ARCHIVED"];
export type TaskStatus = (typeof TASK_STATUSES)[number];
export declare const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]>;
export declare const EDITABLE_STATUSES: TaskStatus[];
