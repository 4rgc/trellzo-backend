import { Request, Response, NextFunction } from 'express';
import checklistDataController from '../data-controllers/checklist';

const updateChecklist = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { noteId, checklistId } = req.params;
	const { name, checkItems, checkItemsOrder } = req.body;

	if (!noteId) return res.status(400).json({ message: 'noteId was null' });
	if (!checklistId)
		return res.status(400).json({ message: 'checklistId was null' });

	const { checklist, err } = await checklistDataController
		.updateChecklist(noteId, checklistId, name, checkItems, checkItemsOrder)
		.then(
			(checklist) => ({ checklist, err: undefined }),
			(err) => ({ err, checklist: undefined })
		);

	if (err) return next(err);
	if (!checklist)
		return res.status(404).json({ message: 'Checklist not found' });

	res.json({
		checklist,
	});
};

const addChecklist = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { noteId } = req.params;
	const { name, checkItems, checkItemsOrder } = req.body;

	if (!noteId) return res.status(400).json({ message: 'noteId was null' });

	const { checklist, err } = await checklistDataController
		.createChecklist(noteId, name, checkItems, checkItemsOrder)
		.then(
			(checklist) => ({ checklist, err: undefined }),
			(err) => ({ err, checklist: undefined })
		);

	if (err) return next(err);
	if (!checklist) return res.status(404).json({ message: 'Note not found' });

	res.status(201).json({
		checklist,
	});
};

const removeChecklist = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { noteId, checklistId } = req.params;

	if (!noteId) return res.status(400).json({ message: 'noteId was null' });
	if (!checklistId)
		return res.status(400).json({ message: 'checklistId was null' });

	const { deletedChecklist, err } = await checklistDataController
		.deleteChecklist(noteId, checklistId)
		.then(
			(deletedChecklist) => ({ deletedChecklist, err: undefined }),
			(err) => ({ err, deletedChecklist: undefined })
		);

	if (err) return next(err);
	if (!deletedChecklist)
		return res.status(404).json({ message: 'Checklist not found' });

	res.json({
		checklist: deletedChecklist,
	});
};

const checklistController = {
	updateChecklist,
	addChecklist,
	removeChecklist,
};

export default checklistController;
