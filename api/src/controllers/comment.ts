import { Request, Response, NextFunction } from 'express';
import commentDataController from '../data-controllers/comment';

const getComments = async (req: Request, res: Response, next: NextFunction) => {
	const { noteId } = req.params;

	if (!noteId) return res.status(400).json({ message: 'noteId was null' });

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
	const { content } = req.body;

	if (!noteId) return res.status(400).json({ message: 'noteId was null' });
	if (!content) return res.status(400).json({ message: 'content was empty' });

	const { comments, err } = await commentDataController
		.postComment(noteId, userId, content)
		.then(
			(comments) => ({ comments, err: undefined }),
			(err) => ({ err, comments: undefined })
		);

	if (err) return next(err);
	if (!comments) return res.status(404).json({ message: 'Note not found' });

	return res.json({ comments });
};

const patchComment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { noteId, commentId } = req.params;
	const { content } = req.body;

	if (!noteId) return res.status(400).json({ message: 'noteId was null' });
	if (!commentId) return res.status(400).json({ message: 'noteId was null' });
	if (!content) return res.status(400).json({ message: 'content was empty' });

	const { comments, err } = await commentDataController
		.patchComment(noteId, commentId, content)
		.then(
			(comments) => ({ comments, err: undefined }),
			(err) => ({ err, comments: undefined })
		);

	if (err) return next(err);
	if (!comments)
		return res.status(404).json({ message: 'Comment not found' });

	return res.json({ comments });
};

const deleteComment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { noteId, commentId } = req.params;

	if (!noteId) return res.status(400).json({ message: 'noteId was null' });
	if (!commentId) return res.status(400).json({ message: 'noteId was null' });

	const { comments, err } = await commentDataController
		.deleteComment(noteId, commentId)
		.then(
			(comments) => ({ comments, err: undefined }),
			(err) => ({ err, comments: undefined })
		);

	if (err) return next(err);
	if (!comments)
		return res.status(404).json({ message: 'Comment not found' });

	return res.json({ comments });
};

const commentController = {
	getComments,
	postComment,
	patchComment,
	deleteComment,
};

export default commentController;
