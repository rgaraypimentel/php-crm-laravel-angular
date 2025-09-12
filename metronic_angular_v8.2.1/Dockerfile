# Build stage
# Build stage
FROM node:18-slim as build

WORKDIR /app

# Copiamos solo el contenido del proyecto Angular
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./
COPY src ./src

RUN npm install

RUN npm run build --prod

# Production stage
FROM nginx:stable-alpine

COPY --from=build /app/dist/demo1 /usr/share/nginx/html

# Copia configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


