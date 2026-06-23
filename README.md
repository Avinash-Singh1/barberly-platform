# 🪒 Barberly Platform - Complete Booking System

A comprehensive barber shop booking platform built with **Node.js**, **Express**, **Prisma ORM**, **PostgreSQL**, and **Angular**. This monorepo includes admin portal, barber app, and customer booking interface.

![Platform Status](https://img.shields.io/badge/Status-Active%20Development-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)
![License](https://img.shields.io/badge/License-ISC-yellow)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Database Setup & Seeding](#database-setup--seeding)
- [Starting the Application](#starting-the-application)
- [Login Credentials](#login-credentials)
- [Project Structure](#project-structure)
- [Key URLs](#key-urls)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Available Scripts](#available-scripts)

---

## ✨ Features

### 🛡️ Admin Portal
- Complete dashboard with analytics
- User management (customers & barbers)
- Shop and location management
- Service and pricing management
- Appointment oversight and management
- Review and rating management
- Permission and role configuration
- Content management system (CMS)

### 💈 Barber App
- Personal dashboard with earnings
- Appointment management
- Service management and pricing
- Professional profile management
- Shop/location management
- Customer reviews and ratings
- Service portfolio and gallery
- Real-time notifications

### 👤 Customer Booking
- Browse available barbers
- View shop locations and services
- Real-time appointment booking
- Payment processing
- Appointment history and management
- Reviews and ratings
- Barber profile browsing
- Service recommendations

### 🔒 Security Features
- JWT authentication with refresh tokens
- Bcrypt password hashing
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation with Zod

### 📊 Additional Features
- Real-time notifications (Socket.io)
- Email notifications (Nodemailer)
- File upload with Multer
- API documentation with Swagger
- Database migrations with Prisma

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL 15
- **ORM:** Prisma
- **Authentication:** JWT
- **Security:** Bcrypt, Helmet, CORS, Rate Limiting
- **Real-time:** Socket.io
- **Email:** Nodemailer
- **File Upload:** Multer
- **API Docs:** Swagger/OpenAPI
- **Validation:** Zod

### Frontend
- **Framework:** Angular
- **Build Tool:** Nx monorepo
- **Styling:** CSS
- **HTTP Client:** Angular HttpClient
- **State Management:** Angular Services

### DevOps
- **Containerization:** Docker
- **Database Container:** PostgreSQL 15
- **Package Manager:** npm

---

## 🏗️ Architecture

```
barberly-platform (Nx Monorepo)
├── apps/
│   ├── admin/                    # Admin Portal (Angular)
│   ├── backend/                  # Backend API (Express.js)
│   └── customer-barber/          # Customer & Barber App (Angular)
├── libs/
│   ├── shared-auth/              # Authentication utilities
│   ├── shared-models/            # Data models
│   ├── shared-ui/                # Reusable UI components
│   └── shared-utils/             # Helper functions
└── prisma/
    ├── schema.prisma             # Database schema
    ├── seed.ts                   # Seed script
    └── migrations/               # Database migrations
```

---

## 📦 Prerequisites

Before starting, ensure you have:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v9 or higher (comes with Node.js)
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** (for version control)
- **Code Editor** (VS Code recommended)

### Verify Installation

```bash
node --version      # Should be v18+
npm --version       # Should be v9+
docker --version    # Should show Docker version
git --version       # Should show Git version
```

---

## 🚀 Installation Guide

### Step 1: Clone Repository (Skip if already cloned)

```bash
# Navigate to desired directory
cd d:\Avinash_V2\Barberly

# If cloning from GitHub
git clone <repository-url>
cd barberly-platform
```

### Step 2: Install Root Dependencies

```bash
# Install monorepo dependencies
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd apps/backend
npm install
cd ../..
```

### Step 4: Install Frontend Dependencies

```bash
cd apps/customer-barber
npm install
cd ../..
```

### Step 5: Setup Environment Variables

Create `.env` file in `apps/backend/`:

```env
# Database
DATABASE_URL="postgresql://barberly_user:barberly_pass@localhost:5432/barberly_db"

# Server
PORT=3000
NODE_ENV=development

# JWT Secrets
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_here_min_32_chars
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# Email (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@barberly.com

# CORS
CORS_ORIGIN=http://localhost:4200

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🗄️ Database Setup & Seeding

### Step 1: Start PostgreSQL Container

**Option A: Using Docker (Recommended)**

```bash
docker run --name barberly-postgres \
  -e POSTGRES_USER=barberly_user \
  -e POSTGRES_PASSWORD=barberly_pass \
  -e POSTGRES_DB=barberly_db \
  -p 5432:5432 \
  -d postgres:15
```

**Option B: Windows Batch File (If available)**

```bash
start-postgres.bat
```

**Verify Container is Running:**

```bash
docker ps
```

You should see `barberly-postgres` in the output.

### Step 2: Generate Prisma Client

```bash
cd apps/backend
npm run prisma:generate
```

### Step 3: Run Database Migrations

```bash
npm run prisma:migrate
```

This will create all tables based on the Prisma schema.

### Step 4: Seed Database with Sample Data

**Option A: TypeScript Seed Script (Recommended)**

```bash
npm run prisma:seed
```

**Option B: Using psql (if installed)**

```bash
# Windows PowerShell
$env:PGPASSWORD="barberly_pass"
psql -h localhost -U barberly_user -d barberly_db -f prisma/seed.ts

# Or use manual script below
```

**Option C: Manual SQL Insert**

Open Prisma Studio and use the SQL console:

```bash
npm run prisma:studio
```

Then execute the seed data SQL from the section below.

---

## 📊 Seed Data Overview

The database includes comprehensive sample data:

### Users (11 Total)
- **1 Admin** - admin@barberly.com
- **5 Barbers** - Professional profiles with ratings (4.5-4.9 stars)
- **5 Customers** - Ready for booking

### Shops (3 Total)
- Downtown Barbershop (New York)
- West Side Cuts (Los Angeles)
- Classic Cuts & Shaves (Chicago)

### Services (19 Total)
- Haircuts, Fades, Beard Services
- Hot Towel Shaves, Hair Coloring
- Treatments, Styling, and Combo Packages
- Prices: $25 - $150

### Appointments (11 Sample)
- 4 Completed (Past)
- 4 Confirmed (Today/Upcoming)
- 2 Pending
- 1 Cancelled

### Reviews (8 Sample)
- Ratings: 3-5 stars
- Customer feedback with tags
- Barber replies

### Gallery (12 Images)
- Professional portfolio photos
- Work samples for each barber

**Default Password for All Users:** `Password123!`

---

## ▶️ Starting the Application

### Quick Start (All-in-One)

**Terminal 1 - Start Backend:**

```bash
cd apps/backend
npm run dev
```

**Terminal 2 - Start Frontend:**

```bash
cd apps/customer-barber
npm start
```

**Wait for:**
- Backend: `Server running on port 3000`
- Frontend: `Angular Live Development Server listening on localhost:4200`

### Step-by-Step Start

#### 1. Start PostgreSQL (if not running)

```bash
# Check if container exists
docker ps -a | findstr barberly-postgres

# If it exists but not running
docker start barberly-postgres

# If not exists, create it (see Database Setup section)
```

#### 2. Start Backend API

```bash
cd apps/backend
npm run dev
```

**Expected Output:**
```
[Backend] Prisma Client generated ✓
[Backend] Server running on port 3000
[Backend] Database connected ✓
[Backend] Routes initialized
```

#### 3. Start Frontend Application

Open new terminal:

```bash
cd apps/customer-barber
npm start
```

**Expected Output:**
```
[Frontend] ✔ Angular Live Development Server listening on localhost:4200
[Frontend] Application bundle generated successfully
```

#### 4. Open Application

**Main Application:** http://localhost:4200/

---

## 🔐 Login Credentials

**Universal Password:** `Password123!`

### Admin Access
- **Email:** admin@barberly.com
- **URL:** http://localhost:4200/admin/dashboard
- **Permissions:** Full system access

### Barber Access
- **Email:** john.smith@barberly.com
- **URL:** http://localhost:4200/barber/dashboard
- **Permissions:** Manage own profile, appointments, services

Alternative Barbers:
- david.brown@barberly.com
- emma.davis@barberly.com
- james.wilson@barberly.com
- sophia.martinez@barberly.com

### Customer Access
- **Email:** customer1@example.com
- **URL:** http://localhost:4200/customer/bookings
- **Permissions:** Browse, book appointments, leave reviews

Alternative Customers:
- customer2@example.com
- customer3@example.com
- customer4@example.com
- customer5@example.com

---

## 📁 Project Structure

```
barberly-platform/
├── apps/
│   ├── admin/                          # Admin Portal
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── assets/
│   │   │   └── styles/
│   │   ├── angular.json
│   │   └── package.json
│   │
│   ├── backend/                        # API Server
│   │   ├── src/
│   │   │   ├── app.ts                 # Express app setup
│   │   │   ├── routes/                # API routes
│   │   │   ├── controllers/           # Request handlers
│   │   │   ├── services/              # Business logic
│   │   │   ├── middleware/            # Auth, validation
│   │   │   ├── utils/                 # Helper functions
│   │   │   └── types/                 # TypeScript types
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # Database schema
│   │   │   ├── seed.ts                # Seed data script
│   │   │   └── migrations/            # DB migrations
│   │   ├── .env.example
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── customer-barber/                # Customer & Barber App
│       ├── src/
│       │   ├── app/
│       │   │   ├── customer/          # Customer pages
│       │   │   ├── barber/            # Barber pages
│       │   │   └── shared/            # Shared components
│       │   └── assets/
│       ├── angular.json
│       └── package.json
│
├── libs/
│   ├── shared-auth/                   # Auth module
│   │   └── src/lib/
│   ├── shared-models/                 # Data models
│   │   └── src/lib/
│   ├── shared-ui/                     # UI components
│   │   └── src/lib/
│   └── shared-utils/                  # Utilities
│       └── src/lib/
│
├── .gitignore                          # Git ignore rules
├── nx.json                             # Nx configuration
├── package.json                        # Root dependencies
├── tsconfig.base.json                  # TypeScript base config
├── README.md                           # This file
└── [Documentation Files]
    ├── QUICK_START.md
    ├── START_APPLICATION_GUIDE.md
    ├── USER_CREDENTIALS.md
    ├── DATABASE_SEED_GUIDE.md
    ├── API_REFERENCE.md
    └── ...
```

---

## 🌐 Key URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Main App** | http://localhost:4200/ | Customer booking interface |
| **Admin Portal** | http://localhost:4200/admin/dashboard | Admin management |
| **Barber Dashboard** | http://localhost:4200/barber/dashboard | Barber operations |
| **Backend API** | http://localhost:3000/ | API server |
| **API Docs** | http://localhost:3000/api-docs | Swagger documentation |
| **Prisma Studio** | (local) | Database GUI |
| **Database** | localhost:5432 | PostgreSQL connection |

---

## 📚 API Documentation

### Generate API Docs

```bash
cd apps/backend
npm run dev
```

Visit: **http://localhost:3000/api-docs**

### Key API Endpoints

#### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - User login
POST   /api/auth/refresh       - Refresh JWT token
POST   /api/auth/logout        - User logout
GET    /api/auth/profile       - Get current user profile
```

#### Appointments
```
GET    /api/appointments       - List appointments
POST   /api/appointments       - Create appointment
GET    /api/appointments/:id   - Get appointment details
PUT    /api/appointments/:id   - Update appointment
DELETE /api/appointments/:id   - Cancel appointment
```

#### Barbers
```
GET    /api/barbers           - List all barbers
GET    /api/barbers/:id       - Get barber profile
PUT    /api/barbers/:id       - Update barber profile
GET    /api/barbers/:id/services - Get barber services
```

#### Services
```
GET    /api/services          - List all services
POST   /api/services          - Create service (admin)
PUT    /api/services/:id      - Update service (admin)
DELETE /api/services/:id      - Delete service (admin)
```

#### Shops
```
GET    /api/shops             - List all shops
POST   /api/shops             - Create shop (admin)
PUT    /api/shops/:id         - Update shop (admin)
```

---

## 🐛 Troubleshooting

### Issue: Port 3000 Already in Use

```bash
# Windows - Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use a different port by setting PORT in .env
```

### Issue: PostgreSQL Connection Failed

```bash
# Check if container is running
docker ps | findstr barberly-postgres

# Check container logs
docker logs barberly-postgres

# Verify connection string in .env
# DATABASE_URL="postgresql://barberly_user:barberly_pass@localhost:5432/barberly_db"

# Test connection
psql -h localhost -U barberly_user -d barberly_db -c "SELECT 1"
```

### Issue: Prisma Schema Out of Sync

```bash
# Regenerate Prisma Client
cd apps/backend
npm run prisma:generate

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Issue: CORS Errors

**Ensure Frontend URL is in Backend .env:**

```env
CORS_ORIGIN=http://localhost:4200
```

### Issue: Module Not Found Errors

```bash
# Reinstall all dependencies
rm -r node_modules apps/*/node_modules
npm install
cd apps/backend && npm install
cd ../customer-barber && npm install
```

### Issue: Build Fails

```bash
# Clear Nx cache
npx nx reset

# Rebuild
npm run build:backend
```

### Issue: Database Migrations Failed

```bash
# Check migration status
cd apps/backend
npx prisma migrate status

# View schema
npx prisma studio

# Reset database (if safe to do)
npx prisma migrate reset
```

---

## 📋 Available Scripts

### Root Commands

```bash
# Install all dependencies
npm install

# Install backend and frontend deps
npm run install:all

# Start backend dev server
npm run dev:backend

# Build backend
npm run build:backend

# Start backend production
npm run start:backend
```

### Backend Commands

```bash
cd apps/backend

# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Production start
npm start

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Seed database
npm run prisma:seed
```

### Frontend Commands

```bash
cd apps/customer-barber

# Development server
npm start

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

---

## 📝 Environment Variables Reference

### Backend .env Template

```env
# DATABASE
DATABASE_URL=postgresql://user:password@host:port/database

# SERVER
PORT=3000
NODE_ENV=development

# AUTHENTICATION
JWT_SECRET=your_secret_key_min_32_characters_long_here_12345
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_characters_here_123
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# EMAIL
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@barberly.com

# CORS
CORS_ORIGIN=http://localhost:4200

# RATE LIMITING
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# FILE UPLOAD
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

---

## 🔄 Development Workflow

### Making Changes

1. **Backend Changes**
   - Edit files in `apps/backend/src/`
   - Dev server auto-reloads with `npm run dev`

2. **Frontend Changes**
   - Edit files in `apps/customer-barber/src/`
   - Angular dev server auto-reloads

3. **Database Changes**
   - Update `apps/backend/prisma/schema.prisma`
   - Run: `npm run prisma:migrate`
   - Regenerate client: `npm run prisma:generate`

### Committing Code

```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "feat: description of changes"

# Push
git push origin main
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Commit with descriptive messages
5. Push to your branch
6. Create a Pull Request

---

## 📞 Support & Contact

- **Documentation:** See markdown files in project root
- **Issues:** Check GitHub Issues
- **Questions:** Review API_REFERENCE.md and other guides

---

## 📄 License

ISC License - See LICENSE file for details

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Docker running with PostgreSQL
- [ ] Backend starts without errors on port 3000
- [ ] Frontend loads on http://localhost:4200
- [ ] Can login with admin@barberly.com / Password123!
- [ ] Can browse barbers and services
- [ ] Can create appointment as customer
- [ ] Barber can view appointments
- [ ] Admin can manage users and services

---

## 📈 Next Steps

After successful setup:

1. **Explore Admin Portal** - Manage users, services, shops
2. **Book Appointment** - Test customer booking flow
3. **Check API Docs** - http://localhost:3000/api-docs
4. **Review Database** - Open Prisma Studio
5. **Customize Services** - Add your barber services
6. **Setup Email** - Configure SMTP in .env

---

## 📚 Additional Documentation

- [Quick Start](./QUICK_START.md) - Fast reference guide
- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Admin Portal Guide](./ADMIN_PORTAL_GUIDE.md) - Admin features
- [Database Seed Guide](./DATABASE_SEED_GUIDE.md) - Seed data details
- [Barber Portal Guide](./BARBER_APPOINTMENTS_GUIDE.md) - Barber features
- [User Credentials](./USER_CREDENTIALS.md) - All test accounts

---

**Happy coding! 🎉**

*Last Updated: June 23, 2026*
*Version: 1.0.0*
```

### Development

```bash
# Start backend API
npm run dev:backend

# Start customer-barber app
npm run dev:customer-barber

# Start admin app
npm run dev:admin
```

### Build

```bash
# Build all apps
npm run build

# Build specific app
npm run build:customer-barber
npm run build:admin
npm run build:backend
```

## Development Phases

- ✅ Phase 1: Foundation & Auth (Current)
- ⏳ Phase 2: Customer Booking Flow
- ⏳ Phase 3: Barber Portal
- ⏳ Phase 4: Admin Dashboard
- ⏳ Phase 5: Real-time & Polish

## API Documentation

Once the backend is running, visit: http://localhost:3000/api-docs

## License

Proprietary
