import { Router } from 'express';
import { setupProfile } from '../controllers/users.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const usersRouter = Router();

usersRouter.post('/profile', authMiddleware, setupProfile);

export default usersRouter;