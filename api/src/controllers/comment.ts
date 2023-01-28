import { Request, Response, NextFunction } from 'express';
import commentDataController from '../data-controllers/comment.js';

const getComments = async (req: Request, res: Response, next: NextFunction) => {
	const { noteId } = req.params;

	const { comments, err } = await commentDataController
		.getComments(noteId)
		.then(
			(comments) => ({ comments, err: undefined }),
			(err) => ({ err, comments: undefined })
		);

	if (err) return next(err);
	if (!comments) return res.status(404).json({ message: 'Note not found' });

	return res.json({ comments });
};

const postComment = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;
	const { noteId } = req.params;
	const { contents } = req.body;

	const { comment, err } = await commentDataController
		.postComment(noteId, userId, contents)
		.then(
			(comment) => ({ comment, err: undefined }),
			(err) => ({ err, comment: undefined })
		);

	if (err) return next(err);
	if (!comment) return res.status(404).json({ message: 'Note not found' });

	return res.json({ comment });
};

const patchComment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { noteId, commentId } = req.params;
	const { contents } = req.body;

	const { comment, err } = await commentDataController
		.patchComment(noteId, commentId, contents)
		.then(
			(comment) => ({ comment, err: undefined }),
			(err) => ({ err, comment: undefined })
		);

	if (err) return next(err);
	if (!comment) return res.status(404).json({ message: 'Comment not found' });

	return res.json({ comment });
};

const deleteComment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { noteId, commentId } = req.params;

	const { comment, err } = await commentDataController
		.deleteComment(noteId, commentId)
		.then(
			(comment) => ({ comment, err: undefined }),
			(err) => ({ err, comment: undefined })
		);

	if (err) return next(err);
	if (!comment) return res.status(404).json({ message: 'Comment not found' });

	return res.json({ comment });
};

const commentController = {
	getComments,
	postComment,
	patchComment,
	deleteComment,
};

export default commentController;
