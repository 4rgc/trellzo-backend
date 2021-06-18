import boardDataController from '../data-controllers/board';

import { Router, Response } from 'express';
import { notFoundHandler, saveDbDataHandler, wrapAsHandler } from './util';
import IUser from '../interfaces/user';
const router = Router();

const userValidator = (data: IUser) => !!data;
const boardValidator = (data: IUser) => !!(data as IUser).boards;

router.get(
	'/:userId',
	saveDbDataHandler(boardDataController.getBoardData),
	notFoundHandler(userValidator, 'User'),
	notFoundHandler(boardValidator, 'Board'),
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
	saveDbDataHandler(boardDataController.createNewBoard),
	notFoundHandler(userValidator, 'User'),
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
	saveDbDataHandler(boardDataController.updateBoard),
	notFoundHandler(userValidator, 'User'),
	notFoundHandler(boardValidator, 'Board'),
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
