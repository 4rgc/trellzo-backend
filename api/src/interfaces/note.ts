import { Document, Types } from 'mongoose';
import IChecklist from './checklist.js';
import IComment from './comment.js';
import IOrder from './order.js';
import ITag from './tag.js';

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
