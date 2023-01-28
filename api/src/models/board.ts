import { model } from 'mongoose';
import IBoard from '../interfaces/board.js';
import BoardSchema from '../schemas/board.js';

export default model<IBoard>('Board', BoardSchema);
