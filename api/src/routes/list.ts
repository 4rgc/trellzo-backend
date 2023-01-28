import { Router } from 'express';
import { param, body, oneOf } from 'express-validator';
import listController from '../controllers/list.js';
import authController from '../controllers/auth.js';
import validateRequest from '../middleware/validateRequest.js';

const listRouter = Router();

/**
 * @openapi
 * /list/{boardId}:
 *  post:
 *   summary: Adds a list to a board. Responds with the newly created list object.
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
 *         description: New list's name
 *         example: List 1
 *         nullable: false
 *   responses:
 *    '201':
 *     description: 'List created'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         list:
 *          $ref: '#/components/schemas/List'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
listRouter.post(
	'/:boardId',
	param('boardId').isMongoId(),
	body('name').isString().notEmpty(),
	validateRequest,
	authController.verifyToken,
	listController.addList
);

/**
 * @openapi
 * /list/{boardId}/{listId}:
 *  post:
 *   summary: Adds a list to a board. Responds with the newly created list object.
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
 *    - in: path
 *      name: listId
 *      schema:
 *       type: string
 *      required: true
 *      description: ObjectId of the list
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         description: List's new name
 *         example: New new list
 *         nullable: true
 *        description:
 *         type: string
 *         description: List's new description
 *         example: New description.
 *         nullable: true
 *        notesOrder:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/ObjectId'
 *         description: New display order for the notes in the list
 *         nullable: true
 *   responses:
 *    '200':
 *     description: 'List updated'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         list:
 *          $ref: '#/components/schemas/List'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
listRouter.post(
	'/:boardId/:listId',
	param('boardId').isMongoId(),
	param('listId').isMongoId(),
	oneOf([body('name').not().exists(), body('name').isString().notEmpty()]),
	oneOf([
		body('description').not().exists(),
		body('description').isString().notEmpty(),
	]),
	oneOf([
		body('notesOrder').not().exists(),
		body('notesOrder').isArray().notEmpty(),
	]),
	validateRequest,
	authController.verifyToken,
	listController.updateList
);

/**
 * @openapi
 * /list/{boardId}/{listId}/moveNoteTo/{otherListId}:
 *  post:
 *   summary: Moves a note from one list to another. Responds with the two lists after the update.
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
 *    - in: path
 *      name: listId
 *      schema:
 *       type: string
 *      required: true
 *      description: ObjectId of the source list
 *    - in: path
 *      name: otherListId
 *      schema:
 *       type: string
 *      required: true
 *      description: ObjectId of the destination list
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        noteId:
 *         type: string
 *         description: Id of the note
 *         example: '61252f1050f154f82b6eda40'
 *         nullable: false
 *        otherListIndex:
 *         type: number
 *         description: Index at which the note should be placed in the destination list
 *         example: 0
 *         nullable: false
 *   responses:
 *    '200':
 *     description: 'List updated'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         list:
 *          $ref: '#/components/schemas/List'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
listRouter.post(
	'/:boardId/:listId/moveNoteTo/:otherListId',
	param('boardId').isMongoId(),
	param('listId').isMongoId(),
	param('otherListId').isMongoId(),
	body('noteId').isMongoId(),
	body('otherListIndex').isNumeric(),
	validateRequest,
	authController.verifyToken,
	listController.moveNoteToList
);

/**
 * @openapi
 * /list/{boardId}/{listId}:
 *  delete:
 *   summary: Removes a list from a board. Responds with the removed list.
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   parameters:
 *    - in: path
 *      name: boardId
 *      description: ObjectId of the board
 *      schema:
 *       type: string
 *      required: true
 *    - in: path
 *      name: listId
 *      description: ObjectId of the list
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    '200':
 *     description: 'List deleted'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         list:
 *          $ref: '#/components/schemas/List'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
listRouter.delete(
	'/:boardId/:listId',
	param('boardId').isMongoId(),
	param('listId').isMongoId(),
	validateRequest,
	authController.verifyToken,
	listController.removeList
);

export default listRouter;
