import express from 'express';
import mongoose from 'mongoose';
import userController from './controllers/user';

const app = express();

app.use(express.json());

mongoose.connect('mongodb://mongodb:27017/trellzo').catch((err) => {
	console.error(err.message);
});

app.get('/', (req, res) => {
	res.send('Well done!');
});

app.get('/users', userController.getAllUsers);
app.get('/users/addNewComment', userController.addNewComment);

app.listen(8080, () => {
	console.log('Listening on port 8080...');
});
