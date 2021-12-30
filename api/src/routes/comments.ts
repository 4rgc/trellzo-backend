import { Router } from 'express';
import { param, body } from 'express-validator';
import authController from '../controllers/auth';
import commentController from '../controllers/comment';
import validateRequest from '../middleware/validateRequest';

const commentRouter = Router();

commentRouter.use(authController.verifyToken);

/**
 * @openapi
 * /comment/{noteId}:
 *  get:
 *   summary: Retrieves all comments for a note.
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
 *     description: Comments retrieved
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         comments:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Comment'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
commentRouter.get(
	'/:noteId',
	param('noteId').isMongoId(),
	validateRequest,
	commentController.getComments
);

/**
 * @openapi
 * /comment/{noteId}:
 *  post:
 *   summary: Posts a comment. Returns the object of the new comment.
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
 *        contents:
 *         type: string
 *         description: Contents of the new comment
 *         example: Hello new comment
 *   responses:
 *    '200':
 *     description: Comment posted
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         comments:
 *          $ref: '#/components/schemas/Comment'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
commentRouter.post(
	'/:noteId',
	param('noteId').isMongoId(),
	body('contents').isString().notEmpty(),
	validateRequest,
	commentController.postComment
);

/**
 * @openapi
 * /comment/{noteId}/{commentId}:
 *  patch:
 *   summary: Patches a comment. Returns the object of the updated comment.
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
 *    - in: path
 *      name: commentId
 *      required: true
 *      schema:
 *       type: string
 *      description: ObjectId of the comment
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        contents:
 *         type: string
 *         description: New contents of the comment
 *         example: Hello new comment
 *   responses:
 *    '200':
 *     description: Comment posted
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         comments:
 *          $ref: '#/components/schemas/Comment'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
commentRouter.patch(
	'/:noteId/:commentId',
	param('noteId').isMongoId(),
	param('commentId').isMongoId(),
	body('contents').isString().notEmpty(),
	validateRequest,
	commentController.patchComment
);

/**
 * @openapi
 * /comment/{noteId}/{commentId}:
 *  delete:
 *   summary: Removes a comment. Responds with removed comment's data.
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
 *    - in: path
 *      name: commentId
 *      required: true
 *      schema:
 *       type: string
 *      description: ObjectId of the comment
 *   responses:
 *    '200':
 *     description: Comment removed
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         comment:
 *          $ref: '#/components/schemas/Comment'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
commentRouter.delete(
	'/:noteId/:commentId',
	param('noteId').isMongoId(),
	param('commentId').isMongoId(),
	validateRequest,
	commentController.deleteComment
);

export default commentRouter;
