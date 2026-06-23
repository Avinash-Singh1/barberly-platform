"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = exports.AppError = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const env_1 = require("../config/env");
class AppError extends Error {
    statusCode;
    message;
    isOperational;
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
const errorHandler = (error, req, res, next) => {
    // Zod validation errors
    if (error instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: 'Validation failed',
            details: error.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }
    // Prisma errors
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0] || 'field';
            return res.status(409).json({
                error: `${field} already exists`,
            });
        }
        // Record not found
        if (error.code === 'P2025') {
            return res.status(404).json({
                error: 'Resource not found',
            });
        }
    }
    // Application errors
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: error.message,
        });
    }
    // Default to 500 server error
    console.error('❌ Unhandled error:', error);
    return res.status(500).json({
        error: env_1.env.isDevelopment ? error.message : 'Internal server error',
        ...(env_1.env.isDevelopment && { stack: error.stack }),
    });
};
exports.errorHandler = errorHandler;
// Async error wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=error.middleware.js.map