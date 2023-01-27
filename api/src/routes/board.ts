import { Router } from 'express';
import { body, oneOf, param } from 'express-validator';
import authController from '../controllers/auth.js';
import boardController from '../controllers/board.js';
import validateRequest from '../middleware/validateRequest.js';

const boardRouter = Router();

/**
 * @openapi
 * /board/:
 *  get:
 *   summary: Responds with user's boards.
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   responses:
 *    '200':
 *     description: 'OK'
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/PartialBoard'
 */
boardRouter.get('/', authController.verifyToken, boardController.getBoards);

/**
 * @openapi
 * /board/:
 *  post:
 *   summary: Creates a new board. Responds with the new board's data.
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
 *        name:
 *         type: string
 *         description: Board's name
 *         example: New board
 *   responses:
 *    '201':
 *     description: 'Board created'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         board:
 *          $ref: '#/components/schemas/Board'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
boardRouter.post(
	'/',
	body('name').isString(),
	validateRequest,
	authController.verifyToken,
	boardController.createBoard
);

/**
 * @openapi
 * /board/{boardId}:
 *  get:
 *   summary: Responds with the board's data.
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   parameters:
 *    - in: path
 *      name: boardId
 *      schema:
 *       type: string
 *      required: true
 *      description: ObjectId of the board
 *   responses:
 *    '200':
 *     description: 'Board found'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         board:
 *          $ref: '#/components/schemas/Board'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
boardRouter.get(
	'/:boardId',
	param('boardId').isMongoId(),
	validateRequest,
	authController.verifyToken,
	boardController.getBoard
);

/**
 * @openapi
 * /board/{boardId}:
 *  post:
 *   summary: Updates a board. Responds with the updated board object.
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   parameters:
 *    - in: path
 *      name: boardId
 *      schema:
 *       type: string
 *      required: true
 *      description: ObjectId of the board
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         description: Board's new name
 *         example: New new board
 *         nullable: true
 *        description:
 *         type: string
 *         description: Board's new description
 *         example: New description.
 *         nullable: true
 *        listsOrder:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/ObjectId'
 *         description: New display order for lists
 *         nullable: true
 *   responses:
 *    '200':
 *     description: 'Board updated'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         board:
 *          $ref: '#/components/schemas/Board'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
boardRouter.post(
	'/:boardId',
	param('boardId').isMongoId(),
	oneOf([body('name').not().exists(), body('name').isString().notEmpty()]),
	oneOf([
		body('description').not().exists(),
		body('description').isString().notEmpty(),
	]),
	oneOf([
		body('listsOrder').not().exists(),
		body('listsOrder').isArray().notEmpty(),
	]),
	validateRequest,
	authController.verifyToken,
	boardController.updateBoard
);

/**
 * @openapi
 * /board/{boardId}:
 *  delete:
 *   summary: Deletes the board. Responds with deleted board's data.
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   parameters:
 *    - in: path
 *      name: boardId
 *      schema:
 *       type: string
 *      required: true
 *      description: ObjectId of the board
 *   responses:
 *    '200':
 *     description: 'Board deleted'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         board:
 *          $ref: '#/components/schemas/Board'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
boardRouter.delete(
	'/:boardId',
	param('boardId').isMongoId(),
	validateRequest,
	authController.verifyToken,
	boardController.deleteBoard
);

export default boardRouter;
