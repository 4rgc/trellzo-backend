import Board from '../models/board';
import User from '../models/user';

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
};

export default listDataController;
