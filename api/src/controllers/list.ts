import listDataController from '../data-controllers/list';
import { Request, Response, NextFunction } from 'express';

const addList = async (req: Request, res: Response, next: NextFunction) => {
	const { boardId } = req.params;
	const { name } = req.body;

	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!name)
		return res.status(400).json({ message: 'List name was null or empty' });

	const { list, err } = await listDataController
		.createList(boardId, name)
		.then(
			(list) => ({ list, err: undefined }),
			(err) => ({ err, list: undefined })
		);

	if (err) return next(err);

	if (!list) return res.status(404).json({ message: 'Board not found' });

	res.status(201).json({
		list: list,
	});
};

const updateList = async (req: Request, res: Response, next: NextFunction) => {
	const { boardId, listId } = req.params;
	const { name, description, notesOrder } = req.body;

	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!listId) return res.status(400).json({ message: 'listId was null' });

	const { list, err } = await listDataController
		.updateList(boardId, listId, name, description, notesOrder)
		.then(
			(list) => ({ list, err: undefined }),
			(err) => ({ err, list: undefined })
		);

	if (err) return next(err);
	if (!list) return res.status(404).json({ message: 'Board/list not found' });

	return res.json({
		list: list,
	});
};

const removeList = async (req: Request, res: Response, next: NextFunction) => {
	const { boardId, listId } = req.params;

	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!listId) return res.status(400).json({ message: 'listId was null' });

	const { list, err } = await listDataController
		.deleteList(boardId, listId)
		.then(
			(list) => ({ list, err: undefined }),
			(err) => ({ err, list: undefined })
		);

	if (err) return next(err);
	if (!list) return res.status(404).json({ message: 'Board/list not found' });

	return res.json({
		list: list,
	});
};

const listController = {
	addList,
	updateList,
	removeList,
};

export default listController;
