import { Router } from 'express';
import { taskRouter } from '../modules/tasks/task.routes';
import { authenticate } from '../middleware/auth.middleware';
import { activityLogger } from '../middleware/activity-log.middleware';

const router = Router();

router.use(authenticate);
router.use(activityLogger);
router.use('/tasks', taskRouter);

export const apiRouter = router;
