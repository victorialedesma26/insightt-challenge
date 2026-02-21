import { Schema, model, type Document, type Model } from 'mongoose';
import { TASK_STATUSES, type TaskStatus } from './task.types';

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

const TaskSchema = new Schema<TaskDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: TASK_STATUSES, default: 'PENDING', index: true },
    ownerId: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

TaskSchema.index({ ownerId: 1, status: 1 });
TaskSchema.index({ ownerId: 1, createdAt: -1 });

TaskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const output = ret as unknown as Record<string, unknown> & { _id?: { toString: () => string } };

    if (output._id) {
      output.id = output._id.toString();
      Reflect.deleteProperty(output, '_id');
    }
  },
});

TaskSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const output = ret as unknown as Record<string, unknown> & { _id?: { toString: () => string } };

    if (output._id) {
      output.id = output._id.toString();
      Reflect.deleteProperty(output, '_id');
    }
  },
});

export const TaskModel: Model<TaskDocument> = model<TaskDocument>('Task', TaskSchema);
