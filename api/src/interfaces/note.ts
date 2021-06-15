import { Document, Types } from 'mongoose';
import IChecklist from './checklist';
import IComment from './comment';
import IOrder from './order';

export default interface INote extends Document {
	name: string;
	description: string;
	startDate: Date;
	dueDate: Date;
	checklists: IChecklist[];
	comments: IComment[];
	tags: Types.ObjectId[];
	checklistOrder: IOrder[];
}
