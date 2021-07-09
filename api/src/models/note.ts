import { model } from 'mongoose';
import INote from '../interfaces/note';
import NoteSchema from '../schemas/note';

export default model<INote>('Board', NoteSchema);
