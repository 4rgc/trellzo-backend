import { Document, Types } from 'mongoose';
import IList from './list.js';
import ITag from './tag.js';
import IOrder from './order.js';

export default interface IBoard extends Document {
	name: string;
	description: string;
	lists: IList[];
	tags: ITag[];
	listsOrder: string[];
	userIds: string[];
}
