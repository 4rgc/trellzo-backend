import { Request, Response, NextFunction } from 'express';
import boardDataController from '../data-controllers/board';

const getBoards = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;

	if (!userId) return res.status(400).json({ message: 'userId was null' });

	const boards = await boardDataController.getUserBoards(userId).catch(next);

	res.json({
		boards,
	});
};

const getBoard = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;
	const { boardId } = req.params;

	if (!userId) return res.status(400).json({ message: 'userId was null' });

	if (!boardId) return res.status(400).json({ message: 'boardId was null' });

	const board = await boardDataController
		.getBoardData(userId, boardId)
		.catch(next);

	if (!board) return res.status(404).json({ message: 'Board not found' });

	res.json({
		board,
	});
};

const updateBoard = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;
	const { boardId } = req.params;
	const { name, description } = req.body;

	if (!userId) return res.status(400).json({ message: 'userId was null' });
	if (!boardId) return res.status(400).json({ message: 'boardId was null' });

	const updatedBoard = await boardDataController
		.updateBoard(userId, boardId, name, description)
		.catch(next);

	if (!updatedBoard)
		return res.status(404).json({ message: 'Board not found' });

	res.json({ board: updatedBoard });
};

const deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;
	const { boardId } = req.params;

	if (!userId) return res.status(400).json({ message: 'userId was null' });
	if (!boardId) return res.status(400).json({ message: 'boardId was null' });

	const deletedBoard = await boardDataController.deleteBoard(userId, boardId);

	res.json({
		message: 'Deleted board',
		deletedBoard,
	});
};

const boardController = {
	getBoard,
	updateBoard,
	deleteBoard,
	getBoards,
};

export default boardController;
