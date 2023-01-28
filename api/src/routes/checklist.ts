import { Router } from 'express';
import { param, body, oneOf } from 'express-validator';
import authController from '../controllers/auth.js';
import checklistController from '../controllers/checklist.js';
import validateRequest from '../middleware/validateRequest.js';

const checklistRouter = Router();

/**
 * @openapi
 * /checklist/{noteId}/{checklistId}:
 *  post:
 *   summary: Updates a checklist. Responds with updated checklist data.
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
 *      name: checklistId
 *      required: true
 *      schema:
 *       type: string
 *      description: ObjectId of the checklist
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         description: New name for the checklist
 *         example: To-do new
 *        checkItems:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/CheckItem'
 *         description: Updated checklist items
 *        checkItemsOrder:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/ObjectId'
 *         description: New display order for the checklist items
 *   responses:
 *    '200':
 *     description: Checklist updated
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         checklist:
 *          $ref: '#/components/schemas/Checklist'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
checklistRouter.post(
	'/:noteId/:checklistId',
	param('noteId').isMongoId(),
	param('checklistId').isMongoId(),
	oneOf([body('name').not().exists(), body('name').isString()]),
	oneOf([body('checkItems').not().exists(), body('checkItems').isArray()]),
	oneOf([
		body('checkItemsOrder').not().exists(),
		body('checkItemsOrder').isArray(),
	]),
	validateRequest,
	authController.verifyToken,
	checklistController.updateChecklist
);

/**
 * @openapi
 * /checklist/{noteId}:
 *  post:
 *   summary: Adds a checklist. Responds with newly created checklist's data.
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
 *         description: Name for the new checklist
 *         example: To-do new
 *        checkItems:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/CheckItem'
 *         description: Checklist items for the new checklist
 *   responses:
 *    '201':
 *     description: Checklist created
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         checklist:
 *          $ref: '#/components/schemas/Checklist'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
checklistRouter.post(
	'/:noteId',
	param('noteId').isMongoId(),
	body('name').isString(),
	oneOf([body('checkItems').not().exists(), body('checkItems').isArray()]),
	validateRequest,
	authController.verifyToken,
	checklistController.addChecklist
);

/**
 * @openapi
 * /checklist/{noteId}/{checklistId}:
 *  delete:
 *   summary: Removes a checklist. Responds with removed checklist's data.
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
 *      name: checklistId
 *      required: true
 *      schema:
 *       type: string
 *      description: ObjectId of the checklist
 *   responses:
 *    '200':
 *     description: Checklist removed
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         checklist:
 *          $ref: '#/components/schemas/Checklist'
 *    '401':
 *     $ref: '#/components/responses/401Unauthorized'
 *    '400':
 *     $ref: '#/components/responses/400Validation'
 */
checklistRouter.delete(
	'/:noteId/:checklistId',
	param('noteId').isMongoId(),
	param('checklistId').isMongoId(),
	validateRequest,
	authController.verifyToken,
	checklistController.removeChecklist
);

export default checklistRouter;
