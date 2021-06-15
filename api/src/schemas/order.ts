import IOrder from '../interfaces/order';
import { Schema } from 'mongoose';

const OrderSchema = new Schema<IOrder>({
	id: { type: Schema.Types.ObjectId, required: true },
});

export default OrderSchema;
