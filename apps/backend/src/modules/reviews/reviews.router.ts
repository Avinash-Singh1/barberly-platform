import { Router } from 'express';
import { reviewsController } from './reviews.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validateRequest } from './reviews.validation';

const router = Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a review for a completed appointment
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentId
 *               - rating
 *               - comment
 *             properties:
 *               appointmentId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid request or review already exists
 */
router.post(
  '/',
  authenticate,
  authorize('CUSTOMER'),
  validateRequest('create'),
  reviewsController.createReview
);

/**
 * @swagger
 * /api/reviews/my-reviews:
 *   get:
 *     summary: Get customer's own reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get('/my-reviews', authenticate, reviewsController.getMyReviews);

/**
 * @swagger
 * /api/reviews/{id}/reply:
 *   put:
 *     summary: Barber replies to a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reply
 *             properties:
 *               reply:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply added successfully
 */
router.put(
  '/:id/reply',
  authenticate,
  authorize('BARBER'),
  validateRequest('reply'),
  reviewsController.replyToReview
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete own review (CUSTOMER only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */
router.delete('/:id', authenticate, reviewsController.deleteReview);

export default router;
