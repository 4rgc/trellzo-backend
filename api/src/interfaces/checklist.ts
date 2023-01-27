import { Document } from 'mongoose';
import ICheckItem from './checkItem.js';
import IOrder from './order.js';

export default interface IChecklist extends Document {
	name: string;
	checkItems: ICheckItem[];
	checkItemsOrder: string[];
}
