import { Request, Response, NextFunction } from 'express';
import {
	generateTokens as genTokens,
	verifyAccessToken,
	verifyRefreshToken,
	refreshAccessToken,
} from '../util/jwt.js';
import userDataController from '../data-controllers/user.js';
import { compare } from '../util/crypt.js';

const generateTokens = (_req: Request, res: Response, next: NextFunction) => {
	try {
		const { authToken, refreshToken } = genTokens(
			res.locals.payload.userId,
			res.locals.payload.userName
		);

		res.cookie('auth', 'JWT ' + authToken, {
			secure: true,
			path: '/',
			domain: process.env.DOMAIN || 'trellzo.tech',
		});
		res.cookie('reft', refreshToken, {
			secure: true,
			httpOnly: true,
			path: '/',
			domain: process.env.DOMAIN || 'trellzo.tech',
		});

		return next();
	} catch (err) {
		return next(err);
	}
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const { auth } = req.cookies;
	if (!auth || auth === '')
		return res.status(401).json({
			message: 'Unauthorized: no token',
		});

	const authToken = auth.replace('JWT ', '');

	let payload;

	try {
		payload = verifyAccessToken(authToken);
	} catch (err) {
		return next(err);
	}

	res.locals.auth = payload;
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

	res.locals.payload = { userId: user._id, userName: user.name };
	return next();
};

const logout = (req: Request, res: Response, next: NextFunction) => {
	const { auth, reft }: { auth: string; reft: string } = req.cookies;
	if (!auth || !reft)
		return res.status(401).json({ message: 'Unauthorized: not logged in' });

	const authToken = auth.replace('JWT ', '');
	const refreshToken = reft;

	try {
		res.clearCookie('auth');
		res.clearCookie('reft');
		verifyAccessToken(authToken);
		verifyRefreshToken(refreshToken);
	} catch (err) {
		return next(err);
	}

	res.json({
		message: 'Logged out',
	});
};

const refreshAuthToken = (req: Request, res: Response, next: NextFunction) => {
	const { auth, reft } = req.cookies;

	const authToken = auth.replace('JWT ', '');
	const refreshToken = reft;

	let newAuthToken = '';

	try {
		newAuthToken = 'JWT ' + refreshAccessToken(authToken, refreshToken);
	} catch (err) {
		return next(err);
	}

	res.cookie('auth', newAuthToken, {
		secure: true,
		path: '/',
		domain: process.env.DOMAIN || 'trellzo.tech',
	});
	return res.json({
		message: 'Refreshed',
	});
};

export default {
	generateTokens,
	logout,
	verifyLogin,
	refreshAuthToken,
	verifyToken,
};
