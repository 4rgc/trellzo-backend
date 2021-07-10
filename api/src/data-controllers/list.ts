import Board from '../models/board';
import User from '../models/user';

const createList = (boardId: string, listName: string) =>
	Board.findByIdAndUpdate(
		boardId,
		{ $push: { lists: { name: listName } } },
		{ new: true, fields: { lists: { $elemMatch: { name: listName } } } }
	)
		.lean()
		.exec()
		.then((b) => b?.lists[0]);

const updateList = (
	boardId: string,
	listId: string,
	name: string,
	description: string
) =>
	Board.findOneAndUpdate(
		{ _id: boardId, 'lists._id': listId },
		{
			'lists.$.name': name,
			'lists.$.description': description,
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
			},
		},
		{
			fields: { lists: { $elemMatch: { _id: listId } } },
		}
	)
		.lean()
		.exec()
		.then((b) => b?.lists[0]);

const listDataController = {
	createList,
	updateList,
	deleteList,
};

export default listDataController;
