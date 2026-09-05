# FINANCE CONTROL PLATFORM
## ระบบบริหารการเงิน งบประมาณ ลูกหนี้ เจ้าหนี้ และเงินยืม สำหรับโรงพยาบาลและหน่วยงานราชการ

> **"เห็นเงิน เห็นหนี้ เห็นภาระผูกพัน เห็นกำหนดชำระ และตรวจสอบย้อนหลังได้จากระบบเดียว"**

---

## 1. ภาพรวมระบบ (System Overview)

**FINANCE CONTROL PLATFORM** เป็น Web Application ระดับ Enterprise ที่ออกแบบและพัฒนาขึ้นตามระเบียบการเงินการคลังและการพัสดุภาครัฐ เพื่อรองรับการดำเนินงานของฝ่ายการเงินและบัญชีของโรงพยาบาลศูนย์ โรงพยาบาลทั่วไป และหน่วยงานภาครัฐในประเทศไทย

### จุดเด่นสำคัญ:
- **Thai Fiscal Year Native**: รองรับปีงบประมาณไทย (1 ตุลาคม - 30 กันยายน) และคำนวณปี พ.ศ. อัตโนมัติ
- **Dynamic Aging Calculation**: คำนวณอายุหนี้ลูกหนี้และเจ้าหนี้แบบ Real-time (<30 วัน, 31-60 วัน, 61-90 วัน, >90 วัน)
- **Real-time Budget Control Engine**: ตรวจสอบวงเงินงบประมาณคงเหลือ (`Available = Allocated + Adjustment - Committed - Spent`) ก่อนทำรายการจ่าย
- **Government Loan & Clearance Workflow**: ติดตามวงจรเงินยืมราชการ แจ้งเตือน 7, 3, 1 วันก่อนครบกำหนด 30 วัน พร้อมระบบล้างเงินยืมแบบหลายรูปแบบ (คืนเงินสด / หักล้างใบเสร็จ / เบิกเพิ่ม)
- **Bank Reconciliation & Period Lock**: กระทบยอดเงินฝากธนาคาร และล็อกงวดบัญชีรายวัน/รายเดือนเพื่อป้องกันการแก้ไขย้อนหลัง
- **Granular RBAC & Security**: สิทธิ์การใช้งาน 10 บทบาท (Super Admin, CFO, Finance, Budget, Auditor ฯลฯ) พร้อม HttpOnly Cookie, Password Hashing และ Immutable Audit Trail

---

## 2. สถาปัตยกรรมและเทคโนโลยี (Architecture & Tech Stack)

- **Frontend / Backend**: Next.js 14 (App Router), React 18, TypeScript, React Server Components
- **Styling**: Tailwind CSS (Navy Blue Theme: `#08294F`, `#0D3768`, `#1687E8`, `#08A7A4`, `#FF4664`, `#F5F8FC`)
- **Icons & Visualization**: Lucide Icons, Recharts
- **Data Tables**: TanStack Table
- **Forms & Validation**: React Hook Form, Zod
- **Database & ORM**: MySQL 8 (`utf8mb4`), Prisma ORM
- **Exporting**: Excel (`xlsx`), PDF & Print Layout A4
- **Security**: Argon2 / bcrypt, HttpOnly Secure Cookies, Session Timeout, Anti-Brute Force, Rate Limiting, Audit Logging

---

## 3. โครงสร้างโฟลเดอร์ (Project Structure)

```
pdhfinance/
├── prisma/
│   └── schema.prisma         # Prisma Schema ครอบคลุม 25+ Models (MySQL 8)
├── src/
│   ├── app/
│   │   ├── (auth)/login/     # หน้าเข้าสู่ระบบ พร้อม CAPTCHA Security & Demo Switcher
│   │   ├── (dashboard)/      # Layout ผู้บริหาร (Navy Sidebar + Header + Search)
│   │   │   ├── dashboard/    # Executive Dashboard 12 KPIs & Interactive Charts
│   │   │   ├── cash-bank/    # ทะเบียนบัญชีธนาคาร, Bank Tx, Reconciliation, Closing
│   │   │   ├── receivables/  # ทะเบียนลูกหนี้ AR, Aging, รับชำระ, ใบเสร็จรับเงิน RC
│   │   │   ├── payables/     # ทะเบียนเจ้าหนี้ AP, อนุมัติตั้งจ่าย, ใบสำคัญจ่าย PV
│   │   │   ├── commitments/  # ภาระผูกพัน PO/สัญญา (วิเคราะห์กระแสเงินสด 7/15/30/60 วัน)
│   │   │   ├── loans/        # เงินยืมราชการ LN และใบเคลียร์ล้างเงินยืม CL
│   │   │   ├── budget/       # โครงสร้างงบประมาณ, ควบคุมงบ, โอนเปลี่ยนแปลงงบ
│   │   │   ├── revenue/      # บันทึกรายได้และเงินบำรุงแยกตามแหล่งเงิน (UC, SSS, CSMBS)
│   │   │   ├── reports/      # ศูนย์รายงานการเงิน 16 ชุด + Excel Export & Print A4
│   │   │   ├── notifications/# ศูนย์แจ้งเตือนสถานะทางการเงิน
│   │   │   ├── audit/        # ประวัติการตรวจสอบย้อนหลัง พร้อม JSON Diff
│   │   │   └── settings/     # ข้อมูลหลัก (Master) และผู้ใช้งาน (Users & RBAC)
│   │   ├── api/              # RESTful API Endpoints
│   │   ├── globals.css       # Design System, Thai Typography (Sarabun), Print Styles
│   │   ├── layout.tsx        # Root Layout
│   │   └── page.tsx          # Landing Page (ปัญหาที่พบ, ความสามารถ, ขั้นตอน, ผลลัพธ์)
│   ├── components/           # Reusable UI & Layout Components
│   └── lib/                  # Utilities (Fiscal Year, Number Generator, RBAC, Store)
├── docs/
│   ├── DEPLOYMENT.md         # คู่มือการติดตั้งบน Ubuntu 24.04 VPS (Nginx, PM2, SSL)
│   └── BACKUP.md             # นโยบายและสคริปต์สำรองข้อมูลฐานข้อมูล MySQL
├── .env.example              # ตัวอย่าง Environment Variables
└── package.json
```

---

## 4. การติดตั้งและเริ่มต้นใช้งาน (Installation & Setup)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่าไฟล์สภาพแวดล้อม (.env)
คัดลอกไฟล์ `.env.example` ไปเป็น `.env`:
```bash
cp .env.example .env
```
กำหนดค่า `DATABASE_URL` และ `SESSION_SECRET`

### 3. สร้างฐานข้อมูลและ Prisma Client
```bash
npx prisma generate
npx prisma db push
```

### 4. รันระบบสำหรับ Development
```bash
npm run dev
```
เปิดบราวเซอร์ไปที่ `http://localhost:3000`

### 5. Build สำหรับ Production
```bash
npm run build
npm run start
```

---

## 5. บัญชีผู้ใช้สำหรับการทดสอบ (Demo Accounts)

| ผู้ใช้งาน | รหัสผ่าน | บทบาท (Role) | หน้าที่และความรับผิดชอบ |
|---|---|---|---|
| `admin` | `password123` | **SUPER_ADMIN** | ผู้ดูแลระบบสูงสุด จัดการสิทธิ์และตั้งค่า |
| `cfo` | `password123` | **CFO** | รอง ผอ. ฝ่ายการเงิน อนุมัติการเบิกจ่ายและงบประมาณ |
| `finance` | `password123` | **FINANCE** | เจ้าหน้าที่การเงิน บันทึกลูกหนี้ เจ้าหนี้ ยืมเงิน |
| `budget` | `password123` | **BUDGET** | เจ้าหน้าที่งบประมาณ จัดสรรและโอนเปลี่ยนแปลงงบ |
| `auditor` | `password123` | **AUDITOR** | ผู้ตรวจสอบภายใน ตรวจสอบประวัติ Audit Trail |

---

## 6. เอกสารคู่มือเพิ่มเติม

- [คู่มือการ Deploy บน Ubuntu 24.04 VPS (docs/DEPLOYMENT.md)](docs/DEPLOYMENT.md)
- [นโยบายและการสำรองข้อมูลฐานข้อมูล (docs/BACKUP.md)](docs/BACKUP.md)

---

## 7. ลิขสิทธิ์และมาตรฐานการพัฒนา

พัฒนาขึ้นตามมาตรฐานความมั่นคงปลอดภัยสารสนเทศ **OWASP Top 10** และพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล **(PDPA)**
