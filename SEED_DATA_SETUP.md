# 🗄️ Barberly Database Seeding Guide

Complete guide to seed your Barberly platform database with sample data for testing and development.

---

## 📋 Quick Start - Automated Seeding

### Option 1: TypeScript Seed Script (Recommended - Fastest)

This is the easiest and most reliable method:

```bash
cd apps/backend

# Ensure Prisma Client is generated
npm run prisma:generate

# Run the seed script
npm run prisma:seed
```

**Expected Output:**
```
🌱 Starting database seed...
🗑️ Cleaning existing data...
👤 Creating users...
🏪 Creating shops...
💈 Creating barber profiles...
👥 Creating customer profiles...
💇 Creating services...
📅 Creating availability...
📋 Creating appointments...
⭐ Creating reviews...
🎨 Creating gallery images...
✅ Seed completed successfully!
```

### Option 2: Using Prisma Studio SQL Console

```bash
# Open Prisma Studio
cd apps/backend
npm run prisma:studio
```

Then:
1. Click the **SQL** tab at the bottom
2. Copy and paste the SQL from the "Manual SQL Script" section below
3. Execute

---

## 👥 Sample Users Created

### Admin Account
```
Email: admin@barberly.com
Password: Password123!
Role: ADMIN
Status: ACTIVE
Permissions: Full system access
```

### Barber Accounts (5)
| Email | Name | Experience | Rating |
|-------|------|------------|--------|
| john.smith@barberly.com | John Smith | 10 years | 4.8★ |
| david.brown@barberly.com | David Brown | 8 years | 4.7★ |
| emma.davis@barberly.com | Emma Davis | 12 years | 4.9★ |
| james.wilson@barberly.com | James Wilson | 15 years | 4.6★ |
| sophia.martinez@barberly.com | Sophia Martinez | 6 years | 4.5★ |

### Customer Accounts (5)
| Email | Name |
|-------|------|
| customer1@example.com | Alice Johnson |
| customer2@example.com | Bob Williams |
| customer3@example.com | Carol Davis |
| customer4@example.com | David Martinez |
| customer5@example.com | Emma Thompson |

**All passwords:** `Password123!`

---

## 🏪 Sample Shops Created (3)

### Downtown Barbershop
- Location: New York, NY
- Phone: (555) 123-4567
- Email: downtown@barberly.com
- Barbers: John Smith, David Brown
- Hours: 9:00 AM - 7:00 PM

### West Side Cuts
- Location: Los Angeles, CA
- Phone: (555) 234-5678
- Email: westside@barberly.com
- Barbers: Emma Davis, James Wilson
- Hours: 10:00 AM - 8:00 PM

### Classic Cuts & Shaves
- Location: Chicago, IL
- Phone: (555) 345-6789
- Email: classic@barberly.com
- Barbers: Sophia Martinez
- Hours: 8:00 AM - 6:00 PM

---

## 💇 Sample Services Created (19)

### Basic Services
| Service | Price | Duration | Description |
|---------|-------|----------|-------------|
| Classic Haircut | $25 | 30 min | Standard men's haircut |
| Fade Haircut | $30 | 40 min | Skin fade with fade lines |
| Beard Trim | $15 | 15 min | Basic beard shaping |
| Full Beard Service | $35 | 45 min | Trim, shape, and edge |

### Premium Services
| Service | Price | Duration | Description |
|---------|-------|----------|-------------|
| Hot Towel Shave | $40 | 30 min | Traditional hot towel shave |
| Hair Coloring | $50 | 45 min | Full color service |
| Hair Treatments | $45 | 30 min | Deep conditioning treatment |

### Styling Services
| Service | Price | Duration | Description |
|---------|-------|----------|-------------|
| Styling | $20 | 20 min | Hair styling and finishing |
| Eyebrow Trim | $10 | 10 min | Eyebrow shaping |
| Haircut + Beard | $40 | 60 min | Combo package |

### Specialty Packages
| Service | Price | Duration | Description |
|---------|-------|----------|-------------|
| Deluxe Package | $80 | 90 min | Full haircut, beard, massage |
| VIP Experience | $150 | 120 min | All services + consultation |

---

## 📅 Sample Appointments Created (11)

### Status Breakdown
- **4 Completed** (Past appointments)
- **4 Confirmed** (Today and upcoming)
- **2 Pending** (Awaiting confirmation)
- **1 Cancelled** (Cancelled appointment)

### Sample Appointment Data
```
Appointment 1:
- Customer: Alice Johnson
- Barber: John Smith
- Service: Classic Haircut ($25)
- Status: COMPLETED
- Date: 2024-06-15 10:00 AM
- Notes: Regular customer

Appointment 2:
- Customer: Bob Williams
- Barber: Emma Davis
- Service: Fade Haircut ($30)
- Status: CONFIRMED
- Date: 2024-06-24 2:00 PM
- Notes: First time customer

[...and 9 more appointments]
```

---

## ⭐ Sample Reviews Created (8)

### Review Distribution
- **5-Star Reviews:** 3
- **4-Star Reviews:** 3
- **3-Star Reviews:** 2

### Sample Review
```
Customer: Alice Johnson
Barber: John Smith
Rating: 5 stars
Comment: "Excellent haircut! John is very professional and friendly."
Tags: Professional, Friendly, Quick Service
Barber Reply: "Thank you, Alice! Always happy to serve you."
```

---

## 🎨 Gallery Images Created (12)

Each barber has sample portfolio images:
- John Smith: 3 images
- David Brown: 3 images
- Emma Davis: 2 images
- James Wilson: 2 images
- Sophia Martinez: 2 images

---

## 🔐 Security Notes

### Password Hashing
- All passwords are hashed using bcrypt with 10 salt rounds
- Passwords are **never stored in plain text**
- Same password used for all test accounts: `Password123!`

### Test Account Credentials
```
Admin:
- Email: admin@barberly.com
- Password: Password123!

Barber Example:
- Email: john.smith@barberly.com
- Password: Password123!

Customer Example:
- Email: customer1@example.com
- Password: Password123!
```

---

## 🔄 Resetting the Database

### Option 1: Full Reset (Delete and Recreate)

```bash
cd apps/backend

# WARNING: This deletes all data!
npx prisma migrate reset

# Then reseed
npm run prisma:seed
```

### Option 2: Clean and Reseed (Keep schema)

```bash
cd apps/backend

# Opens Prisma Studio SQL console
npm run prisma:studio

# In the SQL tab, execute:
DELETE FROM "Review";
DELETE FROM "Appointment";
DELETE FROM "Availability";
DELETE FROM "Service";
DELETE FROM "GalleryImage";
DELETE FROM "ShopBarber";
DELETE FROM "BarberProfile";
DELETE FROM "CustomerProfile";
DELETE FROM "RefreshToken";
DELETE FROM "Shop";
DELETE FROM "User";

# Then run seed
npm run prisma:seed
```

### Option 3: Delete Only Appointments

```sql
-- Keep users and shops, just clear appointments
DELETE FROM "Appointment" WHERE 1=1;
DELETE FROM "Review" WHERE 1=1;
DELETE FROM "Availability" WHERE 1=1;
```

---

## 📊 Seed Data Statistics

### Database Objects Created
- **11 Users**
- **3 Shops**
- **5 Barber Profiles**
- **5 Customer Profiles**
- **19 Services**
- **~50 Availability Slots**
- **11 Appointments**
- **8 Reviews**
- **12 Gallery Images**

### Total Records: ~123

---

## ✅ Verification Steps

After seeding, verify everything:

### 1. Check Users Count
```sql
SELECT COUNT(*) as total_users FROM "User";
-- Expected: 11
```

### 2. Check Shops
```sql
SELECT id, name, city FROM "Shop";
-- Expected: 3 shops
```

### 3. Check Services
```sql
SELECT COUNT(*) as total_services FROM "Service";
-- Expected: 19
```

### 4. Check Appointments
```sql
SELECT COUNT(*) as total_appointments FROM "Appointment";
-- Expected: 11
```

### 5. Login Test
- Admin: admin@barberly.com / Password123!
- Barber: john.smith@barberly.com / Password123!
- Customer: customer1@example.com / Password123!

---

## 🛠️ Troubleshooting Seed Issues

### Issue: "Connection timeout"

```bash
# Check if PostgreSQL is running
docker ps | findstr barberly-postgres

# If not running, start it
docker start barberly-postgres

# Wait 10 seconds for startup
# Try again
npm run prisma:seed
```

### Issue: "Relation 'User' does not exist"

```bash
# Migrations haven't been run
cd apps/backend
npm run prisma:migrate

# Then seed
npm run prisma:seed
```

### Issue: "Prisma Client out of sync"

```bash
# Regenerate Prisma Client
npm run prisma:generate

# Then seed
npm run prisma:seed
```

### Issue: "Unique constraint failed"

Data might already exist. Reset first:

```bash
npm run prisma:migrate

# This will create fresh tables and then
npm run prisma:seed
```

---

## 📝 Manual SQL Script

If automated seeding fails, use this SQL (requires manual execution in Prisma Studio):

```sql
-- Delete existing data
DELETE FROM "Review";
DELETE FROM "Appointment";
DELETE FROM "Availability";
DELETE FROM "Service";
DELETE FROM "GalleryImage";
DELETE FROM "ShopBarber";
DELETE FROM "BarberProfile";
DELETE FROM "CustomerProfile";
DELETE FROM "RefreshToken";
DELETE FROM "Shop";
DELETE FROM "User";

-- Insert Admin User
INSERT INTO "User" (id, email, password, "firstName", "lastName", phone, role, status, "createdAt", "updatedAt")
VALUES (1, 'admin@barberly.com', '$2b$10$...', 'Admin', 'User', '+1234567890', 'ADMIN', 'ACTIVE', NOW(), NOW());

-- Insert Barber Users
INSERT INTO "User" (id, email, password, "firstName", "lastName", phone, role, status, "createdAt", "updatedAt")
VALUES 
(2, 'john.smith@barberly.com', '$2b$10$...', 'John', 'Smith', '+1234567891', 'BARBER', 'ACTIVE', NOW(), NOW()),
(3, 'david.brown@barberly.com', '$2b$10$...', 'David', 'Brown', '+1234567892', 'BARBER', 'ACTIVE', NOW(), NOW()),
(4, 'emma.davis@barberly.com', '$2b$10$...', 'Emma', 'Davis', '+1234567893', 'BARBER', 'ACTIVE', NOW(), NOW()),
(5, 'james.wilson@barberly.com', '$2b$10$...', 'James', 'Wilson', '+1234567894', 'BARBER', 'ACTIVE', NOW(), NOW()),
(6, 'sophia.martinez@barberly.com', '$2b$10$...', 'Sophia', 'Martinez', '+1234567895', 'BARBER', 'ACTIVE', NOW(), NOW());

-- Insert Customer Users
INSERT INTO "User" (id, email, password, "firstName", "lastName", phone, role, status, "createdAt", "updatedAt")
VALUES 
(7, 'customer1@example.com', '$2b$10$...', 'Alice', 'Johnson', '+2234567890', 'CUSTOMER', 'ACTIVE', NOW(), NOW()),
(8, 'customer2@example.com', '$2b$10$...', 'Bob', 'Williams', '+2234567891', 'CUSTOMER', 'ACTIVE', NOW(), NOW()),
(9, 'customer3@example.com', '$2b$10$...', 'Carol', 'Davis', '+2234567892', 'CUSTOMER', 'ACTIVE', NOW(), NOW()),
(10, 'customer4@example.com', '$2b$10$...', 'David', 'Martinez', '+2234567893', 'CUSTOMER', 'ACTIVE', NOW(), NOW()),
(11, 'customer5@example.com', '$2b$10$...', 'Emma', 'Thompson', '+2234567894', 'CUSTOMER', 'ACTIVE', NOW(), NOW());

-- NOTE: Password hashes shown as $2b$10$... - Use bcrypt to hash "Password123!"
```

**To get bcrypt hash for "Password123!":**
```bash
node -e "require('bcryptjs').hash('Password123!', 10, (err, hash) => console.log(hash));"
```

---

## 📚 Additional Resources

- [Database Schema](./apps/backend/prisma/schema.prisma)
- [Seed Script Source](./apps/backend/prisma/seed.ts)
- [User Credentials Guide](./USER_CREDENTIALS.md)
- [Database Setup Guide](./DATABASE_SEED_GUIDE.md)

---

## 🎯 Next Steps After Seeding

1. **Verify Login** - Test all user types
2. **Explore Admin** - Check admin dashboard
3. **Browse Services** - View all available services
4. **Create Appointment** - Book as customer
5. **Check Dashboard** - Barber appointment view
6. **View Reviews** - Check sample reviews

---

**Happy Testing! 🎉**

*Last Updated: June 23, 2026*
