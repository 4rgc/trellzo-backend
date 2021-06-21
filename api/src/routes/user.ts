import { Router } from 'express';
const userRouter = Router();

import userController from '../controllers/user';
import authController from '../controllers/auth';

userRouter.get('/', authController.verifyToken, userController.getUserProfile);
userRouter.post(
	'/',
	authController.verifyToken,
	userController.updateUserProfile
);

userRouter.post(
	'/register',
	userController.registerNewUser,
	authController.generateTokens,
	(_, res) => res.status(201).json({ message: 'Created' })
);

export default userRouter;
