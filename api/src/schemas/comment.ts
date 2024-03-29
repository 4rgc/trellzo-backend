import { Schema } from 'mongoose';
import IComment from '../interfaces/comment.js';

const CommentSchema = new Schema<IComment>(
	{
		userId: { type: Schema.Types.ObjectId, required: true },
		contents: { type: String, required: true },
		timestamp: { type: Schema.Types.Date, required: true },
	},
	{ timestamps: true }
);

export default CommentSchema;
