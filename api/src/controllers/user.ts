import { Request, Response, NextFunction } from 'express';
import userDataController from '../data-controllers/user';
import { hash } from '../util/crypt';

const registerNewUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name, email, password } = req.body;

	const { existingUser, errGetUser } = await userDataController
		.getUserByEmail(email)
		.then(
			(existingUser) => ({ existingUser, errGetUser: undefined }),
			(errGetUser) => ({ errGetUser, existingUser: undefined })
		);

	if (errGetUser) return next(errGetUser);

	if (existingUser !== null)
		return res.status(409).json({
			message: 'User with this email already exists.',
		});

	const { hashedPw, errHash } = await hash(password).then(
		(hashedPw) => ({ hashedPw, errHash: undefined }),
		(errHash) => ({ errHash, hashedPw: undefined })
	);

	if (errHash) return next(errHash);
	if (!hashedPw)
		return res.status(500).json({
			message: 'Hashed password was null',
			err: new Error(
				'500 Internal Server Error: hashed password was null'
			),
		});

	const { newUser, errCreateUser } = await userDataController
		.createUser(name, email, hashedPw)
		.then(
			(newUser) => ({ newUser, errCreateUser: undefined }),
			(errCreateUser) => ({ errCreateUser, newUser: undefined })
		);

	if (errCreateUser) return next(errCreateUser);

	if (!newUser) return next(new Error('New user was null'));
	res.locals.payload = newUser._id;

	next();
};

const getUserProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { userId } = res.locals.auth;

	const { user, err } = await userDataController.getUser(userId).then(
		(user) => ({ user, err: undefined }),
		(err) => ({ err, user: undefined })
	);

	if (err) return next(err);

	return res.json({
		user,
	});
};

const updateUserProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, name } = req.body;
	const { userId } = res.locals.auth;

	if (email) {
		const { existingUser, err } = await userDataController
			.getUserByEmail(email)
			.then(
				(existingUser) => ({ existingUser, err: undefined }),
				(err) => ({ err, existingUser: undefined })
			);

		if (err) return next(err);

		if (existingUser)
			return res.status(409).json({
				message: 'Conflict: email already in use',
			});
	}

	const { updatedUser, errUpdateUser } = await userDataController
		.updateUser(userId, name, email)
		.then(
			(updatedUser) => ({ updatedUser, errUpdateUser: undefined }),
			(errUpdateUser) => ({ errUpdateUser, updatedUser: undefined })
		);

	if (errUpdateUser) return next(errUpdateUser);

	return res.json({
		user: updatedUser,
	});
};

const userController = {
	getUserProfile,
	registerNewUser,
	updateUserProfile,
};

export default userController;
