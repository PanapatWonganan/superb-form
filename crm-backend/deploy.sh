#!/bin/bash

#######################################################
# Peaches Wellness CRM - Vultr VPS Deployment Script
# Domain: admin.peacheswellnessinthecity.com
#######################################################

set -e  # Exit on error

echo "🍑 Starting Peaches Wellness CRM Deployment..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Update system
echo -e "\n${GREEN}[1/8]${NC} Updating system..."
apt update && apt upgrade -y

# Step 2: Install PHP 8.3
echo -e "\n${GREEN}[2/8]${NC} Installing PHP 8.3..."
apt install -y software-properties-common
add-apt-repository ppa:ondrej/php -y
apt update
apt install -y php8.3 php8.3-cli php8.3-fpm php8.3-mysql php8.3-mbstring \
  php8.3-xml php8.3-curl php8.3-zip php8.3-gd php8.3-bcmath php8.3-intl

# Step 3: Install MySQL
echo -e "\n${GREEN}[3/8]${NC} Installing MySQL..."
apt install -y mysql-server

# Step 4: Install Nginx
echo -e "\n${GREEN}[4/8]${NC} Installing Nginx..."
apt install -y nginx

# Step 5: Install Composer
echo -e "\n${GREEN}[5/8]${NC} Installing Composer..."
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Step 6: Install Git and Certbot
echo -e "\n${GREEN}[6/8]${NC} Installing Git and Certbot..."
apt install -y git certbot python3-certbot-nginx

# Step 7: Setup MySQL
echo -e "\n${GREEN}[7/8]${NC} Setting up MySQL..."
echo -e "${YELLOW}Please enter a strong password for MySQL database user:${NC}"
read -sp "Database Password: " DB_PASSWORD
echo

# Generate random MySQL root password
MYSQL_ROOT_PASS=$(openssl rand -base64 32)

# Set MySQL root password and create database
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASS}';"
mysql -u root -p"${MYSQL_ROOT_PASS}" -e "CREATE DATABASE IF NOT EXISTS peaches_wellness;"
mysql -u root -p"${MYSQL_ROOT_PASS}" -e "CREATE USER IF NOT EXISTS 'peaches_user'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
mysql -u root -p"${MYSQL_ROOT_PASS}" -e "GRANT ALL PRIVILEGES ON peaches_wellness.* TO 'peaches_user'@'localhost';"
mysql -u root -p"${MYSQL_ROOT_PASS}" -e "FLUSH PRIVILEGES;"

echo -e "${GREEN}✓ MySQL setup complete${NC}"

# Step 8: Clone repository
echo -e "\n${GREEN}[8/8]${NC} Cloning repository..."
cd /var/www
if [ -d "peaches-wellness-backend" ]; then
    echo "Directory exists, pulling latest changes..."
    cd peaches-wellness-backend
    git pull origin main
else
    git clone https://github.com/PanapatWonganan/peaches-wellness-backend.git
    cd peaches-wellness-backend
fi

# Install dependencies
echo "Installing Composer dependencies..."
composer install --optimize-autoloader --no-dev

# Setup environment
echo "Setting up environment..."
cp .env.production .env

# Generate app key
php artisan key:generate

# Update .env with database credentials
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=${DB_PASSWORD}/" .env

# Set permissions
echo "Setting permissions..."
chown -R www-data:www-data /var/www/peaches-wellness-backend
chmod -R 755 /var/www/peaches-wellness-backend
chmod -R 775 /var/www/peaches-wellness-backend/storage
chmod -R 775 /var/www/peaches-wellness-backend/bootstrap/cache

# Setup Nginx
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/peaches-wellness << 'EOF'
server {
    listen 80;
    server_name admin.peacheswellnessinthecity.com;
    root /var/www/peaches-wellness-backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/peaches-wellness /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
nginx -t

# Restart services
systemctl restart nginx
systemctl restart php8.3-fpm

echo -e "\n${GREEN}✓ Deployment complete!${NC}"
echo "================================================"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Configure DNS: Point admin.peacheswellnessinthecity.com to this server IP"
echo "2. Wait 5-15 minutes for DNS propagation"
echo "3. Run: certbot --nginx -d admin.peacheswellnessinthecity.com"
echo "4. Run migrations: cd /var/www/peaches-wellness-backend && php artisan migrate --force"
echo "5. Create admin user: php artisan make:filament-user"
echo ""
echo -e "${GREEN}Save these credentials:${NC}"
echo "MySQL Root Password: ${MYSQL_ROOT_PASS}"
echo "Database Name: peaches_wellness"
echo "Database User: peaches_user"
echo "Database Password: ${DB_PASSWORD}"
echo ""
echo "Server IP: $(curl -s ifconfig.me)"
echo ""
echo -e "${GREEN}Access your site at: https://admin.peacheswellnessinthecity.com${NC}"
