# Barberly Platform - Project Structure

## Complete Directory Tree

```
barberly-platform/
│
├── apps/
│   ├── backend/                         # Node.js Express API
│   │   ├── prisma/
│   │   │   └── schema.prisma           # ✅ Complete database schema
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── env.ts              # ✅ Environment validation
│   │   │   │   └── database.ts         # ✅ Prisma client singleton
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts  # ✅ JWT auth + role guards
│   │   │   │   └── error.middleware.ts # ✅ Global error handler
│   │   │   ├── modules/
│   │   │   │   ├── auth/               # ✅ PHASE 1 COMPLETE
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.router.ts
│   │   │   │   │   └── auth.validation.ts
│   │   │   │   ├── appointments/       # ⏳ Phase 2
│   │   │   │   ├── barbers/            # ⏳ Phase 2
│   │   │   │   ├── services/           # ⏳ Phase 3
│   │   │   │   ├── shops/              # ⏳ Phase 4
│   │   │   │   ├── customers/          # ⏳ Phase 4
│   │   │   │   ├── reviews/            # ⏳ Phase 2
│   │   │   │   ├── earnings/           # ⏳ Phase 3
│   │   │   │   ├── notifications/      # ⏳ Phase 5
│   │   │   │   └── cms/                # ⏳ Phase 4
│   │   │   └── app.ts                  # ✅ Main Express app with Swagger
│   │   ├── .env.example                # ✅ Environment template
│   │   ├── package.json                # ✅ Backend dependencies
│   │   └── tsconfig.json               # ✅ TypeScript config
│   │
│   ├── customer-barber/                 # ⏳ Angular app (Phase 2-3)
│   │   └── src/
│   │       └── app/
│   │           ├── core/
│   │           │   ├── services/
│   │           │   ├── guards/
│   │           │   └── interceptors/
│   │           ├── features/
│   │           │   ├── home/
│   │           │   ├── search/
│   │           │   ├── barber-profile/
│   │           │   ├── booking/
│   │           │   ├── my-bookings/
│   │           │   └── barber/         # Barber portal routes
│   │           │       ├── onboarding/
│   │           │       ├── dashboard/
│   │           │       ├── appointments/
│   │           │       ├── earnings/
│   │           │       ├── services/
│   │           │       └── reviews/
│   │           └── shared/
│   │               └── components/
│   │
│   └── admin/                           # ⏳ Angular app (Phase 4)
│       └── src/
│           └── app/
│               ├── layout/
│               │   ├── admin-shell.component.ts
│               │   ├── sidebar.component.ts
│               │   └── topbar.component.ts
│               ├── features/
│               │   ├── dashboard/
│               │   ├── appointments/
│               │   ├── barbers/
│               │   ├── customers/
│               │   ├── shops/
│               │   ├── services/
│               │   ├── reviews/
│               │   ├── cms/
│               │   ├── permissions/
│               │   └── settings/
│               └── shared/
│
├── libs/
│   ├── shared-ui/                       # ⏳ Phase 2
│   │   └── src/
│   │       ├── components/
│   │       │   ├── appointment-card/
│   │       │   ├── star-rating/
│   │       │   ├── avatar/
│   │       │   ├── status-badge/
│   │       │   ├── calendar-picker/
│   │       │   ├── time-slot-grid/
│   │       │   └── image-uploader/
│   │       ├── styles/
│   │       │   ├── tokens.scss         # Material Design 3 tokens
│   │       │   └── tailwind.config.js
│   │       └── index.ts
│   │
│   ├── shared-models/                   # ✅ COMPLETE
│   │   ├── src/
│   │   │   └── index.ts                # All TypeScript interfaces
│   │   └── package.json
│   │
│   ├── shared-auth/                     # ⏳ Phase 2
│   │   └── src/
│   │       ├── services/
│   │       │   └── auth.service.ts
│   │       ├── guards/
│   │       │   ├── auth.guard.ts
│   │       │   └── role.guard.ts
│   │       ├── interceptors/
│   │       │   └── auth.interceptor.ts
│   │       └── index.ts
│   │
│   └── shared-utils/                    # ⏳ Phase 2
│       └── src/
│           ├── pipes/
│           ├── validators/
│           ├── helpers/
│           └── index.ts
│
├── docs/                                # Documentation
│   ├── api/
│   ├── architecture/
│   └── guides/
│
├── .gitignore                           # ✅
├── nx.json                              # ✅ Nx workspace config
├── tsconfig.base.json                   # ✅ Base TypeScript config
├── package.json                         # ✅ Root workspace config
├── README.md                            # ✅ Project overview
├── SETUP.md                             # ✅ Installation guide
├── IMPLEMENTATION_PLAN.md               # ✅ Complete roadmap
└── PROJECT_STRUCTURE.md                 # ✅ This file
```

## Module Pattern (Backend)

Each backend module follows this structure:

```
modules/<module-name>/
├── <module>.controller.ts    # HTTP request handlers
├── <module>.service.ts       # Business logic
├── <module>.router.ts        # Express routes
├── <module>.validation.ts    # Zod schemas
└── <module>.types.ts         # TypeScript types (optional)
```

## Component Pattern (Frontend)

Each Angular feature follows this structure:

```
features/<feature-name>/
├── <feature>.component.ts    # Smart component
├── <feature>.component.html
├── <feature>.component.scss
├── <feature>.service.ts      # Feature-specific service
└── components/               # Dumb components
    ├── child-a.component.ts
    └── child-b.component.ts
```

## Shared Library Pattern

Shared libraries are imported via TypeScript path mapping:

```typescript
// In any app or lib
import { User, Appointment } from '@barberly/shared-models';
import { StarRatingComponent } from '@barberly/shared-ui';
import { AuthGuard } from '@barberly/shared-auth';
import { formatDate } from '@barberly/shared-utils';
```

## Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `apps/backend/prisma/schema.prisma` | Database schema definition | ✅ Complete |
| `apps/backend/src/app.ts` | Express app entry point | ✅ Complete |
| `apps/backend/src/config/env.ts` | Environment variables | ✅ Complete |
| `apps/backend/src/middleware/auth.middleware.ts` | JWT auth | ✅ Complete |
| `apps/backend/src/modules/auth/*` | Auth module | ✅ Complete |
| `libs/shared-models/src/index.ts` | TypeScript interfaces | ✅ Complete |
| `tsconfig.base.json` | TypeScript path mapping | ✅ Complete |
| `nx.json` | Nx workspace config | ✅ Complete |
| `.gitignore` | Git ignore rules | ✅ Complete |

## Database Schema Overview

```sql
-- Users & Authentication
users
refresh_tokens

-- Barber
barber_profiles
gallery_images
availability

-- Customer
customer_profiles

-- Shop
shops
shop_barbers
shop_images

-- Service
services

-- Booking
appointments

-- Review
reviews

-- Financial
earnings

-- Communication
notifications

-- Content Management
cms_content
system_settings
```

## API Routes Map

```
/health                         GET    Public
/api-docs                       GET    Public (Swagger UI)

/api/auth/register              POST   Public
/api/auth/login                 POST   Public
/api/auth/refresh               POST   Public
/api/auth/logout                POST   Public
/api/auth/profile               GET    Authenticated

# Phase 2
/api/barbers/search             GET    Public
/api/barbers/:id                GET    Public
/api/barbers/:id/services       GET    Public
/api/barbers/:id/availability   GET    Public
/api/appointments               POST   Customer
/api/appointments               GET    Customer/Barber/Admin
/api/reviews                    POST   Customer

# Phase 3
/api/services                   POST   Barber
/api/services/:id               PUT    Barber (own)
/api/earnings                   GET    Barber (own) / Admin

# Phase 4
/api/admin/barbers/approve      PUT    Admin
/api/admin/customers            GET    Admin
/api/admin/shops                POST   Admin
/api/admin/cms                  POST   Admin
/api/admin/settings             GET    Admin
```

## Technology Dependencies

### Backend
```json
{
  "express": "REST API framework",
  "@prisma/client": "ORM",
  "bcryptjs": "Password hashing",
  "jsonwebtoken": "JWT auth",
  "zod": "Validation",
  "helmet": "Security headers",
  "cors": "Cross-origin",
  "multer": "File uploads",
  "socket.io": "Real-time",
  "nodemailer": "Email",
  "swagger-jsdoc": "API docs"
}
```

### Frontend
```json
{
  "@angular/core": "Framework",
  "@angular/material": "UI components",
  "tailwindcss": "Styling",
  "@ngrx/signals": "State management",
  "socket.io-client": "Real-time",
  "chart.js": "Charts"
}
```

## Development Commands

```bash
# Backend
npm run dev:backend              # Start dev server
npm run prisma:generate          # Generate Prisma client
npm run prisma:migrate           # Run migrations
npm run prisma:studio            # Open Prisma Studio

# Frontend (after setup)
npm run dev:customer-barber      # Start customer+barber app
npm run dev:admin                # Start admin app

# Build
npm run build:backend
npm run build:customer-barber
npm run build:admin
```

## Environment Variables

```env
# Required
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
PORT=3000
NODE_ENV=development

# Optional
ALLOWED_ORIGINS=http://localhost:4200
SMTP_HOST=smtp.gmail.com
AWS_S3_BUCKET=...
CLOUDINARY_CLOUD_NAME=...
TWILIO_ACCOUNT_SID=...
```

## Next Steps

1. ✅ Phase 1 foundation is complete
2. ⏳ Follow SETUP.md to install and run backend
3. ⏳ Test auth endpoints via Swagger UI
4. ⏳ Begin Phase 2: Barbers + Appointments modules
5. ⏳ Create Angular customer-barber app
6. ⏳ Build customer booking flow UI

---

**Status Legend:**
- ✅ Complete and ready to use
- ⏳ Planned, not yet implemented
- 🚧 In progress
