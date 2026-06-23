import { Request, Response } from 'express';
import { appointmentsService } from './appointments.service';
import { AppointmentStatus } from '@prisma/client';

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export class AppointmentsController {
  /**
   * Create appointment
   * POST /api/appointments
   */
  createAppointment = asyncHandler(async (req: Request, res: Response) => {
    const customerId = req.user!.id;
    const { barberId, serviceId, dateTime, notes } = req.body;

    const appointment = await appointmentsService.createAppointment({
      customerId,
      barberId,
      serviceId,
      dateTime: new Date(dateTime),
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  });

  /**
   * Get my appointments
   * GET /api/appointments
   */
  getMyAppointments = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const filters = {
      userId,
      userRole,
      status: req.query.status as AppointmentStatus | undefined,
      from: req.query.from ? new Date(req.query.from as string) : undefined,
      to: req.query.to ? new Date(req.query.to as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };

    const result = await appointmentsService.getMyAppointments(filters);

    res.json({
      success: true,
      message: 'Appointments retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  });

  /**
   * Get appointment details
   * GET /api/appointments/:id
   */
  getAppointmentDetails = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const appointment = await appointmentsService.getAppointmentDetails(id, userId, userRole);

    res.json({
      success: true,
      message: 'Appointment details retrieved successfully',
      data: appointment
    });
  });

  /**
   * Cancel appointment
   * PUT /api/appointments/:id/cancel
   */
  cancelAppointment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { reason } = req.body;

    const appointment = await appointmentsService.cancelAppointment(id, userId, userRole, reason);

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  });

  /**
   * Reschedule appointment
   * PUT /api/appointments/:id/reschedule
   */
  rescheduleAppointment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { newDateTime } = req.body;

    const appointment = await appointmentsService.rescheduleAppointment(
      id,
      userId,
      userRole,
      new Date(newDateTime)
    );

    res.json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: appointment
    });
  });

  /**
   * Confirm appointment (BARBER only)
   * PUT /api/appointments/:id/confirm
   */
  confirmAppointment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const barberId = req.user!.id;

    const appointment = await appointmentsService.confirmAppointment(id, barberId);

    res.json({
      success: true,
      message: 'Appointment confirmed successfully',
      data: appointment
    });
  });

  /**
   * Start appointment (BARBER only)
   * PUT /api/appointments/:id/start
   */
  startAppointment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const barberId = req.user!.id;

    const appointment = await appointmentsService.startAppointment(id, barberId);

    res.json({
      success: true,
      message: 'Appointment started successfully',
      data: appointment
    });
  });

  /**
   * Complete appointment (BARBER only)
   * PUT /api/appointments/:id/complete
   */
  completeAppointment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const barberId = req.user!.id;

    const appointment = await appointmentsService.completeAppointment(id, barberId);

    res.json({
      success: true,
      message: 'Appointment completed successfully. Earnings recorded.',
      data: appointment
    });
  });
}

export const appointmentsController = new AppointmentsController();
