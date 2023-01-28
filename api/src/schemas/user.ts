import { Schema } from 'mongoose';
import IUser from '../interfaces/user.js';
import PartialBoardSchema from './partialBoard.js';

const UserSchema = new Schema<IUser>({
	name: { type: String, required: true },
	email: { type: String, required: true },
	pass: { type: String, required: true },
	boards: { type: [PartialBoardSchema], default: [] },
});

export default UserSchema;
