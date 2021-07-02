import { Request, Response, NextFunction } from 'express';
import noteDataController from '../data-controllers/note';

const getNote = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = res.locals.auth;
	const { boardId, listId } = req.params;
	const { noteId } = req.query;

	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!listId) return res.status(400).json({ message: 'listId was null' });
	if (!noteId || !(typeof noteId === 'string'))
		return res.status(400).json({ message: 'noteId was null' });

	const { note, err } = await noteDataController
		.getNote(userId, boardId, listId, noteId)
		.then(
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
	const { userId } = res.locals.auth;
	const { boardId, listId, noteId } = req.params;
	const { name, description, startDate, dueDate, tagIds } = req.body;

	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!listId) return res.status(400).json({ message: 'listId was null' });
	if (!noteId) return res.status(400).json({ message: 'noteId was null' });
	if (!name || name === '')
		return res.status(400).json({ message: 'Name was null or empty' });

	const { updatedNote, err } = await noteDataController
		.updateNote(
			userId,
			boardId,
			listId,
			noteId,
			name,
			description,
			startDate,
			dueDate,
			tagIds
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
	const { userId } = res.locals.auth;
	const { boardId, listId } = req.params;
	const { name, description, startDate, dueDate, tagIds } = req.body;

	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!listId) return res.status(400).json({ message: 'listId was null' });
	if (!name || name === '')
		return res.status(400).json({ message: 'Name was null or empty' });

	const { newNote, err } = await noteDataController
		.addNote(
			userId,
			boardId,
			listId,
			name,
			description,
			startDate,
			dueDate,
			tagIds
		)
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
	const { userId } = res.locals.auth;
	const { boardId, listId, noteId } = req.params;

	if (!boardId) return res.status(400).json({ message: 'boardId was null' });
	if (!listId) return res.status(400).json({ message: 'listId was null' });
	if (!noteId) return res.status(400).json({ message: 'noteId was null' });

	const { deletedNote, err } = await noteDataController
		.deleteNote(userId, boardId, listId, noteId)
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
