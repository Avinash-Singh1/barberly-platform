# 🚀 Barberly Platform - Quick Setup Checklist

Fast reference checklist to get your Barberly platform running in minutes!

---

## ⚡ Prerequisites Check (5 min)

- [ ] Node.js v18+ installed
  ```bash
  node --version  # Should be v18+
  ```

- [ ] npm v9+ installed
  ```bash
  npm --version   # Should be v9+
  ```

- [ ] Docker Desktop installed and running
  ```bash
  docker --version
  docker ps       # Should work without errors
  ```

- [ ] Git installed (optional, for version control)
  ```bash
  git --version
  ```

---

## 🏗️ Initial Setup (5-10 min)

### Step 1: Start Database
```bash
# Start PostgreSQL container
docker run --name barberly-postgres \
  -e POSTGRES_USER=barberly_user \
  -e POSTGRES_PASSWORD=barberly_pass \
  -e POSTGRES_DB=barberly_db \
  -p 5432:5432 \
  -d postgres:15

# Verify running
docker ps  # Should show barberly-postgres
```

**⏱️ Expected Time:** 1-2 minutes

### Step 2: Install Dependencies
```bash
# Navigate to project
cd d:\Avinash_V2\Barberly\barberly-platform

# Root dependencies
npm install

# Backend dependencies
cd apps/backend && npm install && cd ../..

# Frontend dependencies  
cd apps/customer-barber && npm install && cd ../..
```

**⏱️ Expected Time:** 5-10 minutes (depends on internet speed)

### Step 3: Setup Environment
```bash
# Create .env in apps/backend
# Copy content below to apps/backend/.env

DATABASE_URL="postgresql://barberly_user:barberly_pass@localhost:5432/barberly_db"
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here_min_32_chars_12345
JWT_REFRESH_SECRET=your_refresh_secret_key_here_min_32_chars_123
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=http://localhost:4200
```

**⏱️ Expected Time:** 2 minutes

### Step 4: Setup Database
```bash
cd apps/backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

**⏱️ Expected Time:** 2-3 minutes

---

## ▶️ Running the Application (5 min)

### Terminal 1: Backend API
```bash
cd apps/backend
npm run dev
```

**Wait for:** `Server running on port 3000`

### Terminal 2: Frontend App
```bash
cd apps/customer-barber
npm start
```

**Wait for:** `Angular Live Development Server listening on localhost:4200`

### Terminal 3 (Optional): Prisma Studio
```bash
cd apps/backend
npm run prisma:studio
```

**Open:** http://localhost:5555

---

## 🔐 Login & Test (5 min)

### Access Points

| Role | Email | Password | URL |
|------|-------|----------|-----|
| **Admin** | admin@barberly.com | Password123! | http://localhost:4200/admin |
| **Barber** | john.smith@barberly.com | Password123! | http://localhost:4200/barber |
| **Customer** | customer1@example.com | Password123! | http://localhost:4200/customer |

### Quick Test Flow

1. **Open:** http://localhost:4200
2. **Login:** Use customer account above
3. **Browse:** View available barbers
4. **Book:** Create a test appointment
5. **Logout:** Test logout functionality
6. **Login as Admin:** Check admin dashboard

---

## 📊 Post-Setup Verification

### Check All Services Running

```bash
# All should return a response:
curl http://localhost:3000                  # Backend
curl http://localhost:4200                  # Frontend  
psql -h localhost -U barberly_user -d barberly_db -c "SELECT 1"  # Database
```

### Verify Sample Data

```bash
# Open Prisma Studio
cd apps/backend
npm run prisma:studio

# Check these tables have data:
# - User (11 rows)
# - Shop (3 rows)
# - Service (19 rows)
# - Appointment (11 rows)
# - Review (8 rows)
```

### API Health Check

```bash
# Should return response:
curl http://localhost:3000/api/health
```

---

## ⏱️ Total Setup Time

| Phase | Time |
|-------|------|
| Prerequisites Check | 5 min |
| Database Setup | 3 min |
| Dependencies Install | 5-10 min |
| Environment Setup | 2 min |
| Database Migrations & Seed | 3 min |
| **Total** | **20-25 min** |

---

## 🛑 Stopping Everything

### Stop Backend
```bash
# In Backend Terminal: Press Ctrl+C
```

### Stop Frontend
```bash
# In Frontend Terminal: Press Ctrl+C
```

### Stop Prisma Studio
```bash
# In Prisma Studio Terminal: Press Ctrl+C
```

### Stop Database (Keep for next time)
```bash
docker stop barberly-postgres
```

### Restart Database Next Time
```bash
docker start barberly-postgres
```

---

## 🔧 Quick Fixes

### Port Already in Use
```bash
# Check what's using port
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port in .env:
PORT=3001
```

### Database Connection Failed
```bash
# Restart docker
docker restart barberly-postgres

# Check logs
docker logs barberly-postgres

# Verify connection string in .env
```

### Module Not Found
```bash
# Reinstall everything
rm -r node_modules
npm install
cd apps/backend && npm install && cd ../..
cd apps/customer-barber && npm install && cd ../..
```

### Prisma Out of Sync
```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
```

---

## 🎯 Features to Explore

After successful setup:

### 👤 Customer Features
- [ ] Browse barbers by location
- [ ] View barber profiles and services
- [ ] Book appointments
- [ ] Manage bookings
- [ ] Leave reviews
- [ ] View appointment history

### 💈 Barber Features
- [ ] View dashboard
- [ ] Manage appointments
- [ ] Set availability
- [ ] Update services
- [ ] View earned reviews
- [ ] Update profile

### 🛡️ Admin Features
- [ ] View analytics dashboard
- [ ] Manage users (activate/suspend)
- [ ] Manage shops and locations
- [ ] Manage services
- [ ] View all appointments
- [ ] Manage reviews
- [ ] Configure permissions

---

## 📱 API Testing

### Using Curl

```bash
# Get all barbers
curl http://localhost:3000/api/barbers

# Get all services
curl http://localhost:3000/api/services

# Get shops
curl http://localhost:3000/api/shops

# Get appointments (requires auth token)
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/appointments
```

### Using Postman

1. Import collection: See API_REFERENCE.md
2. Set base URL: http://localhost:3000
3. Configure auth with JWT token
4. Test endpoints

---

## 📚 Documentation Quick Links

- **README.md** - Full comprehensive guide
- **QUICK_START.md** - Ultra-fast reference
- **API_REFERENCE.md** - All API endpoints
- **USER_CREDENTIALS.md** - All test accounts
- **SEED_DATA_SETUP.md** - Database seeding details
- **ADMIN_PORTAL_GUIDE.md** - Admin features
- **DATABASE_SEED_GUIDE.md** - Seed data reference

---

## ✅ Final Verification Checklist

- [ ] PostgreSQL container running
- [ ] Backend API responding on port 3000
- [ ] Frontend app loading on port 4200
- [ ] Sample data loaded in database
- [ ] Can login with admin@barberly.com
- [ ] Can login with john.smith@barberly.com
- [ ] Can login with customer1@example.com
- [ ] Admin dashboard accessible
- [ ] Barber dashboard accessible
- [ ] Customer can browse barbers
- [ ] Prisma Studio opens without errors

---

## 🎉 You're All Set!

Your Barberly platform is ready for development and testing!

### Next Steps:
1. Explore the admin portal
2. Test customer booking flow
3. Review API documentation
4. Customize services for your business
5. Configure email notifications
6. Deploy to production

---

**Happy coding! 🚀**

*Setup completed: June 23, 2026*
