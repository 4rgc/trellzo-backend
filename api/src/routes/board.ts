import boardController from '../data-controllers/board';

import { Router, Request, Response } from 'express';
import { notFoundHandler, saveDbDataHandler, wrapAsHandler } from './util';
import IUser from '../interfaces/user';
const router = Router();

router.get(
	'/:userId',
	saveDbDataHandler(boardController.getBoardData),
	notFoundHandler((data) => !!data, 'User'),
	notFoundHandler((data) => !!(data as IUser).boards, 'Board'),
	wrapAsHandler(
		({
			res: {
				locals: { data },
			},
			res,
		}: {
			res: Response;
		}) => res.json({ board: data.boards[0] })
	)
);

router.post(
	'/:userId',
	saveDbDataHandler(boardController.createNewBoard),
	notFoundHandler((data) => !!data, 'User'),
	wrapAsHandler(
		({
			res: {
				locals: { data },
			},
			res,
		}: {
			res: Response;
		}) => res.status(201).json({ board: data.boards[0] })
	)
);

router.post(
	'/:userId/:boardId',
	saveDbDataHandler(boardController.updateBoard),
	notFoundHandler((data) => !!data, 'User'),
	notFoundHandler((data) => !!(data as IUser).boards, 'Board'),
	wrapAsHandler(
		({
			res: {
				locals: { data },
			},
			res,
		}: {
			res: Response;
		}) => res.json({ board: data.boards[0] })
	)
);

export default router;
