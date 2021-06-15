import { Document, Types } from 'mongoose';
import INote from './note';
import IOrder from './order';

export default interface IList extends Document {
	name: string;
	notes: INote[];
	notesOrder: IOrder[];
}
