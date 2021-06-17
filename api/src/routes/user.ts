import userController from '../data-controllers/user';
import {
	invalidQueryParamHandler,
	wrapAsHandler,
	saveDbDataHandler,
	notFoundHandler,
} from './util';

import { Router, Request, Response } from 'express';
const router = Router();

router.get(
	'/',
	invalidQueryParamHandler(
		(req: Request) => !!req.query.email && req.query.email !== '',
		'email'
	),
	saveDbDataHandler(userController.getUserByEmail),
	notFoundHandler((data: any) => data !== null, 'User'),
	wrapAsHandler(({ res }: { res: Response }) =>
		res.json({
			user: res.locals.data,
		})
	)
);

router.get(
	'/boards',
	saveDbDataHandler(userController.getUserBoards),
	notFoundHandler((data: any) => data !== null, 'User'),
	wrapAsHandler(({ res }: { res: Response }) =>
		res.json({ ...res.locals.data })
	)
);

router.post(
	'/new',
	saveDbDataHandler(userController.createNewUser),
	wrapAsHandler(({ res }: { res: Response }) =>
		res.status(201).json({ user: res.locals.data })
	)
);

router.post(
	'/:userId',
	saveDbDataHandler(userController.updateUser),
	notFoundHandler((data) => !!data, 'User'),
	({ res }: { res: Response }) => res.json({ user: res.locals.data })
);

export default router;
