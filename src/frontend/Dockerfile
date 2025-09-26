FROM node:22-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ssl.conf /etc/nginx/conf.d/ssl.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
