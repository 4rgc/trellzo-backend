import { NextFunction, Response, Request } from 'express';
import { ValidationError, validationResult } from 'express-validator';

const validationErrorFormatter = ({ location, msg, param }: ValidationError) =>
	`${location}[${param}]: ${msg}`;

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
