import { Router } from 'express';
import { TaskController } from './task.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import {
  createTaskSchema,
  statusTransitionSchema,
  taskFiltersSchema,
  taskIdParamSchema,
  updateTaskSchema,
} from './task.validation';

const router = Router();
const controller = new TaskController();

router.post('/', validateRequest(createTaskSchema), controller.create);
router.get('/', validateRequest(taskFiltersSchema, 'query'), controller.list);
router.get('/:taskId', validateRequest(taskIdParamSchema, 'params'), controller.getById);
router.patch(
  '/:taskId',
  validateRequest(taskIdParamSchema, 'params'),
  validateRequest(updateTaskSchema),
  controller.update,
);
router.delete('/:taskId', validateRequest(taskIdParamSchema, 'params'), controller.delete);
router.post(
  '/:taskId/transition',
  validateRequest(taskIdParamSchema, 'params'),
  validateRequest(statusTransitionSchema),
  controller.transitionStatus,
);
router.post('/:taskId/done', validateRequest(taskIdParamSchema, 'params'), controller.markAsDone);

export const taskRouter = router;
