import userController from '../data-controllers/user';
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
	saveDbDataHandler(userController.getUserByEmail),
	notFoundHandler(userValidator, 'User'),
	wrapAsHandler(({ res }: { res: Response }) =>
		res.json({
			user: res.locals.data,
		})
	)
);

router.get(
	'/boards',
	saveDbDataHandler(userController.getUserBoards),
	notFoundHandler(userValidator, 'User'),
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
	notFoundHandler(userValidator, 'User'),
	({ res }: { res: Response }) => res.json({ user: res.locals.data })
);

export default router;
