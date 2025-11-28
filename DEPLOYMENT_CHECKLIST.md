# ✅ Deployment Checklist - Superb Form MVP

พิมพ์หรือบันทึกไฟล์นี้เพื่อ track progress ในการ deploy

---

## 📅 วันที่: __________________

## 👤 ผู้ดำเนินการ: __________________

---

## Phase 1: เตรียมความพร้อม (15 นาที)

### บัญชีและเครื่องมือ
- [ ] มี GitHub account
- [ ] มี Railway account (https://railway.app)
- [ ] มี Vercel account (https://vercel.com)
- [ ] มี Domain name พร้อมใช้งาน
  - Domain: ________________________
  - Registrar: ________________________
- [ ] ติดตั้ง Railway CLI
  ```bash
  brew install railway  # หรือ npm i -g @railway/cli
  ```
- [ ] ติดตั้ง Git
- [ ] อ่านคู่มือ DEPLOYMENT_QUICK_START.md แล้ว

### โค้ดและไฟล์
- [ ] Frontend code push ขึ้น GitHub แล้ว
  - Repo URL: ________________________
- [ ] Backend code push ขึ้น GitHub แล้ว
  - Repo URL: ________________________
- [ ] ตรวจสอบไฟล์ที่สร้างใหม่:
  - [ ] `crm-backend/Procfile`
  - [ ] `crm-backend/railway.json`
  - [ ] `crm-backend/nixpacks.toml`
  - [ ] `crm-backend/.env.railway`
  - [ ] `lib/api.ts`
  - [ ] `.env.local`
  - [ ] `.env.production`

---

## Phase 2: Deploy Backend (Railway) - 30 นาที

### 2.1 สร้าง Project บน Railway
- [ ] Login Railway ด้วย GitHub
- [ ] คลิก "New Project"
- [ ] เลือก "Deploy from GitHub repo"
- [ ] เลือก backend repository
- [ ] ตั้งชื่อ project: ________________________
- [ ] รอให้ Railway detect โปรเจกต์

### 2.2 เพิ่ม MySQL Database
- [ ] คลิก "+ New" > "Database" > "MySQL"
- [ ] รอให้ MySQL deploy เสร็จ (status: Active)
- [ ] เช็คว่า MySQL service มี Environment Variables:
  - [ ] `MYSQLHOST`
  - [ ] `MYSQLPORT`
  - [ ] `MYSQLDATABASE`
  - [ ] `MYSQLUSER`
  - [ ] `MYSQLPASSWORD`

### 2.3 ตั้งค่า Environment Variables
- [ ] คลิกที่ Backend Service > Variables
- [ ] คลิก "RAW Editor"
- [ ] Copy-paste ค่าต่อไปนี้:

```bash
APP_NAME=Superb CRM
APP_ENV=production
APP_DEBUG=false
APP_KEY=
APP_URL=

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

CORS_ALLOWED_ORIGINS=

LOG_CHANNEL=stack
LOG_LEVEL=info
```

- [ ] คลิก "Update Variables"
- [ ] Redeploy backend (Settings > Redeploy)

### 2.4 Setup Laravel
- [ ] เปิด Terminal
- [ ] Login Railway:
  ```bash
  railway login
  ```
- [ ] Link project:
  ```bash
  cd crm-backend
  railway link
  ```
  เลือก project: ________________________

- [ ] Generate APP_KEY:
  ```bash
  railway run php artisan key:generate --show
  ```
  Copy key: ________________________

- [ ] เพิ่ม APP_KEY ใน Railway Environment Variables
- [ ] Redeploy backend

- [ ] Run migration:
  ```bash
  railway run php artisan migrate --force
  ```

- [ ] สร้าง Admin user:
  ```bash
  railway run php artisan make:filament-user
  ```
  - Email: ________________________
  - Password: ________________________

### 2.5 ทดสอบ Backend
- [ ] ดู Railway URL (Settings > Domains)
  - URL: ________________________
- [ ] เปิด URL ใน browser ดูว่า Laravel ทำงาน
- [ ] เข้า Admin Panel: `https://[your-backend].railway.app/admin`
- [ ] Login ด้วย Email/Password ที่สร้างไว้

---

## Phase 3: Custom Domain - Backend (20 นาที)

### 3.1 เพิ่ม Domain ใน Railway
- [ ] Backend Service > Settings > Domains
- [ ] คลิก "+ Custom Domain"
- [ ] ใส่: `api.yourdomain.com`
  - ใส่: ________________________
- [ ] คลิก "Add Domain"
- [ ] Copy Railway target:
  - Target: ________________________

### 3.2 ตั้งค่า DNS
ไปที่ DNS Provider (Cloudflare/Namecheap/GoDaddy):

- [ ] เพิ่ม CNAME record:
  - Type: CNAME
  - Name: `api`
  - Target: ________________________ (from Railway)
  - TTL: 3600
  - Proxy: **DNS only** (ถ้าใช้ Cloudflare)

### 3.3 รอ SSL Certificate
- [ ] รอ 5-15 นาที
- [ ] ใน Railway status เป็น "Active" และมี 🔒

### 3.4 อัพเดท Environment Variables
- [ ] อัพเดทใน Railway:
  ```bash
  APP_URL=https://api.yourdomain.com
  CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
  ```
  - APP_URL: ________________________
  - CORS: ________________________

- [ ] Redeploy backend

### 3.5 ทดสอบ Custom Domain
- [ ] Test DNS:
  ```bash
  nslookup api.yourdomain.com
  ```
- [ ] เปิด `https://api.yourdomain.com` (ต้องมี 🔒)
- [ ] เปิด `https://api.yourdomain.com/admin`

---

## Phase 4: Deploy Frontend (Vercel) - 20 นาที

### 4.1 อัพเดท .env.production
- [ ] แก้ไฟล์ `.env.production`:
  ```bash
  NEXT_PUBLIC_API_URL=https://api.yourdomain.com
  ```
  - ใส่: ________________________

- [ ] Commit และ Push:
  ```bash
  git add .
  git commit -m "Update API URL for production"
  git push
  ```

### 4.2 Deploy บน Vercel
- [ ] ไปที่ https://vercel.com
- [ ] คลิก "Add New" > "Project"
- [ ] Import Git Repository
- [ ] เลือก frontend repository
- [ ] Framework Preset: Next.js
- [ ] Root Directory: `./`
- [ ] เพิ่ม Environment Variable:
  - Key: `NEXT_PUBLIC_API_URL`
  - Value: ________________________
- [ ] คลิก "Deploy"
- [ ] รอ build เสร็จ (2-5 นาที)

### 4.3 ทดสอบ
- [ ] เปิด Vercel URL:
  - URL: ________________________
- [ ] ทดสอบกรอก form
- [ ] Submit form
- [ ] เช็คว่าข้อมูลเข้า backend:
  ```bash
  railway run php artisan tinker
  > \App\Models\Lead::count();
  > exit
  ```

---

## Phase 5: Custom Domain - Frontend (20 นาที)

### 5.1 เพิ่ม Domain ใน Vercel
- [ ] Project > Settings > Domains
- [ ] เพิ่ม domain:
  - [ ] `yourdomain.com`
  - [ ] `www.yourdomain.com`

### 5.2 ตั้งค่า DNS

**Option A: Nameservers (แนะนำ)**
- [ ] ใน Domain Registrar เปลี่ยน Nameservers:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`

**Option B: A Record (สำหรับ Cloudflare)**
- [ ] เพิ่ม A record:
  - Type: A
  - Name: @
  - Value: 76.76.21.21
  - Proxy: DNS only
- [ ] เพิ่ม CNAME:
  - Type: CNAME
  - Name: www
  - Value: cname.vercel-dns.com
  - Proxy: DNS only

### 5.3 รอ DNS Propagation
- [ ] รอ 10-60 นาที
- [ ] ใน Vercel status เป็น "Valid Configuration"

### 5.4 ตั้งค่า Redirect
- [ ] Vercel > Settings > Domains
- [ ] คลิกที่ `www.yourdomain.com` > Edit
- [ ] เลือก "Redirect to `yourdomain.com`"
- [ ] Save

### 5.5 ทดสอบ
- [ ] เปิด `https://yourdomain.com` (ต้องมี 🔒)
- [ ] เปิด `https://www.yourdomain.com` (ต้อง redirect)
- [ ] ทดสอบ form submit
- [ ] ทดสอบบน mobile

---

## Phase 6: Final Testing (30 นาที)

### 6.1 Backend Testing
- [ ] เปิด `https://api.yourdomain.com`
- [ ] เปิด `https://api.yourdomain.com/admin`
- [ ] Login admin panel สำเร็จ
- [ ] ดู Railway logs ไม่มี error
- [ ] Test API endpoint:
  ```bash
  curl https://api.yourdomain.com/api/v1/leads \
    -H "Content-Type: application/json" \
    -H "Accept: application/json"
  ```

### 6.2 Frontend Testing
- [ ] เปิด `https://yourdomain.com`
- [ ] ทดสอบ Language toggle (EN/TH)
- [ ] กรอก form ครบทุกข้อ
- [ ] Submit form สำเร็จ
- [ ] เห็นหน้า Result Page
- [ ] Size recommendation แสดงถูกต้อง

### 6.3 Integration Testing
- [ ] ข้อมูลจาก form เข้า database
- [ ] ตรวจสอบใน Admin Panel มี lead ใหม่
- [ ] ตรวจสอบใน Railway Shell:
  ```bash
  railway run php artisan tinker
  > $lead = \App\Models\Lead::latest()->first();
  > $lead->name
  > $lead->email
  > $lead->form_data
  > exit
  ```

### 6.4 Cross-Browser Testing
- [ ] Chrome (Desktop)
- [ ] Safari (Desktop)
- [ ] Firefox (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (Mobile)

### 6.5 Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Form submit < 2 seconds
- [ ] ไม่มี console errors
- [ ] SSL certificate ถูกต้องทุก domain

---

## Phase 7: Documentation & Handover (15 นาที)

### 7.1 สรุปข้อมูล URLs
```
Frontend:
Main:        https://yourdomain.com
WWW:         https://www.yourdomain.com

Backend:
API:         https://api.yourdomain.com
Admin:       https://api.yourdomain.com/admin

Admin Login:
Email:       ________________________
Password:    ________________________
```

### 7.2 สำรองข้อมูลสำคัญ
- [ ] Export database (Railway Dashboard > MySQL > Data)
- [ ] บันทึก Environment Variables (Railway & Vercel)
- [ ] บันทึก Admin credentials

### 7.3 Monitoring Setup (Optional)
- [ ] Setup Railway Metrics
- [ ] Setup Vercel Analytics
- [ ] Setup Google Analytics (optional)

---

## Phase 8: แชร์ให้ลูกค้า (5 นาที)

### 8.1 เตรียมข้อมูลให้ลูกค้า
```
🎉 MVP พร้อมทดสอบแล้วค่ะ!

🔗 URL: https://yourdomain.com

📋 วิธีใช้งาน:
1. เปิดลิงก์ด้านบน
2. เลือกภาษา (EN/TH) ที่มุมซ้ายบน
3. กรอกข้อมูลในฟอร์ม
4. กดปุ่ม "Next" หรือ "ถัดไป"
5. กรอกครบ 12 ข้อ
6. กดปุ่ม "Submit" หรือ "ส่งข้อมูล"
7. รับคำแนะนำไซส์ที่เหมาะสม!

✨ Features:
- รองรับ 2 ภาษา (ไทย/อังกฤษ)
- คำนวณไซส์แนะนำอัตโนมัติ
- บันทึกข้อมูลลงระบบ
- Mobile-friendly

🐛 พบปัญหาหรือมีข้อเสนอแนะ?
กรุณาส่ง feedback มาที่: [your-email]

ขอบคุณค่ะ! 🙏
```

- [ ] ส่ง URL และคำแนะนำให้ลูกค้า
- [ ] ขอ feedback จากลูกค้า

---

## ✅ Checklist สรุป

- [ ] Backend deploy สำเร็จ (Railway)
- [ ] Frontend deploy สำเร็จ (Vercel)
- [ ] Database setup เรียบร้อย
- [ ] Custom domains เชื่อมต่อแล้ว
- [ ] SSL certificates active
- [ ] Form submit ได้และบันทึก data
- [ ] Admin panel เข้าถึงได้
- [ ] ทดสอบครบทุก browser
- [ ] ส่งข้อมูลให้ลูกค้าแล้ว

---

## 🎉 สำเร็จ!

**วันที่เสร็จ:** __________________

**เวลาที่ใช้ทั้งหมด:** ________ ชั่วโมง

**หมายเหตุ:**
_________________________________________________
_________________________________________________
_________________________________________________

---

## 📞 Emergency Contact

หากมีปัญหาด่วน:

**Railway Support:**
- Help: https://railway.app/help
- Docs: https://docs.railway.app

**Vercel Support:**
- Help: https://vercel.com/support
- Docs: https://vercel.com/docs

**Laravel Docs:**
- https://laravel.com/docs

**Next.js Docs:**
- https://nextjs.org/docs

---

**Prepared by:** Claude Code Assistant
**Date:** November 25, 2025
**Version:** 1.0.0
