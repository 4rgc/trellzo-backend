import IBoard from '../interfaces/board';
import ListSchema from './list';
import TagSchema from './tag';
import OrderSchema from './order';
import { Schema, Types } from 'mongoose';

const BoardSchema = new Schema<IBoard>({
	name: { type: String, required: true },
	description: { type: String, default: '' },
	lists: { type: [ListSchema], default: [] },
	tags: { type: [TagSchema], default: [] },
	listsOrder: { type: [Types.ObjectId], default: [] },
	userIds: { type: [Types.ObjectId], required: true },
});

export default BoardSchema;
