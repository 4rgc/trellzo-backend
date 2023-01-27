import { Document, Types } from 'mongoose';
import IPartialNote from './partialNote.js';

export default interface IList extends Document {
	name: string;
	notes: IPartialNote[];
	notesOrder: string[];
	boardId: Types.ObjectId;
}
