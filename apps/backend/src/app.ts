import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';

// Import routers
import authRouter from './modules/auth/auth.router';
import barbersRouter from './modules/barbers/barbers.router';
import appointmentsRouter from './modules/appointments/appointments.router';
import reviewsRouter from './modules/reviews/reviews.router';

const app = express();

// ===== MIDDLEWARE =====

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
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
        url: `http://localhost:${env.PORT}`,
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

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== ROUTES =====

app.use('/api/auth', authRouter);
app.use('/api/barbers', barbersRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/reviews', reviewsRouter);

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

app.use(errorHandler);

// ===== START SERVER =====

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
    🚀 Barberly API Server Started
    
    📡 Server running on: http://localhost:${PORT}
    📚 API Docs: http://localhost:${PORT}/api-docs
    🏥 Health check: http://localhost:${PORT}/health
    
    Environment: ${env.NODE_ENV}
    
    Ready to accept requests!
  `);
});

export default app;
