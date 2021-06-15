import IBoard from '../interfaces/board';
import ListSchema from './list';
import TagSchema from './tag';
import OrderSchema from './order';
import { Schema } from 'mongoose';

const BoardSchema = new Schema<IBoard>({
	name: { type: String, required: true },
	description: { type: String, required: true },
	lists: { type: [ListSchema], required: true },
	tags: { type: [TagSchema], required: true },
	listsOrder: { type: [OrderSchema], required: true },
});

export default BoardSchema;
