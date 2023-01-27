import { model } from 'mongoose';
import INote from '../interfaces/note.js';
import NoteSchema from '../schemas/note.js';

export default model<INote>('Note', NoteSchema);
