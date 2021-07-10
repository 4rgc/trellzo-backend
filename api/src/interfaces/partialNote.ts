import { Document, Types } from 'mongoose';
import ITag from './tag';

export default interface IPartialNote extends Document {
	name: string;
	description: string;
	startDate: Date;
	dueDate: Date;
	tags: ITag[];
}
