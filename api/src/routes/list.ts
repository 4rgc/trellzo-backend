import { Router } from 'express';
import { param, body, oneOf } from 'express-validator';
import listController from '../controllers/list';
import authController from '../controllers/auth';
import validateRequest from '../middleware/validateRequest';

const listRouter = Router();

listRouter.post(
	'/:boardId',
	param('boardId').isMongoId(),
	body('name').isString().notEmpty(),
	validateRequest,
	authController.verifyToken,
	listController.addList
);

listRouter.post(
	'/:boardId/:listId',
	param('boardId').isMongoId(),
	param('listId').isMongoId(),
	oneOf([body('name').not().exists(), body('name').isString().notEmpty()]),
	oneOf([
		body('description').not().exists(),
		body('description').isString().notEmpty(),
	]),
	oneOf([
		body('notesOrder').not().exists(),
		body('notesOrder').isArray().notEmpty(),
	]),
	validateRequest,
	authController.verifyToken,
	listController.updateList
);

listRouter.delete(
	'/:boardId/:listId',
	param('boardId').isMongoId(),
	param('listId').isMongoId(),
	validateRequest,
	authController.verifyToken,
	listController.removeList
);

export default listRouter;
