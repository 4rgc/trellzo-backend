import express from 'express';
import { queryParser } from 'express-query-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import boardDataRouter from './routes/board-data';
import usersDataRouter from './routes/users-data';
import userDataRouter from './routes/user-data';
import {
	handleValidationError,
	internalErrorHandler,
} from './util/route-handling';

const app = express();

app.use(express.json());
app.use(queryParser({ parseNull: true, parseBoolean: true }));
app.use(cookieParser());

mongoose
	.connect('mongodb://mongodb:27017/trellzo', {
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.catch((err) => {
		console.error(err.message);
		process.exit();
	});
mongoose.set('runValidators', true);

app.use('/data/user', userDataRouter);
app.use('/data/users', usersDataRouter);
app.use('/data/board', boardDataRouter);

app.get('/', (req, res) => {
	res.send('Well done!');
});

app.use(handleValidationError);
app.use(internalErrorHandler);

app.listen(8080, () => {
	console.log('Listening on port 8080...');
});
