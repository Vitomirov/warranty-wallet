FROM node:22-slim AS build
WORKDIR /app
COPY src/backend/package.json src/backend/package-lock.json ./
RUN npm install --only=production
FROM node:22-slim
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY src/backend/ ./.
EXPOSE 3000
CMD ["node", "server.js"]
