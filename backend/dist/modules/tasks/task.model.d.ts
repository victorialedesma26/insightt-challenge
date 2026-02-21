import { type Document, type Model } from 'mongoose';
import { type TaskStatus } from './task.types';
export interface TaskDocument extends Document {
    title: string;
    description?: string;
    status: TaskStatus;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    id: string;
}
export interface TaskAttrs {
    title: string;
    description?: string;
    ownerId: string;
    status?: TaskStatus;
}
export declare const TaskModel: Model<TaskDocument>;
