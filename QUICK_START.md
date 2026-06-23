# Barberly Platform - Quick Start Reference

## 🚀 Start Application (3 Commands)

```bash
# 1. Start Database (if not running)
docker start barberly-postgres

# 2. Start Backend (Terminal 1)
cd apps/backend && npm run dev

# 3. Start Frontend (Terminal 2)
cd apps/customer-barber && npm start
```

**Open Browser:** http://localhost:4200/

---

## 🔐 Login Credentials (Password: **Password123!**)

| Role | Email | Dashboard |
|------|-------|-----------|
| **Admin** | admin@barberly.com | /admin/dashboard |
| **Barber** | john.smith@barberly.com | /barber/dashboard |
| **Customer** | customer1@example.com | /customer/bookings |

**All users password:** `Password123!`

---

## 🗄️ First Time Setup Only

```bash
# 1. Create PostgreSQL Container
docker run --name barberly-postgres -e POSTGRES_USER=barberly_user -e POSTGRES_PASSWORD=barberly_pass -e POSTGRES_DB=barberly_db -p 5432:5432 -d postgres:15

# 2. Setup Backend
cd apps/backend
npm install
npx prisma generate
npx prisma migrate deploy

# 3. Seed Database (Windows PowerShell)
$env:PGPASSWORD="barberly_pass"; psql -h localhost -U barberly_user -d barberly_db -f prisma/quick-seed.sql
$env:PGPASSWORD="barberly_pass"; psql -h localhost -U barberly_user -d barberly_db -f prisma/fix-remaining.sql

# 4. Setup Frontend
cd ../customer-barber
npm install
```

---

## 📍 Key URLs

- **Frontend:** http://localhost:4200/
- **Backend API:** http://localhost:3000/
- **Database:** localhost:5432
- **API Docs:** http://localhost:3000/api

---

## 🛑 Stop Application

```bash
# Stop servers: Press Ctrl+C in each terminal

# Stop database
docker stop barberly-postgres
```

---

## 🔧 Common Issues

**Port 3000 in use?**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Database not connecting?**
```bash
docker restart barberly-postgres
```

**Need fresh data?**
```bash
cd apps/backend
npx prisma migrate reset
npx prisma migrate deploy
# Then run seed scripts again
```

---

**Full Guide:** See `START_APPLICATION_GUIDE.md` for detailed instructions.
