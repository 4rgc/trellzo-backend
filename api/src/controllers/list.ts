import listDataController from '../data-controllers/list';
import { Request, Response, NextFunction } from 'express';

const addList = async (req: Request, res: Response, next: NextFunction) => {
	const { boardId } = req.params;
	const { name } = req.body;

	const { list, err } = await listDataController
		.createList(boardId, name)
		.then(
			(list) => ({ list, err: undefined }),
			(err) => ({ err, list: undefined })
		);

	if (err) return next(err);

	if (!list) return res.status(404).json({ message: 'Board not found' });

	return res.status(201).json({
		list,
	});
};

const updateList = async (req: Request, res: Response, next: NextFunction) => {
	const { boardId, listId } = req.params;
	const { name, description, notesOrder } = req.body;

	const { list, err } = await listDataController
		.updateList(boardId, listId, name, description, notesOrder)
		.then(
			(list) => ({ list, err: undefined }),
			(err) => ({ err, list: undefined })
		);

	if (err) return next(err);
	if (!list) return res.status(404).json({ message: 'Board/list not found' });

	return res.json({
		list,
	});
};

const removeList = async (req: Request, res: Response, next: NextFunction) => {
	const { boardId, listId } = req.params;

	const { list, err } = await listDataController
		.deleteList(boardId, listId)
		.then(
			(list) => ({ list, err: undefined }),
			(err) => ({ err, list: undefined })
		);

	if (err) return next(err);
	if (!list) return res.status(404).json({ message: 'Board/list not found' });

	return res.json({
		list,
	});
};

const listController = {
	addList,
	updateList,
	removeList,
};

export default listController;
