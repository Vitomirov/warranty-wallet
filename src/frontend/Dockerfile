# Use Node.js official image for building the frontend
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY src/frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend source code, including index.html
COPY src/frontend/ ./

# Build the frontend for production
RUN npm run build

# Use nginx to serve the built frontend
FROM nginx:alpine

# Copy the built frontend from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for frontend access
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
