# Dockerfile (dentro de ./api-crm-erp/docker/ o similar)
FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    git \
    && apt-get purge -y g++ \
    && apt-get autoremove -y \
    && rm -r /var/lib/apt/lists/* \
    && rm -rf /tmp/*

# Instalar PDO MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Configurar DocumentRoot en public/
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Permitir .htaccess en public/
RUN echo '<Directory /var/www/html/public>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' >> /etc/apache2/apache2.conf

WORKDIR /var/www/html

COPY api-crm-erp/app/ app/
COPY api-crm-erp/bootstrap/ bootstrap/
COPY api-crm-erp/config/ config/
COPY api-crm-erp/database/ database/
COPY api-crm-erp/public/ public/
COPY api-crm-erp/resources/ resources/
COPY api-crm-erp/routes/ routes/
COPY api-crm-erp/storage/ storage/
COPY api-crm-erp/artisan .

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

