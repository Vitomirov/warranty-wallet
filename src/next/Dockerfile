# Stage 1: install dependencies
FROM node:22-slim AS deps
WORKDIR /app/src/next
COPY src/next/package.json src/next/package-lock.json* ./
RUN npm ci

# Stage 2: build Next.js (needs frontend SCSS)
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/src/next/node_modules ./src/next/node_modules
COPY src/next ./src/next
COPY src/frontend/styles ./src/frontend/styles
WORKDIR /app/src/next
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_BASE_PATH=/warrantywallet
RUN npm run build

# Stage 3: production runner
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_BASE_PATH=/warrantywallet
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/src/next/public ./src/next/public
COPY --from=builder --chown=nextjs:nodejs /app/src/next/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/src/next/.next/static ./src/next/.next/static

USER nextjs
EXPOSE 3001

CMD ["node", "src/next/server.js"]
