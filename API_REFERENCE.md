# Barberly API Reference

## 🔐 Authentication Endpoints

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "CUSTOMER"  // CUSTOMER | BARBER | ADMIN
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "SecurePassword123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1...",
    "user": {
      "id": "uuid",
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER"
    }
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {accessToken}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer {accessToken}

{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

---

## 💈 Barbers Endpoints

### Get Featured Barbers
```http
GET /api/barbers/featured?limit=6
```

### Search Barbers
```http
GET /api/barbers/search?q=haircut&minRating=4&city=New%20York&page=1&limit=10&sortBy=rating&sortOrder=desc

Query Parameters:
- q: Search term (optional)
- services: Comma-separated service IDs (optional)
- minPrice: Minimum service price (optional)
- maxPrice: Maximum service price (optional)
- minRating: Minimum rating (1-5) (optional)
- city: City name (optional)
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- sortBy: rating | price | experience (default: rating)
- sortOrder: asc | desc (default: desc)

Response:
{
  "success": true,
  "message": "Barbers retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "bio": "Professional barber...",
      "yearsOfExperience": 5,
      "rating": 4.8,
      "totalReviews": 120,
      "city": "New York",
      "user": {
        "firstName": "Mike",
        "lastName": "Smith",
        "profileImage": "url"
      },
      "services": [...],
      "gallery": [...]
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Get Barber Profile
```http
GET /api/barbers/{barberId}

Response includes:
- Full barber details
- All services
- Gallery images
- Shop assignments
- Review statistics
```

### Get Barber Services
```http
GET /api/barbers/{barberId}/services

Response: Services grouped by category
{
  "success": true,
  "data": {
    "Haircuts": [
      {
        "id": "uuid",
        "name": "Classic Haircut",
        "price": 30,
        "duration": 30,
        "category": "Haircuts"
      }
    ],
    "Beard": [...]
  }
}
```

### Get Barber Availability
```http
GET /api/barbers/{barberId}/availability?date=2024-03-15&serviceId={serviceId}

Response:
{
  "success": true,
  "data": {
    "availableSlots": [
      "2024-03-15T09:00:00.000Z",
      "2024-03-15T09:30:00.000Z",
      "2024-03-15T10:00:00.000Z",
      ...
    ]
  }
}
```

### Get Barber Reviews
```http
GET /api/barbers/{barberId}/reviews?page=1&limit=10

Response includes reviews with customer info and review stats
```

---

## 📅 Appointments Endpoints

### Create Appointment (CUSTOMER only)
```http
POST /api/appointments
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "barberId": "uuid",
  "serviceId": "uuid",
  "appointmentDate": "2024-03-15T10:00:00.000Z",
  "notes": "Please use scissors only"
}

Response:
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "id": "uuid",
    "status": "PENDING",
    "appointmentDate": "2024-03-15T10:00:00.000Z",
    "totalPrice": 30,
    "customer": {...},
    "barber": {...},
    "service": {...}
  }
}
```

### Get My Appointments
```http
GET /api/appointments?status=PENDING&from=2024-03-01&to=2024-03-31&page=1&limit=10
Authorization: Bearer {accessToken}

Query Parameters:
- status: PENDING | CONFIRMED | IN_PROGRESS | COMPLETED | CANCELLED | NO_SHOW
- from: Start date (YYYY-MM-DD)
- to: End date (YYYY-MM-DD)
- page: Page number
- limit: Items per page

Returns different data based on user role:
- CUSTOMER: Appointments where they are the customer
- BARBER: Appointments where they are the barber
```

### Get Appointment Details
```http
GET /api/appointments/{appointmentId}
Authorization: Bearer {accessToken}
```

### Cancel Appointment
```http
PUT /api/appointments/{appointmentId}/cancel
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "reason": "Emergency came up"
}

Rules:
- Cannot cancel if less than 2 hours before appointment
- Cannot cancel completed appointments
```

### Reschedule Appointment
```http
PUT /api/appointments/{appointmentId}/reschedule
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "newAppointmentDate": "2024-03-16T14:00:00.000Z"
}

Resets status to PENDING for barber confirmation
```

### Confirm Appointment (BARBER only)
```http
PUT /api/appointments/{appointmentId}/confirm
Authorization: Bearer {accessToken}

Changes status from PENDING to CONFIRMED
```

### Start Appointment (BARBER only)
```http
PUT /api/appointments/{appointmentId}/start
Authorization: Bearer {accessToken}

Changes status from CONFIRMED to IN_PROGRESS
```

### Complete Appointment (BARBER only)
```http
PUT /api/appointments/{appointmentId}/complete
Authorization: Bearer {accessToken}

Changes status to COMPLETED and creates earning record
```

---

## ⭐ Reviews Endpoints

### Create Review (CUSTOMER only)
```http
POST /api/reviews
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "appointmentId": "uuid",
  "rating": 5,
  "comment": "Excellent service! Very professional and skilled.",
  "tags": ["Professional", "Clean", "Friendly"]
}

Rules:
- Can only review completed appointments
- One review per appointment
- Rating must be 1-5
- Comment min 10 chars, max 1000 chars
```

### Get My Reviews
```http
GET /api/reviews/my-reviews?page=1&limit=10
Authorization: Bearer {accessToken}
```

### Reply to Review (BARBER only)
```http
PUT /api/reviews/{reviewId}/reply
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "reply": "Thank you for your kind words! Looking forward to seeing you again."
}

Rules:
- Can only reply to reviews on their own appointments
- Can only reply once
- Reply min 10 chars, max 500 chars
```

### Delete Review
```http
DELETE /api/reviews/{reviewId}
Authorization: Bearer {accessToken}

Rules:
- Can only delete own reviews
- Must be within 30 days of posting
```

---

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error, business rule violation)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## 🔑 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Access Token:** Short-lived (15 minutes)  
**Refresh Token:** Long-lived (7 days)

When access token expires, use the refresh endpoint to get a new access token.

---

## 🎭 User Roles

### CUSTOMER
- Can create appointments
- Can write reviews
- Can cancel/reschedule own appointments
- Can view own bookings

### BARBER
- Can view assigned appointments
- Can confirm/start/complete appointments
- Can reply to reviews
- Can manage own services (Phase 3)

### ADMIN
- Full access to all endpoints (Phase 4)
- Can manage users, barbers, shops, CMS

---

## 🧪 Testing with curl

### Register and Login
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test123456",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test123456"
  }'

# Save the accessToken from response
```

### Search Barbers
```bash
curl http://localhost:3000/api/barbers/search?minRating=4&page=1&limit=5
```

### Create Appointment
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "barberId": "BARBER_UUID",
    "serviceId": "SERVICE_UUID",
    "appointmentDate": "2024-03-20T10:00:00.000Z",
    "notes": "First time customer"
  }'
```

---

## 📝 Notes

1. **All dates use ISO 8601 format:** `YYYY-MM-DDTHH:mm:ss.sssZ`
2. **Pagination:** Default page=1, limit=10
3. **Rate Limiting:** 100 requests per 15 minutes per IP
4. **Swagger Docs:** Visit http://localhost:3000/api-docs for interactive API testing

---

## 🚀 Next Steps

- Start the backend: `npm run dev` in `apps/backend`
- Visit Swagger UI: http://localhost:3000/api-docs
- Test endpoints with Postman or curl
- Build the Angular frontend to consume these APIs!

