export const TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE', 'ARCHIVED'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  PENDING: ['IN_PROGRESS'],
  IN_PROGRESS: ['DONE'],
  DONE: ['ARCHIVED'],
  ARCHIVED: [],
};

export const EDITABLE_STATUSES: TaskStatus[] = ['PENDING', 'IN_PROGRESS'];
