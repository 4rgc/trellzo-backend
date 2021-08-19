import { Router } from 'express';
import { body, oneOf } from 'express-validator';
import userController from '../controllers/user';
import authController from '../controllers/auth';
import validateRequest from '../middleware/validateRequest';

const userRouter = Router();

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

userRouter.get('/', authController.verifyToken, userController.getUserProfile);

userRouter.post(
	'/',
	oneOf([
		body('name').notEmpty().not().isNumeric(),
		body('name').not().exists(),
	]),
	oneOf([body('email').isEmail().notEmpty(), body('email').not().exists()]),
	validateRequest,
	authController.verifyToken,
	userController.updateUserProfile
);

userRouter.post(
	'/register',
	body('email').isEmail().notEmpty(),
	body('name').notEmpty().not().isNumeric(),
	body('password').matches(passwordRegex),
	validateRequest,
	userController.registerNewUser,
	authController.generateTokens,
	(_, res) => res.status(201).json({ message: 'Created' })
);

export default userRouter;
