import { Router } from 'express';
import { param, body } from 'express-validator';
import authController from '../controllers/auth';
import commentController from '../controllers/comment';
import validateRequest from '../middleware/validateRequest';

const commentRouter = Router();

commentRouter.use(authController.verifyToken);

commentRouter.get(
	'/:noteId',
	param('noteId').isMongoId(),
	validateRequest,
	commentController.getComments
);

commentRouter.post(
	'/:noteId',
	param('noteId').isMongoId(),
	body('contents').isString().notEmpty(),
	validateRequest,
	commentController.postComment
);

commentRouter.patch(
	'/:noteId/:commentId',
	param('noteId').isMongoId(),
	param('commentId').isMongoId(),
	body('contents').isString().notEmpty(),
	validateRequest,
	commentController.patchComment
);

commentRouter.delete(
	'/:noteId/:commentId',
	param('noteId').isMongoId(),
	param('commentId').isMongoId(),
	validateRequest,
	commentController.deleteComment
);

export default commentRouter;
