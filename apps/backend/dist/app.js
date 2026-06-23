"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const express_rate_limit_1 = tslib_1.__importDefault(require("express-rate-limit"));
const swagger_jsdoc_1 = tslib_1.__importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = tslib_1.__importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middleware/error.middleware");
// Import routers
const auth_router_1 = tslib_1.__importDefault(require("./modules/auth/auth.router"));
const barbers_router_1 = tslib_1.__importDefault(require("./modules/barbers/barbers.router"));
const appointments_router_1 = tslib_1.__importDefault(require("./modules/appointments/appointments.router"));
const reviews_router_1 = tslib_1.__importDefault(require("./modules/reviews/reviews.router"));
const app = (0, express_1.default)();
// ===== MIDDLEWARE =====
// Security headers
app.use((0, helmet_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: env_1.env.ALLOWED_ORIGINS,
    credentials: true,
}));
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
});
app.use('/api/', limiter);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ===== SWAGGER API DOCS =====
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Barberly API',
            version: '1.0.0',
            description: 'Barberly booking platform API documentation',
        },
        servers: [
            {
                url: `http://localhost:${env_1.env.PORT}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/modules/**/*.router.ts'], // Path to API docs
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// ===== ROUTES =====
app.use('/api/auth', auth_router_1.default);
app.use('/api/barbers', barbers_router_1.default);
app.use('/api/appointments', appointments_router_1.default);
app.use('/api/reviews', reviews_router_1.default);
// TODO: Add more routers as we build them
// app.use('/api/services', servicesRouter);
// app.use('/api/shops', shopsRouter);
// app.use('/api/customers', customersRouter);
// app.use('/api/earnings', earningsRouter);
// app.use('/api/notifications', notificationsRouter);
// app.use('/api/cms', cmsRouter);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// ===== ERROR HANDLING =====
app.use(error_middleware_1.errorHandler);
// ===== START SERVER =====
const PORT = env_1.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    🚀 Barberly API Server Started
    
    📡 Server running on: http://localhost:${PORT}
    📚 API Docs: http://localhost:${PORT}/api-docs
    🏥 Health check: http://localhost:${PORT}/health
    
    Environment: ${env_1.env.NODE_ENV}
    
    Ready to accept requests!
  `);
});
exports.default = app;
//# sourceMappingURL=app.js.map