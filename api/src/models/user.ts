import { model } from 'mongoose';
import IUser from '../interfaces/user';
import UserSchema from '../schemas/user';

export default model<IUser>('User', UserSchema);
