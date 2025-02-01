# Use official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY src/backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the entire backend source code
COPY src/backend/ ./

# Expose backend port (3000)
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]
