import { Request, Response, NextFunction } from 'express';
import { UpdateQuery } from 'mongoose';
import IUser from '../interfaces/user';
import User from '../models/user';

const getAllUsers = () => User.find().lean().exec();

const getUser = (userId: string) =>
	User.findById(userId, { _id: 0, boards: 0, pass: 0 }).lean().exec();

const getUserByEmail = (email: string) =>
	User.findOne({ email }, { boards: 0 }).lean().exec();

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
		.exec();

const createUser = (name: string, email: string, password: string) =>
	User.create({
		name,
		email,
		pass: password,
	}).then(() => User.findOne({ email }, { pass: 0, boards: 0 }).exec());

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
		{
			new: true,
			omitUndefined: true,
			fields: { boards: 0, pass: 0, _id: 0 },
		}
	);

const userDataController = {
	getAllUsers,
	getUser,
	getUserByEmail,
	getUserBoards,
	createUser,
	updateUser,
};

export default userDataController;
