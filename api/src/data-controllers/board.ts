import { Request, Response, NextFunction } from 'express';
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
		.exec();

const createNewBoard = (userId: string, name: string) =>
	User.findByIdAndUpdate(userId, {
		$push: { boards: { name: name } },
	}).then(() =>
		User.findById(userId, {
			boards: { $elemMatch: { name: name } },
			email: 0,
			name: 0,
		})
	);

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
	).then(() =>
		User.findById(userId, {
			boards: { $elemMatch: { _id: boardId } },
			email: 0,
			name: 0,
		})
	);

const boardDataController = {
	getBoardData,
	createNewBoard,
	updateBoard,
};

export default boardDataController;
