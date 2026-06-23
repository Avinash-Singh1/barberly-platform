# Barberly Platform - Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn**
- **Git**

## Step 1: Install Backend Dependencies

```bash
cd apps/backend
npm install
```

## Step 2: Set Up PostgreSQL Database

### Option A: Local PostgreSQL

1. Install PostgreSQL if you haven't already
2. Create a new database:

```sql
CREATE DATABASE barberly_db;
CREATE USER barberly_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE barberly_db TO barberly_user;
```

### Option B: Use Docker

```bash
docker run --name barberly-postgres \
  -e POSTGRES_DB=barberly_db \
  -e POSTGRES_USER=barberly_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:14
```

## Step 3: Configure Environment Variables

1. Copy the example environment file:

```bash
cd apps/backend
copy .env.example .env
```

2. Update `.env` with your database credentials:

```env
DATABASE_URL="postgresql://barberly_user:your_password@localhost:5432/barberly_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_REFRESH_SECRET=your-refresh-token-secret-also-32-characters
```

## Step 4: Run Database Migrations

```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
```

This will:
- Generate the Prisma Client
- Create all database tables based on the schema

## Step 5: (Optional) Seed Database

Create a seed file to add sample data:

```bash
cd apps/backend
npm run prisma:seed
```

## Step 6: Start the Backend Server

```bash
cd apps/backend
npm run dev
```

The server should start on `http://localhost:3000`

### Verify it's working:

1. Health check: http://localhost:3000/health
2. API Documentation: http://localhost:3000/api-docs

## Step 7: Test the API

### Register a new user:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "Test123456",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  }'
```

### Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "Test123456"
  }'
```

## Common Issues & Troubleshooting

### Issue: "Prisma Client not generated"
**Solution**: Run `npm run prisma:generate` in the backend directory

### Issue: Database connection failed
**Solution**: 
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in .env
- Check database user permissions

### Issue: Port 3000 already in use
**Solution**: Change PORT in .env or kill the process using port 3000

### Issue: JWT errors
**Solution**: Ensure JWT_SECRET and JWT_REFRESH_SECRET are set in .env

## Next Steps

Once the backend is running:

1. ✅ **Phase 1 Complete**: Auth system is ready
2. 📱 **Phase 2**: Build Angular customer-barber app
3. 🔨 **Phase 3**: Add appointments, services, and barbers modules
4. 🎨 **Phase 4**: Build admin dashboard
5. 🚀 **Phase 5**: Add real-time features with Socket.IO

## Development Workflow

```bash
# Start backend in development mode (auto-reload)
npm run dev:backend

# View database in Prisma Studio
npm run prisma:studio

# Create a new migration after schema changes
cd apps/backend
npx prisma migrate dev --name your_migration_name

# Build for production
npm run build:backend

# Start production server
npm run start:backend
```

## Project Structure Reference

```
apps/backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/                # Configuration files
│   ├── middleware/            # Express middleware
│   ├── modules/
│   │   └── auth/             # Auth module (COMPLETE)
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       ├── auth.router.ts
│   │       └── auth.validation.ts
│   └── app.ts                # Main Express app
├── .env                       # Environment variables
├── package.json
└── tsconfig.json
```

## API Endpoints (Current)

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get current user profile (requires auth)

## Database Schema

See `apps/backend/prisma/schema.prisma` for the complete schema including:
- Users & Auth
- Barber Profiles
- Customer Profiles
- Shops
- Services
- Appointments
- Reviews
- Earnings
- Notifications
- CMS Content

## Support

For issues or questions, refer to the main README.md or check the API documentation at `/api-docs`
