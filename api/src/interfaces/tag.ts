import { Document } from 'mongoose';

export default interface ITag extends Document {
	color: string;
	name: string;
}
