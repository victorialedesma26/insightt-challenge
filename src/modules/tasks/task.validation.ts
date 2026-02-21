import { z } from 'zod';
import { TASK_STATUSES } from './task.types';

const statusEnum = z.enum(TASK_STATUSES);

export const createTaskSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().max(2000).optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(3).max(140).optional(),
    description: z.string().trim().max(2000).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update a task',
  });

export const taskFiltersSchema = z.object({
  status: statusEnum.optional(),
  search: z.string().trim().min(1).max(140).optional(),
});

export const statusTransitionSchema = z.object({
  targetStatus: statusEnum,
});

export const taskIdParamSchema = z.object({
  taskId: z.string().trim().min(1),
});
