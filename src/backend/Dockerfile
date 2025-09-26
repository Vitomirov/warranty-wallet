FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production
FROM node:22-slim
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
