# WorkSphere — Enterprise HR & Employee Operations Portal

WorkSphere is a full-stack, enterprise-grade Human Resource and Employee Self-Service management portal built with React, Vite, and Laravel. The platform features dynamic role-based workflows, configurable leave policy management, an automated 3-stage intern career lifecycle tracker, desktop notification broadcasts, and an integrated AI HR Copilot.

---

## Key Features

1. Role-Based Portals and Access Control
- Employee Portal: Self-service dashboard for leave quotas, attendance, ticket submission, and team directory.
- Intern Portal: Special progression tracking with 0 leaves policy during internship and probation stages.
- Team Lead Portal: 1st-tier leave review, team attendance overview, and member directory.
- Department Head Portal: 2nd-tier approvals, department-level health metrics, and cross-team monitoring.
- HR Manager / Admin Portal: Organization-wide metrics, policy engine configuration, employee credential provisioning, and broadcast announcements.

2. Automated 3-Stage Intern Lifecycle Tracker
- Stage 1 (Months 0 to 3): Initial Internship phase with 0 leave balance allocation.
- Stage 2 (Months 3 to 6): Automatic transition to Probation phase.
- Stage 3 (6+ Months Tenure): Permanent job confirmation with automatic activation of standard equal company leaves (20 Annual, 10 Medical, 8 Casual, 3 Emergency).
- Direct Permanent Hires: Regular employees receive equal standard leave entitlement from Day 1.

3. Configurable Leave Policy Engine
- Policies are fully dynamic and configurable by HR rather than hard-coded.
- Customizable entitlement days, eligibility filters (department, employment type), carry-forward limits, and multi-tier approval chains.
- Real-time balance calculations with support for emergency requests.

4. Organization Announcements and Notifications
- Broadcast announcements to all active employees.
- Native browser desktop notifications with audio chime alerts and in-app bell notification tray.

5. In-App AI HR Copilot
- Context-aware virtual assistant answering leave policy queries, emergency procedures, and HR contact points without markdown asterisks.

---

## Tech Stack

Frontend:
- React 19
- Vite 6
- Lucide React Icons
- Custom Vanilla CSS Design System with responsive tokens

Backend:
- Laravel 12 (PHP 8.2+)
- SQLite / MySQL / PostgreSQL supported
- Eloquent ORM with automated migrations
- RESTful JSON API Architecture

---

## Project Structure

```text
HR_portal/
├── backend/                  # Laravel 12 REST API backend
│   ├── app/
│   │   ├── Http/Controllers/Api/  # User, Policy, Leave, Announcement Controllers
│   │   └── Models/                # User, LeavePolicy, LeaveRequest models
│   ├── database/
│   │   └── migrations/            # Database schema migrations
│   ├── routes/
│   │   └── api.php                # REST API routes
│   └── composer.json
│
├── portal/                   # React + Vite frontend application
│   ├── src/
│   │   ├── components/            # Portal screens, modals, and navigation
│   │   ├── data/                  # Initial seed fixtures and defaults
│   │   ├── services/              # API clients and notification service
│   │   ├── utils/                 # Employment timeline milestone calculators
│   │   ├── App.jsx                # Application master shell and routing
│   │   ├── main.jsx               # React entrypoint
│   │   └── index.css              # Global design system styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore                # Production ignore definitions
└── README.md                 # Project documentation
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20/v22)
- npm 9+
- PHP 8.2+
- Composer

---

### Backend Setup (Laravel API)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Composer dependencies:
```bash
composer install
```

3. Configure environment file:
```bash
cp .env.example .env
php artisan key:generate
```

4. Run database migrations:
```bash
php artisan migrate
```

5. Start the backend API server:
```bash
php artisan serve --port=8000
```
The API will be running at `http://127.0.0.1:8000`.

---

### Frontend Setup (Vite + React)

1. Open a new terminal and navigate to the portal directory:
```bash
cd portal
```

2. Install npm dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```
The web portal will open at `http://localhost:3000` (or `http://localhost:5173`).

---

## Default Login Credentials

| Role | Email | Password |
|---|---|---|
| HR Operations Manager | david.hr@xortlogix.com | hr123 |
| System Admin | admin@xortlogix.com | admin123 |

New employees, team leads, department heads, and interns can be created directly by HR through the Register Employee modal.

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/users | List all active employees |
| POST | /api/users | Register and provision a new user |
| PUT | /api/users/{id} | Update employee profile, role, or dates |
| DELETE | /api/users/{id} | Remove employee record |
| GET | /api/leave-policies | Retrieve active leave policies |
| POST | /api/leave-policies | Create a new leave policy |
| PUT | /api/leave-policies/{id} | Update leave policy rules |
| DELETE | /api/leave-policies/{id} | Archive a leave policy |
| GET | /api/announcements | Fetch organization announcements |
| POST | /api/announcements | Broadcast announcement to team |
| DELETE | /api/announcements/{id} | Remove announcement |

---

## License

Proprietary enterprise software developed for XortLogix. All rights reserved.
