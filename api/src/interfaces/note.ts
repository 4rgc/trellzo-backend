import { Document, Types } from 'mongoose';
import IChecklist from './checklist';
import IComment from './comment';
import IOrder from './order';
import ITag from './tag';

export default interface INote extends Document {
	name: string;
	description: string;
	startDate: Date;
	dueDate: Date;
	checklists: IChecklist[];
	comments: IComment[];
	tags: ITag[];
	checklistsOrder: string[];
	boardId: Types.ObjectId;
	listId: Types.ObjectId;
}
