import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import boardDataController from '../data-controllers/board';

const getBoards = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;

	if (!userId) return res.status(400).json({ message: 'userId was null' });

	const { boards, err } = await boardDataController
		.getUserBoards(userId)
		.then(
			(boards) => ({ boards, err: undefined }),
			(err) => ({ err, boards: undefined })
		);

	if (err) return next(err);

	return res.json({
		boards,
	});
};

const getBoard = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;
	const { boardId } = req.params;

	if (!userId) return res.status(400).json({ message: 'userId was null' });
	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!isValidObjectId(boardId))
		return res
			.status(400)
			.json({ message: 'boardId was not a valid ObjectId' });

	const { board, err } = await boardDataController.getBoardData(boardId).then(
		(board) => ({ board, err: undefined }),
		(err) => ({ err, board: undefined })
	);

	if (err) return next(err);

	if (!board) return res.status(404).json({ message: 'Board not found' });

	return res.json({
		board,
	});
};

const updateBoard = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;
	const { boardId } = req.params;
	const { name, description, listsOrder } = req.body;

	if (!userId) return res.status(400).json({ message: 'userId was null' });
	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!isValidObjectId(boardId))
		return res
			.status(400)
			.json({ message: 'boardId was not a valid ObjectId' });

	const { board, err } = await boardDataController
		.updateBoard(userId, boardId, name, description, listsOrder)
		.then(
			(board) => ({ board, err: undefined }),
			(err) => ({ err, board: undefined })
		);

	if (err) return next(err);

	if (!board) return res.status(404).json({ message: 'Board not found' });

	return res.json({ board });
};

const deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;
	const { boardId } = req.params;

	if (!userId) return res.status(400).json({ message: 'userId was null' });
	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!isValidObjectId(boardId))
		return res
			.status(400)
			.json({ message: 'boardId was not a valid ObjectId' });

	const { board, err } = await boardDataController.deleteBoard(boardId).then(
		(board) => ({ board, err: undefined }),
		(err) => ({ err, board: undefined })
	);

	if (err) return next(err);

	return res.json({
		board,
	});
};

const createBoard = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;
	const { name } = req.body;

	if (!userId) return res.status(400).json({ message: 'userId was null' });
	if (!name) return res.status(400).json({ message: 'Board name was null' });

	const { board, err } = await boardDataController
		.createNewBoard(userId, name)
		.then(
			(board) => ({ board, err: undefined }),
			(err) => ({ err, board: undefined })
		);

	if (err) return next(err);

	return res.status(201).json({
		board,
	});
};

const boardController = {
	getBoard,
	updateBoard,
	deleteBoard,
	getBoards,
	createBoard,
};

export default boardController;
