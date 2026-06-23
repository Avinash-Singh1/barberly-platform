import { Request, Response } from 'express';
import { reviewsService } from './reviews.service';

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export class ReviewsController {
  /**
   * Create review
   * POST /api/reviews
   */
  createReview = asyncHandler(async (req: Request, res: Response) => {
    const customerId = req.user!.id;
    const { appointmentId, rating, comment, tags } = req.body;

    const review = await reviewsService.createReview({
      customerId,
      appointmentId,
      rating,
      comment,
      tags
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  });

  /**
   * Get my reviews
   * GET /api/reviews/my-reviews
   */
  getMyReviews = asyncHandler(async (req: Request, res: Response) => {
    const customerId = req.user!.id;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await reviewsService.getMyReviews(customerId, page, limit);

    res.json({
      success: true,
      message: 'Reviews retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  });

  /**
   * Reply to review
   * PUT /api/reviews/:id/reply
   */
  replyToReview = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const barberId = req.user!.id;
    const { reply } = req.body;

    const review = await reviewsService.replyToReview(id, barberId, reply);

    res.json({
      success: true,
      message: 'Reply added successfully',
      data: review
    });
  });

  /**
   * Delete review
   * DELETE /api/reviews/:id
   */
  deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const customerId = req.user!.id;

    await reviewsService.deleteReview(id, customerId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  });
}

export const reviewsController = new ReviewsController();
