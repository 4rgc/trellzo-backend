import { Document } from 'mongoose';

export default interface IPartialBoard extends Document {
	name: string;
	description: string;
}
