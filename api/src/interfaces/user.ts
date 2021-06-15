import { Document } from 'mongoose';
import IBoard from './board';

export default interface IUser {
	name: string;
	email: string;
	boards: IBoard[];
}
