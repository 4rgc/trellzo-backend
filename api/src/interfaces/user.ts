import { Document } from 'mongoose';
import IBoard from './board';

export default interface IUser extends Document {
	name: string;
	email: string;
	pass: string;
	boards: IBoard[];
}
