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
				UserProfile: {
					type: 'object',
					properties: {
						name: {
							type: 'string',
							description: "User's name",
							example: 'John Doe',
						},
						email: {
							type: 'email',
							description: "User's email address",
							example: 'johndoe@example.com',
						},
					},
				},
				ObjectId: {
					type: 'ObjectId',
					description: "MongoDB's ObjectId",
					example: '61252f1050f154f82b6eda40',
				},
				PartialBoard: {
					type: 'object',
					properties: {
						_id: { $ref: '#/components/schemas/ObjectId' },
						name: {
							type: 'string',
							description: 'Board name',
							example: 'Board 1',
						},
						description: {
							type: 'string',
							description: 'Board description',
							example: 'This is a board.',
						},
					},
				},
				Board: {
					type: 'object',
					properties: {
						_id: { $ref: '#/components/schemas/ObjectId' },
						name: {
							type: 'string',
							description: 'Board name',
							example: 'Board 1',
						},
						description: {
							type: 'string',
							description: 'Board description',
							example: 'This is a board.',
						},
						lists: {
							type: 'array',
							items: { $ref: '#/components/schemas/List' },
							description: "Board's lists",
						},
						tags: {
							type: 'array',
							items: { $ref: '#/components/schemas/Tag' },
							description: "Board's note tags",
						},
						listsOrder: {
							type: 'array',
							items: { $ref: '#/components/schemas/ObjectId' },
							description: "Display order of board's lists",
						},
						userIds: {
							type: 'array',
							items: { $ref: '#/components/schemas/ObjectId' },
							description: 'Users who have access to this board',
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
			responses: {
				'401Unauthorized': {
					description:
						'Unauthorized. The access token was either invalid or expired.',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ResultMessage',
							},
						},
					},
				},
				'400Validation': {
					description:
						'Bad Request. Request query params/URL params/body were not valid.',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ResultMessage',
							},
						},
					},
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
