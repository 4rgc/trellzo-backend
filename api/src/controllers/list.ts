import listDataController from '../data-controllers/list';
import { Request, Response, NextFunction } from 'express';

const addList = async (req: Request, res: Response, next: NextFunction) => {
	const { boardId } = req.params;
	const { name } = req.body;

	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!name)
		return res.status(400).json({ message: 'List name was null or empty' });

	const newList = await listDataController
		.createList(boardId, name)
		.catch(next);

	if (!newList) res.status(404).json({ message: 'Board not found' });

	res.status(201).json({
		list: newList,
	});
};

const updateList = async (req: Request, res: Response, next: NextFunction) => {
	const { boardId, listId } = req.params;
	const { name, description, notesOrder } = req.body;

	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!listId) return res.status(400).json({ message: 'listId was null' });

	const updatedList = await listDataController
		.updateList(boardId, listId, name, description, notesOrder)
		.catch(next);

	if (!updatedList) res.status(404).json({ message: 'Board/list not found' });

	res.json({
		list: updatedList,
	});
};

const removeList = async (req: Request, res: Response, next: NextFunction) => {
	const { boardId, listId } = req.params;

	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!listId) return res.status(400).json({ message: 'listId was null' });

	const deletedList = await listDataController
		.deleteList(boardId, listId)
		.catch(next);

	if (!deletedList) res.status(404).json({ message: 'Board/list not found' });

	res.json({
		list: deletedList,
	});
};

const listController = {
	addList,
	updateList,
	removeList,
};

export default listController;
