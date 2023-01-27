import { model } from 'mongoose';
import IUser from '../interfaces/user.js';
import UserSchema from '../schemas/user.js';

export default model<IUser>('User', UserSchema);
