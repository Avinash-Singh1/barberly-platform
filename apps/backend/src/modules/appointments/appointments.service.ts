import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { AppointmentStatus, Prisma } from '@prisma/client';

interface CreateAppointmentData {
  customerId: string;
  barberId: string;
  serviceId: string;
  dateTime: Date;
  notes?: string;
}

interface AppointmentFilters {
  userId: string;
  userRole: string;
  status?: AppointmentStatus;
  from?: Date;
  to?: Date;
  page?: number;
  limit?: number;
}

export class AppointmentsService {
  /**
   * Create a new appointment
   */
  async createAppointment(data: CreateAppointmentData) {
    const { customerId, barberId, serviceId, dateTime, notes } = data;

    // Verify barber exists and is active
    const barber = await prisma.barberProfile.findUnique({
      where: { id: barberId },
      include: { user: true }
    });

    if (!barber) {
      throw new AppError('Barber not found', 404);
    }

    if (barber.status !== 'ACTIVE') {
      throw new AppError('Barber is not available for bookings', 400);
    }

    // Verify service exists and belongs to barber
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        barberId,
        isActive: true
      }
    });

    if (!service) {
      throw new AppError('Service not found or not available', 404);
    }

    // Get customer profile
    const customer = await prisma.customerProfile.findFirst({
      where: { userId: customerId }
    });

    if (!customer) {
      throw new AppError('Customer profile not found', 404);
    }

    // Check if time slot is available
    const isAvailable = await this.checkTimeSlotAvailability(
      barberId,
      dateTime,
      service.duration
    );

    if (!isAvailable) {
      throw new AppError('Selected time slot is not available', 400);
    }

    // Check if appointment is at least 1 hour in the future
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    if (dateTime < oneHourFromNow) {
      throw new AppError('Appointment must be at least 1 hour from now', 400);
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        customerId,
        barberId,
        serviceId,
        dateTime,
        duration: service.duration,
        totalPrice: service.price,
        status: AppointmentStatus.PENDING,
        notes
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        barber: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        },
        service: true
      }
    });

    // TODO: Send notification to barber
    // TODO: Send confirmation email to customer

    return appointment;
  }

  /**
   * Get user appointments (customer or barber view)
   */
  async getMyAppointments(filters: AppointmentFilters) {
    const { userId, userRole, status, from, to, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    // Build where clause based on role
    let where: Prisma.AppointmentWhereInput = {};

    if (userRole === 'CUSTOMER') {
      where.customerId = userId;
    } else if (userRole === 'BARBER') {
      const barber = await prisma.barberProfile.findFirst({
        where: { userId }
      });

      if (!barber) {
        throw new AppError('Barber profile not found', 404);
      }

      where.barberId = barber.id;
    }

    // Add status filter
    if (status) {
      where.status = status;
    }

    // Add date range filter
    if (from || to) {
      where.dateTime = {};
      if (from) where.dateTime.gte = from;
      if (to) where.dateTime.lte = to;
    }

    // Execute query
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dateTime: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              phone: true
            }
          },
          barber: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true
                }
              }
            }
          },
          service: true
        }
      }),
      prisma.appointment.count({ where })
    ]);

    return {
      data: appointments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get appointment details
   */
  async getAppointmentDetails(appointmentId: string, userId: string, userRole: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        barber: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                phone: true
              }
            }
          }
        },
        service: true
      }
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Verify user has access to this appointment
    const hasAccess =
      (userRole === 'CUSTOMER' && appointment.customerId === userId) ||
      (userRole === 'BARBER' && appointment.barber.userId === userId) ||
      userRole === 'ADMIN';

    if (!hasAccess) {
      throw new AppError('You do not have access to this appointment', 403);
    }

    return appointment;
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId: string, userId: string, userRole: string, reason?: string) {
    const appointment = await this.getAppointmentDetails(appointmentId, userId, userRole);

    // Check if appointment can be cancelled
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new AppError('Cannot cancel a completed appointment', 400);
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new AppError('Appointment is already cancelled', 400);
    }

    // Check cancellation policy (e.g., at least 2 hours before)
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
    if (appointment.dateTime < twoHoursFromNow) {
      throw new AppError('Cannot cancel appointment less than 2 hours before scheduled time', 400);
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.CANCELLED,
        cancelledBy: userId,
        cancellationReason: reason
      },
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, email: true } },
        barber: { include: { user: true } },
        service: true
      }
    });

    // TODO: Send cancellation notifications

    return updatedAppointment;
  }

  /**
   * Reschedule an appointment
   */
  async rescheduleAppointment(
    appointmentId: string,
    userId: string,
    userRole: string,
    newDateTime: Date
  ) {
    const appointment = await this.getAppointmentDetails(appointmentId, userId, userRole);

    // Check if appointment can be rescheduled
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new AppError('Cannot reschedule a completed appointment', 400);
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new AppError('Cannot reschedule a cancelled appointment', 400);
    }

    // Check if new time slot is available
    const service = appointment.service;
    const isAvailable = await this.checkTimeSlotAvailability(
      appointment.barberId,
      newDateTime,
      service.duration,
      appointmentId
    );

    if (!isAvailable) {
      throw new AppError('Selected time slot is not available', 400);
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        dateTime: newDateTime,
        status: AppointmentStatus.PENDING // Reset to pending for barber confirmation
      },
      include: {
        customer: { select: { id: true, firstName: true, lastName: true } },
        barber: { include: { user: true } },
        service: true
      }
    });

    // TODO: Send notification to barber about rescheduling

    return updatedAppointment;
  }

  /**
   * Barber confirms appointment
   */
  async confirmAppointment(appointmentId: string, barberId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    const barber = await prisma.barberProfile.findFirst({
      where: { userId: barberId }
    });

    if (!barber || appointment.barberId !== barber.id) {
      throw new AppError('You do not have access to this appointment', 403);
    }

    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new AppError('Only pending appointments can be confirmed', 400);
    }

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CONFIRMED },
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, email: true } },
        service: true
      }
    });

    // TODO: Send confirmation notification to customer

    return updated;
  }

  /**
   * Barber starts appointment
   */
  async startAppointment(appointmentId: string, barberId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    const barber = await prisma.barberProfile.findFirst({
      where: { userId: barberId }
    });

    if (!barber || appointment.barberId !== barber.id) {
      throw new AppError('You do not have access to this appointment', 403);
    }

    if (appointment.status !== AppointmentStatus.CONFIRMED) {
      throw new AppError('Only confirmed appointments can be started', 400);
    }

    return await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.IN_PROGRESS }
    });
  }

  /**
   * Barber completes appointment
   */
  async completeAppointment(appointmentId: string, barberId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { service: true }
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    const barber = await prisma.barberProfile.findFirst({
      where: { userId: barberId }
    });

    if (!barber || appointment.barberId !== barber.id) {
      throw new AppError('You do not have access to this appointment', 403);
    }

    if (appointment.status !== AppointmentStatus.IN_PROGRESS) {
      throw new AppError('Only in-progress appointments can be completed', 400);
    }

    // Complete appointment and create earning record
    const [updated] = await prisma.$transaction([
      prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status: AppointmentStatus.COMPLETED
        }
      }),
      prisma.earning.create({
        data: {
          barberId: barber.id,
          appointmentId,
          grossAmount: appointment.totalPrice,
          commissionRate: barber.commission,
          commissionAmount: appointment.totalPrice * (barber.commission / 100),
          netAmount: appointment.totalPrice * (1 - barber.commission / 100)
        }
      })
    ]);

    // TODO: Send review request to customer

    return updated;
  }

  /**
   * Check if time slot is available
   */
  private async checkTimeSlotAvailability(
    barberId: string,
    dateTime: Date,
    duration: number,
    excludeAppointmentId?: string
  ): Promise<boolean> {
    const appointmentEnd = new Date(dateTime.getTime() + duration * 60000);

    const conflictingAppointments = await prisma.appointment.findMany({
      where: {
        barberId,
        id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.IN_PROGRESS]
        },
        AND: [
          {
            dateTime: {
              lt: appointmentEnd
            }
          },
          {
            dateTime: {
              gte: new Date(dateTime.getTime() - 120 * 60000) // 2 hours buffer
            }
          }
        ]
      },
      select: {
        dateTime: true,
        duration: true
      }
    });

    // Check for actual overlaps
    for (const existing of conflictingAppointments) {
      const existingEnd = new Date(
        existing.dateTime.getTime() + existing.duration * 60000
      );

      const hasOverlap =
        (dateTime >= existing.dateTime && dateTime < existingEnd) ||
        (appointmentEnd > existing.dateTime && appointmentEnd <= existingEnd) ||
        (dateTime <= existing.dateTime && appointmentEnd >= existingEnd);

      if (hasOverlap) {
        return false;
      }
    }

    return true;
  }
}

export const appointmentsService = new AppointmentsService();
