import { NextFunction, Response, Request } from 'express';

type DataMethod<T> = (req: Request) => Promise<T> | T;

export const wrapAsHandler = (fn: any, ...params: any[]) => {
	return (req: Request, res: Response, next: NextFunction) =>
		fn({ req, res, next }, ...params);
};

export const wrapAsAsyncHandler = <T, Y>(
	fn: (
		obj: { req: Request; res: Response; next: NextFunction },
		params: T
	) => Y,
	...params: [T]
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

export const validateQueryParam = (
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

export const ensureFound = <T>(
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

export const internalErrorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.headersSent) {
		return next(err);
	}
	console.error(err.message);
	res.status(500).json({ message: err.message, err });
};

export const handleValidationError = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
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

export const notFoundHandler = <T>(
	validate: (data: T) => boolean,
	entityName: string
) => wrapAsHandler(ensureFound, validate, entityName);
