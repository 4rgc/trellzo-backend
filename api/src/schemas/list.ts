import { Schema } from 'mongoose';
import IList from '../interfaces/list';
import OrderSchema from './order';
import PartialNoteSchema from './partialNote';

const ListSchema = new Schema<IList>({
	name: { type: String, required: true },
	notes: { type: [PartialNoteSchema], default: [] },
	notesOrder: { type: [OrderSchema], default: [] },
});

export default ListSchema;
