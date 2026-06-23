# 🗄️ Barberly Database Seed Guide

## ✅ What Was Fixed

### 1. App Component Template
**File:** `apps/customer-barber/src/app/app.component.html`

**Before:** Angular default starter template with logo and links  
**After:** Clean Barberly application structure with navbar, router-outlet, and footer

The application now properly displays your Barberly content!

---

## 📦 Seed Data Created

**File:** `apps/backend/prisma/seed.sql`

### Data Included:

**Users (11 total):**
- 1 Admin account
- 5 Barber accounts
- 5 Customer accounts
- All passwords: `Password123!`

**Barber Profiles (5):**
- Mike Johnson - 10 years exp, Rating 4.8
- David Brown - 8 years exp, Rating 4.7
- Emma Davis - 12 years exp, Rating 4.9
- James Wilson - 15 years exp, Rating 4.6
- Sophia Martinez - 6 years exp, Rating 4.5

**Shops (3):**
- Downtown Barbershop (New York)
- West Side Cuts (Los Angeles)
- Classic Cuts & Shaves (Chicago)

**Services (19):**
- Haircuts, Fades, Beard Services
- Hot Towel Shaves, Hair Coloring
- Treatments, Styling, Combos
- Prices range from $25 to $150

**Appointments (11):**
- 4 Completed (past)
- 4 Confirmed (today and upcoming)
- 2 Pending
- 1 Cancelled

**Reviews (8):**
- Ratings from 3 to 5 stars
- With comments and tags
- Some with barber replies

**Gallery Images (12):**
- Professional portfolio photos
- Work samples for each barber

---

## 🚀 How to Use the Seed Data

### Step 1: Start PostgreSQL
```cmd
# Make sure Docker Desktop is running, then:
start-postgres.bat

# Or manually:
docker run --name barberly-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=barberly -p 5432:5432 -d postgres:15
```

### Step 2: Setup Backend
```cmd
cd apps\backend

# Install dependencies (if not done)
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# This creates all tables
```

### Step 3: Run Seed File
```cmd
# Option 1: Using psql (if installed)
psql -U postgres -h localhost -d barberly -f prisma\seed.sql

# Option 2: Using Docker
docker exec -i barberly-postgres psql -U postgres -d barberly < prisma\seed.sql

# Option 3: Copy and paste into Prisma Studio SQL console
npx prisma studio
# Then go to SQL tab and paste the contents
```

### Step 4: Verify Data
```cmd
# Open Prisma Studio
npx prisma studio

# Or connect with psql
psql -U postgres -h localhost -d barberly

# Run verification queries
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "BarberProfile";
SELECT COUNT(*) FROM "Appointment";
```

### Step 5: Start Backend Server
```cmd
cd apps\backend
npm run dev

# Backend will run on http://localhost:3000
```

---

## 👤 Test Accounts

### Admin Account
- **Email:** admin@barberly.com
- **Password:** Password123!
- **Access:** Full admin dashboard

### Barber Accounts
- mike.johnson@barberly.com
- david.brown@barberly.com
- emma.davis@barberly.com
- james.wilson@barberly.com
- sophia.martinez@barberly.com
- **Password (all):** Password123!

### Customer Accounts
- john.doe@example.com
- jane.smith@example.com
- alex.johnson@example.com
- maria.garcia@example.com
- robert.chen@example.com
- **Password (all):** Password123!

---

## 🎯 What You Can Do Now

### As a Customer:
1. **Browse Barbers** - See all 5 barbers with ratings and services
2. **View Profiles** - See detailed profiles with galleries
3. **Book Appointments** - Choose from 19 different services
4. **View Bookings** - See your appointment history
5. **Write Reviews** - Rate and review completed appointments

### As a Barber:
1. **Dashboard** - View today's appointments and stats
2. **Manage Appointments** - Confirm, start, complete appointments
3. **Manage Services** - Add, edit, delete your services
4. **View Reviews** - See customer reviews and reply
5. **Earnings** - Track your earnings from appointments

### As an Admin:
1. **Dashboard** - View platform-wide stats
2. **Manage Barbers** - Approve/reject barber applications
3. **Manage Customers** - View customer list and activity
4. **Manage Shops** - Add and manage shop locations
5. **Moderate Reviews** - Flag or remove inappropriate reviews
6. **View Analytics** - See booking trends and revenue

---

## 📊 Database Schema Overview

```
User (Authentication)
  ├── BarberProfile (Barber details)
  │   ├── Service (Barber services)
  │   ├── BarberAvailability (Work schedule)
  │   ├── GalleryImage (Portfolio)
  │   ├── ShopAssignment (Shop assignments)
  │   ├── Appointment (via barberId)
  │   └── Review (via barberId)
  │
  ├── Appointment (as customer)
  │   └── Review (Appointment reviews)
  │
  └── Review (as customer)

Shop (Physical locations)
  ├── ShopAssignment (Barbers)
  └── Appointment (Shop bookings)
```

---

## 🔧 Troubleshooting

### Issue: "psql command not found"
**Solution:** Use Docker method or install PostgreSQL client

### Issue: "password authentication failed"
**Solution:** Check your .env file database URL:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/barberly?schema=public"
```

### Issue: "relation does not exist"
**Solution:** Run migrations first:
```cmd
npx prisma migrate dev
```

### Issue: "duplicate key value"
**Solution:** Clear existing data first:
```sql
TRUNCATE TABLE "Review", "Appointment", "Service", "BarberAvailability", 
         "GalleryImage", "ShopAssignment", "Shop", "BarberProfile", "User" 
         RESTART IDENTITY CASCADE;
```

---

## 🎨 Frontend is Now Clean

Your Angular app component now shows only:
- Navbar (with login/register)
- Main content area (router-outlet)
- Footer

No more Angular default template!

**Refresh your browser at http://localhost:4200/ to see the changes!**

---

## 📝 Next Steps

1. ✅ Start PostgreSQL
2. ✅ Run migrations
3. ✅ Run seed file
4. ✅ Start backend server
5. ✅ Login with test account
6. ✅ Explore all features!

---

## 🎉 You're All Set!

You now have:
- Clean frontend without Angular template
- Comprehensive seed data
- 11 test accounts to use
- 11 appointments to work with
- 8 reviews to read
- 19 services to book

**Happy testing! 🚀**
