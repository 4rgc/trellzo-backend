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
	const existingUser = await userDataController
		.getUserByEmail(email)
		.catch(next);

	if (existingUser !== null)
		return res.status(409).json({
			message: 'User with this email already exists.',
		});

	const hashedPw = await hash(password).catch(next);
	if (!hashedPw) return;

	const newUser = await userDataController
		.createUser(name, email, hashedPw)
		.catch(next);

	if (!newUser) return next(new Error('New user was null'));
	res.locals.payload = newUser._id;

	next();
};

const verifyLogin = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;

	const user = await userDataController.getUserByEmail(email).catch(next);

	if (!user) return res.status(401).json({ message: 'User not found' });
	if (!password)
		return res.status(400).json({ message: 'Password was null' });

	const pwIsValid = await compare(password, user.pass).catch(next);

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

	const user = await userDataController.getUser(userId).catch(next);

	res.json({
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
			res.status(400).json({
				message: 'Invalid email',
			});
		const existingUser = await userDataController.getUserByEmail(email);
		if (existingUser)
			return res.status(409).json({
				message: 'Conflict: email already in use',
			});
	}

	const updatedUser = await userDataController
		.updateUser(userId, name, email)
		.catch(next);

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
