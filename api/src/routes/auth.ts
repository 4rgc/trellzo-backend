import { Router } from 'express';
import { cookie, body } from 'express-validator';
import authController from '../controllers/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import { sendSuccessMessageHandler } from '../util/route-handling.js';
const authRouter = Router();

/**
 * @openapi
 * /auth/login:
 *  post:
 *   summary: Allows a user to log in with an email and a password, and get a refresh/auth token pair.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         example: "johndoe@example.com"
 *        password:
 *         type: string
 *         example: "password1"
 *   responses:
 *    '200':
 *     description: 'Successfully logged in'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ResultMessage'
 *    '401':
 *     description: 'Invalid email/password'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ResultMessage'
 *    '400':
 *     description: 'Email/password was empty'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ResultMessage'
 */
authRouter.post(
	'/login',
	body('email').isEmail().notEmpty(),
	body('password').notEmpty(),
	validateRequest,
	authController.verifyLogin,
	authController.generateTokens,
	sendSuccessMessageHandler('Logged in')
);

/**
 * @openapi
 * /auth/logout:
 *  post:
 *   summary: Allows a user to log out.
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   responses:
 *    '200':
 *     description: 'Successfully logged out'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ResultMessage'
 *    '401':
 *     description: 'Logout failed, tokens were invalid'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ResultMessage'
 */
authRouter.post('/logout', authController.logout);

/**
 * @openapi
 * /auth/refresh:
 *  post:
 *   summary: Allows users to refresh their auth tokens in order to stay logged in.
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   responses:
 *    '200':
 *     description: Successfully refreshed the auth token
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ResultMessage'
 *    '400':
 *     description: "Auth/Refresh token wasn't present"
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ResultMessage'
 */
authRouter.post(
	'/refresh',
	cookie('auth').notEmpty().contains('JWT '),
	cookie('reft').notEmpty().isJWT(),
	validateRequest,
	authController.refreshAuthToken
);

export default authRouter;
