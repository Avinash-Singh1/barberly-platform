import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { AppointmentStatus } from '@prisma/client';

interface CreateReviewData {
  customerId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  tags?: string[];
}

export class ReviewsService {
  /**
   * Create a review
   */
  async createReview(data: CreateReviewData) {
    const { customerId, appointmentId, rating, comment, tags } = data;

    // Get customer profile
    const customer = await prisma.customerProfile.findFirst({
      where: { userId: customerId }
    });

    if (!customer) {
      throw new AppError('Customer profile not found', 404);
    }

    // Verify appointment exists, is completed, and belongs to customer
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        barber: true,
        service: true
      }
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    if (appointment.customerId !== customer.id) {
      throw new AppError('This appointment does not belong to you', 403);
    }

    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new AppError('You can only review completed appointments', 400);
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: { appointmentId }
    });

    if (existingReview) {
      throw new AppError('You have already reviewed this appointment', 400);
    }

    // Create review
    const review = await prisma.review.create({
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
  async getMyReviews(customerId: string, page = 1, limit = 10) {
    const customer = await prisma.customerProfile.findFirst({
      where: { userId: customerId }
    });

    if (!customer) {
      throw new AppError('Customer profile not found', 404);
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
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
      prisma.review.count({ where: { customerId: customer.id } })
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
  async replyToReview(reviewId: string, barberId: string, reply: string) {
    // Get barber profile
    const barber = await prisma.barberProfile.findFirst({
      where: { userId: barberId }
    });

    if (!barber) {
      throw new AppError('Barber profile not found', 404);
    }

    // Verify review exists and belongs to this barber
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.barberId !== barber.id) {
      throw new AppError('This review does not belong to you', 403);
    }

    if (review.barberReply) {
      throw new AppError('You have already replied to this review', 400);
    }

    // Add reply
    const updatedReview = await prisma.review.update({
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
  async deleteReview(reviewId: string, customerId: string) {
    // Get customer profile
    const customer = await prisma.customerProfile.findFirst({
      where: { userId: customerId }
    });

    if (!customer) {
      throw new AppError('Customer profile not found', 404);
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.customerId !== customer.id) {
      throw new AppError('You can only delete your own reviews', 403);
    }

    // Check if review is within 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (review.createdAt < thirtyDaysAgo) {
      throw new AppError('You can only delete reviews within 30 days of posting', 400);
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewId }
    });

    // Update barber's rating
    await this.updateBarberRating(review.barberId);

    return { message: 'Review deleted successfully' };
  }

  /**
   * Update barber's average rating and total reviews
   */
  private async updateBarberRating(barberId: string) {
    const reviews = await prisma.review.findMany({
      where: { barberId },
      select: { rating: true }
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    await prisma.barberProfile.update({
      where: { id: barberId },
      data: {
        rating: Math.round(averageRating * 10) / 10,
        totalReviews
      }
    });
  }
}

export const reviewsService = new ReviewsService();
