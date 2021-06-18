import userController from '../data-controllers/user';

import { Router, Response } from 'express';
import { wrapAsHandler, saveDbDataHandler } from './util';
const router = Router();

router.get(
	'/',
	saveDbDataHandler(userController.getAllUsers),
	wrapAsHandler(({ res }: { res: Response }) =>
		res.json({ users: res.locals.data })
	)
);

export default router;
