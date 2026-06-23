# Barberly Platform - User Credentials Reference

## 🔐 Universal Password

**All users share the same password for testing purposes:**

```
Password: Password123!
```

---

## 👨‍💼 Administrator Account

### Admin User
- **Email:** admin@barberly.com
- **Password:** Password123!
- **Role:** ADMIN
- **User ID:** 1
- **Access Level:** Full system access

### Admin Capabilities
✅ Manage all users (customers, barbers)  
✅ Approve/suspend/activate barbers  
✅ View all appointments across the platform  
✅ Manage shops and locations  
✅ Manage services and pricing  
✅ View system analytics and reports  
✅ Configure platform settings  
✅ Manage permissions and roles  
✅ View and respond to all reviews  
✅ Access CMS for content management  

### Admin Dashboard
**URL:** http://localhost:4200/admin/dashboard

### Admin Portal Sections
- Dashboard (Overview & Analytics)
- Barbers Management
- Customers Management
- Shops Management
- Services Management
- Appointments Management
- Reviews & Ratings
- Permissions & Roles
- Settings & Configuration
- CMS Content Management

---

## 💈 Barber Accounts

### Barber 1 - John Smith (ACTIVE)
- **Email:** john.smith@barberly.com
- **Password:** Password123!
- **Role:** BARBER
- **User ID:** 2
- **Barber Profile ID:** 1
- **Status:** ACTIVE ✅
- **Phone:** +1234567890
- **Specializations:** Fade Haircuts, Beard Styling
- **Experience:** 5 years
- **Rating:** 4.8/5.0
- **Shop:** Elite Cuts Downtown

### Barber 2 - Jane Doe (ACTIVE)
- **Email:** jane.doe@barberly.com
- **Password:** Password123!
- **Role:** BARBER
- **User ID:** 3
- **Barber Profile ID:** 2
- **Status:** ACTIVE ✅
- **Phone:** +1234567891
- **Specializations:** Classic Cuts, Hot Towel Shaves
- **Experience:** 8 years
- **Rating:** 4.9/5.0
- **Shop:** Elite Cuts Downtown

### Barber 3 - Mike Johnson (ACTIVE)
- **Email:** mike.johnson@barberly.com
- **Password:** Password123!
- **Role:** BARBER
- **User ID:** 4
- **Barber Profile ID:** 3
- **Status:** ACTIVE ✅
- **Phone:** +1234567892
- **Specializations:** Modern Styles, Hair Coloring
- **Experience:** 3 years
- **Rating:** 4.7/5.0
- **Shop:** Style Station Midtown

### Barber 4 - Sarah Williams (PENDING)
- **Email:** sarah.williams@barberly.com
- **Password:** Password123!
- **Role:** BARBER
- **User ID:** 5
- **Barber Profile ID:** Not created yet
- **Status:** PENDING ⏳
- **Note:** Awaiting admin approval before accepting bookings

### Barber 5 - David Brown (PENDING)
- **Email:** david.brown@barberly.com
- **Password:** Password123!
- **Role:** BARBER
- **User ID:** 6
- **Barber Profile ID:** Not created yet
- **Status:** PENDING ⏳
- **Note:** Awaiting admin approval before accepting bookings

### Barber Capabilities
✅ Manage personal profile and bio  
✅ Upload portfolio/gallery images  
✅ Set availability schedule (days/hours)  
✅ View and manage appointments  
✅ Offer and price services  
✅ Respond to customer reviews  
✅ Track earnings and tips  
✅ Update personal information  
❌ Cannot access admin features  
❌ Cannot manage other barbers  

### Barber Dashboard
**URL:** http://localhost:4200/barber/dashboard

### Barber Portal Sections
- Dashboard (Appointments & Earnings)
- My Appointments
- My Schedule (Availability)
- My Services
- My Profile
- Gallery/Portfolio
- Reviews & Ratings
- Earnings & Tips

---

## 👥 Customer Accounts

### Customer 1 - Alice Johnson
- **Email:** customer1@example.com
- **Password:** Password123!
- **Role:** CUSTOMER
- **User ID:** 7
- **Customer Profile ID:** 1
- **Phone:** +1234567893
- **Loyalty Points:** 100

### Customer 2 - Bob Smith
- **Email:** customer2@example.com
- **Password:** Password123!
- **Role:** CUSTOMER
- **User ID:** 8
- **Customer Profile ID:** 2
- **Phone:** +1234567894
- **Loyalty Points:** 50

### Customer 3 - Charlie Brown
- **Email:** customer3@example.com
- **Password:** Password123!
- **Role:** CUSTOMER
- **User ID:** 9
- **Customer Profile ID:** 3
- **Phone:** +1234567895
- **Loyalty Points:** 75

### Customer 4 - Diana Prince
- **Email:** customer4@example.com
- **Password:** Password123!
- **Role:** CUSTOMER
- **User ID:** 10
- **Customer Profile ID:** Not created yet
- **Phone:** +1234567896

### Customer 5 - Ethan Hunt
- **Email:** customer5@example.com
- **Password:** Password123!
- **Role:** CUSTOMER
- **User ID:** 11
- **Customer Profile ID:** Not created yet
- **Phone:** +1234567897

### Customer Capabilities
✅ Search and browse barbers  
✅ View barber profiles and ratings  
✅ Book appointments with available barbers  
✅ View booking history  
✅ Cancel/reschedule appointments  
✅ Leave reviews and ratings  
✅ Earn and redeem loyalty points  
✅ Manage personal profile  
✅ Receive notifications  
❌ Cannot access admin features  
❌ Cannot access barber dashboard  

### Customer Dashboard
**URL:** http://localhost:4200/customer/bookings

### Customer Portal Sections
- Browse Barbers
- My Bookings (Current & Past)
- Favorites
- My Profile
- Loyalty Points
- Notifications
- Reviews I've Written

---

## 🏪 Shop Information

### Shop 1 - Elite Cuts Downtown
- **Shop ID:** 1
- **Address:** 123 Main St, Downtown
- **Phone:** +1555000001
- **Barbers:** John Smith, Jane Doe
- **Services:** Haircut, Beard Trim, Hot Towel Shave

### Shop 2 - Style Station Midtown
- **Shop ID:** 2
- **Address:** 456 Park Ave, Midtown
- **Phone:** +1555000002
- **Barbers:** Mike Johnson
- **Services:** Haircut, Hair Coloring, Styling

---

## 💼 Services Available

| Service | Duration | Price | Available At |
|---------|----------|-------|--------------|
| Men's Haircut | 45 min | $35 | Both Shops |
| Beard Trim | 20 min | $20 | Elite Cuts Downtown |
| Hot Towel Shave | 30 min | $30 | Elite Cuts Downtown |
| Hair Coloring | 60 min | $75 | Style Station Midtown |
| Kids Haircut | 30 min | $25 | Both Shops |
| Buzz Cut | 20 min | $20 | Elite Cuts Downtown |
| Fade Haircut | 45 min | $40 | Both Shops |
| Long Hair Cut | 60 min | $45 | Style Station Midtown |
| Head Shave | 30 min | $25 | Elite Cuts Downtown |
| Hair Styling | 30 min | $35 | Style Station Midtown |

---

## 🧪 Testing Scenarios

### Scenario 1: Customer Booking Flow
1. Login as: `customer1@example.com` / `Password123!`
2. Browse barbers on homepage
3. Select "John Smith" (Active barber)
4. Choose service: "Men's Haircut"
5. Select available time slot
6. Confirm booking
7. View in "My Bookings"

### Scenario 2: Barber Managing Schedule
1. Login as: `john.smith@barberly.com` / `Password123!`
2. Go to "My Schedule"
3. Set availability for next week
4. Save changes
5. View upcoming appointments

### Scenario 3: Admin Approving Barber
1. Login as: `admin@barberly.com` / `Password123!`
2. Go to "Barbers Management"
3. Find "Sarah Williams" (Status: PENDING)
4. Click "Approve"
5. Status changes to ACTIVE
6. Sarah can now accept bookings

### Scenario 4: Customer Leaving Review
1. Login as: `customer1@example.com` / `Password123!`
2. Go to "My Bookings"
3. Find completed appointment
4. Click "Leave Review"
5. Rate 5 stars and write comment
6. Submit review

### Scenario 5: Admin Managing Services
1. Login as: `admin@barberly.com` / `Password123!`
2. Go to "Services Management"
3. View all services
4. Edit service pricing
5. Add new service
6. Assign service to shop

---

## 🔄 Password Change

All users can change their password after logging in:
1. Go to Profile Settings
2. Click "Change Password"
3. Enter current password: `Password123!`
4. Enter new password
5. Confirm new password
6. Save changes

---

## 🚨 Security Notes

⚠️ **IMPORTANT:** These credentials are for **DEVELOPMENT/TESTING ONLY**

- The universal password `Password123!` is intentionally simple for testing
- In production, enforce strong password policies
- Enable two-factor authentication
- Rotate admin credentials regularly
- Use environment-specific credentials
- Never commit passwords to version control

---

## 📊 Database Connection Info

**For Direct Database Access:**
- **Host:** localhost
- **Port:** 5432
- **Database:** barberly_db
- **Username:** barberly_user
- **Password:** barberly_pass

**Connection String:**
```
postgresql://barberly_user:barberly_pass@localhost:5432/barberly_db
```

**psql Command:**
```bash
psql -h localhost -p 5432 -U barberly_user -d barberly_db
```

---

## 📞 Quick Reference

**Need to login as...**
- Admin? → `admin@barberly.com`
- Active Barber? → `john.smith@barberly.com`
- Customer? → `customer1@example.com`
- **Password for all:** `Password123!`

**Can't remember which barber is active?**
- ✅ John Smith (john.smith@barberly.com)
- ✅ Jane Doe (jane.doe@barberly.com)
- ✅ Mike Johnson (mike.johnson@barberly.com)
- ⏳ Sarah Williams (Pending - needs admin approval)
- ⏳ David Brown (Pending - needs admin approval)

---

**Last Updated:** June 15, 2026  
**Version:** 1.0.0
