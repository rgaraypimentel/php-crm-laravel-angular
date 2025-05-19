# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiamos solo el contenido del proyecto Angular
COPY metronic_angular_v8.2.1/package*.json ./
COPY metronic_angular_v8.2.1/angular.json ./
COPY metronic_angular_v8.2.1/tsconfig*.json ./
COPY metronic_angular_v8.2.1/src ./src

RUN npm install

RUN npm run build --prod

# Production stage
FROM nginx:stable-alpine

COPY --from=build /app/dist/demo1 /usr/share/nginx/html

# Copia configuración personalizada de NGINX
COPY metronic_angular_v8.2.1/nginx.conf /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


