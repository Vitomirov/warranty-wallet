# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY . ./

# Expose backend port
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]
