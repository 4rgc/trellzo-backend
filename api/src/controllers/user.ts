import { Request, Response, NextFunction } from 'express';
import userDataController from '../data-controllers/user';
import { compare, hash } from '../util/crypt';

const emailRegex =
	/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

const registerNewUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name, email, password } = req.body;

	const emailValid = emailRegex.test(email);
	if (!emailValid) return res.status(400).json({ message: 'Invalid email' });

	const passwordValid = passwordRegex.test(password);
	if (!passwordValid)
		return res.status(400).json({ message: 'Password not strong enough' });

	if (!name || name === '')
		return res.status(400).json({ message: 'Name was invalid' });

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

const verifyLogin = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;

	const { user, errUser } = await userDataController
		.getUserByEmail(email)
		.then(
			(user) => ({ user, errUser: undefined }),
			(errUser) => ({ errUser, user: undefined })
		);

	if (errUser) return next(errUser);

	if (!user) return res.status(401).json({ message: 'User not found' });
	if (!password)
		return res.status(400).json({ message: 'Password was null' });

	const { pwIsValid, errPwValidation } = await compare(
		password,
		user.pass
	).then(
		(pwIsValid) => ({ pwIsValid, errPwValidation: undefined }),
		(errPwValidation) => ({ errPwValidation, pwIsValid: undefined })
	);

	if (errPwValidation) return next(errPwValidation);

	if (!pwIsValid)
		return res.status(401).json({ message: 'Incorrect password' });

	res.locals.payload = user._id;
	return next();
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

	if (!email && !name) return res.send();

	if (email) {
		if (!emailRegex.test(email))
			return res.status(400).json({
				message: 'Invalid email',
			});

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

	if (name === '')
		return res.status(400).json({ message: 'Name was invalid' });

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
	verifyLogin,
	updateUserProfile,
};

export default userController;
