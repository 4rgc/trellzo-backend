import { Schema } from 'mongoose';
import IUser from '../interfaces/user';
import BoardSchema from './board';

const UserSchema = new Schema<IUser>({
	name: { type: String, required: true },
	email: { type: String, required: true },
	boards: { type: [BoardSchema], default: [] },
});

export default UserSchema;
