"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const createAppointmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        barberId: zod_1.z.string().uuid('Invalid barber ID'),
        serviceId: zod_1.z.string().uuid('Invalid service ID'),
        appointmentDate: zod_1.z.string().datetime('Invalid date format'),
        notes: zod_1.z.string().max(500).optional()
    })
});
const rescheduleAppointmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        newAppointmentDate: zod_1.z.string().datetime('Invalid date format')
    })
});
const schemas = {
    create: createAppointmentSchema,
    reschedule: rescheduleAppointmentSchema
};
const validateRequest = (schemaName) => {
    return (req, res, next) => {
        try {
            schemas[schemaName].parse({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.errors
                });
            }
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=appointments.validation.js.map