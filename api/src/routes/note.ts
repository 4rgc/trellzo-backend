import { Router } from 'express';
import { param, oneOf, body } from 'express-validator';
import validateRequest from '../middleware/validateRequest';
import authController from '../controllers/auth';
import noteController from '../controllers/note';

const noteRouter = Router();

noteRouter.get(
	'/:noteId',
	param('noteId').isMongoId(),
	validateRequest,
	authController.verifyToken,
	noteController.getNote
);

noteRouter.post(
	'/:noteId',
	param('noteId').isMongoId(),
	oneOf([body('name').not().exists(), body('name').isString().notEmpty()]),
	oneOf([
		body('description').not().exists(),
		body('description').isString().notEmpty(),
	]),
	oneOf([body('startDate').not().exists(), body('startDate').isDate()]),
	oneOf([body('dueDate').not().exists(), body('dueDate').isDate()]),
	oneOf([body('tags').not().exists(), body('tags').isArray()]),
	oneOf([
		body('checklistsOrder').not().exists(),
		body('checklistsOrder').isArray(),
	]),
	validateRequest,
	authController.verifyToken,
	noteController.updateNote
);

noteRouter.post(
	'/:boardId/:listId',
	param('boardId').isMongoId(),
	param('listId').isMongoId(),
	body('name').isString().notEmpty(),
	oneOf([
		body('description').not().exists(),
		body('description').isString().notEmpty(),
	]),
	oneOf([body('startDate').not().exists(), body('startDate').isDate()]),
	oneOf([body('dueDate').not().exists(), body('dueDate').isDate()]),
	oneOf([body('tags').not().exists(), body('tags').isArray()]),
	validateRequest,
	authController.verifyToken,
	noteController.addNote
);

noteRouter.delete(
	'/:noteId',
	param('noteId').isMongoId(),
	validateRequest,
	authController.verifyToken,
	noteController.deleteNote
);

export default noteRouter;
