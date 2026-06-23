"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsController = exports.ReviewsController = void 0;
const reviews_service_1 = require("./reviews.service");
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
class ReviewsController {
    /**
     * Create review
     * POST /api/reviews
     */
    createReview = asyncHandler(async (req, res) => {
        const customerId = req.user.id;
        const { appointmentId, rating, comment, tags } = req.body;
        const review = await reviews_service_1.reviewsService.createReview({
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
    getMyReviews = asyncHandler(async (req, res) => {
        const customerId = req.user.id;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const result = await reviews_service_1.reviewsService.getMyReviews(customerId, page, limit);
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
    replyToReview = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const barberId = req.user.id;
        const { reply } = req.body;
        const review = await reviews_service_1.reviewsService.replyToReview(id, barberId, reply);
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
    deleteReview = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const customerId = req.user.id;
        await reviews_service_1.reviewsService.deleteReview(id, customerId);
        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    });
}
exports.ReviewsController = ReviewsController;
exports.reviewsController = new ReviewsController();
//# sourceMappingURL=reviews.controller.js.map