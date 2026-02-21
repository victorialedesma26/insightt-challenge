"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_1 = require("./task.service");
const AppError_1 = require("../../shared/errors/AppError");
const errorCodes_1 = require("../../shared/errors/errorCodes");
class TaskController {
    constructor(taskService = new task_service_1.TaskService()) {
        this.taskService = taskService;
        this.create = async (req, res, next) => {
            try {
                const ownerId = this.requireUser(req);
                const task = await this.taskService.createTask(req.body, ownerId);
                return res.status(201).json({ data: task });
            }
            catch (error) {
                return next(error);
            }
        };
        this.list = async (req, res, next) => {
            try {
                const ownerId = this.requireUser(req);
                const tasks = await this.taskService.listTasks(ownerId, req.query);
                return res.json({ data: tasks });
            }
            catch (error) {
                return next(error);
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const ownerId = this.requireUser(req);
                const task = await this.taskService.getTask(this.extractTaskId(req), ownerId);
                return res.json({ data: task });
            }
            catch (error) {
                return next(error);
            }
        };
        this.update = async (req, res, next) => {
            try {
                const ownerId = this.requireUser(req);
                const task = await this.taskService.updateTask(this.extractTaskId(req), ownerId, req.body);
                return res.json({ data: task });
            }
            catch (error) {
                return next(error);
            }
        };
        this.delete = async (req, res, next) => {
            try {
                const ownerId = this.requireUser(req);
                await this.taskService.deleteTask(this.extractTaskId(req), ownerId);
                return res.status(204).send();
            }
            catch (error) {
                return next(error);
            }
        };
        this.transitionStatus = async (req, res, next) => {
            try {
                const ownerId = this.requireUser(req);
                const task = await this.taskService.transitionStatus(this.extractTaskId(req), ownerId, req.body);
                return res.json({ data: task });
            }
            catch (error) {
                return next(error);
            }
        };
        this.markAsDone = async (req, res, next) => {
            try {
                const ownerId = this.requireUser(req);
                const task = await this.taskService.markAsDone(this.extractTaskId(req), ownerId);
                return res.json({ data: task });
            }
            catch (error) {
                return next(error);
            }
        };
    }
    requireUser(req) {
        if (!req.auth?.sub) {
            throw new AppError_1.AppError('Authenticated user is missing', 401, errorCodes_1.ErrorCodes.AUTH_REQUIRED);
        }
        return req.auth.sub;
    }
    extractTaskId(req) {
        const { taskId } = req.params;
        return taskId;
    }
}
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map