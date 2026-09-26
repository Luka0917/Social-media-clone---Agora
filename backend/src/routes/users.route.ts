import { Router } from 'express';
import { 
    getMyProfile, 
    getUserProfile, 
    setupProfile, 
    updateProfile,
    getBannerPresignedUrl,
    getAvatarPresignedUrl,
    saveAvatar,
    saveBanner
} from '../controllers/users.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const usersRouter = Router();

usersRouter.post('/profile', authMiddleware, setupProfile);
usersRouter.patch('/me/profile', authMiddleware, updateProfile);
usersRouter.get('/me/profile', authMiddleware, getMyProfile);
usersRouter.get('/:id/profile', authMiddleware, getUserProfile);
usersRouter.post('/me/avatar/presign', authMiddleware, getAvatarPresignedUrl);
usersRouter.post('/me/banner/presign', authMiddleware, getBannerPresignedUrl);
usersRouter.post('/me/avatar', authMiddleware, saveAvatar);
usersRouter.post('/me/banner', authMiddleware, saveBanner);

export default usersRouter;