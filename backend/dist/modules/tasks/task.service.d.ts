import type { TaskDocument } from './task.model';
import { TaskRepository } from './task.repository';
import type { CreateTaskDTO, StatusTransitionDTO, TaskFiltersDTO, UpdateTaskDTO } from './dto/task.dto';
export declare class TaskService {
    private readonly repository;
    constructor(repository?: TaskRepository);
    createTask(payload: CreateTaskDTO, ownerId: string): Promise<TaskDocument>;
    listTasks(ownerId: string, filters?: TaskFiltersDTO): Promise<TaskDocument[]>;
    getTask(taskId: string, ownerId: string): Promise<TaskDocument>;
    updateTask(taskId: string, ownerId: string, payload: UpdateTaskDTO): Promise<TaskDocument>;
    deleteTask(taskId: string, ownerId: string): Promise<void>;
    transitionStatus(taskId: string, ownerId: string, payload: StatusTransitionDTO): Promise<TaskDocument>;
    markAsDone(taskId: string, ownerId: string): Promise<TaskDocument>;
    private ensureValidTransition;
    private assertEditable;
}
