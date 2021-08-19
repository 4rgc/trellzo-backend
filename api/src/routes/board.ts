import { Router } from 'express';
import { body, oneOf, param } from 'express-validator';
import authController from '../controllers/auth';
import boardController from '../controllers/board';
import validateRequest from '../middleware/validateRequest';

const boardRouter = Router();

boardRouter.get('/', authController.verifyToken, boardController.getBoards);

boardRouter.post(
	'/',
	body('name').isString(),
	validateRequest,
	authController.verifyToken,
	boardController.createBoard
);

boardRouter.get(
	'/:boardId',
	param('boardId').isMongoId(),
	validateRequest,
	authController.verifyToken,
	boardController.getBoard
);

boardRouter.post(
	'/:boardId',
	param('boardId').isMongoId(),
	oneOf([body('name').not().exists(), body('name').isString().notEmpty()]),
	oneOf([
		body('description').not().exists(),
		body('description').isString().notEmpty(),
	]),
	oneOf([
		body('listsOrder').not().exists(),
		body('listsOrder').isArray().notEmpty(),
	]),
	validateRequest,
	authController.verifyToken,
	boardController.updateBoard
);

boardRouter.delete(
	'/:boardId',
	param('boardId').isMongoId(),
	validateRequest,
	authController.verifyToken,
	boardController.deleteBoard
);

export default boardRouter;
