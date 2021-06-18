import userDataController from '../data-controllers/user';
import {
	invalidQueryParamHandler,
	wrapAsHandler,
	saveDbDataHandler,
	notFoundHandler,
} from './util';

import { Router, Request, Response } from 'express';
import IUser from '../interfaces/user';
const router = Router();

const userValidator = (data: IUser) => !!data;

router.get(
	'/',
	invalidQueryParamHandler(
		(req: Request) => !!req.query.email && req.query.email !== '',
		'email'
	),
	saveDbDataHandler((req) =>
		userDataController.getUserByEmail(req.query.email as string)
	),
	notFoundHandler(userValidator, 'User'),
	wrapAsHandler(({ res }: { res: Response }) =>
		res.json({
			user: res.locals.data,
		})
	)
);

router.get(
	'/boards',
	saveDbDataHandler((req) =>
		userDataController.getUserBoards(req.query.userId as string)
	),
	notFoundHandler(userValidator, 'User'),
	wrapAsHandler(({ res }: { res: Response }) =>
		res.json({ ...res.locals.data })
	)
);

router.post(
	'/new',
	saveDbDataHandler((req) =>
		userDataController.createUser(
			req.body.name,
			req.body.email,
			req.body.password
		)
	),
	wrapAsHandler(({ res }: { res: Response }) =>
		res.status(201).json({ user: res.locals.data })
	)
);

router.post(
	'/:userId',
	saveDbDataHandler((req) =>
		userDataController.updateUser(
			req.params.userId,
			req.body.name,
			req.body.email
		)
	),
	notFoundHandler(userValidator, 'User'),
	({ res }: { res: Response }) => res.json({ user: res.locals.data })
);

export default router;
