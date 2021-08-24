import express from 'express';
import { queryParser } from 'express-query-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import boardDataRouter from './routes/board-data';
import usersDataRouter from './routes/users-data';
import userDataRouter from './routes/user-data';
import {
	authErrorHandler,
	handleValidationError,
	internalErrorHandler,
} from './util/route-handling';
import userRouter from './routes/user';
import authRouter from './routes/auth';
import boardRouter from './routes/board';
import listRouter from './routes/list';
import noteRouter from './routes/note';
import checklistRouter from './routes/checklist';
import commentRouter from './routes/comments';

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Trellzo API',
			version: '1.0.0',
		},
		components: {
			schemas: {
				ResultMessage: {
					type: 'object',
					properties: {
						message: {
							type: 'string',
							description:
								"The description of the request's outcome.",
						},
					},
				},
			},
			securitySchemes: {
				jwtAuth: {
					type: 'apiKey',
					in: 'cookie',
					name: 'auth',
				},
				jwtRef: {
					type: 'apiKey',
					in: 'cookie',
					name: 'reft',
				},
			},
		},
	},
	apis: ['./src/routes/*.ts', './src/index.ts'],
};

const openapiSpecification = swaggerJsdoc(options);

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use('/data/user', userDataRouter);
app.use('/data/users', usersDataRouter);
app.use('/data/board', boardDataRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/board', boardRouter);
app.use('/list', listRouter);
app.use('/note', noteRouter);
app.use('/checklist', checklistRouter);
app.use('/comment', commentRouter);

app.get('/', (req, res) => {
	res.send('Well done!');
});

app.use(handleValidationError);
app.use(authErrorHandler);
app.use(internalErrorHandler);

app.listen(8080, () => {
	console.log('Listening on port 8080...');
});
