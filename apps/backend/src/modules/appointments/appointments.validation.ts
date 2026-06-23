import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const createAppointmentSchema = z.object({
  body: z.object({
    barberId: z.string().uuid('Invalid barber ID'),
    serviceId: z.string().uuid('Invalid service ID'),
    appointmentDate: z.string().datetime('Invalid date format'),
    notes: z.string().max(500).optional()
  })
});

const rescheduleAppointmentSchema = z.object({
  body: z.object({
    newAppointmentDate: z.string().datetime('Invalid date format')
  })
});

const schemas = {
  create: createAppointmentSchema,
  reschedule: rescheduleAppointmentSchema
};

export const validateRequest = (schemaName: keyof typeof schemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schemas[schemaName].parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
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
