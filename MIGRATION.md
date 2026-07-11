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
| Legacy decommission | **Phase 3 complete** — fallback removed; `src/frontend/` ready for Phase 4 deletion |

---

## Architecture

### Production (current)

```
Browser
  ↓
Nginx (:443)
  ├─ /warrantywallet/api/     → Express :3000 (API + uploads)
  ├─ /warrantywallet/_next/   → Next.js :3001 (static assets)
  └─ /warrantywallet/*        → Next.js :3001 (all pages)
```

### Development

| Service | URL | Role |
|---------|-----|------|
| Next.js | http://localhost:3001/warrantywallet/ | **Primary UI** |
| Express | http://localhost:3000/api/test | API |

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

### `src/frontend/` — legacy (Phase 4 deletion pending)

No longer used in production or development Docker stacks. Safe to delete in Phase 4 after confirming no local workflows depend on it.

Previously used for nginx fallback and backend-embedded Vite build — **removed in Phase 3**.

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

### Phase 3 — Remove fallback infrastructure ✅

- [x] Remove `@warranty_express_fallback` from `deploy/nginx/warranty-wallet.conf`
- [x] Remove Vite build stage from `src/backend/Dockerfile`
- [x] Remove static SPA serving from `src/backend/app.js`
- [x] Remove `frontend` service from `docker-compose.dev.yml`
- [x] Update `deploy/scripts/vps-emergency-restore.sh` (restart Next, not Vite fallback)
- [x] Remove `VITE_API_BASE_URL` from CI/CD deploy workflow
- [x] Deprecate `deploy/nginx/warranty-wallet-emergency.conf`

### Phase 4 — Delete legacy frontend

- [ ] Delete `src/frontend/` (entire directory)
- [ ] Port or drop remaining legacy Jest tests

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

1. **Restart Next:** `bash deploy/scripts/vps-recover-next.sh` on the VPS
2. **Emergency restore:** `bash deploy/scripts/vps-emergency-restore.sh`
3. **Pin previous image:** set `NEXT_IMAGE` in `.env.production` to a known-good GHCR tag and `docker compose pull && up -d next`

No database changes are involved in frontend rollback.

---

## Related Documentation

| File | Description |
|------|-------------|
| [README.md](README.md) | Project overview and getting started |
| [deploy/nginx/README.md](deploy/nginx/README.md) | Nginx strangler routing and VPS setup |
