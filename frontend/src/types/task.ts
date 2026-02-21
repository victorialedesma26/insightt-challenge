export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskPayload {
  title: string;
  description?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  search?: string;
}

export const STATUS_FLOW: Record<TaskStatus, TaskStatus[]> = {
  PENDING: ['IN_PROGRESS'],
  IN_PROGRESS: ['DONE'],
  DONE: ['ARCHIVED'],
  ARCHIVED: [],
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  ARCHIVED: 'Archived',
};

export const STATUS_COLORS: Record<TaskStatus, 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error'> = {
  PENDING: 'warning',
  IN_PROGRESS: 'info',
  DONE: 'success',
  ARCHIVED: 'default',
};
