import User from '../models/user.js';
import Board from '../models/board.js';

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

const getBoardData = (boardId: string) =>
	Board.findOne({
		_id: boardId,
	})
		.lean()
		.exec();

const createNewBoard = (userId: string, name: string) =>
	Board.create({ name, userIds: [userId] }).then((b) =>
		User.findByIdAndUpdate(userId, {
			$push: {
				boards: {
					_id: b._id,
					name: b.name,
					description: b.description,
				},
			},
		}).then(() => b)
	);

const updateBoard = (
	userId: string,
	boardId: string,
	name: string | undefined,
	description: string | undefined,
	listsOrder: string[]
) =>
	Board.findByIdAndUpdate(
		boardId,
		{ name, description, listsOrder },
		{ omitUndefined: true, new: true }
	)
		.lean()
		.then((b) =>
			User.updateMany(
				{ boards: { $elemMatch: { _id: boardId } } },
				{
					'boards.$[boardField]': {
						_id: b?._id,
						name: b?.name,
						description: b?.description,
					},
				},
				{
					arrayFilters: [{ 'boardField._id': b?._id }],
					omitUndefined: true,
				}
			).then(() => b)
		);

const deleteBoard = async (boardId: string) =>
	Board.findByIdAndDelete(boardId)
		.lean()
		.then((b) =>
			User.updateMany(
				{ _id: { $in: b?.userIds } },
				{ $pull: { boards: { _id: boardId } } },
				{ omitUndefined: true }
			).then(() => b)
		);

const boardDataController = {
	getBoardData,
	createNewBoard,
	updateBoard,
	deleteBoard,
	getUserBoards,
};

export default boardDataController;
