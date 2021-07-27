import { Document } from 'mongoose';
import ICheckItem from './checkItem';
import IOrder from './order';

export default interface IChecklist extends Document {
	name: string;
	checkItems: ICheckItem[];
	checkItemsOrder: string[];
}
