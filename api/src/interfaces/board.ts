import { Document } from 'mongoose';
import IList from './list';
import ITag from './tag';
import IOrder from './order';

export default interface IBoard {
	name: string;
	description: string;
	lists: IList[];
	tags: ITag[];
	listsOrder: IOrder[];
}
