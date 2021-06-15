import ICheckItem from '../interfaces/checkItem';
import { Schema } from 'mongoose';

const CheckItemSchema = new Schema<ICheckItem>(
	{
		name: { type: String, required: true },
		checked: { type: Boolean, required: true },
		dueDate: { type: Schema.Types.Date, required: true },
	},
	{ timestamps: true }
);

export default CheckItemSchema;
