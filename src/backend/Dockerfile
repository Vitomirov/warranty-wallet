# Stage 1: build backend dependencies
FROM node:22-slim AS build-backend
WORKDIR /app
COPY src/backend/package.json src/backend/package-lock.json ./
RUN npm install --only=production

# Stage 2: build frontend
FROM node:22-slim AS build-frontend
WORKDIR /app
COPY src/frontend/package.json src/frontend/package-lock.json ./
RUN npm install
COPY src/frontend/ ./
RUN npm run build

FROM node:22-slim
WORKDIR /app

# Copy backend node_modules
COPY --from=build-backend /app/node_modules ./node_modules
COPY src/backend/ ./src/backend
COPY --from=build-frontend /app/dist ./src/frontend/dist

# Expose backend port
EXPOSE 3000

# Start backend server
CMD ["node", "src/backend/server.js"]
