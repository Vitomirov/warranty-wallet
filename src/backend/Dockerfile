# Stage 1: install production dependencies
FROM node:22-slim AS build-backend
WORKDIR /app
COPY src/backend/package.json src/backend/package-lock.json ./
RUN npm install --only=production

# Stage 2: production API image
FROM node:22-slim
WORKDIR /app

COPY --from=build-backend /app/node_modules ./node_modules
COPY src/backend/ ./src/backend

EXPOSE 3000

CMD ["node", "src/backend/server.js"]
