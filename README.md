# Barberly Platform

Professional barber booking and management platform built with Angular and Node.js.

## Project Structure

```
barberly-platform/
├── apps/
│   ├── customer-barber/      # Customer & Barber app (combined)
│   ├── admin/                # Admin dashboard
│   └── backend/              # Node.js API
├── libs/
│   ├── shared-ui/            # Design system components
│   ├── shared-models/        # TypeScript interfaces
│   ├── shared-auth/          # Auth services & guards
│   └── shared-utils/         # Common utilities
└── docs/                     # Documentation
```

## Tech Stack

- **Frontend**: Angular 17+ (standalone components), Angular Material, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: JWT (access + refresh tokens)
- **Real-time**: Socket.IO
- **State**: NgRx Signal Store

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env

# Set up database
cd apps/backend
npx prisma migrate dev
npx prisma generate
```

### Development

```bash
# Start backend API
npm run dev:backend

# Start customer-barber app
npm run dev:customer-barber

# Start admin app
npm run dev:admin
```

### Build

```bash
# Build all apps
npm run build

# Build specific app
npm run build:customer-barber
npm run build:admin
npm run build:backend
```

## Development Phases

- ✅ Phase 1: Foundation & Auth (Current)
- ⏳ Phase 2: Customer Booking Flow
- ⏳ Phase 3: Barber Portal
- ⏳ Phase 4: Admin Dashboard
- ⏳ Phase 5: Real-time & Polish

## API Documentation

Once the backend is running, visit: http://localhost:3000/api-docs

## License

Proprietary
