# Barberly API - Testing Guide

This guide will help you test the complete customer booking flow end-to-end.

## Prerequisites

1. Backend server running: `npm run dev` in `apps/backend`
2. PostgreSQL database set up and migrations run
3. API testing tool (Postman, Insomnia, or curl)

## Test Scenario: Complete Booking Flow

### Step 1: Register a Customer

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "Test123456",
    "firstName": "Alice",
    "lastName": "Johnson",
    "phone": "+1234567890",
    "role": "CUSTOMER"
  }'
```

**Save the response** - you'll need the user ID.

### Step 2: Register a Barber

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mike@example.com",
    "password": "Test123456",
    "firstName": "Mike",
    "lastName": "Smith",
    "phone": "+1234567891",
    "role": "BARBER"
  }'
```

**Note:** Barber will be in PENDING approval status. For testing, you'll need to manually update the database:

```sql
-- In PostgreSQL or Prisma Studio
UPDATE "BarberProfile" 
SET "approvalStatus" = 'APPROVED',
    "bio" = 'Professional barber with 5 years experience',
    "yearsOfExperience" = 5,
    "city" = 'New York'
WHERE "userId" = 'BARBER_USER_ID';
```

### Step 3: Create Barber Availability

```sql
-- Add weekly availability for the barber
INSERT INTO "Availability" ("id", "barberId", "dayOfWeek", "startTime", "endTime", "isAvailable")
VALUES 
  (gen_random_uuid(), 'BARBER_PROFILE_ID', 'MONDAY', '09:00', '18:00', true),
  (gen_random_uuid(), 'BARBER_PROFILE_ID', 'TUESDAY', '09:00', '18:00', true),
  (gen_random_uuid(), 'BARBER_PROFILE_ID', 'WEDNESDAY', '09:00', '18:00', true),
  (gen_random_uuid(), 'BARBER_PROFILE_ID', 'THURSDAY', '09:00', '18:00', true),
  (gen_random_uuid(), 'BARBER_PROFILE_ID', 'FRIDAY', '09:00', '18:00', true),
  (gen_random_uuid(), 'BARBER_PROFILE_ID', 'SATURDAY', '10:00', '16:00', true);
```

### Step 4: Create Services

```sql
-- Add services for the barber
INSERT INTO "Service" ("id", "barberId", "name", "description", "price", "duration", "category", "isActive")
VALUES 
  (gen_random_uuid(), 'BARBER_PROFILE_ID', 'Classic Haircut', 'Traditional haircut with scissors', 30, 30, 'Haircuts', true),
  (gen_random_uuid(), 'BARBER_PROFILE_ID', 'Beard Trim', 'Professional beard shaping and trim', 20, 20, 'Beard', true),
  (gen_random_uuid(), 'BARBER_PROFILE_ID', 'Hot Towel Shave', 'Traditional straight razor shave', 40, 45, 'Shaving', true);
```

**Alternative: Use Prisma Studio**
- Run `npm run prisma:studio` in `apps/backend`
- Manually create BarberProfile, Availability, and Service records

---

## Testing the API Flow

### 1. Login as Customer

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "Test123456"
  }'
```

**Save the `accessToken` from response!**

### 2. Get Featured Barbers

```bash
curl http://localhost:3000/api/barbers/featured?limit=6
```

### 3. Search for Barbers

```bash
# Search by city
curl "http://localhost:3000/api/barbers/search?city=New%20York&minRating=4&page=1&limit=10"

# Search by name
curl "http://localhost:3000/api/barbers/search?q=Mike&page=1"
```

**Note the barber ID from results.**

### 4. View Barber Profile

```bash
curl http://localhost:3000/api/barbers/{BARBER_ID}
```

### 5. Get Barber Services

```bash
curl http://localhost:3000/api/barbers/{BARBER_ID}/services
```

**Note a service ID.**

### 6. Check Availability

```bash
# Check availability for tomorrow at the selected date
curl "http://localhost:3000/api/barbers/{BARBER_ID}/availability?date=2024-03-20&serviceId={SERVICE_ID}"
```

**Pick an available slot from the response.**

### 7. Create Appointment

```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "barberId": "BARBER_ID",
    "serviceId": "SERVICE_ID",
    "appointmentDate": "2024-03-20T10:00:00.000Z",
    "notes": "First time customer, please be gentle"
  }'
```

**Save the appointment ID.**

### 8. View My Appointments (Customer)

```bash
curl -X GET http://localhost:3000/api/appointments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Filter by status
curl "http://localhost:3000/api/appointments?status=PENDING" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 9. Get Appointment Details

```bash
curl http://localhost:3000/api/appointments/{APPOINTMENT_ID} \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 10. Reschedule Appointment (Optional)

```bash
curl -X PUT http://localhost:3000/api/appointments/{APPOINTMENT_ID}/reschedule \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newAppointmentDate": "2024-03-21T14:00:00.000Z"
  }'
```

---

## Barber Workflow

### 1. Login as Barber

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mike@example.com",
    "password": "Test123456"
  }'
```

**Save the barber's `accessToken`.**

### 2. View Appointments (Barber)

```bash
curl http://localhost:3000/api/appointments \
  -H "Authorization: Bearer BARBER_ACCESS_TOKEN"

# View only pending appointments
curl "http://localhost:3000/api/appointments?status=PENDING" \
  -H "Authorization: Bearer BARBER_ACCESS_TOKEN"
```

### 3. Confirm Appointment

```bash
curl -X PUT http://localhost:3000/api/appointments/{APPOINTMENT_ID}/confirm \
  -H "Authorization: Bearer BARBER_ACCESS_TOKEN"
```

Status changes: PENDING → CONFIRMED

### 4. Start Appointment

```bash
curl -X PUT http://localhost:3000/api/appointments/{APPOINTMENT_ID}/start \
  -H "Authorization: Bearer BARBER_ACCESS_TOKEN"
```

Status changes: CONFIRMED → IN_PROGRESS

### 5. Complete Appointment

```bash
curl -X PUT http://localhost:3000/api/appointments/{APPOINTMENT_ID}/complete \
  -H "Authorization: Bearer BARBER_ACCESS_TOKEN"
```

Status changes: IN_PROGRESS → COMPLETED  
**Earning record is automatically created!**

---

## Review Workflow

### 1. Customer Creates Review

**Note:** Can only review completed appointments!

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer CUSTOMER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentId": "APPOINTMENT_ID",
    "rating": 5,
    "comment": "Excellent service! Mike is very professional and gave me exactly the haircut I wanted. The shop is clean and the atmosphere is great. Highly recommend!",
    "tags": ["Professional", "Clean", "Friendly"]
  }'
```

**Barber's average rating is automatically updated!**

### 2. View Barber Reviews

```bash
# As customer or public
curl "http://localhost:3000/api/barbers/{BARBER_ID}/reviews?page=1&limit=10"
```

### 3. Barber Replies to Review

```bash
curl -X PUT http://localhost:3000/api/reviews/{REVIEW_ID}/reply \
  -H "Authorization: Bearer BARBER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reply": "Thank you so much for your kind words, Alice! It was a pleasure working with you. Looking forward to seeing you again!"
  }'
```

### 4. Customer Views Own Reviews

```bash
curl http://localhost:3000/api/reviews/my-reviews?page=1&limit=10 \
  -H "Authorization: Bearer CUSTOMER_ACCESS_TOKEN"
```

### 5. Customer Deletes Review (Optional)

**Note:** Only within 30 days!

```bash
curl -X DELETE http://localhost:3000/api/reviews/{REVIEW_ID} \
  -H "Authorization: Bearer CUSTOMER_ACCESS_TOKEN"
```

---

## Edge Cases to Test

### Validation Errors

**Try invalid rating:**
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer CUSTOMER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentId": "APPOINTMENT_ID",
    "rating": 6,
    "comment": "Test"
  }'
```

Expected: 400 error with validation message

### Business Rule Violations

**Try booking in the past:**
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Authorization: Bearer CUSTOMER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "barberId": "BARBER_ID",
    "serviceId": "SERVICE_ID",
    "appointmentDate": "2020-01-01T10:00:00.000Z"
  }'
```

Expected: 400 error "Appointment must be at least 1 hour from now"

**Try canceling with less than 2 hours notice:**

1. Create an appointment for 1 hour from now
2. Try to cancel it

Expected: 400 error about cancellation policy

**Try reviewing incomplete appointment:**

```bash
# Create appointment but don't complete it
# Try to review it immediately
```

Expected: 400 error "You can only review completed appointments"

### Authorization Errors

**Try accessing without token:**
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{...}'
```

Expected: 401 Unauthorized

**Try accessing other user's appointment:**
```bash
# As customer A, try to view customer B's appointment
curl http://localhost:3000/api/appointments/{CUSTOMER_B_APPOINTMENT_ID} \
  -H "Authorization: Bearer CUSTOMER_A_TOKEN"
```

Expected: 403 Forbidden

---

## Using Swagger UI

The easiest way to test is using the interactive Swagger documentation:

1. Start backend: `npm run dev`
2. Open browser: http://localhost:3000/api-docs
3. Click "Authorize" button at top
4. Enter: `Bearer YOUR_ACCESS_TOKEN`
5. Try endpoints interactively!

---

## Using Postman

### Setup

1. Create new collection "Barberly API"
2. Add environment variables:
   - `baseUrl`: http://localhost:3000
   - `customerToken`: (set after customer login)
   - `barberToken`: (set after barber login)

### Request Examples

**Register Customer:**
- Method: POST
- URL: `{{baseUrl}}/api/auth/register`
- Body (JSON):
```json
{
  "email": "alice@example.com",
  "password": "Test123456",
  "firstName": "Alice",
  "lastName": "Johnson",
  "role": "CUSTOMER"
}
```

**Login and Save Token:**
- Method: POST
- URL: `{{baseUrl}}/api/auth/login`
- Body (JSON):
```json
{
  "email": "alice@example.com",
  "password": "Test123456"
}
```
- Tests (to auto-save token):
```javascript
pm.test("Save token", function() {
    var jsonData = pm.response.json();
    pm.environment.set("customerToken", jsonData.data.accessToken);
});
```

**Search Barbers:**
- Method: GET
- URL: `{{baseUrl}}/api/barbers/search?city=New York&minRating=4`

**Create Appointment:**
- Method: POST
- URL: `{{baseUrl}}/api/appointments`
- Headers:
  - `Authorization`: `Bearer {{customerToken}}`
- Body (JSON):
```json
{
  "barberId": "uuid-here",
  "serviceId": "uuid-here",
  "appointmentDate": "2024-03-20T10:00:00.000Z"
}
```

---

## Database Inspection

### Using Prisma Studio

```bash
cd apps/backend
npm run prisma:studio
```

Opens at http://localhost:5555

You can:
- View all tables
- Browse records
- Edit data
- Create test data

### Direct SQL Queries

```bash
# Connect to PostgreSQL
psql -U barberly_user -d barberly_db

# View users
SELECT * FROM "User";

# View barber profiles
SELECT * FROM "BarberProfile";

# View appointments with details
SELECT 
  a.id,
  a.status,
  a."appointmentDate",
  cu."firstName" as customer_name,
  bu."firstName" as barber_name,
  s.name as service_name,
  a."totalPrice"
FROM "Appointment" a
JOIN "CustomerProfile" cp ON a."customerId" = cp.id
JOIN "User" cu ON cp."userId" = cu.id
JOIN "BarberProfile" bp ON a."barberId" = bp.id
JOIN "User" bu ON bp."userId" = bu.id
JOIN "Service" s ON a."serviceId" = s.id;
```

---

## Common Issues & Solutions

### Issue: "Barber not found" when searching
**Solution:** Ensure barber's approvalStatus is 'APPROVED'

### Issue: "Time slot not available"
**Solution:** Check:
1. Barber has Availability records for that day of week
2. Time is within barber's working hours
3. Time is at least 1 hour in the future
4. No overlapping appointments exist

### Issue: "Cannot review appointment"
**Solution:** Ensure:
1. Appointment status is COMPLETED
2. You are the customer on that appointment
3. No review exists yet for this appointment

### Issue: 401 Unauthorized
**Solution:** 
1. Check token is included in Authorization header
2. Token might be expired - get new one with refresh token
3. Token format: `Bearer <token>` with space

### Issue: 403 Forbidden
**Solution:**
1. Check you have correct role for endpoint
2. Ensure you're accessing your own resources

---

## Next: Frontend Integration

Once backend is tested and working:

1. **Build Angular services** to call these APIs
2. **Implement auth interceptor** to add Bearer token
3. **Create components** for each page
4. **Add error handling** for API responses
5. **Implement loading states** during API calls

Happy Testing! 🚀

