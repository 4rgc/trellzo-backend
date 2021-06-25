import listDataController from '../data-controllers/list';
import { Request, Response, NextFunction } from 'express';

const addList = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;
	const { boardId } = req.params;
	const { name } = req.body;

	if (!userId) return res.status(400).json({ message: 'userId was null' });
	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!name) return res.status(400).json({ message: 'List name was null' });

	const newList = await listDataController
		.createList(userId, boardId, name)
		.catch(next);

	if (!newList) res.status(404).json({ message: 'Board not found' });

	res.status(201).json({
		list: newList,
	});
};

const updateList = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;
	const { boardId, listId } = req.params;
	const { name, description } = req.body;

	if (!userId) return res.status(400).json({ message: 'userId was null' });
	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!listId) return res.status(400).json({ message: 'listId was null' });

	if (!name && !description) return res.send();

	const updatedList = await listDataController
		.updateList(userId, boardId, listId, name, description)
		.catch(next);

	if (!updatedList) res.status(404).json({ message: 'Board/list not found' });

	res.json({
		list: updatedList,
	});
};

const removeList = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;
	const { boardId, listId } = req.params;

	if (!userId) return res.status(400).json({ message: 'userId was null' });
	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!listId) return res.status(400).json({ message: 'listId was null' });

	const deletedList = await listDataController
		.deleteList(userId, boardId, listId)
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
