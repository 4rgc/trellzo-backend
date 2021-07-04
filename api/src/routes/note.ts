import authController from '../controllers/auth';
import noteController from '../controllers/note';

import { Router } from 'express';
const noteRouter = Router();

noteRouter.get(
	'/:boardId/:listId',
	authController.verifyToken,
	noteController.getNote
);
noteRouter.post(
	'/:boardId/:listId/:noteId',
	authController.verifyToken,
	noteController.updateNote
);

noteRouter.post(
	'/:boardId/:listId',
	authController.verifyToken,
	noteController.addNote
);

noteRouter.delete(
	'/:boardId/:listId/:noteId',
	authController.verifyToken,
	noteController.deleteNote
);

export default noteRouter;