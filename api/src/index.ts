import express from 'express';
import { queryParser } from 'express-query-parser';
import mongoose from 'mongoose';
import userController from './data-controllers/user';
import boardController from './data-controllers/board';
import usersRouter from './routes/users';
import userRouter from './routes/user';
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

app.use('/user', userRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
	res.send('Well done!');
});

app.use(handleValidationError);
app.use(internalErrorHandler);

app.listen(8080, () => {
	console.log('Listening on port 8080...');
});
