import type { UpdateQuery } from 'mongoose';
import { TaskModel, type TaskAttrs, type TaskDocument } from './task.model';
import type { TaskStatus } from './task.types';
import type { TaskFiltersDTO } from './dto/task.dto';

export class TaskRepository {
	create(attributes: TaskAttrs): Promise<TaskDocument> {
		return TaskModel.create(attributes);
	}

	findOwnedTask(taskId: string, ownerId: string): Promise<TaskDocument | null> {
		return TaskModel.findOne({ _id: taskId, ownerId }).exec();
	}

	listByOwner(ownerId: string, filters: TaskFiltersDTO = {}): Promise<TaskDocument[]> {
		const query: Record<string, unknown> & { ownerId: string } = { ownerId };

		if (filters.status) {
			query.status = filters.status;
		}

		if (filters.search) {
			query.title = { $regex: filters.search, $options: 'i' };
		}

		return TaskModel.find(query).sort({ createdAt: -1 }).exec();
	}

	updateOwnedTask(
		taskId: string,
		ownerId: string,
		update: UpdateQuery<TaskDocument>,
	): Promise<TaskDocument | null> {
		return TaskModel.findOneAndUpdate({ _id: taskId, ownerId }, update, { new: true }).exec();
	}

	updateStatusAtomically(
		taskId: string,
		ownerId: string,
		expectedStatus: TaskStatus,
		targetStatus: TaskStatus,
	): Promise<TaskDocument | null> {
		return TaskModel.findOneAndUpdate(
			{ _id: taskId, ownerId, status: expectedStatus },
			{
				$set: {
					status: targetStatus,
					updatedAt: new Date(),
				},
			},
			{ new: true },
		).exec();
	}

	deleteOwnedTask(taskId: string, ownerId: string): Promise<boolean> {
		return TaskModel.deleteOne({ _id: taskId, ownerId })
			.exec()
			.then((result) => result.deletedCount === 1);
	}
}