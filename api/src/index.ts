import express from 'express';
import { queryParser } from 'express-query-parser';
import mongoose from 'mongoose';
import userController from './data-controllers/user';
import boardController from './data-controllers/board';

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

app.get('/', (req, res) => {
	res.send('Well done!');
});

app.get('/users', userController.getAllUsers);
app.get('/user', userController.getUserByEmail);
app.get('/boards', userController.getUserBoards);
app.get('/board/:userId', boardController.getBoardData);
app.post('/user/new', userController.createNewUser);
app.post('/user/:userId', userController.updateUser);
app.post('/board/:userId', boardController.createNewBoard);
app.post('/board/:userId/:boardId', boardController.updateBoard);

app.listen(8080, () => {
	console.log('Listening on port 8080...');
});
