# Barberly Platform - Application Startup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Start PostgreSQL Database](#step-1-start-postgresql-database)
3. [Step 2: Database Setup & Seeding](#step-2-database-setup--seeding)
4. [Step 3: Start Backend Server](#step-3-start-backend-server)
5. [Step 4: Start Frontend Application](#step-4-start-frontend-application)
6. [Step 5: Access Application](#step-5-access-application)
7. [User Login Credentials](#user-login-credentials)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Docker Desktop** (for PostgreSQL)
- **npm** or **yarn**

---

## Step 1: Start PostgreSQL Database

### 1.1 Start Docker Container

Open a terminal and run:

```bash
docker run --name barberly-postgres \
  -e POSTGRES_USER=barberly_user \
  -e POSTGRES_PASSWORD=barberly_pass \
  -e POSTGRES_DB=barberly_db \
  -p 5432:5432 \
  -d postgres:15
```

**For Windows PowerShell:**
```powershell
docker run --name barberly-postgres -e POSTGRES_USER=barberly_user -e POSTGRES_PASSWORD=barberly_pass -e POSTGRES_DB=barberly_db -p 5432:5432 -d postgres:15
```

### 1.2 Verify Container is Running

```bash
docker ps
```

You should see `barberly-postgres` in the list.

### 1.3 If Container Already Exists

If you get an error that the container already exists:

```bash
# Start existing container
docker start barberly-postgres

# Or remove and recreate
docker rm barberly-postgres
# Then run the docker run command again
```

---

## Step 2: Database Setup & Seeding

### 2.1 Navigate to Backend Directory

```bash
cd apps/backend
```

### 2.2 Install Backend Dependencies

```bash
npm install
```

### 2.3 Generate Prisma Client

```bash
npx prisma generate
```

### 2.4 Run Database Migrations

This creates all necessary tables:

```bash
npx prisma migrate deploy
```

### 2.5 Seed Database with Sample Data

Run the quick seed script:

```bash
# For Windows CMD
psql -h localhost -p 5432 -U barberly_user -d barberly_db -f prisma\quick-seed.sql

# For PowerShell
$env:PGPASSWORD="barberly_pass"; psql -h localhost -p 5432 -U barberly_user -d barberly_db -f prisma/quick-seed.sql
```

**Enter password when prompted:** `barberly_pass`

Then run the fix-remaining script:

```bash
# For Windows CMD
psql -h localhost -p 5432 -U barberly_user -d barberly_db -f prisma\fix-remaining.sql

# For PowerShell
$env:PGPASSWORD="barberly_pass"; psql -h localhost -p 5432 -U barberly_user -d barberly_db -f prisma/fix-remaining.sql
```

### 2.6 Verify Seed Data

```bash
# Connect to database
psql -h localhost -p 5432 -U barberly_user -d barberly_db

# Check users
SELECT id, email, role FROM users;

# Exit psql
\q
```

---

## Step 3: Start Backend Server

### 3.1 Ensure You're in Backend Directory

```bash
cd apps/backend
```

### 3.2 Check Environment Variables

Verify `apps/backend/.env` file exists with:

```env
DATABASE_URL="postgresql://barberly_user:barberly_pass@localhost:5432/barberly_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

### 3.3 Start Backend Server

```bash
npm run dev
```

**Expected Output:**
```
🚀 Server running on http://localhost:3000
✅ Database connected successfully
```

**Keep this terminal open!**

---

## Step 4: Start Frontend Application

### 4.1 Open a NEW Terminal

Navigate to the frontend directory:

```bash
cd apps/customer-barber
```

### 4.2 Install Frontend Dependencies (First Time Only)

```bash
npm install
```

### 4.3 Start Frontend Server

```bash
npm start
```

**Expected Output:**
```
Watch mode enabled. Watching for file changes...
➜  Local:   http://localhost:4200/
```

**Keep this terminal open!**

---

## Step 5: Access Application

### 5.1 Open Browser

Navigate to: **http://localhost:4200/**

### 5.2 Available Routes

- **Home Page:** http://localhost:4200/
- **Find Barbers:** http://localhost:4200/barbers
- **Login:** http://localhost:4200/auth/login
- **Register:** http://localhost:4200/auth/register
- **Admin Dashboard:** http://localhost:4200/admin/dashboard (Admin users only)
- **Barber Dashboard:** http://localhost:4200/barber/dashboard (Barber users only)
- **Customer Bookings:** http://localhost:4200/customer/bookings (Customer users only)

---

## 🔐 User Login Credentials

All passwords: **Password123!**

### Admin User

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@barberly.com | Password123! | ADMIN | Full admin portal access |

**Admin Capabilities:**
- Manage all users
- Approve/suspend barbers
- View all appointments
- Manage shops and services
- System settings

---

### Barber Users

| Email | Password | Role | Barber Name | Status |
|-------|----------|------|-------------|--------|
| john.smith@barberly.com | Password123! | BARBER | John Smith | Active |
| jane.doe@barberly.com | Password123! | BARBER | Jane Doe | Active |
| mike.johnson@barberly.com | Password123! | BARBER | Mike Johnson | Active |
| sarah.williams@barberly.com | Password123! | BARBER | Sarah Williams | Pending |
| david.brown@barberly.com | Password123! | BARBER | David Brown | Pending |

**Barber Capabilities:**
- Manage own profile
- Set availability schedule
- View own appointments
- Upload portfolio images
- Respond to reviews

**Note:** Only Active barbers can accept bookings. Pending barbers need admin approval.

---

### Customer Users

| Email | Password | Role | Customer Name |
|-------|----------|------|---------------|
| customer1@example.com | Password123! | CUSTOMER | Alice Johnson |
| customer2@example.com | Password123! | CUSTOMER | Bob Smith |
| customer3@example.com | Password123! | CUSTOMER | Charlie Brown |
| customer4@example.com | Password123! | CUSTOMER | Diana Prince |
| customer5@example.com | Password123! | CUSTOMER | Ethan Hunt |

**Customer Capabilities:**
- Search and book barbers
- View booking history
- Leave reviews
- Manage profile
- Track appointments

---

## 🎯 Quick Test Flow

### 1. Test Customer Flow
1. Login as: `customer1@example.com` / `Password123!`
2. Browse barbers on home page
3. Click "Find Barbers" to see all available barbers
4. Select a barber and view their profile
5. Book an appointment
6. View bookings at: http://localhost:4200/customer/bookings

### 2. Test Barber Flow
1. Login as: `john.smith@barberly.com` / `Password123!`
2. Access barber dashboard: http://localhost:4200/barber/dashboard
3. View your appointments
4. Update your availability
5. Manage your services

### 3. Test Admin Flow
1. Login as: `admin@barberly.com` / `Password123!`
2. Access admin dashboard: http://localhost:4200/admin/dashboard
3. View all users, appointments, shops
4. Approve pending barbers
5. Manage system settings

---

## 🐛 Troubleshooting

### Database Connection Issues

**Problem:** Backend can't connect to database

**Solution:**
```bash
# Check if PostgreSQL container is running
docker ps

# Restart container if needed
docker restart barberly-postgres

# Check logs
docker logs barberly-postgres
```

### Port Already in Use

**Problem:** "EADDRINUSE: address already in use :::3000"

**Solution:**
```bash
# For Windows - Find process on port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Restart backend
npm run dev
```

### Backend Returns 500 Errors

**Problem:** API endpoints return 500 Internal Server Error

**Solution:**
1. Check backend terminal for error details
2. Verify database has seed data:
   ```bash
   psql -h localhost -U barberly_user -d barberly_db
   SELECT COUNT(*) FROM users;
   \q
   ```
3. Regenerate Prisma Client:
   ```bash
   cd apps/backend
   npx prisma generate
   ```

### Frontend Not Loading Data

**Problem:** Homepage shows no barbers

**Solution:**
1. Check if backend is running on http://localhost:3000
2. Open browser console (F12) to check for API errors
3. Test API directly:
   ```bash
   curl http://localhost:3000/api/barbers/featured
   ```
4. Verify CORS is enabled in backend

### Seed Script Fails

**Problem:** SQL seed scripts fail with errors

**Solution:**
1. Reset database:
   ```bash
   npx prisma migrate reset
   ```
2. Run migrations again:
   ```bash
   npx prisma migrate deploy
   ```
3. Run seed scripts in order:
   - `quick-seed.sql`
   - `fix-remaining.sql`

### Docker Container Won't Start

**Problem:** PostgreSQL container fails to start

**Solution:**
```bash
# Remove existing container
docker rm -f barberly-postgres

# Remove volume if needed
docker volume prune

# Recreate container
docker run --name barberly-postgres \
  -e POSTGRES_USER=barberly_user \
  -e POSTGRES_PASSWORD=barberly_pass \
  -e POSTGRES_DB=barberly_db \
  -p 5432:5432 \
  -d postgres:15
```

---

## 📝 Summary Checklist

- [ ] PostgreSQL container running
- [ ] Database migrations completed
- [ ] Seed data inserted
- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 4200
- [ ] Can access http://localhost:4200/
- [ ] Can login with admin credentials
- [ ] Can see barbers on homepage

---

## 🔄 Daily Startup Commands

For subsequent startups after initial setup:

```bash
# Terminal 1: Start Database
docker start barberly-postgres

# Terminal 2: Start Backend
cd apps/backend
npm run dev

# Terminal 3: Start Frontend
cd apps/customer-barber
npm start
```

Then open: **http://localhost:4200/**

---

## 📞 Need Help?

If you encounter issues not covered here:
1. Check backend terminal for error messages
2. Check frontend browser console (F12)
3. Verify all ports are available (3000, 4200, 5432)
4. Ensure Docker Desktop is running

---

**Last Updated:** June 15, 2026
**Version:** 1.0.0
