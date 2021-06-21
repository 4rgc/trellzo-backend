import {
	generateTokens as genTokens,
	verifyAccessToken,
	verifyRefreshToken,
	refreshAccessToken,
} from '../util/jwt';
import { Request, Response, NextFunction } from 'express';

const generateTokens = (_req: Request, res: Response, next: NextFunction) => {
	try {
		const { authToken, refreshToken } = genTokens(res.locals.payload);

		res.cookie('auth', 'JWT ' + authToken, { httpOnly: true });
		res.cookie('reft', refreshToken, { httpOnly: true });

		return next();
	} catch (err) {
		return next(err);
	}
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const { auth } = req.cookies;
	if (!auth)
		res.status(401).json({
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
	if (!auth)
		res.status(401).json({
			message: 'Unauthorized: no access token',
		});
	if (!reft)
		res.status(401).json({
			message: 'Unauthorized: no refresh token',
		});

	const authToken = auth.replace('JWT ', '');
	const refreshToken = reft;

	let newAuthToken = '';

	try {
		newAuthToken = refreshAccessToken(authToken, refreshToken);
	} catch (err) {
		return next(err);
	}

	res.cookie('auth', newAuthToken, { httpOnly: true });
	return res.json({
		message: 'Refreshed',
	});
};

export default {
	generateTokens,
	logout,
	refreshAuthToken,
	verifyToken,
};
