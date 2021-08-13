import { Router } from 'express';
import { cookie, body } from 'express-validator';
import authController from '../controllers/auth';
import validateRequest from '../middleware/validateRequest';
import { sendSuccessMessageHandler } from '../util/route-handling';
const authRouter = Router();

authRouter.post(
	'/login',
	body('email').isEmail().notEmpty(),
	body('password').notEmpty(),
	validateRequest,
	authController.verifyLogin,
	authController.generateTokens,
	sendSuccessMessageHandler('Logged in')
);

authRouter.post('/logout', authController.logout);

authRouter.post(
	'/refresh',
	cookie('auth').notEmpty().contains('JWT '),
	cookie('reft').notEmpty().isJWT(),
	validateRequest,
	authController.refreshAuthToken
);

export default authRouter;
