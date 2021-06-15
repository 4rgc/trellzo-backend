import { Document, Schema } from 'mongoose';

export default interface ICheckItem extends Document {
	name: string;
	checked: boolean;
	dueDate: Schema.Types.Date;
}
