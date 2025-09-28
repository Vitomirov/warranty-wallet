# Stage 1: build backend dependencies
FROM node:22-slim AS build-backend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production

# Stage 2: build frontend
FROM node:22-slim AS build-frontend
WORKDIR /app
COPY src/frontend/package.json src/frontend/package-lock.json ./
RUN npm install
COPY src/frontend/ ./
RUN npm run build

# Stage 3: final backend image with frontend
FROM node:22-slim
WORKDIR /app

# Copy backend node_modules
COPY --from=build-backend /app/node_modules ./node_modules
# Copy backend source code
COPY src/backend/ ./src/backend
# Copy frontend build into backend
COPY --from=build-frontend /app/dist ./src/frontend/dist

# Expose backend port
EXPOSE 3000

# Start backend
CMD ["node", "src/backend/server.js"]
