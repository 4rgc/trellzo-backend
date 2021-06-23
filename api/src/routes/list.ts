import listController from '../controllers/list';
import authController from '../controllers/auth';

import { Router } from 'express';
const listRouter = Router();

listRouter.post(
	'/list/:boardId/',
	authController.verifyToken,
	listController.addList
);

listRouter.post(
	'/list/:boardId/:listId',
	authController.verifyToken,
	listController.updateList
);

listRouter.delete(
	'/list/:boardId/:listId',
	authController.verifyToken,
	listController.removeList
);

export default listRouter;
