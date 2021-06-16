import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import BoardSchema from '../schemas/board';

const getBoardData = (req: Request, res: Response, next: NextFunction) => {
	User.findOne(
		{
			_id: req.params.userId,
			boards: { $elemMatch: { _id: req.query.boardId } },
		},
		{ _id: 0, name: 0, email: 0 }
	)
		.lean()
		.exec()
		.then((user) => {
			if (!user)
				return res.status(404).json({
					message: 'User with id=' + req.params.userId + ' not found',
				});
			if (!user.boards)
				return res.status(404).json({
					message:
						'Board with id=' + req.params.boardId + ' not found',
				});
			res.json({ board: user.boards[0] });
		})
		.catch((err) => {
			res.status(500).json({
				message: err.message,
				err,
			});
		});
};

const createNewBoard = (req: Request, res: Response, next: NextFunction) => {
	User.findByIdAndUpdate(req.params.userId, {
		$push: { boards: { name: req.body.name } },
	})
		.then(() =>
			User.findById(req.params.userId, {
				boards: { $elemMatch: { name: req.body.name } },
				email: 0,
				name: 0,
			})
		)
		.then((user) => {
			if (!user)
				return res.status(404).json({
					message: 'User with id=' + req.params.userId + ' not found',
				});
			return res.status(201).json({
				board: user.boards[0],
			});
		})
		.catch((err) => {
			let status = 500;
			if (err.name === 'ValidationError') status = 400;
			res.status(status).json({
				message: err.message,
				err,
			});
		});
};

const updateBoard = (req: Request, res: Response, next: NextFunction) => {
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
	)
		.then(() =>
			User.findById(req.params.userId, {
				boards: { $elemMatch: { _id: req.params.boardId } },
				email: 0,
				name: 0,
			})
		)
		.then((user) => {
			console.log(user);
			if (!user)
				return res.status(404).json({
					message: 'User with id=' + req.params.userId + ' not found',
				});
			if (!user.boards)
				return res.status(404).json({
					message:
						'Board with id=' + req.params.boardId + ' not found',
				});
			return res.json({
				board: user.boards[0],
			});
		})
		.catch((err) => {
			let status = 500;
			if (err.name === 'ValidationError') status = 400;
			res.status(status).json({
				message: err.message,
				err,
			});
		});
};

export default {
	getBoardData,
	createNewBoard,
	updateBoard,
};
