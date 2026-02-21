import type { NextFunction, Request, Response } from 'express';
import { TaskService } from './task.service';
import type {
  CreateTaskDTO,
  StatusTransitionDTO,
  TaskFiltersDTO,
  UpdateTaskDTO,
} from './dto/task.dto';
import { AppError } from '../../shared/errors/AppError';
import { ErrorCodes } from '../../shared/errors/errorCodes';

export class TaskController {
  constructor(private readonly taskService = new TaskService()) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = this.requireUser(req);
      const task = await this.taskService.createTask(req.body as CreateTaskDTO, ownerId);
      return res.status(201).json({ data: task });
    } catch (error) {
      return next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = this.requireUser(req);
      const tasks = await this.taskService.listTasks(ownerId, req.query as TaskFiltersDTO);
      return res.json({ data: tasks });
    } catch (error) {
      return next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = this.requireUser(req);
      const task = await this.taskService.getTask(this.extractTaskId(req), ownerId);
      return res.json({ data: task });
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = this.requireUser(req);
      const task = await this.taskService.updateTask(
        this.extractTaskId(req),
        ownerId,
        req.body as UpdateTaskDTO,
      );
      return res.json({ data: task });
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = this.requireUser(req);
      await this.taskService.deleteTask(this.extractTaskId(req), ownerId);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };

  transitionStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = this.requireUser(req);
      const task = await this.taskService.transitionStatus(
        this.extractTaskId(req),
        ownerId,
        req.body as StatusTransitionDTO,
      );
      return res.json({ data: task });
    } catch (error) {
      return next(error);
    }
  };

  markAsDone = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = this.requireUser(req);
      const task = await this.taskService.markAsDone(this.extractTaskId(req), ownerId);
      return res.json({ data: task });
    } catch (error) {
      return next(error);
    }
  };

  private requireUser(req: Request): string {
    if (!req.auth?.sub) {
      throw new AppError('Authenticated user is missing', 401, ErrorCodes.AUTH_REQUIRED);
    }

    return req.auth.sub;
  }

  private extractTaskId(req: Request): string {
    const { taskId } = req.params as { taskId: string };
    return taskId;
  }
}
