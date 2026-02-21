import type { NextFunction, Request, Response } from 'express';
import { TaskService } from './task.service';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService?: TaskService);
    create: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    transitionStatus: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    markAsDone: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    private requireUser;
    private extractTaskId;
}
