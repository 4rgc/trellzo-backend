import IPartialBoard from '../interfaces/partialBoard.js';
import { Schema } from 'mongoose';

const PartialBoardSchema = new Schema<IPartialBoard>({
	name: { type: String, required: true },
	description: { type: String, default: '' },
});

export default PartialBoardSchema;
