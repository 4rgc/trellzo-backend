import {model} from 'mongoose';
import IBoard from '../interfaces/board';
import BoardSchema from '../schemas/board';

export default model<IBoard>('Board', BoardSchema);
