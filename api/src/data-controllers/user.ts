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

const updateUser = (req: Request) =>
	User.findByIdAndUpdate(
		req.params.userId,
		{
			email: req.body.email,
			name: req.body.name,
		},
		{ new: true, omitUndefined: true }
	);

const userDataController = {
	getAllUsers,
	getUserByEmail,
	getUserBoards,
	createNewUser,
	updateUser,
};

export default userDataController;
