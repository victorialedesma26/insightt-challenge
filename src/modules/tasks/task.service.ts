import { AppError } from '../../shared/errors/AppError';
import { ErrorCodes } from '../../shared/errors/errorCodes';
import { assertValidObjectId } from '../../shared/utils/mongo';
import type { TaskDocument } from './task.model';
import { TaskRepository } from './task.repository';
import type {
  CreateTaskDTO,
  StatusTransitionDTO,
  TaskFiltersDTO,
  UpdateTaskDTO,
} from './dto/task.dto';
import { EDITABLE_STATUSES, STATUS_TRANSITIONS, type TaskStatus } from './task.types';

export class TaskService {
  constructor(private readonly repository = new TaskRepository()) {}

  async createTask(payload: CreateTaskDTO, ownerId: string): Promise<TaskDocument> {
    return this.repository.create({ ...payload, ownerId });
  }

  async listTasks(ownerId: string, filters: TaskFiltersDTO = {}): Promise<TaskDocument[]> {
    return this.repository.listByOwner(ownerId, filters);
  }

  async getTask(taskId: string, ownerId: string): Promise<TaskDocument> {
    assertValidObjectId(taskId, 'Task');
    const task = await this.repository.findOwnedTask(taskId, ownerId);

    if (!task) {
      throw new AppError('Task not found', 404, ErrorCodes.TASK_NOT_FOUND);
    }

    return task;
  }

  async updateTask(taskId: string, ownerId: string, payload: UpdateTaskDTO): Promise<TaskDocument> {
    const task = await this.getTask(taskId, ownerId);
    this.assertEditable(task, payload);

    const updated = await this.repository.updateOwnedTask(task.id, ownerId, {
      $set: {
        ...payload,
        updatedAt: new Date(),
      },
    });

    if (!updated) {
      throw new AppError('Task update conflict', 409, ErrorCodes.CONCURRENT_UPDATE);
    }

    return updated;
  }

  async deleteTask(taskId: string, ownerId: string): Promise<void> {
    assertValidObjectId(taskId, 'Task');
    const deleted = await this.repository.deleteOwnedTask(taskId, ownerId);

    if (!deleted) {
      throw new AppError('Task not found', 404, ErrorCodes.TASK_NOT_FOUND);
    }
  }

  async transitionStatus(
    taskId: string,
    ownerId: string,
    payload: StatusTransitionDTO,
  ): Promise<TaskDocument> {
    const task = await this.getTask(taskId, ownerId);
    const { targetStatus } = payload;

    if (task.status === targetStatus) {
      return task;
    }

    this.ensureValidTransition(task.status, targetStatus);

    const updated = await this.repository.updateStatusAtomically(task.id, ownerId, task.status, targetStatus);

    if (!updated) {
      throw new AppError('Status update conflict', 409, ErrorCodes.STATUS_CONFLICT);
    }

    return updated;
  }

  async markAsDone(taskId: string, ownerId: string): Promise<TaskDocument> {
    const task = await this.getTask(taskId, ownerId);

    if (task.status === 'DONE') {
      return task;
    }

    if (task.status !== 'IN_PROGRESS') {
      throw new AppError('Tasks must be in progress before being marked as done', 422, ErrorCodes.INVALID_STATUS_TRANSITION);
    }

    const updated = await this.repository.updateStatusAtomically(task.id, ownerId, 'IN_PROGRESS', 'DONE');

    if (!updated) {
      const latest = await this.repository.findOwnedTask(task.id, ownerId);

      if (latest && latest.status === 'DONE') {
        return latest;
      }

      throw new AppError('Task was already marked as done', 409, ErrorCodes.STATUS_CONFLICT);
    }

    return updated;
  }

  private ensureValidTransition(current: TaskStatus, next: TaskStatus): void {
    const allowed = STATUS_TRANSITIONS[current] ?? [];

    if (!allowed.includes(next)) {
      throw new AppError('Invalid status transition', 422, ErrorCodes.INVALID_STATUS_TRANSITION);
    }
  }

  private assertEditable(task: TaskDocument, payload: UpdateTaskDTO): void {
    if (EDITABLE_STATUSES.includes(task.status)) {
      return;
    }

    const providedFields = Object.entries(payload)
      .filter(([, value]) => value !== undefined)
      .map(([key]) => key);

    const onlyTitleChange = providedFields.length === 1 && providedFields[0] === 'title';

    if (task.status === 'DONE' && onlyTitleChange) {
      return;
    }

    throw new AppError('Task cannot be edited in its current status', 422, ErrorCodes.TASK_LOCKED);
  }
}
