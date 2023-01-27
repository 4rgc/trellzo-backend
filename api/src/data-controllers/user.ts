import { UpdateQuery } from 'mongoose';
import IUser from '../interfaces/user.js';
import User from '../models/user.js';

const getAllUsers = () => User.find().lean().exec();

const getUser = (userId: string) =>
	User.findById(userId, { _id: 0, boards: 0, pass: 0 }).lean().exec();

const getUserByEmail = (email: string) =>
	User.findOne({ email }, { boards: 0 }).lean().exec();

const createUser = (name: string, email: string, password: string) =>
	User.create({
		name,
		email,
		pass: password,
	}).then(() => User.findOne({ email }, { pass: 0, boards: 0 }).exec());

const updateUser = (
	userId: string,
	name?: string,
	email?: string,
	pass?: string
) =>
	User.findByIdAndUpdate(
		userId,
		{
			email,
			name,
			pass,
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
	createUser,
	updateUser,
};

export default userDataController;
