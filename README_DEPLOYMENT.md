# 🚀 Superb Form - Production Deployment

คู่มือสำหรับการ deploy ระบบ Superb Form (MVP) ให้ลูกค้าทดสอบ

---

## 📁 โครงสร้างโปรเจกต์

```
Superb_form/
├── app/                          # Next.js Pages
├── components/                   # React Components
│   └── SurveyForm.tsx           # Form หน้าหลัก (ใช้ API)
├── lib/
│   └── api.ts                   # API Configuration (NEW ✨)
├── crm-backend/                 # Laravel Backend
│   ├── Procfile                 # Railway Web Config (NEW ✨)
│   ├── railway.json             # Railway Project Config (NEW ✨)
│   ├── nixpacks.toml            # Build Config (NEW ✨)
│   ├── .env.railway             # ENV Template (NEW ✨)
│   └── RAILWAY_SETUP.md         # Backend Setup Guide (NEW ✨)
├── .env.local                   # Frontend Dev ENV (NEW ✨)
├── .env.production              # Frontend Prod ENV (NEW ✨)
├── DEPLOYMENT_QUICK_START.md   # Quick Start Guide (NEW ✨)
└── RAILWAY_DEPLOYMENT_GUIDE.md # Full Deployment Guide (NEW ✨)
```

---

## 📚 เอกสารที่ต้องอ่าน

### 1. สำหรับคนที่รีบ (15-30 นาที)
**→ อ่าน: [`DEPLOYMENT_QUICK_START.md`](./DEPLOYMENT_QUICK_START.md)**
- คู่มือแบบย่อ step-by-step
- 4 ขั้นตอนหลัก deploy ได้เลย
- มี Checklist และ Troubleshooting

### 2. สำหรับคนที่อยากรู้รายละเอียด (1 ชั่วโมง)
**→ อ่าน: [`RAILWAY_DEPLOYMENT_GUIDE.md`](./RAILWAY_DEPLOYMENT_GUIDE.md)**
- คู่มือฉบับเต็ม แบบละเอียด
- อธิบายทุก step พร้อมภาพรวม
- มี Architecture Diagram
- Troubleshooting แบบละเอียด

### 3. สำหรับ Backend Developer
**→ อ่าน: [`crm-backend/RAILWAY_SETUP.md`](./crm-backend/RAILWAY_SETUP.md)**
- Setup Laravel backend บน Railway
- Environment Variables สำหรับ production

---

## 🎯 สิ่งที่เตรียมให้แล้ว

### ✅ Backend (Laravel) - Ready for Railway
- ✨ `Procfile` - รัน Laravel server
- ✨ `railway.json` - Railway configuration
- ✨ `nixpacks.toml` - Build process
- ✨ `.env.railway` - Production ENV template
- ✅ CORS ตั้งค่าแล้ว (รองรับ Frontend domain)
- ✅ MySQL database support
- ✅ Filament Admin Panel

### ✅ Frontend (Next.js) - Ready for Vercel
- ✨ `lib/api.ts` - API configuration helper
- ✨ `.env.local` - Development environment
- ✨ `.env.production` - Production environment template
- ✅ Form เชื่อมต่อ Backend API ผ่าน Environment Variable
- ✅ Size Calculator
- ✅ Multi-language (TH/EN)

---

## 🚀 Quick Deploy (TL;DR)

### Backend (Railway)
```bash
cd crm-backend
git init && git add . && git commit -m "Deploy to Railway"
# Push to GitHub
# Deploy on Railway.app
railway run php artisan key:generate --show
railway run php artisan migrate --force
railway run php artisan make:filament-user
```

### Frontend (Vercel)
```bash
# 1. อัพเดท .env.production ด้วย Backend URL
# 2. Push to GitHub
# 3. Import project ใน Vercel.com
# 4. เพิ่ม Environment Variable: NEXT_PUBLIC_API_URL
# 5. Deploy!
```

---

## 🔗 URLs หลังจาก Deploy

```
Frontend (Vercel):
https://yourdomain.com                    ← เว็บไซต์หลัก
https://www.yourdomain.com                ← www subdomain

Backend (Railway):
https://api.yourdomain.com                ← API Endpoint
https://api.yourdomain.com/api/v1/leads   ← Lead API
https://api.yourdomain.com/admin          ← Admin Panel
```

---

## 🛠️ Technology Stack

**Frontend:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4

**Backend:**
- Laravel 12
- PHP 8.2
- Filament 3 (Admin Panel)
- MySQL

**Hosting:**
- Frontend: Vercel
- Backend: Railway
- Database: Railway MySQL

---

## 🔐 Environment Variables

### Frontend (.env.production)
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Backend (Railway)
```bash
APP_KEY=base64:xxxxx
APP_URL=https://api.yourdomain.com
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
# ... (see full list in docs)
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

---

## 📊 Data Flow

```
User Browser
    ↓
Frontend (Vercel)
    ↓ POST /api/v1/leads
Backend API (Railway)
    ↓
MySQL Database (Railway)
    ↓
Admin Panel (Filament)
```

---

## ✅ Pre-Deployment Checklist

- [ ] Backend code pushed to GitHub
- [ ] Frontend code pushed to GitHub
- [ ] Railway account created
- [ ] Vercel account created
- [ ] Domain name ready (optional but recommended)
- [ ] Read DEPLOYMENT_QUICK_START.md
- [ ] ทดสอบ form ใน local environment

---

## 🧪 Testing Checklist

**หลังจาก Deploy:**

- [ ] Backend API respond: `curl https://api.yourdomain.com`
- [ ] Admin Panel เข้าได้: `https://api.yourdomain.com/admin`
- [ ] Frontend load ได้: `https://yourdomain.com`
- [ ] Form submit ได้และ data เข้า database
- [ ] ดู logs ใน Railway ไม่มี error
- [ ] ทดสอบบน mobile browser
- [ ] ทดสอบทั้ง 2 ภาษา (TH/EN)
- [ ] Size recommendation ทำงานถูกต้อง

---

## 🐛 Common Issues

### CORS Error
```bash
# Fix: อัพเดท CORS_ALLOWED_ORIGINS ใน Railway
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend ไม่เชื่อมต่อ Backend
```bash
# Fix: เช็ค Environment Variable ใน Vercel
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Database Connection Error
```bash
# Fix: ตรวจสอบ MySQL service ใน Railway active หรือไม่
```

**→ ดู Troubleshooting เพิ่มเติม: RAILWAY_DEPLOYMENT_GUIDE.md**

---

## 📞 Support

หากพบปัญหา:
1. อ่าน `DEPLOYMENT_QUICK_START.md` ส่วน Troubleshooting
2. อ่าน `RAILWAY_DEPLOYMENT_GUIDE.md` ส่วน Troubleshooting
3. ดู Railway Logs: Dashboard > Service > Deployments > View Logs
4. ดู Vercel Logs: Dashboard > Project > Deployments > Function Logs

---

## 📈 Next Steps (หลัง MVP)

1. ⚡ Performance Optimization
   - CDN (Cloudflare)
   - Image Optimization
   - Redis Cache

2. 🔒 Security Hardening
   - Rate Limiting
   - Security Headers
   - HTTPS Everywhere

3. 📧 Email Integration
   - Welcome Email
   - Notification Email
   - SMTP Setup

4. 📊 Analytics & Monitoring
   - Google Analytics
   - Sentry (Error Tracking)
   - Railway Metrics

5. 💾 Backup & Recovery
   - Database Auto Backup
   - Export Strategy
   - Disaster Recovery Plan

---

## 🎉 Ready to Deploy!

ตอนนี้คุณมีทุกอย่างที่ต้องการแล้ว!

**เริ่มต้นที่:** [`DEPLOYMENT_QUICK_START.md`](./DEPLOYMENT_QUICK_START.md)

---

**Created:** November 25, 2025
**Version:** 1.0.0
**Author:** Claude Code Assistant
