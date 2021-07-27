import ITag from '../interfaces/tag';
import Board from '../models/board';
import Note from '../models/note';

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
		.then((n) =>
			Board.findByIdAndUpdate(
				n?.boardId,
				{
					'lists.$[listField].notes.$[noteField]': {
						_id: n?._id,
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
					'lists.$.notesOrder': n?._id,
				},
			},
			{
				new: true,
				omitUndefined: true,
			}
		).then(() => n)
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
