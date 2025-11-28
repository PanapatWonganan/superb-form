# 🚀 คู่มือการ Deploy Laravel Backend บน Railway

## 📋 สารบัญ
1. [เตรียม Backend สำหรับ Deployment](#1-เตรียม-backend-สำหรับ-deployment)
2. [สร้าง Project บน Railway](#2-สร้าง-project-บน-railway)
3. [ตั้งค่า Database](#3-ตั้งค่า-database)
4. [ตั้งค่า Environment Variables](#4-ตั้งค่า-environment-variables)
5. [Deploy Backend](#5-deploy-backend)
6. [เชื่อมต่อ Custom Domain](#6-เชื่อมต่อ-custom-domain)
7. [อัพเดท Frontend Configuration](#7-อัพเดท-frontend-configuration)
8. [ทดสอบระบบ](#8-ทดสอบระบบ)

---

## 1. เตรียม Backend สำหรับ Deployment

### ✅ ไฟล์ที่ได้สร้างให้แล้ว:
- `crm-backend/Procfile` - กำหนดคำสั่งรัน Laravel
- `crm-backend/railway.json` - การตั้งค่า Railway
- `crm-backend/nixpacks.toml` - การตั้งค่า build process
- `crm-backend/.env.railway` - ตัวอย่าง environment variables

### 📦 Push Code ขึ้น GitHub

```bash
cd crm-backend

# สร้าง Git repository ถ้ายังไม่มี
git init

# เพิ่มไฟล์ทั้งหมด
git add .

# Commit
git commit -m "Prepare Laravel backend for Railway deployment"

# สร้าง repository ใหม่บน GitHub แล้ว push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**⚠️ สำคัญ:** ตรวจสอบว่าไฟล์ `.env` อยู่ใน `.gitignore` (ไม่ให้ push ขึ้น GitHub)

---

## 2. สร้าง Project บน Railway

### ขั้นตอน:

1. **เข้าสู่ Railway**
   - ไปที่: https://railway.app
   - คลิก **"Login"** (ใช้ GitHub account)

2. **สร้าง New Project**
   - คลิก **"New Project"**
   - เลือก **"Deploy from GitHub repo"**
   - เลือก repository **`crm-backend`** ของคุณ
   - Railway จะเริ่ม detect โครงสร้างโปรเจกต์อัตโนมัติ

3. **ตั้งชื่อ Project**
   - คลิกที่ชื่อ project ด้านบน
   - ตั้งชื่อเป็น `superb-crm-backend` (หรือชื่อที่คุณต้องการ)

---

## 3. ตั้งค่า Database

### เพิ่ม MySQL Database:

1. **เพิ่ม Database Service**
   - ใน Project dashboard คลิก **"+ New"**
   - เลือก **"Database"**
   - เลือก **"Add MySQL"**
   - Railway จะสร้าง MySQL instance ให้อัตโนมัติ

2. **รอให้ Database Deploy เสร็จ**
   - ดูที่แท็บ "Deployments" จะเห็นสถานะ
   - เมื่อเสร็จจะเห็นสถานะเป็น "Active"

3. **ดู Database Credentials**
   - คลิกที่ MySQL service
   - ไปที่แท็บ **"Variables"**
   - คุณจะเห็น:
     - `MYSQLHOST`
     - `MYSQLPORT`
     - `MYSQLDATABASE`
     - `MYSQLUSER`
     - `MYSQLPASSWORD`
   - Railway จะ inject ค่าเหล่านี้เข้า backend service อัตโนมัติ

---

## 4. ตั้งค่า Environment Variables

### กลับไปที่ Backend Service:

1. **คลิกที่ Backend Service** (ไม่ใช่ Database)
2. **ไปที่แท็บ "Variables"**
3. **เพิ่ม Variables ต่อไปนี้:**

```bash
# Application Settings
APP_NAME=Superb CRM
APP_ENV=production
APP_DEBUG=false
APP_KEY=
# ⬆️ เว้นว่างไว้ก่อน จะ generate ทีหลัง

# Application URL
APP_URL=https://your-backend-domain.railway.app
# ⬆️ เปลี่ยนเป็น domain ที่ Railway generate ให้ หรือ custom domain

# Database - Railway จะ inject อัตโนมัติ
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# CORS Settings
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.your-domain.com
# ⬆️ เปลี่ยนเป็น Frontend URL ของคุณ (แยกด้วย comma)

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=info

# Storage
FILESYSTEM_DISK=local
```

### 📝 วิธีเพิ่ม Variables:

**Option 1: เพิ่มทีละตัว**
- คลิก **"+ New Variable"**
- ใส่ชื่อและค่า
- คลิก **"Add"**

**Option 2: Raw Editor (แนะนำ)**
- คลิก **"RAW Editor"** ที่มุมขวาบน
- Copy-paste ค่าทั้งหมดข้างบนเลย
- คลิก **"Update Variables"**

---

## 5. Deploy Backend

### Deploy และ Setup Database:

1. **Trigger Redeploy**
   - ไปที่แท็บ **"Settings"**
   - scroll ลงมาหาส่วน **"Deploys"**
   - คลิก **"Redeploy"** (เพื่อให้ใช้ environment variables ใหม่)

2. **รอให้ Deploy เสร็จ**
   - ไปที่แท็บ **"Deployments"**
   - ดูสถานะจะเห็น build logs กำลังรอ
   - รอจนขึ้น **"Success"** และ **"Active"**

3. **เข้า Railway Shell เพื่อ Setup Laravel**
   ```bash
   # ใน Railway dashboard ของ backend service
   # 1. ไปที่แท็บ "Settings"
   # 2. Scroll ลงไปหาส่วน "Service"
   # 3. คลิก "Create Service Token" (copy token ไว้)

   # หรือเชื่อม Railway CLI:
   ```

### ติดตั้ง Railway CLI (ในเครื่องของคุณ):

```bash
# macOS
brew install railway

# หรือใช้ npm
npm i -g @railway/cli

# Login
railway login

# Link project
cd crm-backend
railway link
# เลือก project "superb-crm-backend"
# เลือก environment "production"
```

### Run Laravel Artisan Commands:

```bash
# Generate APP_KEY
railway run php artisan key:generate --show

# Copy key ที่ได้ แล้วเพิ่มใน Environment Variables:
# APP_KEY=base64:xxxxxxxxxxxxxxxxxxxxx

# Run Migration
railway run php artisan migrate --force

# Create Storage Link
railway run php artisan storage:link

# Create Admin User (Filament)
railway run php artisan make:filament-user
# ใส่ Email และ Password สำหรับ admin
```

### ✅ ตรวจสอบ Backend URL:

1. ใน Railway dashboard คลิกที่ backend service
2. ไปที่แท็บ **"Settings"**
3. ส่วน **"Domains"** จะเห็น URL แบบนี้:
   ```
   https://superb-crm-backend-production.up.railway.app
   ```
4. เปิด URL นี้ในเบราว์เซอร์ควรเห็นหน้า Laravel

---

## 6. เชื่อมต่อ Custom Domain

### 6.1 สำหรับ Backend (Railway):

1. **เพิ่ม Custom Domain ใน Railway**
   - ใน Backend service ไปที่แท็บ **"Settings"**
   - ส่วน **"Domains"** คลิก **"+ Custom Domain"**
   - ใส่ domain เช่น `api.yourdomain.com`
   - คลิก **"Add Domain"**

2. **ตั้งค่า DNS**
   - Railway จะแสดง CNAME record ให้
   - ไปที่ DNS provider ของคุณ (เช่น Cloudflare, GoDaddy, Namecheap)
   - เพิ่ม CNAME record:
     ```
     Type: CNAME
     Name: api (หรือ subdomain ที่คุณต้องการ)
     Value: [railway-domain].up.railway.app
     TTL: Auto หรือ 3600
     ```
   - **หมายเหตุ:** ถ้าใช้ Cloudflare ปิด "Proxied" (เป็น DNS only) ก่อน

3. **รอ SSL Certificate**
   - Railway จะ generate SSL certificate อัตโนมัติ
   - รอประมาณ 5-10 นาที
   - เมื่อเสร็จจะเห็นสถานะเป็น "Active" และมี 🔒

4. **อัพเดท Environment Variables**
   ```bash
   # เปลี่ยน APP_URL และ CORS_ALLOWED_ORIGINS
   APP_URL=https://api.yourdomain.com
   CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```
   - Save แล้ว Redeploy

---

### 6.2 สำหรับ Frontend (Vercel):

1. **เข้าสู่ Vercel Dashboard**
   - ไปที่: https://vercel.com/dashboard
   - เลือก project frontend ของคุณ

2. **เพิ่ม Custom Domain**
   - ไปที่แท็บ **"Settings"** > **"Domains"**
   - คลิก **"Add"**
   - ใส่ domain เช่น:
     - `yourdomain.com`
     - `www.yourdomain.com`
   - คลิก **"Add"**

3. **ตั้งค่า DNS**
   - Vercel จะแสดงวิธีตั้งค่า DNS

   **วิธีที่ 1: ใช้ Nameservers (แนะนำ)**
   ```
   # เปลี่ยน Nameservers ที่ Domain Registrar เป็น:
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

   **วิธีที่ 2: ใช้ A Record**
   ```
   Type: A
   Name: @ (root domain)
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **รอ DNS Propagation**
   - รอประมาณ 10-60 นาที
   - Vercel จะ setup SSL อัตโนมัติ

5. **ตั้งค่า Redirect (Optional)**
   - Redirect `www.yourdomain.com` → `yourdomain.com`
   - ใน Vercel Settings > Domains
   - คลิกที่ `www.yourdomain.com` > Edit > เลือก Redirect to `yourdomain.com`

---

## 7. อัพเดท Frontend Configuration

### 7.1 เพิ่ม Environment Variables ใน Vercel:

1. **ไปที่ Vercel Dashboard**
   - เลือก project frontend
   - ไปที่ **"Settings"** > **"Environment Variables"**

2. **เพิ่ม Variables:**
   ```bash
   # API URL
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   # หรือ
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```

3. **Save แล้ว Redeploy**
   - ไปที่แท็บ **"Deployments"**
   - คลิก 3 จุด (...) ของ latest deployment
   - เลือก **"Redeploy"**

---

### 7.2 อัพเดท API Calls ใน Frontend Code:

ผมต้องดูโค้ด frontend ของคุณก่อนครับว่า API calls อยู่ตรงไหน

---

## 8. ทดสอบระบบ

### ✅ Checklist การทดสอบ:

**Backend:**
```bash
# ทดสอบ Backend URL
curl https://api.yourdomain.com

# ทดสอบ API endpoint
curl https://api.yourdomain.com/api/health
# หรือ endpoint อื่นๆ ที่คุณมี

# ทดสอบ Filament Admin Panel
# เปิด: https://api.yourdomain.com/admin
```

**Frontend:**
```bash
# เปิด frontend domain
https://yourdomain.com

# ทดสอบ Form submission
# กรอก form แล้วส่ง ดูว่าเชื่อมต่อ backend ได้หรือไม่
```

**Database:**
```bash
# ตรวจสอบว่า data บันทึกลง database
railway run php artisan tinker
# > \App\Models\User::count();
# > \App\Models\Customer::count(); // หรือ model อื่นๆ
```

---

## 🔍 Troubleshooting

### ปัญหาที่พบบ่อย:

**1. CORS Error**
```bash
# ตรวจสอบ CORS_ALLOWED_ORIGINS มี frontend URL หรือไม่
# ใน Railway Environment Variables:
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Redeploy backend
```

**2. 500 Error**
```bash
# ดู logs ใน Railway
# คลิกที่ backend service > Deployments > View Logs

# เช็ค APP_KEY
railway run php artisan key:generate --show

# เช็ค database connection
railway run php artisan migrate:status
```

**3. Database Connection Error**
```bash
# ตรวจสอบ Environment Variables
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
# ... ฯลฯ

# ตรวจสอบ MySQL service ว่า Active หรือไม่
```

**4. Domain ไม่ทำงาน**
```bash
# ตรวจสอบ DNS
nslookup api.yourdomain.com

# ตรวจสอบ SSL
curl -I https://api.yourdomain.com

# รอ DNS propagation (อาจใช้เวลาถึง 24-48 ชั่วโมง)
```

**5. Session/Cookie Issues**
```bash
# ใน Railway Environment Variables เพิ่ม:
SESSION_DOMAIN=.yourdomain.com
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none

# Redeploy
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                                │
└─────────────┬───────────────────────────────┬───────────────┘
              │                               │
              │                               │
    ┌─────────▼─────────┐         ┌──────────▼────────────┐
    │  yourdomain.com   │         │  www.yourdomain.com   │
    │  (Frontend)       │         │  (Redirect to main)   │
    │  [Vercel]         │         │  [Vercel]             │
    └─────────┬─────────┘         └───────────────────────┘
              │
              │ API Calls
              │
    ┌─────────▼──────────────────────┐
    │  api.yourdomain.com            │
    │  (Backend API)                 │
    │  [Railway - Laravel]           │
    └─────────┬──────────────────────┘
              │
              │ Database Queries
              │
    ┌─────────▼──────────────────────┐
    │  MySQL Database                │
    │  [Railway - MySQL Service]     │
    └────────────────────────────────┘
```

---

## 🎯 สรุป URLs

```bash
# Frontend URLs:
https://yourdomain.com              # Main site
https://www.yourdomain.com          # Redirect to main

# Backend URLs:
https://api.yourdomain.com          # API endpoint
https://api.yourdomain.com/admin    # Filament Admin Panel
```

---

## 📞 ติดต่อ Support

- **Railway**: https://railway.app/help
- **Vercel**: https://vercel.com/support
- **Laravel**: https://laravel.com/docs

---

## 🚀 Next Steps หลัง MVP

1. **ตั้งค่า Email** (SMTP, Mailgun, SendGrid)
2. **เพิ่ม Queue Workers** (สำหรับ background jobs)
3. **Setup Monitoring** (Sentry, LogRocket)
4. **Backup Database** (Railway auto-backup หรือใช้บริการอื่น)
5. **CDN** (Cloudflare) สำหรับ static assets
6. **Redis** (Cache & Session) เพิ่มความเร็ว

---

**หมายเหตุ:** คู่มือนี้เขียนไว้ ณ วันที่ 25 พฤศจิกายน 2568
UI/UX ของ Railway และ Vercel อาจเปลี่ยนแปลงในอนาคต
