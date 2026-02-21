import type { TaskStatus } from '../task.types';

export interface CreateTaskDTO {
  title: string;
  description?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
}

export interface TaskFiltersDTO {
  status?: TaskStatus;
  search?: string;
}

export interface StatusTransitionDTO {
  targetStatus: TaskStatus;
}
