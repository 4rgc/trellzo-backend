import { ObjectId } from 'mongoose';
import User from '../models/user';

const getNote = (
	userId: string,
	boardId: string,
	listId: string,
	noteId: string
) =>
	User.findById(userId, {
		boards: {
			_id: boardId,
			lists: {
				_id: listId,
				notes: {
					_id: noteId,
					name: 1,
					description: 1,
					startDate: 1,
					dueDate: 1,
					checklists: 1,
					comments: 1,
					tags: 1,
					checklistOrder: 1,
				},
			},
		},
	})
		.lean()
		.exec()
		.then((user) => user?.boards[0].lists[0].notes[0]);

const updateNote = (
	userId: string,
	boardId: string,
	listId: string,
	noteId: string,
	name: string,
	description: string,
	startDate: Date,
	dueDate: Date,
	tagIds: string[]
) =>
	User.findByIdAndUpdate(
		userId,
		{
			'boards.$[boardField].lists.$[listField].notes.$[noteField].name':
				name,
			'boards.$[boardField].lists.$[listField].notes.$[noteField].description':
				description,
			'boards.$[boardField].lists.$[listField].notes.$[noteField].startDate':
				startDate,
			'boards.$[boardField].lists.$[listField].notes.$[noteField].dueDate':
				dueDate,
			'boards.$[boardField].lists.$[listField].notes.$[noteField].tagIds':
				tagIds,
		},
		{
			arrayFilters: [
				{ 'boardField._id': boardId },
				{ 'listField._id': listId },
				{ 'noteField._id': noteId },
			],
			new: true,
			omitUndefined: true,
		}
	)
		.lean()
		.exec()
		.then((user) =>
			user?.boards
				.find((b) => b._id == boardId)
				?.lists.find((l) => l._id == listId)
				?.notes.find((n) => n._id == noteId)
		);

const addNote = (
	userId: string,
	boardId: string,
	listId: string,
	name: string,
	description: string,
	startDate: Date,
	dueDate: Date,
	tagIds: ObjectId[]
) =>
	User.findByIdAndUpdate(
		userId,
		{
			$push: {
				'boards.$[boardField].lists.$[listField].notes': {
					name,
					description,
					startDate,
					dueDate,
					tagIds,
				},
			},
		},
		{
			arrayFilters: [
				{ 'boardField._id': boardId },
				{ 'listField._id': listId },
			],
			new: true,
			omitUndefined: true,
		}
	)
		.lean()
		.exec()
		.then(
			(user) =>
				user?.boards
					.find((b) => b._id == boardId)
					?.lists.find((l) => l._id == listId)
					?.notes.slice(-1)[0]
		);

const deleteNote = (
	userId: string,
	boardId: string,
	listId: string,
	noteId: string
) =>
	User.findByIdAndUpdate(
		userId,
		{
			$pull: {
				'boards.$[boardField].lists.$[listField].notes': {
					_id: noteId,
				},
			},
		},
		{
			arrayFilters: [
				{ 'boardField._id': boardId },
				{ 'listField._id': listId },
			],
		}
	)
		.lean()
		.exec()
		.then((user) =>
			user?.boards
				.find((b) => b._id == boardId)
				?.lists.find((l) => l._id == listId)
				?.notes.find((n) => n._id == noteId)
		);

const noteDataController = {
	getNote,
	updateNote,
	addNote,
	deleteNote,
};

export default noteDataController;
