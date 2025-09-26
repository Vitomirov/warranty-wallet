FROM node:22-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# Brisemo fabricki default.conf pre kopiranja naseg
RUN rm -f /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
# Kopiranje nase SSL konfiguracije
COPY ssl.conf /etc/nginx/conf.d/ssl.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
