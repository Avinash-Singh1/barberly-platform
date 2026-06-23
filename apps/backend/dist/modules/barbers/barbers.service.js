"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.barbersService = exports.BarbersService = void 0;
const database_1 = require("../../config/database");
const error_middleware_1 = require("../../middleware/error.middleware");
class BarbersService {
    /**
     * Search barbers with filters and pagination
     */
    async searchBarbers(filters) {
        const { searchTerm, serviceIds, minPrice, maxPrice, minRating, city, page = 1, limit = 10, sortBy = 'rating', sortOrder = 'desc' } = filters;
        const skip = (page - 1) * limit;
        // Build where clause
        const where = {
            user: {
                isActive: true,
                role: 'BARBER'
            },
            status: 'ACTIVE',
            // Search term in name or bio
            ...(searchTerm && {
                OR: [
                    {
                        user: {
                            OR: [
                                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                                { lastName: { contains: searchTerm, mode: 'insensitive' } }
                            ]
                        }
                    },
                    { bio: { contains: searchTerm, mode: 'insensitive' } }
                ]
            }),
            // Filter by services
            ...(serviceIds && serviceIds.length > 0 && {
                services: {
                    some: {
                        id: { in: serviceIds }
                    }
                }
            }),
            // Filter by rating
            ...(minRating && {
                rating: { gte: minRating }
            }),
            // Filter by city
            ...(city && {
                city: { equals: city, mode: 'insensitive' }
            })
        };
        // Build orderBy
        let orderBy = {};
        if (sortBy === 'rating') {
            orderBy = { rating: sortOrder };
        }
        else if (sortBy === 'experience') {
            orderBy = { experience: sortOrder };
        }
        // Execute query
        const [barbers, total] = await Promise.all([
            database_1.prisma.barberProfile.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                            avatar: true
                        }
                    },
                    services: {
                        where: {
                            isActive: true,
                            ...(minPrice !== undefined && maxPrice !== undefined && {
                                price: {
                                    gte: minPrice,
                                    lte: maxPrice
                                }
                            })
                        },
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            duration: true
                        }
                    },
                    gallery: {
                        take: 4,
                        orderBy: { createdAt: 'desc' }
                    }
                }
            }),
            database_1.prisma.barberProfile.count({ where })
        ]);
        return {
            data: barbers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    /**
     * Get barber profile by ID with full details
     */
    async getBarberProfile(barberId) {
        const barber = await database_1.prisma.barberProfile.findUnique({
            where: { id: barberId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        avatar: true,
                        createdAt: true
                    }
                },
                services: {
                    where: { isActive: true },
                    orderBy: { price: 'asc' }
                },
                gallery: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!barber) {
            throw new error_middleware_1.AppError('Barber not found', 404);
        }
        if (barber.status !== 'ACTIVE') {
            throw new error_middleware_1.AppError('Barber profile is not available', 403);
        }
        // Get review stats
        const reviewStats = await this.getReviewStats(barberId);
        return {
            ...barber,
            reviewStats
        };
    }
    /**
     * Get barber services
     */
    async getBarberServices(barberId) {
        const barber = await database_1.prisma.barberProfile.findUnique({
            where: { id: barberId },
            select: { id: true, status: true }
        });
        if (!barber) {
            throw new error_middleware_1.AppError('Barber not found', 404);
        }
        const services = await database_1.prisma.service.findMany({
            where: {
                barberId,
                isActive: true
            },
            orderBy: [
                { price: 'asc' }
            ]
        });
        // Group by name prefix or return as-is
        return services;
    }
    /**
     * Get available time slots for a barber on a specific date
     */
    async getAvailability(barberId, query) {
        const { date, serviceId } = query;
        // Get barber's service to know duration
        const service = await database_1.prisma.service.findFirst({
            where: { id: serviceId, barberId }
        });
        if (!service) {
            throw new error_middleware_1.AppError('Service not found for this barber', 404);
        }
        // Get barber's availability for this day (0=Sunday, 1=Monday, ..., 6=Saturday)
        const dayOfWeek = date.getDay();
        const availability = await database_1.prisma.availability.findFirst({
            where: {
                barberId,
                dayOfWeek,
                isActive: true
            }
        });
        if (!availability) {
            return { availableSlots: [] };
        }
        // Get existing appointments for this date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const existingAppointments = await database_1.prisma.appointment.findMany({
            where: {
                barberId,
                dateTime: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: {
                    in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
                }
            },
            select: {
                dateTime: true,
                duration: true
            }
        });
        // Generate time slots
        const slots = this.generateTimeSlots(availability.startTime, availability.endTime, service.duration, existingAppointments, date);
        return { availableSlots: slots };
    }
    /**
     * Get barber reviews
     */
    async getBarberReviews(barberId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [reviews, total, stats] = await Promise.all([
            database_1.prisma.review.findMany({
                where: { appointment: { barberId } },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    customer: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatar: true
                        }
                    },
                    appointment: {
                        select: {
                            service: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            }),
            database_1.prisma.review.count({ where: { appointment: { barberId } } }),
            this.getReviewStats(barberId)
        ]);
        return {
            data: reviews,
            stats,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    /**
     * Get review statistics for a barber
     */
    async getReviewStats(barberId) {
        const reviews = await database_1.prisma.review.findMany({
            where: { appointment: { barberId } },
            select: { rating: true }
        });
        if (reviews.length === 0) {
            return {
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            };
        }
        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
        const ratingDistribution = reviews.reduce((acc, review) => {
            acc[review.rating] = (acc[review.rating] || 0) + 1;
            return acc;
        }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
        return {
            totalReviews,
            averageRating: Math.round(averageRating * 10) / 10,
            ratingDistribution
        };
    }
    /**
     * Generate available time slots
     */
    generateTimeSlots(startTime, endTime, serviceDuration, bookedSlots, date) {
        const slots = [];
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        let currentTime = new Date(date);
        currentTime.setHours(startHour, startMin, 0, 0);
        const endDateTime = new Date(date);
        endDateTime.setHours(endHour, endMin, 0, 0);
        // Don't allow booking in the past
        const now = new Date();
        while (currentTime < endDateTime) {
            // Check if slot is available
            const slotEnd = new Date(currentTime.getTime() + serviceDuration * 60000);
            const isBooked = bookedSlots.some((appointment) => {
                const appointmentStart = new Date(appointment.dateTime);
                const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration * 60000);
                // Check for overlap
                return ((currentTime >= appointmentStart && currentTime < appointmentEnd) ||
                    (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
                    (currentTime <= appointmentStart && slotEnd >= appointmentEnd));
            });
            // Only add if not booked and not in the past
            if (!isBooked && currentTime > now) {
                slots.push(currentTime.toISOString());
            }
            // Move to next slot (30 min intervals)
            currentTime = new Date(currentTime.getTime() + 30 * 60000);
        }
        return slots;
    }
    /**
     * Get featured barbers (highest rated)
     */
    async getFeaturedBarbers(limit = 6) {
        const barbers = await database_1.prisma.barberProfile.findMany({
            where: {
                status: 'ACTIVE',
                user: { isActive: true }
            },
            take: limit,
            orderBy: [
                { rating: 'desc' },
                { reviewCount: 'desc' }
            ],
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                },
                services: {
                    where: { isActive: true },
                    take: 3,
                    select: {
                        name: true,
                        price: true
                    }
                }
            }
        });
        return barbers;
    }
}
exports.BarbersService = BarbersService;
exports.barbersService = new BarbersService();
//# sourceMappingURL=barbers.service.js.map