"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsService = exports.ReviewsService = void 0;
const database_1 = require("../../config/database");
const error_middleware_1 = require("../../middleware/error.middleware");
const client_1 = require("@prisma/client");
class ReviewsService {
    /**
     * Create a review
     */
    async createReview(data) {
        const { customerId, appointmentId, rating, comment, tags } = data;
        // Get customer profile
        const customer = await database_1.prisma.customerProfile.findFirst({
            where: { userId: customerId }
        });
        if (!customer) {
            throw new error_middleware_1.AppError('Customer profile not found', 404);
        }
        // Verify appointment exists, is completed, and belongs to customer
        const appointment = await database_1.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                barber: true,
                service: true
            }
        });
        if (!appointment) {
            throw new error_middleware_1.AppError('Appointment not found', 404);
        }
        if (appointment.customerId !== customer.id) {
            throw new error_middleware_1.AppError('This appointment does not belong to you', 403);
        }
        if (appointment.status !== client_1.AppointmentStatus.COMPLETED) {
            throw new error_middleware_1.AppError('You can only review completed appointments', 400);
        }
        // Check if review already exists
        const existingReview = await database_1.prisma.review.findFirst({
            where: { appointmentId }
        });
        if (existingReview) {
            throw new error_middleware_1.AppError('You have already reviewed this appointment', 400);
        }
        // Create review
        const review = await database_1.prisma.review.create({
            data: {
                customerId: customer.id,
                barberId: appointment.barberId,
                appointmentId,
                serviceId: appointment.serviceId,
                rating,
                comment,
                tags: tags || []
            },
            include: {
                customer: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profileImage: true
                            }
                        }
                    }
                },
                barber: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                service: {
                    select: {
                        name: true
                    }
                }
            }
        });
        // Update barber's rating and review count
        await this.updateBarberRating(appointment.barberId);
        // TODO: Send notification to barber
        return review;
    }
    /**
     * Get customer's own reviews
     */
    async getMyReviews(customerId, page = 1, limit = 10) {
        const customer = await database_1.prisma.customerProfile.findFirst({
            where: { userId: customerId }
        });
        if (!customer) {
            throw new error_middleware_1.AppError('Customer profile not found', 404);
        }
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            database_1.prisma.review.findMany({
                where: { customerId: customer.id },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    barber: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    profileImage: true
                                }
                            }
                        }
                    },
                    service: {
                        select: {
                            name: true
                        }
                    }
                }
            }),
            database_1.prisma.review.count({ where: { customerId: customer.id } })
        ]);
        return {
            data: reviews,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    /**
     * Barber replies to a review
     */
    async replyToReview(reviewId, barberId, reply) {
        // Get barber profile
        const barber = await database_1.prisma.barberProfile.findFirst({
            where: { userId: barberId }
        });
        if (!barber) {
            throw new error_middleware_1.AppError('Barber profile not found', 404);
        }
        // Verify review exists and belongs to this barber
        const review = await database_1.prisma.review.findUnique({
            where: { id: reviewId }
        });
        if (!review) {
            throw new error_middleware_1.AppError('Review not found', 404);
        }
        if (review.barberId !== barber.id) {
            throw new error_middleware_1.AppError('This review does not belong to you', 403);
        }
        if (review.barberReply) {
            throw new error_middleware_1.AppError('You have already replied to this review', 400);
        }
        // Add reply
        const updatedReview = await database_1.prisma.review.update({
            where: { id: reviewId },
            data: {
                barberReply: reply,
                repliedAt: new Date()
            },
            include: {
                customer: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profileImage: true
                            }
                        }
                    }
                },
                barber: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        });
        // TODO: Send notification to customer
        return updatedReview;
    }
    /**
     * Delete a review (customer only, within 30 days)
     */
    async deleteReview(reviewId, customerId) {
        // Get customer profile
        const customer = await database_1.prisma.customerProfile.findFirst({
            where: { userId: customerId }
        });
        if (!customer) {
            throw new error_middleware_1.AppError('Customer profile not found', 404);
        }
        const review = await database_1.prisma.review.findUnique({
            where: { id: reviewId }
        });
        if (!review) {
            throw new error_middleware_1.AppError('Review not found', 404);
        }
        if (review.customerId !== customer.id) {
            throw new error_middleware_1.AppError('You can only delete your own reviews', 403);
        }
        // Check if review is within 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        if (review.createdAt < thirtyDaysAgo) {
            throw new error_middleware_1.AppError('You can only delete reviews within 30 days of posting', 400);
        }
        // Delete review
        await database_1.prisma.review.delete({
            where: { id: reviewId }
        });
        // Update barber's rating
        await this.updateBarberRating(review.barberId);
        return { message: 'Review deleted successfully' };
    }
    /**
     * Update barber's average rating and total reviews
     */
    async updateBarberRating(barberId) {
        const reviews = await database_1.prisma.review.findMany({
            where: { barberId },
            select: { rating: true }
        });
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;
        await database_1.prisma.barberProfile.update({
            where: { id: barberId },
            data: {
                rating: Math.round(averageRating * 10) / 10,
                totalReviews
            }
        });
    }
}
exports.ReviewsService = ReviewsService;
exports.reviewsService = new ReviewsService();
//# sourceMappingURL=reviews.service.js.map