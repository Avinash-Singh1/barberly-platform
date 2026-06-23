import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const createReviewSchema = z.object({
  body: z.object({
    appointmentId: z.string().uuid('Invalid appointment ID'),
    rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000),
    tags: z.array(z.string()).optional()
  })
});

const replyToReviewSchema = z.object({
  body: z.object({
    reply: z.string().min(10, 'Reply must be at least 10 characters').max(500)
  })
});

const schemas = {
  create: createReviewSchema,
  reply: replyToReviewSchema
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
