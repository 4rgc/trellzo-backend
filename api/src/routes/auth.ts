import { Router } from 'express';
const authRouter = Router();

import authController from '../controllers/auth';
import userController from '../controllers/user';
import { sendSuccessMessageHandler } from '../util/route-handling';

authRouter.post(
	'/login',
	userController.verifyLogin,
	authController.generateTokens,
	sendSuccessMessageHandler('Logged in')
);

authRouter.post('/logout', authController.logout);

authRouter.post('/refresh', authController.refreshAuthToken);

export default authRouter;
