import { NextFunction, Response, Request } from 'express';
import { ValidationError, validationResult } from 'express-validator';

const buildErrorString = (msg: string, location?: string, param?: string) =>
	`${location}[${param}]: ${msg}`;

const validationErrorFormatter = ({
	location,
	msg,
	param,
	nestedErrors,
}: ValidationError) => {
	let errorString = buildErrorString(msg, location, param);

	if (nestedErrors) {
		nestedErrors.forEach((nestedError) => {
			if (
				nestedError &&
				(nestedError as ValidationError)?.param === '_error'
			)
				errorString += `\n\t⎿${validationErrorFormatter(
					nestedError as ValidationError
				)}`;
			else errorString += `\n\t⎿${JSON.stringify(nestedError)}`;
		});
	}

	return errorString;
};

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: errors
				.formatWith(validationErrorFormatter)
				.array()
				.join('\n'),
		});
	}

	return next();
};

export default validateRequest;
