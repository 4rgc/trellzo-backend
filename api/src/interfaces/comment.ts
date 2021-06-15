import { Document, Types } from 'mongoose';

export default interface IComment extends Document {
	userId: Types.ObjectId;
	contents: string;
	timestamp: Date;
}
