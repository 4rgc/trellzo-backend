import authController from '../controllers/auth';
import commentController from '../controllers/comment';
import { Router } from 'express';

const commentRouter = Router();

commentRouter.use(authController.verifyToken);

commentRouter.get('/:noteId', commentController.getComments);
commentRouter.post('/:noteId', commentController.postComment);
commentRouter.patch('/:noteId/:commentId', commentController.patchComment);
commentRouter.delete('/:noteId/:commentId', commentController.deleteComment);

export default commentRouter;
