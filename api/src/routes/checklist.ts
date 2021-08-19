import { Router } from 'express';
import { param, body, oneOf } from 'express-validator';
import authController from '../controllers/auth';
import checklistController from '../controllers/checklist';
import validateRequest from '../middleware/validateRequest';

const checklistRouter = Router();

checklistRouter.post(
	'/:noteId/:checklistId',
	param('noteId').isMongoId(),
	param('checklistId').isMongoId(),
	oneOf([body('name').not().exists(), body('name').isString()]),
	oneOf([body('checkItems').not().exists(), body('checkItems').isArray()]),
	oneOf([
		body('checkItemsOrder').not().exists(),
		body('checkItemsOrder').isArray(),
	]),
	validateRequest,
	authController.verifyToken,
	checklistController.updateChecklist
);

checklistRouter.post(
	'/:noteId',
	param('noteId').isMongoId(),
	body('name').isString(),
	oneOf([body('checkItems').not().exists(), body('checkItems').isArray()]),
	oneOf([
		body('checkItemsOrder').not().exists(),
		body('checkItemsOrder').isArray(),
	]),
	validateRequest,
	authController.verifyToken,
	checklistController.addChecklist
);

checklistRouter.delete(
	'/:noteId/:checklistId',
	param('noteId').isMongoId(),
	param('checklistId').isMongoId(),
	validateRequest,
	authController.verifyToken,
	checklistController.removeChecklist
);

export default checklistRouter;
