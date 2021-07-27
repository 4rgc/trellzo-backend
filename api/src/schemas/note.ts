import INote from '../interfaces/note';
import CommentSchema from './comment';
import ChecklistSchema from './checklist';
import OrderSchema from './order';
import { Schema } from 'mongoose';
import TagSchema from './tag';

const NoteSchema = new Schema<INote>({
	name: { type: String, required: true },
	description: { type: String, default: '' },
	startDate: { type: Date, default: null },
	dueDate: { type: Date, default: null },
	checklists: { type: [ChecklistSchema], default: [] },
	comments: { type: [CommentSchema], default: [] },
	tags: { type: [TagSchema], default: [] },
	checklistOrder: { type: [OrderSchema], default: [] },
	boardId: { type: Schema.Types.ObjectId, required: true },
	listId: { type: Schema.Types.ObjectId, required: true },
});

export default NoteSchema;
