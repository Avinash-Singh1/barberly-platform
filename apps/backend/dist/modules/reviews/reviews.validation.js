"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const createReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        appointmentId: zod_1.z.string().uuid('Invalid appointment ID'),
        rating: zod_1.z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
        comment: zod_1.z.string().min(10, 'Comment must be at least 10 characters').max(1000),
        tags: zod_1.z.array(zod_1.z.string()).optional()
    })
});
const replyToReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        reply: zod_1.z.string().min(10, 'Reply must be at least 10 characters').max(500)
    })
});
const schemas = {
    create: createReviewSchema,
    reply: replyToReviewSchema
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
//# sourceMappingURL=reviews.validation.js.map