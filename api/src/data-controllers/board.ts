import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

const getBoardData = (req: Request) =>
	User.findOne(
		{
			_id: req.params.userId,
			boards: { $elemMatch: { _id: req.query.boardId } },
		},
		{ _id: 0, name: 0, email: 0 }
	)
		.lean()
		.exec();

const createNewBoard = (req: Request) =>
	User.findByIdAndUpdate(req.params.userId, {
		$push: { boards: { name: req.body.name } },
	}).then(() =>
		User.findById(req.params.userId, {
			boards: { $elemMatch: { name: req.body.name } },
			email: 0,
			name: 0,
		})
	);

const updateBoard = (req: Request) =>
	User.findByIdAndUpdate(
		req.params.userId,
		{
			'boards.$[boardField].name': req.body.name,
			'boards.$[boardField].description': req.body.description,
		},
		{
			arrayFilters: [{ 'boardField._id': req.params.boardId }],
			omitUndefined: true,
		}
	).then(() =>
		User.findById(req.params.userId, {
			boards: { $elemMatch: { _id: req.params.boardId } },
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
