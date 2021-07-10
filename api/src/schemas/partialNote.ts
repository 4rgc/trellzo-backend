import IPartialNote from '../interfaces/partialNote';
import TagSchema from './tag';
import { Schema } from 'mongoose';

const PartialNoteSchema = new Schema<IPartialNote>({
	name: { type: String, required: true },
	description: { type: String, default: '' },
	startDate: { type: Schema.Types.Date, default: null },
	dueDate: { type: Schema.Types.Date, default: null },
	tags: { type: [TagSchema], default: [] },
});

export default PartialNoteSchema;
