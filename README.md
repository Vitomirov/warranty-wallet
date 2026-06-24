# Warranty Wallet

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://dejanvitomirov.com/warrantywallet/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)

**Warranty Wallet** is a production-grade, full-stack web application for digitizing, organizing, and managing product warranties. Users upload PDF receipts and warranty documents, track expiration dates on a personal dashboard, receive automated email reminders, and submit warranty claims directly to sellers — with an AI assistant available for in-app guidance.

**Live application:** [https://dejanvitomirov.com/warrantywallet/](https://dejanvitomirov.com/warrantywallet/)

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Deployment & CI/CD](#deployment--cicd)
- [Documentation](#documentation)
- [License](#license)
- [Author](#author)

---

## Features

| Area | Capability |
|------|------------|
| **Authentication** | JWT access tokens (15 min) + httpOnly refresh cookies (7 days), automatic silent refresh |
| **Warranty Management** | CRUD operations with PDF upload, inline PDF viewing, active/expired status |
| **Notifications** | Daily cron job emails users 14 days before warranty expiration |
| **Warranty Claims** | One-click claim emails to sellers with attached PDF and user details |
| **AI Assistant** | OpenAI-powered chatbot scoped to app features and warranty knowledge |
| **Account Management** | Profile updates, account deletion with cascade cleanup |
| **Audit Logging** | Server-side activity log for sign-up, warranty create/delete events |
| **Marketing Site** | Landing, About, Features, FAQ pages with per-route SEO meta tags |
| **UX** | Mobile-first responsive layout, Framer Motion animations, lazy-loaded routes |

---

## Architecture Overview

Warranty Wallet follows a **decoupled frontend / API backend** design in development, and a **unified production deployment** where the Express server serves the Vite-built React SPA as static assets.

```mermaid
flowchart TB
    subgraph Client["Browser"]
        SPA["React SPA<br/>(Vite + React Router)"]
    end

    subgraph VPS["DigitalOcean VPS"]
        subgraph Docker["Docker Compose"]
            BE["Express API<br/>:3000"]
            DB[("MySQL 8.0")]
            AD["Adminer<br/>:8080"]
        end
        UP["uploads/ volume"]
    end

    subgraph External["External Services"]
        MG["Mailgun SMTP"]
        OAI["OpenAI API"]
    end

    subgraph CI["GitHub Actions"]
        BUILD["Vite build"]
        SSH["SSH deploy"]
    end

    SPA -->|REST + JWT| BE
    BE --> DB
    BE --> UP
    BE --> MG
    BE --> OAI
    CI -->|push to main| SSH
    SSH --> Docker
```

### Backend — Layered Architecture

```
Request → Route → Middleware → Controller → Service → MySQL / File System
```

- **Routes** define HTTP endpoints and attach middleware (auth, file upload).
- **Controllers** handle request/response and delegate to services.
- **Services** contain business logic, database queries, and file operations.
- **Core utilities** (`httpResponses`, `logActivity`) standardize API responses and audit trails.

### Frontend — Feature-Based Architecture

```
pages/          → Marketing & shell routes
features/       → Domain modules (auth, warranties, account, ai)
hooks/          → Data fetching & form logic (separated from UI)
context/        → Global auth state & Axios configuration
layout/         → Header, Footer, MetaTags, Layout wrapper
ui/             → Reusable presentational components
styles/         → SCSS 7-1 architecture with dual themes
```

### Authentication Flow

1. User logs in → server returns a short-lived **access token** (JSON) and sets an **httpOnly refresh cookie**.
2. Frontend stores the access token in `localStorage` and attaches it as a `Bearer` header.
3. `useSecureRequest` intercepts expired tokens, calls `/api/refresh-token`, and retries failed requests.
4. `AuthProvider` schedules proactive refresh 30 seconds before token expiry and on tab visibility change.

---

## Technology Stack

### Frontend

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | React 19 | UI rendering |
| Build tool | Vite 6 | Dev server, production bundling, code splitting |
| Routing | React Router 6 | Client-side routing with `/warrantywallet` base path |
| HTTP | Axios | API client with interceptors |
| UI | Bootstrap 5, React Bootstrap | Grid, components, responsive layout |
| Styling | Sass (7-1 pattern) | Theming, component styles, utilities |
| Animation | Framer Motion | Page transitions and micro-interactions |
| Forms | React Datepicker | Purchase and expiry date inputs |
| Modals | React Modal | Confirmation dialogs |
| Testing | Jest, React Testing Library | Component unit tests |
| Linting | ESLint 9 | Code quality |

### Backend

| Category | Technology | Purpose |
|----------|------------|---------|
| Runtime | Node.js 22 | Server runtime |
| Framework | Express 4 | HTTP API, static file serving |
| Database | MySQL 8 (mysql2) | Persistent storage with connection pooling |
| Auth | jsonwebtoken, bcryptjs | JWT tokens, password hashing |
| File upload | Multer | PDF storage to `uploads/` volume |
| Email | Nodemailer + Mailgun SMTP | Claim and expiration notifications |
| Scheduling | node-cron | Daily warranty expiration checks |
| AI | OpenAI SDK (gpt-4o-mini) | In-app assistant |

### DevOps & Infrastructure

| Category | Technology | Purpose |
|----------|------------|---------|
| Containerization | Docker, Docker Compose | Reproducible dev and prod environments |
| CI/CD | GitHub Actions | Build frontend, SSH deploy to VPS on `main` push |
| Hosting | DigitalOcean VPS | Production server |
| Domain | Namecheap → dejanvitomirov.com | Public URL with sub-path deployment |
| DB Admin | Adminer | Database management (production compose) |

---

## Project Structure

```
warranty-wallet/
├── .github/workflows/
│   └── deploy.yml              # CI/CD pipeline
├── db_init/
│   └── init.sql                # Database schema bootstrap
├── docs/                       # Extended documentation
│   ├── architecture.md
│   ├── api.md
│   ├── development.md
│   └── deployment.md
├── src/
│   ├── backend/
│   │   ├── ai/                 # OpenAI chat endpoint
│   │   ├── auth/               # Login, signup, refresh, JWT middleware
│   │   ├── config/             # MySQL connection pool
│   │   ├── core/               # HTTP helpers, activity logging
│   │   ├── email/              # Nodemailer + Mailgun integration
│   │   ├── handlers/           # Cross-cutting request handlers
│   │   ├── user/               # Profile CRUD
│   │   ├── warranty/           # Warranty CRUD + PDF upload
│   │   ├── uploads/            # Persisted PDF files (volume-mounted)
│   │   ├── app.js              # Express app configuration
│   │   ├── server.js           # Entry point, DB retry, cron init
│   │   ├── cronJobs.js         # Expiration notification scheduler
│   │   └── Dockerfile          # Multi-stage prod image (backend + frontend dist)
│   └── frontend/
│       ├── context/            # AuthProvider, Axios instances
│       ├── features/           # auth, warranties, account, ai
│       ├── hooks/              # Custom hooks for API & forms
│       ├── layout/             # Header, Footer, Layout, MetaTags
│       ├── pages/              # Landing, About, Features, FAQ
│       ├── styles/             # SCSS 7-1 architecture
│       ├── tests/              # Jest component tests
│       ├── ui/                 # Shared UI components
│       ├── seoConfig.js        # Per-route SEO metadata
│       ├── App.jsx             # Route definitions
│       ├── main.jsx            # React entry point
│       └── vite.config.js      # Build, chunking, base path
├── docker-compose.yml          # Production stack
├── docker-compose.dev.yml      # Local development stack
└── README.md
```

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Node.js](https://nodejs.org/) 20+ (for local non-Docker development)
- Git

### Option A — Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/Vitomirov/warranty-wallet.git
   cd warranty-wallet
   ```

2. **Create environment file** at the project root:

   ```bash
   cp .env.development.example .env.development   # if example exists
   # Or create .env.development manually — see Environment Variables below
   ```

3. **Start the development stack**

   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

4. **Open the application**

   | Service | URL |
   |---------|-----|
   | Frontend (Vite) | http://localhost:5173/warrantywallet/ |
   | Backend API | http://localhost:3000/api/test |
   | MySQL | localhost:3307 |

### Option B — Local Node.js

**Backend:**

```bash
cd src/backend
npm install
# Configure .env.development at project root
npm run dev          # nodemon on port 3000
```

**Frontend:**

```bash
cd src/frontend
npm install
npm run dev          # Vite on port 5173
```

Set `VITE_API_BASE_URL=http://localhost:3000` in your frontend environment for local API calls.

---

## Environment Variables

Create `.env.development` (local) or `.env.production` (VPS/Docker) at the **project root**.

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | Yes | JWT access token signing secret |
| `REFRESH_SECRET_KEY` | Yes | JWT refresh token signing secret |
| `DB_HOST` | Yes | MySQL host (`mysql` in Docker, `localhost` locally) |
| `DB_USER` | Yes | Database user |
| `DB_PASSWORD` | Yes | Database password |
| `DB_DATABASE` | Yes | Database name (`warranty_db`) |
| `MYSQL_ROOT_PASSWORD` | Yes | MySQL root password (Docker init) |
| `MAILGUN_SMTP_HOST` | Yes | Mailgun SMTP hostname |
| `MAILGUN_SMTP_PORT` | Yes | SMTP port (typically `587`) |
| `MAILGUN_SMTP_USER` | Yes | Mailgun SMTP username |
| `MAILGUN_SMTP_PASSWORD` | Yes | Mailgun SMTP password |
| `MAIL_FROM_ADDRESS` | Yes | Sender email address |
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI assistant |
| `PORT` | No | Backend port (default `3000`) |
| `NODE_ENV` | No | `development` or `production` |
| `VITE_API_BASE_URL` | Yes* | Frontend API base URL (*build-time for Vite) |
| `BACKEND_BASE_URL` | No | Backend public URL (production) |

> **Security note:** Never commit `.env` files. Production secrets are injected via GitHub Actions secrets during deployment.

---

## API Overview

All authenticated endpoints require `Authorization: Bearer <accessToken>`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/login` | No | Authenticate user |
| `POST` | `/api/signup` | No | Register new user |
| `POST` | `/api/refresh-token` | Cookie | Refresh access token |
| `GET` | `/api/me` | Yes | Get current user profile |
| `PUT` | `/api/me` | Yes | Update profile |
| `DELETE` | `/api/me` | Yes | Delete account |
| `GET` | `/api/warranties` | Yes | List user warranties |
| `GET` | `/api/warranties/:id` | Yes | Get warranty details |
| `POST` | `/api/warranties` | Yes | Create warranty (multipart PDF) |
| `DELETE` | `/api/warranties/:id` | Yes | Delete warranty |
| `GET` | `/api/warranties/pdf/:id` | Yes | Stream warranty PDF |
| `POST` | `/api/warranty/claim` | Yes | Send claim email to seller |
| `POST` | `/api/ai` | No | AI assistant prompt |
| `GET` | `/api/test` | No | Health check |
| `GET` | `/api/testdb` | No | Database connectivity check |

Full request/response details: [docs/api.md](docs/api.md)

---

## Testing

Frontend tests use **Jest** with **React Testing Library**:

```bash
cd src/frontend
npm test
```

Current coverage focuses on authentication components (`LogIn`, `SignUp`) with mocked hooks and router context.

---

## Deployment & CI/CD

Production deployment is fully automated via GitHub Actions (`.github/workflows/deploy.yml`):

1. **Trigger** — Push to `main` branch
2. **Build** — Install frontend dependencies, run `vite build` with production API URL
3. **Deploy** — SSH into DigitalOcean VPS, write `.env.production` from GitHub Secrets, pull latest code, rebuild Docker containers

Production stack (`docker-compose.yml`):

| Container | Image / Build | Port | Role |
|-----------|---------------|------|------|
| `warranty_db` | mysql:8.0 | internal | Database with persistent volume |
| `warranty_backend` | Multi-stage Dockerfile | 3000 | API + static frontend |
| `warranty_adminer` | adminer:latest | 8080 | Database admin UI |

The production backend Dockerfile builds the frontend inside the image and serves `dist/` as static files — a single container handles both API and SPA.

Detailed deployment guide: [docs/deployment.md](docs/deployment.md)

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/architecture.md](docs/architecture.md) | System design, data model, auth, styling, and patterns |
| [docs/api.md](docs/api.md) | Complete API reference |
| [docs/development.md](docs/development.md) | Local setup, conventions, and workflow |
| [docs/deployment.md](docs/deployment.md) | CI/CD pipeline, Docker, and VPS configuration |

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

**Dejan Vitomirov**

- Website: [dejanvitomirov.com](https://dejanvitomirov.com)
- Email: dejan.vitomirov@gmail.com
- GitHub: [@Vitomirov](https://github.com/Vitomirov)
