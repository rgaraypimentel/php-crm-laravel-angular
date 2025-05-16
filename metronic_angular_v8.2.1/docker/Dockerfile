# Imagen base con Node.js
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto de Angular
EXPOSE 4200

# Comando para iniciar el servidor Angular en modo desarrollo
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
