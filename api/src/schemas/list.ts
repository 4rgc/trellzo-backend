import { Schema } from 'mongoose';
import IList from '../interfaces/list';
import NoteSchema from './note';
import OrderSchema from './order';

const ListSchema = new Schema<IList>({
	name: { type: String, required: true },
	notes: { type: [NoteSchema], required: true },
	notesOrder: { type: [OrderSchema], required: true },
});

export default ListSchema;
