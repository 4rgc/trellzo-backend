import express from 'express';
import { queryParser } from 'express-query-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {
	authErrorHandler,
	handleValidationError,
	internalErrorHandler,
	logRequest,
} from './util/route-handling.js';
import userRouter from './routes/user.js';
import authRouter from './routes/auth.js';
import boardRouter from './routes/board.js';
import listRouter from './routes/list.js';
import noteRouter from './routes/note.js';
import checklistRouter from './routes/checklist.js';
import commentRouter from './routes/comments.js';

import cors from 'cors';
import MongoUrl from './util/mongoUrl.js';

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
				List: {
					type: 'object',
					properties: {
						_id: { $ref: '#/components/schemas/ObjectId' },
						name: {
							type: 'string',
							description: "List's name",
							example: 'To-do list',
						},
						notes: {
							type: 'array',
							items: { $ref: '#/components/schemas/Note' },
							description: 'Notes contained in the list',
						},
						notesOrder: {
							type: 'array',
							items: { $ref: '#/components/schemas/ObjectId' },
							description: "Display order of this list's notes",
						},
						boardId: {
							$ref: '#/components/schemas/ObjectId',
						},
					},
				},
				Note: {
					type: 'object',
					properties: {
						_id: { $ref: '#/components/schemas/ObjectId' },
						name: {
							type: 'string',
							description: "Note's name",
							example: 'Do something',
						},
						description: {
							type: 'string',
							description: "Note's description",
							example:
								'We really need to do something about this, fast.',
						},
						startDate: {
							type: 'iso8601',
							description:
								'Start date and time for this note in the ISO 8601 format',
							example: '2021-08-28T16:16:31.305Z',
						},
						endDate: {
							type: 'iso8601',
							description:
								'End date and time for this note in the ISO 8601 format',
							example: '2021-08-28T16:16:31.305Z',
						},
						checklists: {
							type: 'array',
							items: { $ref: '#/components/schemas/Checklist' },
							description: "Note's checklists",
						},
						comments: {
							type: 'array',
							items: { $ref: '#/components/schemas/Comment' },
							description: "Note's comments",
						},
						tags: {
							type: 'array',
							items: { $ref: '#/components/schemas/Tag' },
							description: "Note's tags",
						},
						checklistsOrder: {
							type: 'array',
							items: { $ref: '#/components/schemas/ObjectId' },
							description:
								'Display order for the checklists on this note',
						},
						boardId: { $ref: '#/components/schemas/ObjectId' },
						listId: { $ref: '#/components/schemas/ObjectId' },
					},
				},
				Comment: {
					type: 'object',
					properties: {
						_id: { $ref: '#/components/schemas/ObjectId' },
						userId: { $ref: '#/components/schemas/ObjectId' },
						contents: {
							type: 'string',
							description: 'Contents of the comment',
							example: 'First comment!',
						},
						timestamp: {
							type: 'iso8601',
							description:
								'Timestamp of when the comment was created',
							example: '2021-08-28T16:16:31.305Z',
						},
					},
				},
				Checklist: {
					type: 'object',
					properties: {
						_id: { $ref: '#/components/schemas/ObjectId' },
						name: {
							type: 'string',
							description: 'Name of the checklist',
							example: 'To-do list',
						},
						checkItems: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/CheckItem',
							},
							description: 'Items in the checklist',
						},
						checkItemsOrder: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/ObjectId',
							},
							description:
								'Display order for the items in the checklist',
						},
					},
				},
				CheckItem: {
					type: 'object',
					properties: {
						_id: { $ref: '#/components/schemas/ObjectId' },
						name: {
							type: 'string',
							description: 'Description of the checklist item',
							example: 'Do something',
						},
						checked: {
							type: 'boolean',
							description: 'Status of the checklist item',
							example: true,
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

const corsOptions: cors.CorsOptions = {
	origin: /http(s)?:\/\/localhost(:[0-9]{2,5})?$/,
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(queryParser({ parseNull: true, parseBoolean: true }));
app.use(cookieParser());
if (process.env.DEBUG_MODE) app.use(logRequest);

await mongoose
	.connect(
		new MongoUrl(
			process.env.MONGO_HOST?.split(',') || [],
			process.env.MONGO_PORT?.split(',').map((port) => parseInt(port)) ||
				[],
			'trellzo'
		)
			.username(process.env.MONGO_USER)
			.password(process.env.MONGO_PASSWORD)
			.ssl(process.env.MONGO_SSL === 'true')
			.replicaSet(process.env.MONGO_REPLICA_SET)
			.authSource(process.env.MONGO_AUTH_SOURCE)
			.toString()
	)
	.catch((err) => {
		console.error(err);
		process.exit();
	});
mongoose.set('runValidators', true);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

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
