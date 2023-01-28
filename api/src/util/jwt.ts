import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';

const generateAuthToken = (payload: string | Object | Buffer) => {
	if (!process.env.JWT_SECRET_KEY)
		throw new Error('Env variable was undefined');
	return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
		expiresIn: '1800s',
	});
};

export const verifyRefreshToken = (token: string) => {
	if (!process.env.REFRESH_SECRET_KEY)
		throw new Error('Env variable was undefined');
	jwt.verify(token, process.env.REFRESH_SECRET_KEY);
};

export const generateTokens = (userId: string) => {
	if (!process.env.REFRESH_SECRET_KEY)
		throw new Error('Env variable was undefined');
	if (userId === '') throw new Error('userId was empty');
	const refreshToken = jwt.sign(
		{ a: crypto.randomBytes(256) },
		process.env.REFRESH_SECRET_KEY,
		{ expiresIn: '7d' }
	);
	const authToken = generateAuthToken({ userId });
	return { refreshToken, authToken };
};

export const verifyAccessToken = (token: string, opts?: jwt.VerifyOptions) => {
	if (!process.env.JWT_SECRET_KEY)
		throw new Error('Env variable was undefined');
	return jwt.verify(token, process.env.JWT_SECRET_KEY, opts);
};

export const refreshAccessToken = (authToken: string, refreshToken: string) => {
	if (!process.env.JWT_SECRET_KEY)
		throw new Error('Env variable was undefined');

	try {
		verifyRefreshToken(refreshToken);
	} catch (err: any) {
		err.message = 'Refresh token: ' + err.message;
		throw err;
	}

	let authPayload;
	try {
		authPayload = verifyAccessToken(authToken, {
			ignoreExpiration: true,
		});
	} catch (err: any) {
		err.message = 'Access token: ' + err.message;
		throw err;
	}

	if (typeof authPayload !== 'string') {
		// authPayload is a JwtPayload when exp and iat are present
		if (
			(authPayload as JwtPayload).exp &&
			(authPayload as JwtPayload).iat
		) {
			delete (authPayload as JwtPayload).exp;
			delete (authPayload as JwtPayload).iat;
		}
	}

	return generateAuthToken(authPayload);
};
