import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
	User.find()
		.exec()
		.then((result) =>
			res.json({
				users: result,
				count: result.length,
			})
		)
		.catch((err) =>
			res.status(500).json({
				message: err.message,
				err,
			})
		);
};

const getUserByEmail = (req: Request, res: Response, next: NextFunction) => {
	if (typeof req.query.email !== 'string') {
		return res.status(400).json({
			message:
				'email query parameter was of type ' +
				typeof req.query.email +
				'; expected: string',
		});
	}
	User.findOne({ email: req.query.email }, { boards: 0 })
		.exec()
		.then((user) => {
			if (!user)
				return res.status(404).json({
					message: 'User with id=' + req.params.userId + ' not found',
				});
			res.json({
				user,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: err.message,
				err,
			});
		});
};

const getUserBoards = (req: Request, res: Response, next: NextFunction) => {
	User.findOne(
		{ _id: req.query.userId },
		{ _id: 0, name: 0, email: 0, boards: { lists: 0, listsOrder: 0 } }
	)
		.lean()
		.exec()
		.then((user) => {
			res.json({ ...user });
		})
		.catch((err) => {
			res.status(500).json({
				message: err.message,
				err,
			});
		});
};

const createNewUser = (req: Request, res: Response, next: NextFunction) => {
	User.create({
		name: req.body.name,
		email: req.body.email,
	})
		.then(() => User.findOne({ email: req.body.email }).exec())
		.then((user) => {
			res.status(201).json({
				user,
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

const updateUser = (req: Request, res: Response, next: NextFunction) => {
	console.log(req.body.email);
	User.findByIdAndUpdate(
		req.params.userId,
		{
			email: req.body.email,
			name: req.body.name,
		},
		{ new: true, omitUndefined: true }
	)
		.then((user) => {
			if (!user)
				return res.status(404).json({
					message: 'User with id=' + req.params.userId + ' not found',
				});
			res.json({ user });
		})
		.catch((err) => {
			res.status(500).json({
				message: err.message,
				err,
			});
		});
};

export default {
	getAllUsers,
	getUserByEmail,
	getUserBoards,
	createNewUser,
	updateUser,
};
