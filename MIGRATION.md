# Next.js Migration Guide

Warranty Wallet is migrating from a **Vite + React Router SPA** (`src/frontend`) to **Next.js App Router** (`src/next`) using a strangler pattern.

**Live URL:** https://dejanvitomirov.com/warrantywallet/

---

## Current Status (July 2026)

| Area | Status |
|------|--------|
| Routes & pages | **Complete** — all user-facing routes on Next.js |
| Components & hooks | **Complete** — ported to `src/next/` |
| AI assistant | **Complete** |
| SCSS / design system | **Complete** — owned by `src/next/styles/` |
| SEO / metadata | **Complete** — server-side via `lib/metadata.js` |
| Legacy URL redirects | **Complete** — see `src/next/next.config.js` |
| Nginx routing | **Complete** — all pages → Next (`:3001`) |
| Tests | **Partial** — `LoginForm` in Next; legacy auth tests remain |
| Legacy decommission | **Not started** — Vite SPA still built as fallback |

---

## Architecture

### Production (current)

```
Browser
  ↓
Nginx (:443)
  ├─ /warrantywallet/api/     → Express :3000 (API + uploads)
  ├─ /warrantywallet/_next/   → Next.js :3001 (static assets)
  ├─ /warrantywallet/*        → Next.js :3001 (all pages)
  └─ (on 502/503/504)         → Express :3000 (legacy Vite SPA fallback)
```

### Development

| Service | URL | Role |
|---------|-----|------|
| Next.js | http://localhost:3001/warrantywallet/ | **Primary UI** (use this) |
| Express | http://localhost:3000/api/test | API |
| Vite (legacy) | http://localhost:5173/warrantywallet/ | Fallback dev only — optional |

---

## Route Mapping

| Legacy (Vite) | Next.js | Notes |
|---------------|---------|-------|
| `/` | `app/(marketing)/page.jsx` | |
| `/login` | `app/(auth)/login/page.jsx` | |
| `/signup` | `app/(auth)/signup/page.jsx` | |
| `/about` | `app/(marketing)/about/page.jsx` | |
| `/features` | `app/(marketing)/features/page.jsx` | |
| `/faq` | `app/(marketing)/faq/page.jsx` | |
| `/dashboard` | `app/(app)/dashboard/page.jsx` | Auth required |
| `/myAccount` | `app/(account)/myAccount/page.jsx` | Auth required |
| `/newWarranty` | `app/(app)/newWarranty/page.jsx` | Auth required |
| `/warranties/details/:id` | `/warrantyDetails/[id]/` | Permanent redirect |
| `/warranties/delete/:id` | `/warrantyDetails/[id]/` | Delete is a modal; redirect to details |
| `*` (unknown) | `app/not-found.jsx` | |

---

## What Lives Where

### `src/next/` — primary application

- `app/` — App Router pages and layouts
- `components/` — UI by domain (auth, account, warranties, marketing, ai, layout)
- `hooks/` — Data and form logic
- `styles/` — SCSS 7-1 design system (self-contained)
- `lib/` — API client, metadata, animations
- `providers/` — AuthProvider, global AiChat
- `__tests__/` — Jest tests (growing)

### `src/frontend/` — legacy (decommission pending)

Still required for:

1. **Nginx emergency fallback** when Next.js is unavailable
2. **Backend Docker image** — Vite build embedded in `warranty_backend` container
3. **Express static serving** — `src/backend/app.js` serves `dist/` as SPA

Do **not** delete `src/frontend/` until Phase 3–4 below are complete.

### `src/backend/` — unchanged

Express API. Next.js proxies `/api/*` and `/uploads/*` in dev; nginx handles this in production. No Next.js API routes.

---

## Key Differences from Legacy

| Topic | Legacy | Next.js |
|-------|--------|---------|
| Routing | React Router client-side | App Router file-based |
| SEO | Client-side `MetaTags.jsx` | Server `export const metadata` |
| Auth guard | `PrivateRoute.jsx` | `AuthGuard.jsx` (client-side) |
| Delete warranty | Broken standalone route | Modal in list/details |
| Trailing slashes | Optional | Enforced (`trailingSlash: true`) |
| Styles import | `src/frontend/styles/` | `src/next/styles/` |

---

## Decommission Checklist

### Phase 1 — Documentation ✅

- [x] Create `MIGRATION.md`
- [x] Update `README.md`

### Phase 2 — Dead code removal ✅

- [x] Remove broken `LogOut.test.jsx` (no `LogOut` component ever existed)
- [x] Remove orphaned `src/frontend/src/frontend/` packages
- [x] Remove unused `legacyPath()` helper
- [x] Remove orphaned login snapshot file

### Phase 3 — Remove fallback infrastructure (after burn-in)

Monitor production for 2–4 weeks with no nginx fallback triggers, then:

- [ ] Remove `@warranty_express_fallback` from `deploy/nginx/warranty-wallet.conf`
- [ ] Remove Vite build stage from `src/backend/Dockerfile`
- [ ] Remove static SPA serving from `src/backend/app.js`
- [ ] Remove `frontend` service from `docker-compose.dev.yml`
- [ ] Update `deploy/scripts/vps-emergency-restore.sh` or archive it

### Phase 4 — Delete legacy frontend

Only after Phase 3:

- [ ] Delete `src/frontend/` (entire directory)
- [ ] Remove `VITE_API_BASE_URL` from CI/CD and env docs
- [ ] Port or drop remaining legacy Jest tests
- [ ] Update `.github/workflows/deploy.yml` — backend image no longer builds Vite

---

## Verification Commands

```bash
# Production — confirm Next.js is serving pages
curl -s https://dejanvitomirov.com/warrantywallet/ | grep -c '_next/static'

# Legacy URL redirect
curl -sIL https://dejanvitomirov.com/warrantywallet/warranties/details/1 | grep -E '^HTTP|^location'

# API unchanged
curl -s https://dejanvitomirov.com/warrantywallet/api/test

# Local Next dev
cd src/next && npm run dev   # http://localhost:3001/warrantywallet/
```

---

## Rollback

If Next.js has issues in production:

1. **Automatic:** nginx serves legacy Vite SPA from Express on 502/503/504
2. **Manual:** use `deploy/nginx/warranty-wallet-emergency.conf` to route all traffic to Express
3. **Script:** `deploy/scripts/vps-emergency-restore.sh`

No database changes are involved in frontend migration rollback.

---

## Related Documentation

| File | Description |
|------|-------------|
| [README.md](README.md) | Project overview and getting started |
| [deploy/nginx/README.md](deploy/nginx/README.md) | Nginx strangler routing and VPS setup |
