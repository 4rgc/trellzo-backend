import INote from '../interfaces/note';
import CommentSchema from './comment';
import ChecklistSchema from './checklist';
import OrderSchema from './order';
import { Schema } from 'mongoose';

const NoteSchema = new Schema<INote>({
	name: { type: String, required: true },
	description: { type: String, required: true },
	startDate: { type: Date, required: true },
	dueDate: { type: Date, required: true },
	checklists: { type: [ChecklistSchema], default: [] },
	comments: { type: [CommentSchema], default: [] },
	tagIds: { type: [Schema.Types.ObjectId], default: [] },
	checklistOrder: { type: [OrderSchema], default: [] },
});

export default NoteSchema;
