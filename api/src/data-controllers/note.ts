import { ObjectId } from 'mongoose';
import ITag from '../interfaces/tag';
import Board from '../models/board';
import Note from '../models/note';

const getNote = (noteId: string) => Note.findById(noteId).lean().exec();

///TODO: Instead of accepting boardId and listId, this can be implemented by storing boardId and listId in the note object
/// although this would mean we have to update the note object whenever we move it from one list to another
const updateNote = (
	boardId: string,
	listId: string,
	noteId: string,
	name: string,
	description: string,
	startDate: Date,
	dueDate: Date,
	tags: ITag[]
) =>
	Note.findByIdAndUpdate(
		noteId,
		{
			name,
			description,
			startDate,
			dueDate,
			tags,
		},
		{ new: true, omitUndefined: true }
	)
		.lean()
		.exec()
		.then((n) =>
			Board.findByIdAndUpdate(
				boardId,
				{
					'lists.$[listField].notes.$[noteField]': {
						name: n?.name,
						description: n?.description,
						startDate: n?.startDate,
						dueDate: n?.dueDate,
						tags: n?.tags,
					},
				},
				{
					omitUndefined: true,
					arrayFilters: [
						{ 'listField._id': listId },
						{ 'noteField._id': noteId },
					],
				}
			).then(() => n)
		);

const addNote = (
	boardId: string,
	listId: string,
	name: string,
	description: string,
	startDate: Date,
	dueDate: Date,
	tags: ITag[]
) =>
	Note.create({
		name,
		description,
		startDate,
		dueDate,
		tags,
	}).then((n) =>
		Board.updateOne(
			{ _id: boardId, 'lists._id': listId },
			{
				$push: {
					'lists.$.notes': {
						_id: n?._id,
						name,
						description,
						startDate,
						dueDate,
						tags,
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
		).then(() => n)
	);

const deleteNote = (boardId: string, listId: string, noteId: string) =>
	Note.findByIdAndDelete(noteId)
		.lean()
		.exec()
		.then((n) =>
			Board.updateOne(
				{ _id: boardId, 'lists._id': listId },
				{
					$pull: {
						'lists.$.notes': {
							_id: noteId,
						},
					},
				}
			).then(() => n)
		);

const noteDataController = {
	getNote,
	updateNote,
	addNote,
	deleteNote,
};

export default noteDataController;
