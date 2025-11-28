# 🍑 Peaches Wellness - Deployment Guide

**Domain:** peacheswellnessinthecity.com

---

## 🔗 Domain Structure (ที่เลือกใช้)

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Main Website)                                │
│  🌐 https://peacheswellnessinthecity.com              │
│  🌐 https://www.peacheswellnessinthecity.com          │
│     (redirect → main)                                   │
│                                                          │
│  Platform: Vercel                                       │
│  Tech: Next.js 15 + React 19                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Backend API                                            │
│  🔌 https://api.peacheswellnessinthecity.com          │
│                                                          │
│  Platform: Railway                                      │
│  Tech: Laravel 12 + MySQL                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Admin Panel (Filament)                                 │
│  ⚙️  https://api.peacheswellnessinthecity.com/admin    │
│                                                          │
│  Platform: Railway (same as API)                       │
│  Access: Admin credentials only                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 DNS Configuration

### DNS Records ที่ต้องตั้ง:

```
Record Type   Host/Name   Target/Value                              TTL
─────────────────────────────────────────────────────────────────────────
A             @           76.76.21.21                              3600
CNAME         www         cname.vercel-dns.com                     3600
CNAME         api         [your-railway-app].up.railway.app        3600
```

### ตัวอย่างใน DNS Provider:

**Cloudflare:**
```
Record 1:
  Type: A
  Name: @
  Content: 76.76.21.21
  Proxy: DNS only (☁️ สีเทา)
  TTL: Auto

Record 2:
  Type: CNAME
  Name: www
  Content: cname.vercel-dns.com
  Proxy: DNS only (☁️ สีเทา)
  TTL: Auto

Record 3:
  Type: CNAME
  Name: api
  Content: [จาก Railway Dashboard]
  Proxy: DNS only (☁️ สีเทา)
  TTL: Auto
```

---

## ⚙️ Environment Variables

### Railway (Backend):

```bash
APP_NAME=Peaches Wellness CRM
APP_ENV=production
APP_KEY=                    # จะ generate ภายหลัง
APP_DEBUG=false
APP_URL=https://api.peacheswellnessinthecity.com

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

CORS_ALLOWED_ORIGINS=https://peacheswellnessinthecity.com,https://www.peacheswellnessinthecity.com

LOG_CHANNEL=stack
LOG_LEVEL=info

FILESYSTEM_DISK=local
```

### Vercel (Frontend):

```bash
NEXT_PUBLIC_API_URL=https://api.peacheswellnessinthecity.com
```

---

## 🚀 Deployment Steps (Quick)

### 1. Deploy Backend (Railway) - 30 นาที

```bash
# 1. Push backend to GitHub
cd crm-backend
git init
git add .
git commit -m "Deploy Peaches Wellness backend to Railway"
git remote add origin YOUR_BACKEND_REPO_URL
git push -u origin main

# 2. Deploy on Railway
# - Login Railway.app
# - New Project → Deploy from GitHub
# - Select backend repo
# - Add MySQL Database

# 3. Setup Laravel
railway login
cd crm-backend
railway link

# Generate APP_KEY
railway run php artisan key:generate --show
# Copy และใส่ใน Railway Environment Variables

# Run migration
railway run php artisan migrate --force

# Create admin
railway run php artisan make:filament-user
```

**Environment Variables ใน Railway:**
- Copy จากส่วน "Environment Variables" ด้านบน
- ไปที่ Railway Dashboard > Backend Service > Variables
- คลิก "RAW Editor" → Paste → Update

---

### 2. Add Custom Domain - Backend (20 นาที)

**ใน Railway:**
1. Backend Service → Settings → Domains
2. Add Custom Domain: `api.peacheswellnessinthecity.com`
3. Copy Railway target URL

**ใน DNS Provider:**
```
Type: CNAME
Name: api
Value: [Railway target URL]
TTL: 3600
Proxy: DNS only (ถ้าใช้ Cloudflare)
```

**รอ:**
- 5-15 นาที สำหรับ SSL certificate
- Check: https://api.peacheswellnessinthecity.com

---

### 3. Deploy Frontend (Vercel) - 20 นาที

```bash
# 1. Push frontend to GitHub
cd /path/to/Superb_form
git add .
git commit -m "Deploy Peaches Wellness to Vercel"
git push

# 2. Deploy on Vercel
# - Login Vercel.com
# - Import Git Repository
# - Add Environment Variable:
#   Key: NEXT_PUBLIC_API_URL
#   Value: https://api.peacheswellnessinthecity.com
# - Deploy
```

---

### 4. Add Custom Domain - Frontend (20 นาที)

**ใน Vercel:**
1. Project → Settings → Domains
2. Add: `peacheswellnessinthecity.com`
3. Add: `www.peacheswellnessinthecity.com`

**ใน DNS Provider (เลือก 1 วิธี):**

**Option A: Nameservers (แนะนำ)**
```
เปลี่ยน Nameservers เป็น:
- ns1.vercel-dns.com
- ns2.vercel-dns.com
```

**Option B: A Record (สำหรับ Cloudflare)**
```
Record 1:
  Type: A
  Name: @
  Value: 76.76.21.21

Record 2:
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
```

**ตั้งค่า Redirect:**
- Vercel > Settings > Domains
- Click `www.peacheswellnessinthecity.com` > Edit
- Redirect to `peacheswellnessinthecity.com`

---

## ✅ Testing Checklist

### Backend Tests:
- [ ] เปิด https://api.peacheswellnessinthecity.com (มี 🔒)
- [ ] เปิด https://api.peacheswellnessinthecity.com/admin
- [ ] Login admin panel สำเร็จ
- [ ] Test API:
  ```bash
  curl -I https://api.peacheswellnessinthecity.com
  ```

### Frontend Tests:
- [ ] เปิด https://peacheswellnessinthecity.com (มี 🔒)
- [ ] เปิด https://www.peacheswellnessinthecity.com (redirect ไป main)
- [ ] ทดสอบ Language toggle (EN/TH)
- [ ] กรอก form ครบทุกข้อ
- [ ] Submit form สำเร็จ
- [ ] เห็น Size recommendation

### Integration Tests:
- [ ] Form data บันทึกลง backend
- [ ] ตรวจสอบใน Admin Panel มี lead ใหม่
- [ ] ทดสอบบน mobile

---

## 🔐 Admin Credentials

**Save This Information Securely!**

```
Admin Panel URL:
https://api.peacheswellnessinthecity.com/admin

Admin Email:
[ใส่ตอน railway run php artisan make:filament-user]

Admin Password:
[ใส่ตอน railway run php artisan make:filament-user]

Created Date:
[วันที่สร้าง]
```

---

## 📊 Architecture

```
User Browser
     ↓
peacheswellnessinthecity.com (Frontend - Vercel)
     ↓
POST /api/v1/leads
     ↓
api.peacheswellnessinthecity.com (Backend - Railway)
     ↓
MySQL Database (Railway)
```

---

## 🎯 URLs Summary

```
Public URLs:
  Main Site:    https://peacheswellnessinthecity.com
  WWW:          https://www.peacheswellnessinthecity.com

API URLs:
  Base:         https://api.peacheswellnessinthecity.com
  Leads:        https://api.peacheswellnessinthecity.com/api/v1/leads
  Health:       https://api.peacheswellnessinthecity.com/api/health

Admin URLs:
  Dashboard:    https://api.peacheswellnessinthecity.com/admin
  Login:        https://api.peacheswellnessinthecity.com/admin/login
```

---

## 🐛 Troubleshooting

### CORS Error
```
Error: "Access-Control-Allow-Origin" header is missing

Fix:
1. ตรวจสอบ CORS_ALLOWED_ORIGINS ใน Railway
2. ต้องมี: https://peacheswellnessinthecity.com,https://www.peacheswellnessinthecity.com
3. Redeploy backend
```

### DNS Not Working
```
Error: Domain not resolving

Fix:
1. รอ DNS propagation (10 นาที - 48 ชั่วโมง)
2. Check DNS: nslookup peacheswellnessinthecity.com
3. Check: https://www.whatsmydns.net
4. ถ้าใช้ Cloudflare ปิด Proxy (เป็น DNS only)
```

### SSL Certificate Error
```
Error: "Your connection is not private"

Fix:
1. รอ SSL certificate generation (5-10 นาที)
2. ถ้าใช้ Cloudflare ปิด Proxy
3. ใน Railway/Vercel dashboard เช็คสถานะ SSL
```

---

## 📱 Share with Client

เมื่อ deploy เสร็จให้ส่งข้อความนี้ให้ลูกค้า:

```
🎉 Peaches Wellness Form พร้อมใช้งานแล้วค่ะ!

🔗 เข้าใช้งานที่:
https://peacheswellnessinthecity.com

📋 วิธีใช้:
1. เปิดลิงก์ด้านบน
2. เลือกภาษา (EN/TH) ที่มุมซ้ายบน
3. กรอกข้อมูลในฟอร์ม
4. รับคำแนะนำไซส์ที่เหมาะสม!

✨ Features:
• รองรับภาษาไทยและอังกฤษ
• คำนวณไซส์แนะนำอัตโนมัติ
• ตอบคำถาม 12 ข้อ
• Mobile-friendly

🐛 พบปัญหา?
ส่ง feedback มาที่: [your-email]

ขอบคุณค่ะ! 🍑
```

---

## 📞 Support

**Railway:**
- Dashboard: https://railway.app
- Docs: https://docs.railway.app

**Vercel:**
- Dashboard: https://vercel.com
- Docs: https://vercel.com/docs

**Full Guide:**
- ดู: `DEPLOYMENT_QUICK_START.md`
- ดู: `RAILWAY_DEPLOYMENT_GUIDE.md`

---

**Ready to Deploy!** 🚀

Start here: `DEPLOYMENT_QUICK_START.md`
