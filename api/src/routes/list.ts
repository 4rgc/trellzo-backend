import listController from '../controllers/list';
import authController from '../controllers/auth';

import { Router } from 'express';
const listRouter = Router();

listRouter.post(
	'/:boardId',
	authController.verifyToken,
	listController.addList
);

listRouter.post(
	'/:boardId/:listId',
	authController.verifyToken,
	listController.updateList
);

listRouter.delete(
	'/:boardId/:listId',
	authController.verifyToken,
	listController.removeList
);

export default listRouter;
