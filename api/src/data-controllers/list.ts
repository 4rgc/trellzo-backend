import Board from '../models/board';
import Note from '../models/note';

const createList = (boardId: string, listName: string) =>
	Board.findByIdAndUpdate(
		boardId,
		{ $push: { lists: { name: listName, boardId } } },
		{ new: true, fields: { lists: { $elemMatch: { name: listName } } } }
	)
		.lean()
		.then((b) => b?.lists[0])
		.then((l) =>
			Board.updateOne(
				{ _id: boardId },
				{ $push: { listsOrder: l?._id } }
			).then(() => l)
		);

const updateList = (
	boardId: string,
	listId: string,
	name: string,
	description: string,
	notesOrder: string[]
) =>
	Board.findOneAndUpdate(
		{ _id: boardId, 'lists._id': listId },
		{
			'lists.$.name': name,
			'lists.$.description': description,
			'lists.$.notesOrder': notesOrder,
		},
		{
			omitUndefined: true,
			new: true,
			fields: { lists: { $elemMatch: { _id: listId } } },
		}
	)
		.lean()
		.exec()
		.then((b) => b?.lists[0]);

const moveNoteToList = (
	boardId: string,
	listId: string,
	otherListId: string,
	otherListIndex: number,
	noteId: string
) =>
	Board.findOneAndUpdate(
		{ _id: boardId, 'lists._id': listId },
		{
			$pull: {
				'lists.$.notes': {
					_id: noteId,
				},
				'lists.$.notesOrder': noteId,
			},
		},
		{
			new: false,
		}
	)
		.lean()
		.exec()
		// SHOULD be done using transactions
		.then((b) =>
			b?.lists
				.find((l) => l._id == listId)
				?.notes.find((n) => n._id == noteId)
		)
		// SHOULD be done using transactions
		.then((n) =>
			Board.findOneAndUpdate(
				{ _id: boardId, 'lists._id': otherListId },
				{
					$push: {
						'lists.$.notes': {
							$each: [n],
							$position: otherListIndex,
						},
						'lists.$.notesOrder': {
							$each: [noteId],
							$position: otherListIndex,
						},
					},
				}
			)
				.lean()
				.exec()
		)
		// SHOULD be done using transactions
		.then((n) =>
			Note.findByIdAndUpdate(noteId, {
				$set: { listId: otherListId },
			})
				.lean()
				.exec()
		)
		// TODO: only select lists.$[].notes, lists.$[].notesOrder and lists.$[]._id
		.then(() =>
			Board.findOne({
				_id: boardId,
				'lists._id': { $in: [listId, otherListId] },
			})
				.lean()
				.exec()
		)
		.then((b) => ({
			sourceList: b?.lists.find((l) => l._id == listId),
			destinationList: b?.lists.find((l) => l._id == otherListId),
		}));

const deleteList = (boardId: string, listId: string) =>
	Board.findByIdAndUpdate(
		boardId,
		{
			$pull: {
				lists: { _id: listId },
				listsOrder: listId,
			},
		},
		{
			fields: { lists: { $elemMatch: { _id: listId } } },
		}
	)
		.lean()
		.exec()
		.then((b) => (b?.lists ? b?.lists[0] : null));

const listDataController = {
	createList,
	updateList,
	deleteList,
	moveNoteToList,
};

export default listDataController;
