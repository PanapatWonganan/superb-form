# 🚀 Vultr VPS Deployment Guide

**Domain:** admin.peacheswellnessinthecity.com

---

## 📋 Quick Start

### 1. Create Vultr VPS

1. Go to https://my.vultr.com
2. **Deploy New Server** → Cloud Compute
3. Choose Location: **Singapore** (closest to Thailand)
4. Server Type: **Ubuntu 22.04 LTS x64**
5. Server Size: **$6/month** (1 vCPU, 1GB RAM, 25GB SSD)
6. Deploy Now

**Wait 2-3 minutes** for VPS to be ready.

You will receive:
- IP Address: `xxx.xxx.xxx.xxx`
- Username: `root`
- Password: `xxxxxxxxx`

---

## 🔧 Automated Setup Script

SSH into your VPS:
```bash
ssh root@YOUR_VPS_IP
```

Run this **one-line installer**:
```bash
curl -fsSL https://raw.githubusercontent.com/PanapatWonganan/peaches-wellness-backend/main/deploy.sh | bash
```

This will:
- ✅ Install PHP 8.3, MySQL 8.0, Nginx, Composer
- ✅ Clone code from GitHub
- ✅ Setup MySQL database
- ✅ Configure Laravel
- ✅ Setup Nginx with SSL (via Certbot)
- ✅ Run migrations

**Time:** ~10 minutes

---

## 🛠️ Manual Setup (if needed)

### Step 1: Install Dependencies (5 min)

```bash
# Update system
apt update && apt upgrade -y

# Install PHP 8.3 and extensions
apt install -y software-properties-common
add-apt-repository ppa:ondrej/php -y
apt update

apt install -y php8.3 php8.3-cli php8.3-fpm php8.3-mysql php8.3-mbstring \
  php8.3-xml php8.3-curl php8.3-zip php8.3-gd php8.3-bcmath php8.3-intl

# Install MySQL
apt install -y mysql-server

# Install Nginx
apt install -y nginx

# Install Composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx

# Install Git
apt install -y git
```

### Step 2: Setup MySQL (3 min)

```bash
# Secure MySQL
mysql_secure_installation
# Press Y for all prompts, set root password

# Create database and user
mysql -u root -p
```

In MySQL:
```sql
CREATE DATABASE peaches_wellness;
CREATE USER 'peaches_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON peaches_wellness.* TO 'peaches_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Clone Code (2 min)

```bash
# Go to web root
cd /var/www

# Clone repository
git clone https://github.com/PanapatWonganan/peaches-wellness-backend.git
cd peaches-wellness-backend

# Install dependencies
composer install --optimize-autoloader --no-dev

# Set permissions
chown -R www-data:www-data /var/www/peaches-wellness-backend
chmod -R 755 /var/www/peaches-wellness-backend
chmod -R 775 /var/www/peaches-wellness-backend/storage
chmod -R 775 /var/www/peaches-wellness-backend/bootstrap/cache
```

### Step 4: Configure Laravel (3 min)

```bash
# Copy environment file
cp .env.production .env

# Generate app key
php artisan key:generate

# Edit .env
nano .env
```

Update these values:
```bash
APP_KEY=[generated key]
APP_URL=https://admin.peacheswellnessinthecity.com

DB_DATABASE=peaches_wellness
DB_USERNAME=peaches_user
DB_PASSWORD=YOUR_STRONG_PASSWORD
```

Save and exit (Ctrl+X, Y, Enter)

```bash
# Run migrations
php artisan migrate --force

# Create admin user
php artisan make:filament-user
# Enter: email and password

# Clear cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 5: Setup Nginx (5 min)

Create Nginx config:
```bash
nano /etc/nginx/sites-available/peaches-wellness
```

Paste this:
```nginx
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
```

Save and enable:
```bash
# Enable site
ln -s /etc/nginx/sites-available/peaches-wellness /etc/nginx/sites-enabled/

# Remove default
rm /etc/nginx/sites-enabled/default

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 6: Setup SSL with Certbot (3 min)

```bash
certbot --nginx -d admin.peacheswellnessinthecity.com
```

Follow prompts:
- Enter email
- Agree to terms
- Choose redirect HTTP to HTTPS: Yes

---

## 🌐 DNS Configuration

Add this DNS record in your domain provider:

```
Type: A
Name: admin
Value: YOUR_VPS_IP
TTL: 3600
```

**Wait 5-15 minutes** for DNS propagation.

---

## ✅ Testing

1. Visit: https://admin.peacheswellnessinthecity.com
2. Should see Laravel welcome page or redirect to /admin
3. Visit: https://admin.peacheswellnessinthecity.com/admin
4. Login with admin credentials
5. Test API: https://admin.peacheswellnessinthecity.com/api/health

---

## 🔄 Updates & Deployment

When you push new code to GitHub:

```bash
cd /var/www/peaches-wellness-backend

# Pull latest code
git pull origin main

# Install dependencies
composer install --optimize-autoloader --no-dev

# Run migrations
php artisan migrate --force

# Clear cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart PHP-FPM
systemctl restart php8.3-fpm
```

---

## 🔐 Security Checklist

- [ ] MySQL root password set
- [ ] Database user password is strong
- [ ] SSL certificate installed (HTTPS)
- [ ] APP_DEBUG=false in production
- [ ] Firewall enabled (UFW)
- [ ] SSH key authentication enabled
- [ ] Regular backups scheduled

---

## 🔥 Firewall Setup (Optional but Recommended)

```bash
# Enable UFW
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

---

## 📞 Troubleshooting

### Permission Denied
```bash
chown -R www-data:www-data /var/www/peaches-wellness-backend
chmod -R 775 /var/www/peaches-wellness-backend/storage
chmod -R 775 /var/www/peaches-wellness-backend/bootstrap/cache
```

### 502 Bad Gateway
```bash
systemctl status php8.3-fpm
systemctl restart php8.3-fpm
systemctl restart nginx
```

### Database Connection Error
```bash
# Check MySQL is running
systemctl status mysql

# Test connection
mysql -u peaches_user -p peaches_wellness
```

### View Logs
```bash
# Laravel logs
tail -f /var/www/peaches-wellness-backend/storage/logs/laravel.log

# Nginx error log
tail -f /var/nginx/error.log

# PHP-FPM log
tail -f /var/log/php8.3-fpm.log
```

---

## 🎯 Final URLs

- **Admin Panel:** https://admin.peacheswellnessinthecity.com/admin
- **API Base:** https://admin.peacheswellnessinthecity.com/api/v1
- **Health Check:** https://admin.peacheswellnessinthecity.com/api/health

---

**Ready to deploy!** 🚀
