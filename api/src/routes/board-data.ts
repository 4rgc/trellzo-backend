import boardDataController from '../data-controllers/board';

import { Router, Response } from 'express';
import {
	notFoundHandler,
	saveDbDataHandler,
	wrapAsHandler,
} from '../util/route-handling';
import IUser from '../interfaces/user';
const router = Router();

const userValidator = (data: IUser) => !!data;
const boardValidator = (data: IUser) => !!(data as IUser).boards;

router.get(
	'/:userId/:boardId',
	saveDbDataHandler((req) =>
		boardDataController.getBoardData(req.params.boardId)
	),
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
	saveDbDataHandler((req) =>
		boardDataController.createNewBoard(req.params.userId, req.body.name)
	),
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
	saveDbDataHandler((req) =>
		boardDataController.updateBoard(
			req.params.userId,
			req.params.boardId,
			req.body.name,
			req.body.description,
			req.body.listsOrder
		)
	),
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
