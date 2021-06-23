import User from '../models/user';

const getUserBoards = (userId: string) =>
	User.findOne(
		{ _id: userId },
		{
			_id: 0,
			name: 0,
			email: 0,
			pass: 0,
			boards: { lists: 0, listsOrder: 0 },
		}
	)
		.lean()
		.exec()
		.then((res) => res?.boards);

const getBoardData = (userId: string, boardId: string) =>
	User.findOne(
		{
			_id: userId,
		},
		{
			name: 0,
			email: 0,
			boards: { $elemMatch: { _id: boardId } },
		}
	)
		.lean()
		.exec()
		.then((user) => user?.boards[0]);

const createNewBoard = (userId: string, name: string) =>
	User.findByIdAndUpdate(userId, {
		$push: { boards: { name: name } },
	})
		.then(() =>
			User.findById(userId, {
				boards: { $elemMatch: { name: name } },
			})
		)
		.then((res) => res?.boards[0]);

const updateBoard = (
	userId: string,
	boardId: string,
	name: string | undefined,
	description: string | undefined
) =>
	User.findByIdAndUpdate(
		userId,
		{
			'boards.$[boardField].name': name,
			'boards.$[boardField].description': description,
		},
		{
			arrayFilters: [{ 'boardField._id': boardId }],
			omitUndefined: true,
		}
	)
		.then(() =>
			User.findById(userId, {
				boards: { $elemMatch: { _id: boardId } },
			}).lean()
		)
		.then((res) => res?.boards[0]);

const deleteBoard = async (userId: string, boardId: string) => {
	User.findByIdAndUpdate(
		userId,
		{ $pull: { boards: { $elemMatch: { _id: boardId } } } },
		{ omitUndefined: true }
	)
		.then(() =>
			User.findById(userId, {
				boards: { $elemMatch: { _id: boardId } },
			}).lean()
		)
		.then((res) => res?.boards[0]);
};

const boardDataController = {
	getBoardData,
	createNewBoard,
	updateBoard,
	deleteBoard,
	getUserBoards,
};

export default boardDataController;
