import { Request, Response, NextFunction } from 'express';
import noteDataController from '../data-controllers/note.js';

const getNote = async (req: Request, res: Response, next: NextFunction) => {
	const { noteId } = req.params;

	const { note, err } = await noteDataController.getNote(noteId).then(
		(note) => ({ note, err: undefined }),
		(err) => ({ err, note: undefined })
	);
	if (err) return next(err);
	if (!note) return res.status(404).json({ message: 'Note not found' });

	res.json({
		note,
	});
};

const updateNote = async (req: Request, res: Response, next: NextFunction) => {
	const { noteId } = req.params;
	const { name, description, startDate, dueDate, tags, checklistsOrder } =
		req.body;

	const { updatedNote, err } = await noteDataController
		.updateNote(
			noteId,
			name,
			description,
			startDate,
			dueDate,
			tags,
			checklistsOrder
		)
		.then(
			(updatedNote) => ({ updatedNote, err: undefined }),
			(err) => ({ err, updatedNote: undefined })
		);
	if (err) return next(err);
	if (!updatedNote)
		return res.status(404).json({ message: 'Note not found' });

	res.json({
		note: updatedNote,
	});
};

const addNote = async (req: Request, res: Response, next: NextFunction) => {
	const { boardId, listId } = req.params;
	const { name, description, startDate, dueDate, tags } = req.body;

	const { newNote, err } = await noteDataController
		.addNote(boardId, listId, name, description, startDate, dueDate, tags)
		.then(
			(newNote) => ({ newNote, err: undefined }),
			(err) => ({ err, newNote: undefined })
		);

	if (err) return next(err);
	if (!newNote)
		return res.status(404).json({ message: 'Board/list not found' });

	res.status(201).json({
		note: newNote,
	});
};

const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
	const { noteId } = req.params;

	const { deletedNote, err } = await noteDataController
		.deleteNote(noteId)
		.then(
			(deletedNote) => ({ deletedNote, err: undefined }),
			(err) => ({ err, deletedNote: undefined })
		);

	if (err) return next(err);
	if (!deletedNote)
		return res.status(404).json({ message: 'Note not found' });

	res.json({
		note: deletedNote,
	});
};

const noteController = {
	getNote,
	updateNote,
	addNote,
	deleteNote,
};

export default noteController;
