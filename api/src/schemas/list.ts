import { Schema, Types } from 'mongoose';
import IList from '../interfaces/list.js';
import PartialNoteSchema from './partialNote.js';

const ListSchema = new Schema<IList>({
	name: { type: String, required: true },
	notes: { type: [PartialNoteSchema], default: [] },
	notesOrder: { type: [Types.ObjectId], default: [] },
	boardId: { type: Schema.Types.ObjectId, required: true },
});

export default ListSchema;
