import express from 'express';
import bookController from './controllers/comment';
import mongoose from 'mongoose';

const app = express();

mongoose.connect('mongodb://mongodb:27017');

app.get('/', (req, res) => {
	res.send('Well done!');
});

app.get('/comments', bookController.getAllComments);

app.listen(8080, () => {
	console.log('Listening on port 8080...');
});
