import express from 'express';
import { queryParser } from 'express-query-parser';
import mongoose from 'mongoose';
import boardRouter from './routes/board-data';
import usersRouter from './routes/users-data';
import userRouter from './routes/user-data';
import { handleValidationError, internalErrorHandler } from './routes/util';

const app = express();

app.use(express.json());
app.use(queryParser({ parseNull: true, parseBoolean: true }));

mongoose
	.connect('mongodb://mongodb:27017/trellzo', {
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.catch((err) => {
		console.error(err.message);
	});
mongoose.set('runValidators', true);

app.use('/data/user', userRouter);
app.use('/data/users', usersRouter);
app.use('/data/board', boardRouter);

app.get('/', (req, res) => {
	res.send('Well done!');
});

app.use(handleValidationError);
app.use(internalErrorHandler);

app.listen(8080, () => {
	console.log('Listening on port 8080...');
});
