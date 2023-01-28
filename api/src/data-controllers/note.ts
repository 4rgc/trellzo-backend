import ITag from '../interfaces/tag.js';
import Board from '../models/board.js';
import Note from '../models/note.js';

const getNote = (noteId: string) => Note.findById(noteId).lean().exec();

const updateNote = (
	noteId: string,
	name: string,
	description: string,
	startDate: Date,
	dueDate: Date,
	tags: ITag[],
	checklistsOrder: string[]
) =>
	Note.findByIdAndUpdate(
		noteId,
		{
			name,
			description,
			startDate,
			dueDate,
			tags,
			checklistsOrder,
		},
		{ new: true, omitUndefined: true }
	)
		.lean()
		.exec()
		.then(
			(n) =>
				//If the note wasn't found, we will get a validation error here, and a rejection as a result
				//To fix this, we remove the partial note object only if the note was found
				n &&
				Board.findByIdAndUpdate(
					n?.boardId,
					{
						'lists.$[listField].notes.$[noteField]': {
							_id: n?._id,
							name,
							description,
							startDate,
							dueDate,
							tags,
						},
					},
					{
						omitUndefined: true,
						arrayFilters: [
							{ 'listField._id': n?.listId },
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
		boardId,
		listId,
	}).then(
		(n) =>
			n &&
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
						'lists.$.notesOrder': n?._id,
					},
				},
				{
					new: true,
					omitUndefined: true,
				}
			)
				// In case boardId/listId was invalid and no records were updated, or any
				// other error occurred, roll back note creation by deleting the document
				// SHOULD be done using transactions
				.then(
					(res) =>
						!res.modifiedCount
							? Note.deleteOne({ _id: n?._id }).then(
									() => undefined
							  )
							: n,
					(err) =>
						Note.deleteOne({ _id: n?._id }).then(() => {
							throw err;
						})
				)
	);

const deleteNote = (noteId: string) =>
	Note.findByIdAndDelete(noteId)
		.lean()
		.exec()
		.then((n) =>
			Board.updateOne(
				{ _id: n?.boardId, 'lists._id': n?.listId },
				{
					$pull: {
						'lists.$.notes': {
							_id: noteId,
						},
						'lists.$.notesOrder': noteId,
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
