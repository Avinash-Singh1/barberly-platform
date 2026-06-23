# Barberly Platform - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites Check

```bash
# Check Node.js (need 18+)
node --version

# Check PostgreSQL (need 14+)
psql --version

# Check npm
npm --version
```

## Step 1: Install Backend Dependencies

```bash
cd apps/backend
npm install
```

**Expected time:** 1-2 minutes

## Step 2: Set Up Database

### Option A: Local PostgreSQL (Recommended for Windows)

1. Open **pgAdmin** or **psql**
2. Create database:

```sql
CREATE DATABASE barberly_db;
```

3. Copy environment file:

```bash
cd apps/backend
copy .env.example .env
```

4. Edit `.env` with your database details:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/barberly_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production-minimum-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-also-change-in-production-32-chars"
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:4201
```

### Option B: Docker PostgreSQL (Alternative)

```bash
docker run --name barberly-postgres ^
  -e POSTGRES_DB=barberly_db ^
  -e POSTGRES_PASSWORD=postgres ^
  -p 5432:5432 ^
  -d postgres:14
```

## Step 3: Run Database Migrations

```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
```

This creates all the tables. **Expected time:** 30 seconds

## Step 4: Start the Backend

```bash
npm run dev
```

You should see:

```
🚀 Barberly API Server Started

📡 Server running on: http://localhost:3000
📚 API Docs: http://localhost:3000/api-docs
🏥 Health check: http://localhost:3000/health

Environment: development

Ready to accept requests!
```

## Step 5: Test the API

Open your browser and visit:
- **API Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### Test with curl (or use Swagger UI):

**Register a customer:**
```bash
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"customer@test.com\",\"password\":\"Test123456\",\"firstName\":\"John\",\"lastName\":\"Doe\",\"role\":\"CUSTOMER\"}"
```

**Register a barber:**
```bash
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"barber@test.com\",\"password\":\"Test123456\",\"firstName\":\"Mike\",\"lastName\":\"Smith\",\"role\":\"BARBER\"}"
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"customer@test.com\",\"password\":\"Test123456\"}"
```

Copy the `accessToken` from the response.

**Get profile (replace YOUR_TOKEN):**
```bash
curl http://localhost:3000/api/auth/profile ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✅ Phase 1 Complete!

You now have:
- ✅ Database with all tables
- ✅ Working authentication API
- ✅ JWT access + refresh tokens
- ✅ Role-based access (CUSTOMER, BARBER, ADMIN)
- ✅ API documentation
- ✅ Error handling and validation

---

## 🎯 What's Next?

### Immediate Next Steps:

1. **Explore the API** using Swagger UI at http://localhost:3000/api-docs
2. **View the database** using Prisma Studio:
   ```bash
   cd apps/backend
   npm run prisma:studio
   ```
   Opens at http://localhost:5555

3. **Read the implementation plan**: `IMPLEMENTATION_PLAN.md`

### Phase 2: Build Customer Booking Flow

1. Create the Angular customer-barber app
2. Add barbers search module to backend
3. Add appointments module to backend
4. Build the customer UI (home, search, barber profile, booking)

See `IMPLEMENTATION_PLAN.md` for the complete roadmap.

---

## 🔧 Useful Commands

```bash
# View all database tables in Prisma Studio
npm run prisma:studio

# Reset database (WARNING: deletes all data)
cd apps/backend
npx prisma migrate reset

# Create a new migration after schema changes
npx prisma migrate dev --name your_migration_name

# Format Prisma schema
npx prisma format

# Check database connection
npx prisma db pull
```

---

## 📚 Documentation Quick Links

- **Complete Plan**: `IMPLEMENTATION_PLAN.md`
- **Setup Guide**: `SETUP.md`
- **Project Structure**: `PROJECT_STRUCTURE.md`
- **API Docs**: http://localhost:3000/api-docs (when server running)
- **Database Schema**: `apps/backend/prisma/schema.prisma`

---

## 🐛 Troubleshooting

### Error: "Prisma Client not generated"
```bash
cd apps/backend
npm run prisma:generate
```

### Error: "Connection refused to database"
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Test connection: `psql -U postgres -d barberly_db`

### Error: "Port 3000 already in use"
- Change PORT in `.env` to another port (e.g., 3001)
- Or kill the process using port 3000

### Error: "Invalid JWT secret"
- Ensure JWT_SECRET and JWT_REFRESH_SECRET are set in `.env`
- Make them at least 32 characters long

---

## 🎉 Success Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed and running
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Prisma client generated
- [ ] Database migrations run
- [ ] Backend server starts without errors
- [ ] http://localhost:3000/health returns `{"status":"ok"}`
- [ ] http://localhost:3000/api-docs loads Swagger UI
- [ ] Can register and login via API
- [ ] Prisma Studio opens at http://localhost:5555

If all checked, **you're ready to build!** 🚀

---

## 💡 Tips

1. **Use Swagger UI** - It's easier than curl for testing APIs
2. **Keep Prisma Studio open** - Great for viewing data in real-time
3. **Check server logs** - They show all SQL queries in development mode
4. **Use Postman** - Better than curl for complex API testing
5. **Read the schema** - `schema.prisma` has all entity relationships

---

## 🆘 Need Help?

1. Check the error message carefully
2. Look at server logs in the terminal
3. Check `SETUP.md` for detailed troubleshooting
4. Verify all environment variables are set
5. Ensure PostgreSQL is running and accessible

---

**Ready to build the future of barber bookings!** 💈✨
