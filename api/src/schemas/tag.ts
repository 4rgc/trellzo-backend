import { Schema } from 'mongoose';
import ITag from '../interfaces/tag.js';

const TagSchema = new Schema<ITag>({
	color: { type: String, required: true },
	name: { type: String, required: true },
});

export default TagSchema;
