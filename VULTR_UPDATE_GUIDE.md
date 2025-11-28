# 🔄 Vultr Deployment - Update Code Guide

**วิธีการ Update Code หลังจาก Deploy แล้ว**

---

## 🎯 Quick Reference

### Frontend Update
```bash
# 1. บนเครื่อง Mac - Push code
cd "/Users/panapat/Superb_form copy"
git add .
git commit -m "อธิบายการแก้ไข"
git push origin main

# 2. บน VPS - Deploy
ssh root@45.76.145.9 "/root/deploy-frontend.sh"
```

### Backend Update
```bash
# 1. บนเครื่อง Mac - Push code
cd "/Users/panapat/Superb_form copy/crm-backend"
git add .
git commit -m "อธิบายการแก้ไข"
git push origin main

# 2. บน VPS - Deploy
ssh root@45.76.145.9 "/root/deploy-backend.sh"
```

---

## 📱 Frontend Deployment (Next.js)

### แบบละเอียด - Manual

**1. แก้ไข code บนเครื่อง Mac:**
```bash
cd "/Users/panapat/Superb_form copy"
# แก้ไข code ตามต้องการ
git add .
git commit -m "Update: อธิบายสิ่งที่แก้ไข"
git push origin main
```

**2. Deploy บน VPS:**
```bash
ssh root@45.76.145.9
cd /var/www/superb-form
git pull origin main
npm install                    # ถ้ามี package ใหม่
npm run build
pm2 restart peaches-frontend
pm2 logs peaches-frontend --lines 50  # ดู logs
```

### แบบง่าย - ใช้ Deploy Script

**วิธีที่ง่ายที่สุด:**
```bash
# หลัง push code แล้ว รันคำสั่งเดียว:
ssh root@45.76.145.9 "/root/deploy-frontend.sh"
```

---

## ⚙️ Backend Deployment (Laravel)

### แบบละเอียด - Manual

**1. แก้ไข code บนเครื่อง Mac:**
```bash
cd "/Users/panapat/Superb_form copy/crm-backend"
# แก้ไข code ตามต้องการ
git add .
git commit -m "Update: อธิบายสิ่งที่แก้ไข"
git push origin main
```

**2. Deploy บน VPS:**
```bash
ssh root@45.76.145.9
cd /var/www/peaches-wellness-backend
git pull origin main
composer install --no-dev --optimize-autoloader  # ถ้ามี package ใหม่
php artisan config:cache
php artisan route:cache
php artisan view:cache
systemctl restart php8.3-fpm
```

**3. ถ้ามี Database Migration:**
```bash
php artisan migrate --force
```

### แบบง่าย - ใช้ Deploy Script

**วิธีที่ง่ายที่สุด:**
```bash
# หลัง push code แล้ว รันคำสั่งเดียว:
ssh root@45.76.145.9 "/root/deploy-backend.sh"
```

---

## 🛠️ Deploy Scripts (ติดตั้งครั้งแรก)

### สร้าง Frontend Deploy Script

```bash
ssh root@45.76.145.9
nano /root/deploy-frontend.sh
```

วางโค้ดนี้:
```bash
#!/bin/bash
echo "🚀 Deploying Frontend..."

cd /var/www/superb-form

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building..."
npm run build

echo "♻️  Restarting PM2..."
pm2 restart peaches-frontend

echo "✅ Frontend deployed successfully!"
echo "🌐 URL: https://peacheswellnessinthecity.com"

pm2 logs peaches-frontend --lines 20
```

บันทึก (Ctrl+X, Y, Enter) แล้วรัน:
```bash
chmod +x /root/deploy-frontend.sh
```

### สร้าง Backend Deploy Script

```bash
ssh root@45.76.145.9
nano /root/deploy-backend.sh
```

วางโค้ดนี้:
```bash
#!/bin/bash
echo "🚀 Deploying Backend..."

cd /var/www/peaches-wellness-backend

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
composer install --no-dev --optimize-autoloader

echo "🔧 Clearing caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "♻️  Restarting PHP-FPM..."
systemctl restart php8.3-fpm

echo "✅ Backend deployed successfully!"
echo "🌐 Admin: https://admin.peacheswellnessinthecity.com/admin"

tail -n 20 /var/www/peaches-wellness-backend/storage/logs/laravel.log
```

บันทึก (Ctrl+X, Y, Enter) แล้วรัน:
```bash
chmod +x /root/deploy-backend.sh
```

---

## 🎯 Workflow แนะนำ (ง่ายที่สุด)

### ขั้นตอนการ Update:

**1. แก้ไข Code บนเครื่อง**
```bash
# Frontend
cd "/Users/panapat/Superb_form copy"
# แก้ code...

# หรือ Backend
cd "/Users/panapat/Superb_form copy/crm-backend"
# แก้ code...
```

**2. Commit และ Push**
```bash
git add .
git commit -m "Fix: แก้ bug ในหน้า survey form"
git push origin main
```

**3. Deploy บน VPS (เลือก 1 คำสั่ง)**
```bash
# Deploy Frontend
ssh root@45.76.145.9 "/root/deploy-frontend.sh"

# Deploy Backend
ssh root@45.76.145.9 "/root/deploy-backend.sh"
```

**4. เสร็จ!** ✅

---

## 🔍 Troubleshooting

### ดู Logs

**Frontend Logs:**
```bash
ssh root@45.76.145.9
pm2 logs peaches-frontend
pm2 logs peaches-frontend --lines 100
```

**Backend Logs:**
```bash
ssh root@45.76.145.9
tail -f /var/www/peaches-wellness-backend/storage/logs/laravel.log
```

**Nginx Logs:**
```bash
tail -f /var/log/nginx/error.log
```

### Restart Services

**Restart Frontend:**
```bash
ssh root@45.76.145.9
pm2 restart peaches-frontend
```

**Restart Backend:**
```bash
ssh root@45.76.145.9
systemctl restart php8.3-fpm
systemctl restart nginx
```

### เช็คสถานะ

**Frontend:**
```bash
ssh root@45.76.145.9
pm2 status
```

**Backend:**
```bash
ssh root@45.76.145.9
systemctl status php8.3-fpm
systemctl status nginx
```

---

## 📝 กรณีพิเศษ

### ถ้ามี Database Migration (Backend)

```bash
ssh root@45.76.145.9
cd /var/www/peaches-wellness-backend
php artisan migrate --force
```

### ถ้าต้องการ Hard Restart ทุกอย่าง

```bash
ssh root@45.76.145.9

# Restart Frontend
pm2 restart peaches-frontend

# Restart Backend
systemctl restart php8.3-fpm
systemctl restart nginx

# Restart MySQL (ระวัง!)
systemctl restart mysql
```

### ถ้า Build Frontend ไม่ผ่าน

```bash
ssh root@45.76.145.9
cd /var/www/superb-form
rm -rf .next
rm -rf node_modules
npm install
npm run build
pm2 restart peaches-frontend
```

### ถ้า Backend Error

```bash
ssh root@45.76.145.9
cd /var/www/peaches-wellness-backend

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Check permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Restart
systemctl restart php8.3-fpm
```

---

## 🌐 URLs ที่ใช้งาน

**Frontend:**
- Main: https://peacheswellnessinthecity.com
- WWW: https://www.peacheswellnessinthecity.com

**Backend:**
- Admin Panel: https://admin.peacheswellnessinthecity.com/admin
- API Base: https://admin.peacheswellnessinthecity.com/api/v1

**Admin Credentials:**
```
Email: admin@peacheswellnessinthecity.com
Password: Peaches@Admin2024!
```

---

## 🔐 SSH เข้า VPS

```bash
ssh root@45.76.145.9
Password: *iR3)7!N]$z$+c]w
```

---

## ⚡ Quick Commands สำหรับจดจำ

```bash
# Deploy Frontend (หลัง push code)
ssh root@45.76.145.9 "/root/deploy-frontend.sh"

# Deploy Backend (หลัง push code)
ssh root@45.76.145.9 "/root/deploy-backend.sh"

# ดู Frontend logs
ssh root@45.76.145.9 "pm2 logs peaches-frontend --lines 50"

# ดู Backend logs
ssh root@45.76.145.9 "tail -n 50 /var/www/peaches-wellness-backend/storage/logs/laravel.log"

# Restart ทุกอย่าง
ssh root@45.76.145.9 "pm2 restart peaches-frontend && systemctl restart php8.3-fpm nginx"
```

---

## 📞 Support

ถ้ามีปัญหา ให้เช็คตามลำดับ:

1. ✅ Git push สำเร็จหรือเปล่า?
2. ✅ Deploy script รันสำเร็จหรือเปล่า?
3. ✅ ดู logs มี error อะไรมั้ย?
4. ✅ Restart services ดูหรือยัง?
5. ✅ Clear cache ครบหรือยัง?

---

**Created:** November 26, 2025
**Server:** Vultr VPS (45.76.145.9)
**Deployment:** Production Ready ✅
