import { Router } from 'express';
import { param, oneOf, body } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';
import authController from '../controllers/auth.js';
import noteController from '../controllers/note.js';

const noteRouter = Router();

/**
 * @openapi
 * /note/{noteId}:
 *  get:
 *   summary: Responds with the note's data.
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   parameters:
 *    - in: path
 *      name: noteId
 *      required: true
 *      schema:
 *       type: string
 *      description: ObjectId of the note
 *   responses:
 *    '200':
 *     description: 'Note found'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         note:
 *          $ref: '#/components/schemas/Note'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
noteRouter.get(
	'/:noteId',
	param('noteId').isMongoId(),
	validateRequest,
	authController.verifyToken,
	noteController.getNote
);

/**
 * @openapi
 * /note/{noteId}:
 *  post:
 *   summary: Updates a note. Responds with the updated note's data.
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   parameters:
 *    - in: path
 *      name: noteId
 *      required: true
 *      schema:
 *       type: string
 *      description: ObjectId of the note
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         description: Note's new name
 *         example: Do something
 *        description:
 *         type: string
 *         description: Note's new description
 *         example: We really have to do something about this.
 *        startDate:
 *         type: iso8601
 *         description: Note's new start dateTime in the ISO 8601 format
 *         example: 2021-08-28T16:16:31.305Z
 *        endTime:
 *         type: iso8601
 *         description: Note's new end dateTime in the ISO 8601 format
 *         example: 2021-08-28T16:16:31.305Z
 *        tags:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/Tag'
 *         description: Note's new tags
 *        checklistOrder:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/ObjectId'
 *         description: Note's new checklist display order
 *   responses:
 *    '200':
 *     description: 'Note updated'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         note:
 *          $ref: '#/components/schemas/Note'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
noteRouter.post(
	'/:noteId',
	param('noteId').isMongoId(),
	oneOf([body('name').not().exists(), body('name').isString().notEmpty()]),
	oneOf([
		body('description').not().exists(),
		body('description').isString().notEmpty(),
	]),
	oneOf([body('startDate').not().exists(), body('startDate').isISO8601()]),
	oneOf([body('dueDate').not().exists(), body('dueDate').isISO8601()]),
	oneOf([body('tags').not().exists(), body('tags').isArray()]),
	oneOf([
		body('checklistsOrder').not().exists(),
		body('checklistsOrder').isArray(),
	]),
	validateRequest,
	authController.verifyToken,
	noteController.updateNote
);

/**
 * @openapi
 * /note/{boardId}/{listId}:
 *  post:
 *   summary: Creates a note. Responds with the new note's data.
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   parameters:
 *    - in: path
 *      name: boardId
 *      required: true
 *      schema:
 *       type: string
 *      description: ObjectId of the board
 *    - in: path
 *      name: listId
 *      required: true
 *      schema:
 *       type: string
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
 *         description: Note's name
 *         example: Do something
 *        description:
 *         type: string
 *         description: Note's description
 *         example: We really have to do something about this.
 *        startDate:
 *         type: iso8601
 *         description: Note's start dateTime in the ISO 8601 format
 *         example: 2021-08-28T16:16:31.305Z
 *        endTime:
 *         type: iso8601
 *         description: Note's end dateTime in the ISO 8601 format
 *         example: 2021-08-28T16:16:31.305Z
 *        tags:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/Tag'
 *         description: Note's tags
 *   responses:
 *    '201':
 *     description: 'Note created'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         note:
 *          $ref: '#/components/schemas/Note'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
noteRouter.post(
	'/:boardId/:listId',
	param('boardId').isMongoId(),
	param('listId').isMongoId(),
	body('name').isString().notEmpty(),
	oneOf([
		body('description').not().exists(),
		body('description').isString().notEmpty(),
	]),
	oneOf([body('startDate').not().exists(), body('startDate').isISO8601()]),
	oneOf([body('dueDate').not().exists(), body('dueDate').isISO8601()]),
	oneOf([body('tags').not().exists(), body('tags').isArray()]),
	validateRequest,
	authController.verifyToken,
	noteController.addNote
);

/**
 * @openapi
 * /note/{noteId}:
 *  delete:
 *   summary: Deletes a note. Responds with the deleted note's data.
 *   security:
 *    - jwtAuth: []
 *      jwtRef: []
 *   parameters:
 *    - in: path
 *      name: noteId
 *      required: true
 *      schema:
 *       type: string
 *      description: ObjectId of the note
 *   responses:
 *    '200':
 *     description: 'Note deleted'
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         note:
 *          $ref: '#/components/schemas/Note'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
noteRouter.delete(
	'/:noteId',
	param('noteId').isMongoId(),
	validateRequest,
	authController.verifyToken,
	noteController.deleteNote
);

export default noteRouter;
