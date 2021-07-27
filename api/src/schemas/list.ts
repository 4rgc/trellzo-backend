import { Schema } from 'mongoose';
import IList from '../interfaces/list';
import PartialNoteSchema from './partialNote';

const ListSchema = new Schema<IList>({
	name: { type: String, required: true },
	notes: { type: [PartialNoteSchema], default: [] },
	notesOrder: { type: [Schema.Types.ObjectId], default: [] },
	boardId: { type: Schema.Types.ObjectId, required: true },
});

export default ListSchema;
