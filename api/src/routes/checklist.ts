import { Router } from 'express';
import authController from '../controllers/auth';
import checklistController from '../controllers/checklist';

const checklistRouter = Router();

checklistRouter.post(
	'/:noteId/:checklistId',
	authController.verifyToken,
	checklistController.updateChecklist
);

checklistRouter.post(
	'/:noteId',
	authController.verifyToken,
	checklistController.addChecklist
);

checklistRouter.delete(
	'/:noteId/:checklistId',
	authController.verifyToken,
	checklistController.removeChecklist
);

export default checklistRouter;
