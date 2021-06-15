import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
	User.find()
		.exec()
		.then((result) =>
			res.json({
				users: result,
				count: result.length,
			})
		)
		.catch((err) =>
			res.status(500).json({
				message: err.message,
				err,
			})
		);
};

const addNewComment = (req: Request, res: Response, next: NextFunction) => {
	User.findOne({ name: { $regex: /Dave/ } })
		.exec()
		.then((user) => {
			console.log(user?.boards?.slice(0, 1));
			return user?.updateOne({
				$push: {
					'boards.0.lists.0.notes.0.comments': [
						{
							userId: user.id,
							contents: 'new comment',
							timestamp: new Date().toISOString(),
						},
					],
				},
			});
		})
		.then((user) =>
			res.status(201).json({
				user,
			})
		)
		.catch((err) =>
			res.status(500).json({
				message: err.message,
				err,
			})
		);
};

export default { getAllUsers, addNewComment };
