# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing two applications:
- **frontend/** - Next.js 16.3.1 (React 19) application deployed to Netlify
- **backend-laravel/** - Laravel 13.17 (PHP 8.4) API deployed to cPanel/Shared Hosting

The frontend communicates with the backend via REST API at `NEXT_PUBLIC_API_URL`.

---

## Common Commands

### Frontend (Next.js)

Run from `frontend/` directory:

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Build & Production
npm run build        # Production build (output: .next/standalone)
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

### Backend (Laravel)

Run from `backend-laravel/` directory:

```bash
# Development
composer run dev     # Start Laravel dev server (uses php artisan dev)
php artisan serve    # Alternative: start on http://localhost:8000

# Dependencies
composer install     # Install PHP dependencies
composer update      # Update dependencies

# Database
php artisan migrate           # Run migrations
php artisan migrate:fresh     # Reset and re-run migrations
php artisan migrate:fresh --seed  # Reset, migrate, and seed

# Testing
php artisan test              # Run full Pest test suite
php artisan test --filter=TestName  # Run specific test
vendor/bin/pest               # Run Pest directly
vendor/bin/pest --filter=TestName

# Code Quality
vendor/bin/pint --format agent   # Format PHP code (run after changes)

# Cache Management
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache        # Production cache rebuild

# Other
php artisan route:list          # List all routes
php artisan make:controller     # Generate controller
php artisan make:model          # Generate model
php artisan make:migration      # Generate migration
php artisan make:test --pest    # Generate Pest test
```

### Deployment

**Backend (cPanel):**
```bash
./deploy.sh  # From project root - runs migrations, clears caches, rebuilds config
```

**Frontend (Netlify):**
- Auto-deploys from `main` branch
- Build command: `npm run build` (from `frontend/` directory)
- Output: `.next` (uses `@netlify/plugin-nextjs` for SSR)

---

## Architecture

### Frontend Structure (`frontend/`)

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Login, register, password reset
│   ├── dashboard/         # User dashboard
│   ├── api/               # API routes (if any)
│   └── [feature]/         # Feature pages (about, achievements, calendar, etc.)
├── components/
│   ├── ui/                # Reusable UI components (shadcn-style)
│   ├── dashboard/         # Dashboard-specific components
│   ├── gallery/           # Gallery components
│   ├── admin/             # Admin components
│   └── motion/            # Animation components (Framer Motion, GSAP)
├── lib/
│   ├── api-errors.ts      # Standardized API error handling
│   ├── firebase/          # Firebase auth integration
│   └── utils.ts           # Utility functions
├── public/                # Static assets
└── globals.css            # Global styles + Tailwind v4
```

**Key Technologies:**
- Next.js 16 (App Router, React 19)
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Framer Motion, GSAP, Lenis for animations
- Shadcn/UI component pattern (in `components/ui/`)
- TypeScript with strict mode
- `output: "standalone"` for optimized deployment

### Backend Structure (`backend-laravel/`)

```
backend-laravel/
├── app/
│   ├── Http/Controllers/   # API Controllers
│   │   ├── AuthController.php
│   │   ├── EventController.php
│   │   ├── TeamController.php
│   │   ├── RegistrationController.php
│   │   ├── NotificationController.php
│   │   ├── AdminController.php
│   │   ├── CalendarEventController.php
│   │   ├── AlumniController.php
│   │   └── MembershipController.php
│   ├── Models/             # Eloquent Models
│   │   ├── User.php
│   │   ├── Event.php
│   │   ├── Team.php
│   │   ├── Registration.php
│   │   ├── Notification.php
│   │   ├── Membership.php
│   │   ├── Alumni.php
│   │   └── CalendarEvent.php
│   └── Mail/               # Mailables
├── routes/
│   ├── api.php             # API routes (Sanctum auth)
│   └── web.php             # Web routes (minimal)
├── database/
│   ├── migrations/         # Database schema
│   ├── factories/          # Model factories
│   └── seeders/            # Database seeders
└── tests/
    ├── Feature/            # Pest feature tests
    └── Unit/               # Pest unit tests
```

**Key Technologies:**
- Laravel 13.x (PHP 8.4)
- Laravel Sanctum for API authentication
- Laravel Socialite for OAuth (Google, GitHub)
- Pest for testing
- Laravel Pint for code formatting
- MySQL database

### API Endpoints (from `routes/api.php`)

**Public:**
- `GET /api/user` - Get authenticated user (Sanctum)
- `POST /api/auth/register` - Register
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/google/redirect` - Google OAuth
- `GET /api/auth/github/redirect` - GitHub OAuth
- `GET /api/events` - List events
- `GET /api/events/{id}` - Get event
- `GET /api/alumni` - List alumni
- `POST /api/alumni` - Submit alumni (rate limited)
- `GET /api/calendar-events` - List calendar events
- `GET /api/stats/public` - Public statistics

**Protected (auth:sanctum):**
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user
- `PUT /api/auth/me` - Update profile
- `POST /api/memberships` - Create membership
- `GET /api/memberships/me` - My membership
- `GET /api/events/{id}/participants` - Event participants
- `GET/POST /api/teams` - Team management
- `POST /api/teams/join` - Join team
- `POST /api/registrations/individual` - Event registration
- `GET/POST /api/notifications` - Notifications (SSE stream)

**Admin (auth:sanctum + admin check):**
- `POST /api/admin/events` - Create event
- `DELETE /api/admin/events/{id}` - Delete event
- `GET /api/admin/users` - List users
- `POST /api/admin/broadcast` - Broadcast notification
- Alumni management (approve/reject)
- Membership management (approve/reject)
- Calendar event CRUD

---

## Environment Variables

### Frontend (`.env`)
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8080/api
```

### Backend (`.env`)
```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eclipse_registration
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database

FRONTEND_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8080/api/auth/google/callback

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=http://localhost:8080/api/auth/github/callback
```

---

## Database Schema (Key Tables)

- **users** - Core user accounts (email, password, name, role, avatar, linkedin_url, etc.)
- **events** - Community events
- **teams** - Project teams for events
- **team_members** - Team membership
- **team_join_requests** - Pending join requests
- **registrations** - Event registrations
- **notifications** - User notifications
- **memberships** - Membership applications
- **alumnis** - Alumni directory entries
- **calendar_events** - Calendar events
- **email_otps** - Email OTP for verification
- **personal_access_tokens** - Sanctum tokens

---

## Development Workflow

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend-laravel && composer run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Make changes** following existing patterns:
   - Backend: Use `php artisan make:*` commands
   - Frontend: Follow component patterns in `components/ui/`

3. **Test changes:**
   - Backend: `php artisan test --filter=YourTest`
   - Frontend: Visual verification at localhost:3000

4. **Format code:**
   - Backend: `vendor/bin/pint --format agent`
   - Frontend: `npm run lint`

---

## Important Notes

- **API Base URL**: Frontend uses `NEXT_PUBLIC_API_URL` (default: `http://127.0.0.1:8080/api`)
- **Sanctum Auth**: API uses token-based auth; include `Authorization: Bearer <token>` header
- **CORS**: Configured in Laravel for frontend origin
- **File Uploads**: Stored in `storage/app/public/`, linked via `php artisan storage:link`
- **SSE**: Notifications use Server-Sent Events (`/api/notifications/stream`)
- **Rate Limiting**: Applied on sensitive routes (throttle middleware)

---

## Key Files to Reference

- `backend-laravel/routes/api.php` - All API routes
- `backend-laravel/app/Models/` - Eloquent models
- `frontend/lib/api-errors.ts` - Standardized error handling
- `frontend/components/ui/` - Reusable UI components
- `deploy.sh` - Production deployment script