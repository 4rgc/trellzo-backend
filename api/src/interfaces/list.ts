import { Document, Types } from 'mongoose';
import IPartialNote from './partialNote';
import IOrder from './order';

export default interface IList extends Document {
	name: string;
	notes: IPartialNote[];
	notesOrder: IOrder[];
}
