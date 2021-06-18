import { Request, Response, NextFunction } from 'express';
import { UpdateQuery } from 'mongoose';
import IUser from '../interfaces/user';
import User from '../models/user';

const getAllUsers = () => User.find().lean().exec();

const getUserByEmail = (email: string) =>
	User.findOne({ email: email as string }, { boards: 0 })
		.lean()
		.exec();

const getUserBoards = (userId: string) =>
	User.findOne(
		{ _id: userId },
		{ _id: 0, name: 0, email: 0, boards: { lists: 0, listsOrder: 0 } }
	)
		.lean()
		.exec();

const createNewUser = (name: string, email: string) =>
	User.create({
		name: name,
		email: email,
	}).then(() => User.findOne({ email: email }).exec());

const updateUser = (
	userId: string,
	name: string | undefined,
	email: string | undefined
) =>
	User.findByIdAndUpdate(
		userId,
		{
			email,
			name,
		} as UpdateQuery<IUser>,
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
