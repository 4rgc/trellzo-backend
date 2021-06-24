import User from '../models/user';

const createList = async (userId: string, boardId: string, listName: string) =>
	User.findByIdAndUpdate(
		userId,
		{
			$push: { 'boards.$[boardField].lists': { name: listName } },
		},
		{
			arrayFilters: [{ 'boardField._id': boardId }],
			new: true,
		}
	)
		.lean()
		.exec()
		.then(
			(user) =>
				user?.boards.find((b) => b._id == boardId)?.lists.slice(-1)[0]
		);

const updateList = (
	userId: string,
	boardId: string,
	listId: string,
	name: string,
	description: string
) =>
	User.findByIdAndUpdate(
		userId,
		{
			'boards.$[boardField].lists.$[listField].name': name,
			'boards.$[boardField].lists.$[listField].description': description,
		},
		{
			arrayFilters: [
				{ 'boardField._id': boardId, 'listField._id': listId },
			],
			omitUndefined: true,
			new: true,
		}
	)
		.lean()
		.exec()
		.then((user) =>
			user?.boards
				.find((b) => b._id == boardId)
				?.lists.find((l) => l._id == listId)
		);

const deleteList = (userId: string, boardId: string, listId: string) =>
	User.findByIdAndUpdate(
		userId,
		{
			$pull: {
				'boards.$[boardField].lists': { $elemMatch: { _id: listId } },
			},
		},
		{
			arrayFilters: [{ 'boardField._id': boardId }],
		}
	)
		.lean()
		.exec()
		.then((user) =>
			user?.boards
				.find((b) => b._id === boardId)
				?.lists.find((l) => l._id === listId)
		);

const listDataController = {
	createList,
	updateList,
	deleteList,
};

export default listDataController;
