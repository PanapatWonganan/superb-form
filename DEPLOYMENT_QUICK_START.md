# 🚀 Quick Start Guide - Deploy MVP to Production

คู่มือด่วนสำหรับการ deploy MVP ให้ลูกค้าทดสอบ

---

## 📋 Checklist ก่อน Deploy

- [ ] มี GitHub account และ push code แล้ว
- [ ] มี Railway account (ใช้ GitHub login)
- [ ] มี Vercel account (ใช้ GitHub login)
- [ ] มี Domain name พร้อมใช้งาน
- [ ] อ่าน [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md) แล้ว

---

## ⚡ 4 ขั้นตอนหลัก

### 1️⃣ Deploy Backend (Railway) - 15 นาที

```bash
# 1. Push backend code to GitHub
cd crm-backend
git init
git add .
git commit -m "Initial backend deployment"
git remote add origin https://github.com/YOUR_USERNAME/superb-crm-backend.git
git push -u origin main

# 2. ไปที่ Railway.app
# - Login with GitHub
# - New Project > Deploy from GitHub repo
# - เลือก "superb-crm-backend"
# - Add MySQL Database

# 3. ติดตั้ง Railway CLI
brew install railway  # หรือ npm i -g @railway/cli
railway login
cd crm-backend
railway link  # เลือก project ของคุณ

# 4. Setup Laravel
railway run php artisan key:generate --show
# Copy APP_KEY และใส่ใน Railway Environment Variables

railway run php artisan migrate --force
railway run php artisan make:filament-user
# ใส่ Email & Password สำหรับ admin
```

**Environment Variables ที่ต้องใส่ใน Railway:**
```bash
APP_NAME=Superb CRM
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:xxxxx  # จาก railway run php artisan key:generate --show
APP_URL=https://your-backend.railway.app

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

---

### 2️⃣ เชื่อม Custom Domain กับ Backend - 10 นาที

```bash
# 1. ใน Railway Dashboard
# - คลิกที่ Backend service > Settings > Domains
# - Add Custom Domain: api.yourdomain.com

# 2. ตั้งค่า DNS (ที่ Domain Registrar)
Type: CNAME
Name: api
Value: [railway-domain].up.railway.app
TTL: 3600

# 3. รอ SSL Certificate (5-10 นาที)

# 4. อัพเดท Environment Variables
APP_URL=https://api.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 5. Redeploy backend
```

---

### 3️⃣ Deploy Frontend (Vercel) - 10 นาที

```bash
# 1. ตรวจสอบว่า push code แล้ว
cd /path/to/Superb_form\ copy
git add .
git commit -m "Update frontend with API configuration"
git push

# 2. ไปที่ Vercel.com
# - Import Git Repository
# - เลือก repository ของคุณ
# - Add Environment Variable:
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# 3. Deploy
# - Vercel จะ build และ deploy อัตโนมัติ
```

---

### 4️⃣ เชื่อม Custom Domain กับ Frontend - 10 นาที

```bash
# 1. ใน Vercel Dashboard
# - Project > Settings > Domains
# - Add: yourdomain.com
# - Add: www.yourdomain.com

# 2. ตั้งค่า DNS

## Option A: ใช้ Nameservers (แนะนำ)
# ไปที่ Domain Registrar เปลี่ยน Nameservers:
ns1.vercel-dns.com
ns2.vercel-dns.com

## Option B: ใช้ A Record
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com

# 3. รอ DNS Propagation (10-60 นาที)
```

---

## ✅ ทดสอบระบบ

### ทดสอบ Backend:
```bash
# ทดสอบ API
curl https://api.yourdomain.com

# เข้า Admin Panel
# เปิด: https://api.yourdomain.com/admin
# Login ด้วย Email & Password ที่สร้างไว้
```

### ทดสอบ Frontend:
```bash
# เปิดเว็บไซต์
https://yourdomain.com

# ทดสอบ Form
# 1. กรอกข้อมูลครบ
# 2. Submit form
# 3. ตรวจสอบว่าข้อมูลเข้า backend หรือไม่
```

### ตรวจสอบ Data ใน Backend:
```bash
# เข้า Railway Shell
railway run php artisan tinker

# เช็คข้อมูล
> \App\Models\Lead::count();
> \App\Models\Lead::latest()->first();
> exit
```

---

## 🔗 URLs สรุป

เมื่อ deploy เสร็จจะได้ URLs ดังนี้:

```
Frontend:
https://yourdomain.com               ← เว็บไซต์หลัก
https://www.yourdomain.com           ← Redirect ไป main

Backend:
https://api.yourdomain.com           ← API Endpoint
https://api.yourdomain.com/admin     ← Admin Panel (Filament)

Database:
[Railway MySQL Service]              ← จัดการใน Railway Dashboard
```

---

## 🐛 Troubleshooting ปัญหาที่พบบ่อย

### ❌ CORS Error
```bash
# ตรวจสอบ CORS_ALLOWED_ORIGINS ใน Railway
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Redeploy backend
```

### ❌ 500 Internal Server Error
```bash
# ดู logs
# Railway Dashboard > Backend Service > Deployments > View Logs

# เช็ค APP_KEY
railway run php artisan key:generate --show

# เช็ค database
railway run php artisan migrate:status
```

### ❌ Database Connection Error
```bash
# ตรวจสอบ Environment Variables
# ใน Railway Dashboard > Backend Service > Variables

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
```

### ❌ Frontend ไม่เชื่อมต่อ Backend
```bash
# ตรวจสอบ Environment Variable ใน Vercel
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Redeploy frontend
# Vercel Dashboard > Deployments > Redeploy
```

### ❌ Domain ไม่ทำงาน
```bash
# ตรวจสอบ DNS
nslookup api.yourdomain.com
nslookup yourdomain.com

# รอ DNS Propagation (อาจใช้เวลา 24-48 ชั่วโมง)
# เช็คสถานะ: https://www.whatsmydns.net
```

---

## 📊 Architecture Diagram

```
                    ┌─────────────────┐
                    │   ลูกค้าใช้งาน    │
                    └────────┬────────┘
                             │
                   ┌─────────▼─────────┐
                   │  yourdomain.com   │
                   │  (Frontend - Next.js)
                   │  [Vercel]         │
                   └─────────┬─────────┘
                             │
                             │ fetch API
                             │
                   ┌─────────▼────────────┐
                   │ api.yourdomain.com   │
                   │ (Backend - Laravel)  │
                   │ [Railway]            │
                   └─────────┬────────────┘
                             │
                             │ MySQL
                             │
                   ┌─────────▼────────────┐
                   │  MySQL Database      │
                   │  [Railway]           │
                   └──────────────────────┘
```

---

## 📱 แชร์ให้ลูกค้าทดสอบ

เมื่อ deploy เสร็จให้ส่ง URL นี้ให้ลูกค้า:

```
🔗 https://yourdomain.com

📋 คำแนะนำสำหรับลูกค้า:
1. เปิดลิงก์ด้านบน
2. กรอกข้อมูลในฟอร์ม
3. ทดสอบทุกฟีเจอร์
4. ส่ง feedback กลับมา
```

---

## 🎯 Next Steps หลังจาก MVP

1. **Setup Monitoring**
   - Sentry (Error tracking)
   - Google Analytics
   - Railway Metrics

2. **Backup Database**
   - Railway Auto Backup
   - Export ข้อมูลสำคัญ

3. **Performance Optimization**
   - CDN (Cloudflare)
   - Image Optimization
   - Caching

4. **Security Hardening**
   - Rate Limiting
   - SSL/TLS Configuration
   - Security Headers

5. **Email Integration**
   - SMTP Setup
   - Mailgun/SendGrid
   - Email Notifications

---

## 📞 Support & Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Laravel Docs**: https://laravel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## ✨ เสร็จแล้ว!

ตอนนี้ MVP ของคุณพร้อมให้ลูกค้าทดสอบแล้วครับ! 🎉

หากมีปัญหาให้อ่านคู่มือฉบับเต็มที่: [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md)
