import { Document, Types } from 'mongoose';
import IList from './list';
import ITag from './tag';
import IOrder from './order';

export default interface IBoard extends Document {
	name: string;
	description: string;
	lists: IList[];
	tags: ITag[];
	listsOrder: string[];
	userIds: string[];
}
