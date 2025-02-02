# Use Node.js for building the frontend
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Build the frontend for production
RUN npm run build

# Use nginx to serve the built frontend
FROM nginx:alpine

# Copy built frontend files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy images to the nginx directory
COPY frontend/images /usr/share/nginx/html/images

# Expose port 80 for frontend access
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]