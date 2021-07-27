import { Schema } from 'mongoose';
import IChecklist from '../interfaces/checklist';
import OrderSchema from './order';
import CheckItemSchema from './checkItem';

const ChecklistSchema = new Schema<IChecklist>({
	name: { type: String, required: true },
	checkItems: { type: [CheckItemSchema], default: [] },
	checkItemsOrder: { type: [Schema.Types.ObjectId], default: [] },
});

export default ChecklistSchema;
