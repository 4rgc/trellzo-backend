import { Schema, Types } from 'mongoose';
import IBoard from '../interfaces/board.js';
import ListSchema from './list.js';
import TagSchema from './tag.js';

const BoardSchema = new Schema<IBoard>({
	name: { type: String, required: true },
	description: { type: String, default: '' },
	lists: { type: [ListSchema], default: [] },
	tags: { type: [TagSchema], default: [] },
	listsOrder: { type: [Types.ObjectId], default: [] },
	userIds: { type: [Types.ObjectId], required: true },
});

export default BoardSchema;
