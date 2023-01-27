import { Schema, Types } from 'mongoose';
import IChecklist from '../interfaces/checklist';
import CheckItemSchema from './checkItem';

const ChecklistSchema = new Schema<IChecklist>({
	name: { type: String, required: true },
	checkItems: { type: [CheckItemSchema], default: [] },
	checkItemsOrder: { type: [Types.ObjectId], default: [] },
});

export default ChecklistSchema;
