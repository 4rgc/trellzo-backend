import { Router } from 'express';
const authRouter = Router();

import authController from '../controllers/auth';
import userController from '../controllers/user';
import { sendSuccessMessageHandler } from '../util/route-handling';
const authRouter = Router();

authRouter.post(
	'/login',
	authController.verifyLogin,
	authController.generateTokens,
	sendSuccessMessageHandler('Logged in')
);

authRouter.post('/logout', authController.logout);

authRouter.post('/refresh', authController.refreshAuthToken);

export default authRouter;
