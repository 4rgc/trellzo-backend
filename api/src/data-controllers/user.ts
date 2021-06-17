import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

const getAllUsers = () => User.find().lean().exec();

const getUserByEmail = (req: Request) =>
	User.findOne({ email: req.query.email as string }, { boards: 0 })
		.lean()
		.exec();

const getUserBoards = (req: Request) =>
	User.findOne(
		{ _id: req.query.userId },
		{ _id: 0, name: 0, email: 0, boards: { lists: 0, listsOrder: 0 } }
	)
		.lean()
		.exec();

const createNewUser = (req: Request) =>
	User.create({
		name: req.body.name,
		email: req.body.email,
	}).then(() => User.findOne({ email: req.body.email }).exec());
/* 
const updateUserHandler = (req: Request, res: Response, next: NextFunction) => {
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
}; */

const updateUser = (req: Request) =>
	User.findByIdAndUpdate(
		req.params.userId,
		{
			email: req.body.email,
			name: req.body.name,
		},
		{ new: true, omitUndefined: true }
	);

export default {
	getAllUsers,
	getUserByEmail,
	getUserBoards,
	createNewUser,
	updateUser,
};
