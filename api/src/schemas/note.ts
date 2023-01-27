import { Schema, Types } from 'mongoose';
import INote from '../interfaces/note.js';
import CommentSchema from './comment.js';
import ChecklistSchema from './checklist.js';
import TagSchema from './tag.js';

const NoteSchema = new Schema<INote>({
	name: { type: String, required: true },
	description: { type: String, default: '' },
	startDate: { type: Date, default: null },
	dueDate: { type: Date, default: null },
	checklists: { type: [ChecklistSchema], default: [] },
	comments: { type: [CommentSchema], default: [] },
	tags: { type: [TagSchema], default: [] },
	checklistsOrder: { type: [Types.ObjectId], default: [] },
	boardId: { type: Schema.Types.ObjectId, required: true },
	listId: { type: Schema.Types.ObjectId, required: true },
});

export default NoteSchema;
