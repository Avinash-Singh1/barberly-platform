"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsController = exports.AppointmentsController = void 0;
const appointments_service_1 = require("./appointments.service");
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
class AppointmentsController {
    /**
     * Create appointment
     * POST /api/appointments
     */
    createAppointment = asyncHandler(async (req, res) => {
        const customerId = req.user.id;
        const { barberId, serviceId, dateTime, notes } = req.body;
        const appointment = await appointments_service_1.appointmentsService.createAppointment({
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
    getMyAppointments = asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const userRole = req.user.role;
        const filters = {
            userId,
            userRole,
            status: req.query.status,
            from: req.query.from ? new Date(req.query.from) : undefined,
            to: req.query.to ? new Date(req.query.to) : undefined,
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 10
        };
        const result = await appointments_service_1.appointmentsService.getMyAppointments(filters);
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
    getAppointmentDetails = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const appointment = await appointments_service_1.appointmentsService.getAppointmentDetails(id, userId, userRole);
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
    cancelAppointment = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { reason } = req.body;
        const appointment = await appointments_service_1.appointmentsService.cancelAppointment(id, userId, userRole, reason);
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
    rescheduleAppointment = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { newDateTime } = req.body;
        const appointment = await appointments_service_1.appointmentsService.rescheduleAppointment(id, userId, userRole, new Date(newDateTime));
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
    confirmAppointment = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const barberId = req.user.id;
        const appointment = await appointments_service_1.appointmentsService.confirmAppointment(id, barberId);
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
    startAppointment = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const barberId = req.user.id;
        const appointment = await appointments_service_1.appointmentsService.startAppointment(id, barberId);
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
    completeAppointment = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const barberId = req.user.id;
        const appointment = await appointments_service_1.appointmentsService.completeAppointment(id, barberId);
        res.json({
            success: true,
            message: 'Appointment completed successfully. Earnings recorded.',
            data: appointment
        });
    });
}
exports.AppointmentsController = AppointmentsController;
exports.appointmentsController = new AppointmentsController();
//# sourceMappingURL=appointments.controller.js.map