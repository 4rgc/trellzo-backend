import { Router } from 'express';
import { body, oneOf } from 'express-validator';
import userController from '../controllers/user';
import authController from '../controllers/auth';
import validateRequest from '../middleware/validateRequest';

const userRouter = Router();

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

/**
 * @openapi
 * /user/:
 *  get:
 *   summary: Responds with the user's profile.
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   responses:
 *    '200':
 *     description: 'User profile found'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         user:
 *          $ref: '#/components/schemas/UserProfile'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 */
userRouter.get('/', authController.verifyToken, userController.getUserProfile);

/**
 * @openapi
 * /user/:
 *  post:
 *   summary: Updates user's profile. Responds with updated data.
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: email
 *         nullable: true
 *         description: New email address
 *         example: johndoe@example.com
 *        name:
 *         type: name
 *         nullable: true
 *         description: New name
 *         example: Art Rutherford
 *   responses:
 *    '200':
 *     description: 'Successfully updated user profile'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         user:
 *          $ref: '#/components/schemas/UserProfile'
 *    '409':
 *     description: 'User with this email already exists'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ResultMessage'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
userRouter.post(
	'/',
	oneOf([
		body('name').notEmpty().not().isNumeric(),
		body('name').not().exists(),
	]),
	oneOf([body('email').isEmail().notEmpty(), body('email').not().exists()]),
	validateRequest,
	authController.verifyToken,
	userController.updateUserProfile
);

/**
 * @openapi
 * /user/register:
 *  post:
 *   summary: Registers a new user. Responds with the new user's profile.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: email
 *         description: User's email address
 *         example: aruth@example.com
 *        name:
 *         type: string
 *         description: User's name
 *         example: Art Rutherford
 *        password:
 *         type: string
 *         description: User's password
 *         example: n3WP455w06d
 *   responses:
 *    '201':
 *     description: 'Successfully registered a new user'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         user:
 *          $ref: '#/components/schemas/UserProfile'
 *    '409':
 *     description: 'User with this email already exists'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ResultMessage'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
userRouter.post(
	'/register',
	body('email').isEmail().notEmpty(),
	body('name').notEmpty().not().isNumeric(),
	body('password').matches(passwordRegex),
	validateRequest,
	userController.registerNewUser,
	authController.generateTokens,
	(_, res) => res.status(201).json({ message: 'Created' })
);

/**
 * @openapi
 * /user/changepassword:
 *  post:
 *   summary: Changes current user's password
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        password:
 *         type: string
 *         description: User's password
 *         example: n3WP455w06d
 *   responses:
 *    '201':
 *     description: 'Successfully changed password'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          $ref: '#/components/schemas/ResultMessage'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 */
userRouter.post(
	'/changepassword',
	body('password').matches(passwordRegex),
	validateRequest,
	authController.verifyToken,
	userController.changePassword
);

export default userRouter;
