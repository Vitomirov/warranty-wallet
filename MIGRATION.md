# Next.js Migration Guide

Warranty Wallet migrated from a **Vite + React Router SPA** to **Next.js App Router** (`src/next`). Migration is **complete**.

**Live URL:** https://dejanvitomirov.com/warrantywallet/

---

## Current Status (July 2026)

| Area | Status |
|------|--------|
| Routes & pages | **Complete** |
| Components & hooks | **Complete** |
| AI assistant | **Complete** |
| SCSS / design system | **Complete** — `src/next/styles/` |
| SEO / metadata | **Complete** |
| Legacy URL redirects | **Complete** |
| Nginx routing | **Complete** |
| Fallback infrastructure | **Removed** (Phase 3) |
| Legacy `src/frontend/` | **Deleted** (Phase 4) |
| Tests | **Auth forms** — Login + Signup in `src/next/__tests__/` |

---

## Architecture

### Production

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
| Next.js | http://localhost:3001/warrantywallet/ | UI |
| Express | http://localhost:3000/api/test | API |

---

## Application Layout

### `src/next/` — frontend

- `app/` — App Router pages and layouts
- `components/` — UI by domain
- `hooks/` — Data and form logic
- `styles/` — SCSS 7-1 design system
- `lib/` — API client, metadata, animations
- `providers/` — AuthProvider, global AiChat
- `__tests__/` — Jest component tests

### `src/backend/` — API

Express API only. Next.js proxies `/api/*` and `/uploads/*` in dev; nginx handles this in production.

---

## Route Mapping (historical)

| Legacy (Vite) | Next.js |
|---------------|---------|
| `/` | `app/(marketing)/page.jsx` |
| `/login` | `app/(auth)/login/page.jsx` |
| `/signup` | `app/(auth)/signup/page.jsx` |
| `/about` | `app/(marketing)/about/page.jsx` |
| `/features` | `app/(marketing)/features/page.jsx` |
| `/faq` | `app/(marketing)/faq/page.jsx` |
| `/dashboard` | `app/(app)/dashboard/page.jsx` |
| `/myAccount` | `app/(account)/myAccount/page.jsx` |
| `/newWarranty` | `app/(app)/newWarranty/page.jsx` |
| `/warranties/details/:id` | `/warrantyDetails/[id]/` (redirect) |
| `/warranties/delete/:id` | `/warrantyDetails/[id]/` (redirect) |

---

## Decommission Checklist

### Phase 1 — Documentation ✅

- [x] Create `MIGRATION.md`
- [x] Update `README.md`

### Phase 2 — Dead code removal ✅

- [x] Remove broken `LogOut.test.jsx`
- [x] Remove orphaned nested packages
- [x] Remove unused `legacyPath()` helper
- [x] Remove orphaned login snapshot

### Phase 3 — Remove fallback infrastructure ✅

- [x] Remove nginx Vite fallback
- [x] API-only backend Docker image
- [x] Remove static SPA serving from Express
- [x] Remove Vite dev service from `docker-compose.dev.yml`
- [x] Update emergency recovery scripts
- [x] Remove `VITE_API_BASE_URL` from CI/CD

### Phase 4 — Delete legacy frontend ✅

- [x] Delete `src/frontend/` (entire directory)
- [x] Port Signup tests to `src/next/__tests__/`
- [x] Update documentation

---

## Verification

```bash
curl -s https://dejanvitomirov.com/warrantywallet/ | grep -c '_next/static'
curl -s https://dejanvitomirov.com/warrantywallet/api/test
cd src/next && npm test
```

---

## Rollback

If Next.js has issues in production:

1. `bash deploy/scripts/vps-recover-next.sh` on the VPS
2. Pin a known-good `NEXT_IMAGE` tag in `.env.production` and redeploy

---

## Related Documentation

| File | Description |
|------|-------------|
| [README.md](README.md) | Project overview and getting started |
| [deploy/nginx/README.md](deploy/nginx/README.md) | Nginx routing and VPS setup |
