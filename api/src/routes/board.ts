import { Router } from 'express';
const boardRouter = Router();

import authController from '../controllers/auth';
import boardController from '../controllers/board';

boardRouter.get(
	'/:boardId',
	authController.verifyToken,
	boardController.getBoard
);

boardRouter.post(
	'/:boardId',
	authController.verifyToken,
	boardController.updateBoard
);

boardRouter.delete(
	'/:boardId',
	authController.verifyToken,
	boardController.deleteBoard
);

export default boardRouter;
