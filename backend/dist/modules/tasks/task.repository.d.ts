import type { UpdateQuery } from 'mongoose';
import { type TaskAttrs, type TaskDocument } from './task.model';
import type { TaskStatus } from './task.types';
import type { TaskFiltersDTO } from './dto/task.dto';
export declare class TaskRepository {
    create(attributes: TaskAttrs): Promise<TaskDocument>;
    findOwnedTask(taskId: string, ownerId: string): Promise<TaskDocument | null>;
    listByOwner(ownerId: string, filters?: TaskFiltersDTO): Promise<TaskDocument[]>;
    updateOwnedTask(taskId: string, ownerId: string, update: UpdateQuery<TaskDocument>): Promise<TaskDocument | null>;
    updateStatusAtomically(taskId: string, ownerId: string, expectedStatus: TaskStatus, targetStatus: TaskStatus): Promise<TaskDocument | null>;
    deleteOwnedTask(taskId: string, ownerId: string): Promise<boolean>;
}
