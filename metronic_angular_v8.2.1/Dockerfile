# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Production stage
FROM nginx:stable-alpine

COPY --from=build /app/dist/demo1 /usr/share/nginx/html

# Copia configuración nginx si necesitas (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


