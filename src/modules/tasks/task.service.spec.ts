import { TaskService } from './task.service';
import type { TaskDocument } from './task.model';
import { ErrorCodes } from '../../shared/errors/errorCodes';
import { TaskRepository } from './task.repository';

const TASK_ID = '507f1f77bcf86cd799439011';
const OWNER_ID = 'user-1';

const buildTask = (overrides: Partial<TaskDocument> = {}): TaskDocument => ({
  id: TASK_ID,
  _id: TASK_ID as unknown,
  title: 'Demo Task',
  ownerId: OWNER_ID,
  status: 'PENDING',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
}) as TaskDocument;

const createRepositoryMock = () => ({
  create: jest.fn(),
  listByOwner: jest.fn(),
  findOwnedTask: jest.fn(),
  updateOwnedTask: jest.fn(),
  updateStatusAtomically: jest.fn(),
});

const serviceWithRepo = (repo: ReturnType<typeof createRepositoryMock>) =>
  new TaskService(repo as unknown as TaskRepository);

describe('TaskService', () => {
  it('rejects invalid status transitions', async () => {
    const repository = createRepositoryMock();
    repository.findOwnedTask.mockResolvedValue(buildTask());

    const service = serviceWithRepo(repository);

    await expect(
      service.transitionStatus(TASK_ID, OWNER_ID, { targetStatus: 'DONE' }),
    ).rejects.toMatchObject({ code: ErrorCodes.INVALID_STATUS_TRANSITION });
  });

  describe('markAsDone', () => {
    it('completes task with atomic update and owner scoping', async () => {
      const repository = createRepositoryMock();
      const task = buildTask({ status: 'IN_PROGRESS' });
      const updated = buildTask({ status: 'DONE' });

      repository.findOwnedTask.mockResolvedValue(task);
      repository.updateStatusAtomically.mockResolvedValue(updated);

      const service = serviceWithRepo(repository);
      const result = await service.markAsDone(TASK_ID, OWNER_ID);

      expect(repository.updateStatusAtomically).toHaveBeenCalledWith(
        task.id,
        OWNER_ID,
        'IN_PROGRESS',
        'DONE',
      );
      expect(result).toBe(updated);
    });

    it('keeps idempotency when already done', async () => {
      const repository = createRepositoryMock();
      const task = buildTask({ status: 'DONE' });
      repository.findOwnedTask.mockResolvedValue(task);

      const service = serviceWithRepo(repository);
      const result = await service.markAsDone(TASK_ID, OWNER_ID);

      expect(result).toBe(task);
      expect(repository.updateStatusAtomically).not.toHaveBeenCalled();
    });

    it('validates owner access', async () => {
      const repository = createRepositoryMock();
      repository.findOwnedTask.mockResolvedValue(null);

      const service = serviceWithRepo(repository);

      await expect(service.markAsDone(TASK_ID, OWNER_ID)).rejects.toMatchObject({
        code: ErrorCodes.TASK_NOT_FOUND,
      });
    });

    it('rejects when status is not in progress', async () => {
      const repository = createRepositoryMock();
      repository.findOwnedTask.mockResolvedValue(buildTask({ status: 'PENDING' }));

      const service = serviceWithRepo(repository);

      await expect(service.markAsDone(TASK_ID, OWNER_ID)).rejects.toMatchObject({
        code: ErrorCodes.INVALID_STATUS_TRANSITION,
      });
    });

    it('surfaces conflict when atomic update fails and task not done', async () => {
      const repository = createRepositoryMock();
      const task = buildTask({ status: 'IN_PROGRESS' });
      repository.findOwnedTask
        .mockResolvedValueOnce(task) // initial fetch
        .mockResolvedValueOnce(buildTask({ status: 'IN_PROGRESS' })); // refetch after conflict
      repository.updateStatusAtomically.mockResolvedValue(null);

      const service = serviceWithRepo(repository);

      await expect(service.markAsDone(TASK_ID, OWNER_ID)).rejects.toMatchObject({
        code: ErrorCodes.STATUS_CONFLICT,
      });
    });
  });
});
