# 🌐 DNS Configuration Guide

คู่มือการตั้งค่า DNS สำหรับเชื่อม Domain กับ Railway และ Vercel

---

## 📋 สารบัญ

1. [ภาพรวม DNS Records](#ภาพรวม-dns-records)
2. [DNS Providers แนะนำ](#dns-providers-แนะนำ)
3. [ตั้งค่าสำหรับ Backend (Railway)](#ตั้งค่าสำหรับ-backend-railway)
4. [ตั้งค่าสำหรับ Frontend (Vercel)](#ตั้งค่าสำหรับ-frontend-vercel)
5. [ตรวจสอบ DNS](#ตรวจสอบ-dns)
6. [Troubleshooting](#troubleshooting)

---

## ภาพรวม DNS Records

สมมติ domain คุณคือ: `yourdomain.com`

### Records ที่ต้องตั้งค่า:

```
Domain                  Type    Target                              Purpose
---------------------------------------------------------------------------------------
yourdomain.com          A       76.76.21.21                        Frontend (Vercel)
www.yourdomain.com      CNAME   cname.vercel-dns.com               Frontend (Vercel)
api.yourdomain.com      CNAME   xxx.up.railway.app                 Backend (Railway)
```

---

## DNS Providers แนะนำ

### 1. Cloudflare (แนะนำ)
- ✅ ฟรี
- ✅ ใช้ง่าย
- ✅ Fast DNS propagation
- ✅ SSL/TLS support
- ✅ DDoS protection

### 2. Namecheap
- ✅ ถ้าซื้อ domain จาก Namecheap
- ⚠️ DNS propagation ช้ากว่า Cloudflare

### 3. GoDaddy
- ✅ ถ้าซื้อ domain จาก GoDaddy
- ⚠️ UI ซับซ้อนกว่า

### 4. Route53 (AWS)
- ✅ สำหรับ production ขนาดใหญ่
- ⚠️ มีค่าใช้จ่าย

---

## ตั้งค่าสำหรับ Backend (Railway)

### Step 1: เพิ่ม Custom Domain ใน Railway

1. เข้า Railway Dashboard
2. คลิกที่ **Backend Service**
3. ไปที่ **Settings** tab
4. ส่วน **Domains** คลิก **+ Custom Domain**
5. ใส่: `api.yourdomain.com`
6. คลิก **Add Domain**

Railway จะแสดงข้อมูลแบบนี้:
```
Domain: api.yourdomain.com
Target: superb-crm-backend-production-xxxx.up.railway.app
Status: Waiting for DNS
```

### Step 2: ตั้งค่า DNS

ไปที่ DNS Provider ของคุณ และเพิ่ม CNAME record:

```
Type: CNAME
Name: api
Target: superb-crm-backend-production-xxxx.up.railway.app
TTL: 3600 (หรือ Auto)
Proxy Status: DNS Only (ถ้าใช้ Cloudflare)
```

### ตัวอย่างการตั้งค่าตาม Provider:

#### Cloudflare:
```
1. Dashboard > DNS > Add record
2. Type: CNAME
3. Name: api
4. Target: superb-crm-backend-production-xxxx.up.railway.app
5. Proxy status: DNS only (สีเทา ☁️)
6. TTL: Auto
7. Save
```

#### Namecheap:
```
1. Dashboard > Domain List > Manage
2. Advanced DNS > Add New Record
3. Type: CNAME Record
4. Host: api
5. Value: superb-crm-backend-production-xxxx.up.railway.app
6. TTL: Automatic
7. Save
```

#### GoDaddy:
```
1. My Products > DNS > Manage Zones
2. Add > CNAME
3. Name: api
4. Value: superb-crm-backend-production-xxxx.up.railway.app
5. TTL: 1 Hour
6. Save
```

### Step 3: รอ SSL Certificate

- Railway จะ generate SSL certificate อัตโนมัติ
- รอประมาณ 5-15 นาที
- Status จะเปลี่ยนเป็น **Active** และมี 🔒

### Step 4: ทดสอบ

```bash
# ทดสอบ DNS
nslookup api.yourdomain.com

# ทดสอบ HTTPS
curl -I https://api.yourdomain.com

# ควรได้ HTTP 200 OK
```

---

## ตั้งค่าสำหรับ Frontend (Vercel)

### Option A: ใช้ Nameservers (แนะนำ - ง่ายที่สุด)

#### Step 1: เพิ่ม Domain ใน Vercel

1. เข้า Vercel Dashboard
2. เลือก Project
3. ไปที่ **Settings** > **Domains**
4. คลิก **Add**
5. ใส่: `yourdomain.com` และ `www.yourdomain.com`

#### Step 2: เปลี่ยน Nameservers

Vercel จะแสดง nameservers:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

ไปที่ Domain Registrar (ที่คุณซื้อ domain):

**Namecheap:**
```
1. Domain List > Manage
2. Nameservers > Custom DNS
3. ใส่:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
4. Save
```

**GoDaddy:**
```
1. My Products > Domains > Manage
2. Nameservers > Change
3. Custom > Enter my own nameservers
4. ใส่:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
5. Save
```

**Cloudflare:**
```
⚠️ ไม่สามารถใช้ Nameservers ได้
→ ใช้ Option B แทน
```

#### Step 3: รอ DNS Propagation

- รอประมาณ 10-60 นาที
- Vercel จะ setup SSL อัตโนมัติ
- Status จะเปลี่ยนเป็น **Valid Configuration**

---

### Option B: ใช้ A Record (สำหรับ Cloudflare หรือต้องการควบคุม DNS)

#### Step 1: เพิ่ม Domain ใน Vercel

1. เข้า Vercel Dashboard
2. เลือก Project
3. ไปที่ **Settings** > **Domains**
4. เพิ่ม `yourdomain.com` และ `www.yourdomain.com`

#### Step 2: ตั้งค่า DNS Records

ไปที่ DNS Provider และเพิ่ม records:

**Record 1: Root Domain (yourdomain.com)**
```
Type: A
Name: @ (หรือเว้นว่าง)
Value: 76.76.21.21
TTL: 3600 (หรือ Auto)
Proxy: ❌ DNS only (ถ้าใช้ Cloudflare)
```

**Record 2: WWW Subdomain (www.yourdomain.com)**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (หรือ Auto)
Proxy: ❌ DNS only (ถ้าใช้ Cloudflare)
```

#### ตัวอย่าง Cloudflare:

```
Add record 1:
- Type: A
- Name: @
- IPv4 address: 76.76.21.21
- Proxy status: DNS only (สีเทา ☁️)
- TTL: Auto
- Save

Add record 2:
- Type: CNAME
- Name: www
- Target: cname.vercel-dns.com
- Proxy status: DNS only (สีเทา ☁️)
- TTL: Auto
- Save
```

#### Step 3: ตั้งค่า Redirect (Optional)

ใน Vercel Dashboard:
```
1. Settings > Domains
2. คลิกที่ www.yourdomain.com > Edit
3. เลือก: Redirect to yourdomain.com
4. Save
```

---

## ตรวจสอบ DNS

### เช็คว่า DNS Propagate แล้วหรือยัง:

```bash
# เช็ค Backend (api subdomain)
nslookup api.yourdomain.com
dig api.yourdomain.com

# เช็ค Frontend (root domain)
nslookup yourdomain.com
dig yourdomain.com

# เช็ค WWW subdomain
nslookup www.yourdomain.com
dig www.yourdomain.com
```

### เช็คออนไลน์:

1. **WhatsMyDNS**: https://www.whatsmydns.net
   - ใส่ domain
   - เลือก record type (A หรือ CNAME)
   - ดูว่า propagate ครบทุก server หรือยัง

2. **DNSChecker**: https://dnschecker.org

---

## Troubleshooting

### ❌ DNS ไม่ Propagate

**สาเหตุ:**
- DNS propagation ใช้เวลา 10 นาที - 48 ชั่วโมง
- Cache ที่ local computer

**วิธีแก้:**
```bash
# Clear DNS cache

# macOS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Windows
ipconfig /flushdns

# Linux
sudo systemd-resolve --flush-caches
```

**หรือ:**
- รอ 24-48 ชั่วโมง
- ทดสอบด้วย mobile data (4G/5G)
- ใช้ Incognito/Private mode

---

### ❌ SSL Certificate Error

**สาเหตุ:**
- DNS ยัง propagate ไม่เสร็จ
- Cloudflare Proxy เปิดอยู่

**วิธีแก้:**
```bash
# ถ้าใช้ Cloudflare:
1. ไปที่ DNS settings
2. คลิกที่ cloud icon (🟠) ให้เป็น DNS only (☁️ สีเทา)
3. รอ 5-10 นาที
4. ลอง access ใหม่
```

---

### ❌ CNAME Conflict Error

**สาเหตุ:**
- มี record ซ้ำ (เช่น มี A record และ CNAME ชื่อเดียวกัน)

**วิธีแก้:**
```bash
1. ลบ record เก่าที่ชื่อเดียวกัน
2. เหลือแค่ CNAME record เดียว
3. Save
```

---

### ❌ Railway: Domain Invalid

**สาเหตุ:**
- DNS ยังไม่ชี้ไปที่ Railway

**วิธีแก้:**
```bash
1. ตรวจสอบ CNAME record ถูกต้องหรือไม่
2. รอ DNS propagate (5-30 นาที)
3. ลองลบ domain ใน Railway แล้วเพิ่มใหม่
```

---

### ❌ Vercel: Invalid Configuration

**สาเหตุ:**
- DNS records ไม่ถูกต้อง
- Nameservers ยังไม่เปลี่ยน

**วิธีแก้:**
```bash
Option A (Nameservers):
1. ตรวจสอบว่าเปลี่ยน Nameservers แล้วหรือยัง
2. รอ 10-60 นาที

Option B (A Record):
1. เช็ค A record: @ → 76.76.21.21
2. เช็ค CNAME: www → cname.vercel-dns.com
3. ปิด Cloudflare Proxy (ถ้ามี)
```

---

## 📊 DNS Record Summary

### ✅ Final DNS Configuration:

```
Record Type  Host/Name   Target/Value                          TTL    Proxy
---------------------------------------------------------------------------------------
A            @           76.76.21.21                          Auto   DNS only
CNAME        www         cname.vercel-dns.com                 Auto   DNS only
CNAME        api         xxx.up.railway.app                   Auto   DNS only
```

### Result URLs:
```
https://yourdomain.com           → Frontend (Vercel)
https://www.yourdomain.com       → Redirect to main (Vercel)
https://api.yourdomain.com       → Backend (Railway)
```

---

## 🎯 Checklist

หลังตั้งค่า DNS เสร็จ:

- [ ] `nslookup api.yourdomain.com` แสดง Railway IP
- [ ] `nslookup yourdomain.com` แสดง Vercel IP (76.76.21.21)
- [ ] `nslookup www.yourdomain.com` แสดง CNAME
- [ ] เปิด `https://api.yourdomain.com` ได้ (มี 🔒)
- [ ] เปิด `https://yourdomain.com` ได้ (มี 🔒)
- [ ] เปิด `https://www.yourdomain.com` redirect ไป main
- [ ] ไม่มี SSL warning

---

## 📞 Support Links

- **Cloudflare DNS Docs**: https://developers.cloudflare.com/dns/
- **Vercel DNS Docs**: https://vercel.com/docs/projects/domains
- **Railway DNS Docs**: https://docs.railway.app/deploy/exposing-your-app

---

**สำเร็จ!** 🎉

ตอนนี้ domain ของคุณพร้อมใช้งานแล้ว!
