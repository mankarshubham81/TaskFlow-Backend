import express from 'express';
const router = express.Router();
import TaskController from '../controllers/TaskController.js';
import passport from 'passport';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';

router.post('/',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  TaskController.createTask
);

router.get('/',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  TaskController.getTasks
);

router.patch('/:taskId/status',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  TaskController.updateTaskStatus
);

router.delete('/:taskId',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  TaskController.deleteTask
);

export default router;