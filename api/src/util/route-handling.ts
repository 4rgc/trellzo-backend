import { NextFunction, Response, Request } from 'express';

type DataMethod<T> = (req: Request) => Promise<T> | T;

export const wrapAsHandler = <Y>(
	fn: (
		obj: { req: Request; res: Response; next: NextFunction },
		...params: any[]
	) => Y,
	...params: any[]
) => {
	return (req: Request, res: Response, next: NextFunction) =>
		fn({ req, res, next }, ...params);
};

export const wrapAsAsyncHandler = <Y>(
	fn: (
		obj: { req: Request; res: Response; next: NextFunction },
		...params: any[]
	) => Y,
	...params: any[]
) => {
	return async (req: Request, res: Response, next: NextFunction) =>
		await fn({ req, res, next }, ...params);
};

const saveDbData = async <T>(
	{
		req,
		res,
		next,
	}: {
		req: Request;
		res: Response;
		next: NextFunction;
	},
	dataMethod: DataMethod<T>
) => {
	res.locals.data = await Promise.resolve(dataMethod(req)).catch(next);
	next();
};

const sendSuccessMessage = ({ res }: { res: Response }, message: string) => {
	return res.json({ message });
};

const validateQueryParam = (
	{ req, res, next }: { req: Request; res: Response; next: NextFunction },
	validate: (req: Request) => boolean,
	paramName: string
) => {
	if (!validate(req))
		return res.status(400).json({
			message: 'invalid query parameter: ' + paramName,
		});
	next();
};

const validateUrlParam = <T>(
	{ req, res, next }: { req: Request; res: Response; next: NextFunction },
	validate: (req: Request) => boolean,
	paramName: string
) => {
	if (!validate(req))
		return res.status(400).json({
			message: 'invalid url parameter: ' + paramName,
		});
	next();
};

const ensureFound = <T>(
	{ res, next }: { res: Response; next: NextFunction },
	validate: (data: T) => boolean,
	entityName: string
) => {
	if (!validate(res.locals.data))
		return res.status(404).json({
			message: entityName + ' not found',
		});
	next();
};

export const sendSuccessHandler = (_: any, res: Response) => {
	return res.send();
};

export const internalErrorHandler = (
	err: any,
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.headersSent) {
		return next(err);
	}
	console.error(err);
	res.status(500).json({ message: err.message, err });
};

export const handleValidationError = (
	err: any,
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	if (process.env.DEBUG_MODE === 'true') {
		var stackTrace = err.stack;
		console.error(stackTrace);
	}
	if (err.name === 'ValidationError')
		return res.status(400).json({
			message: err.message,
			err,
		});
	next(err);
};

export const saveDbDataHandler = <T>(dataMethod: DataMethod<T>) =>
	wrapAsAsyncHandler(saveDbData, dataMethod);

export const invalidQueryParamHandler = (
	validate: (req: Request) => boolean,
	paramName: string
) => wrapAsHandler(validateQueryParam, validate, paramName);

export const invalidUrlParamHandler = (
	validate: (req: Request) => boolean,
	paramName: string
) => wrapAsHandler(validateUrlParam, validate, paramName);

export const notFoundHandler = <T>(
	validate: (data: T) => boolean,
	entityName: string
) => wrapAsHandler(ensureFound, validate, entityName);

export const sendSuccessMessageHandler = (message: string) =>
	wrapAsHandler(sendSuccessMessage, message);

export const authErrorHandler = (
	err: any,
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	if (
		err.name === 'JsonWebTokenError' ||
		err.name === 'TokenExpiredError' ||
		err.name === 'NotBeforeError'
	) {
		return res.status(401).json({
			message: 'Unauthorized: ' + err.message,
		});
	}
	next(err);
};

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
	console.log(
		`[${new Date().toISOString()}]: ${req.method.toUpperCase()} ${
			req.url
		} ${JSON.stringify(req.body)}`
	);
	next();
};
