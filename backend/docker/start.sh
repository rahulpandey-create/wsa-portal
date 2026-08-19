#!/bin/sh

set -e

echo "Starting Laravel application..."

# Clear old Laravel caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Cache production configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
php artisan migrate --force

php artisan db:seed --force

# Start PHP-FPM in the background
php-fpm -D

# Start Laravel Reverb in the background
php artisan reverb:start --host=0.0.0.0 --port=8080 &

# Start Nginx in the foreground
nginx -g "daemon off;"