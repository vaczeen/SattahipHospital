# 🏥 Sattahip Hospital - เว็บไซต์โรงพยาบาลสัตหีบ 

> Better Information, Better Health

เว็บไซต์โรงพยาบาลสัตหีบ ระบบจัดการข้อมูลโรงพยาบาล ครอบคลุมหน้าเว็บข้อมูลทั่วไป ระบบจัดซื้อจัดจ้าง ระบบคลังสินค้า/เวชภัณฑ์ ระบบสั่งซื้อสินค้า และระบบจัดการพนักงาน

---

## 📋 สารบัญ

- [เทคโนโลยีที่ใช้](#-เทคโนโลยีที่ใช้)
- [เริ่มต้นใช้งาน](#-เริ่มต้นใช้งาน)
- [โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)
- [เส้นทาง (Routes) หน้าเว็บ](#-เส้นทาง-routes-หน้าเว็บ)
- [API Routes](#-api-routes)
- [ระบบคลังสินค้า (Inventory)](#-ระบบคลังสินค้า-inventory)
- [โครงสร้างฐานข้อมูล](#-โครงสร้างฐานข้อมูล)
- [ค่า Environment Variables](#-ค่า-environment-variables)

---

## 🛠 เทคโนโลยีที่ใช้

| เทคโนโลยี | รายละเอียด |
|-----------|------------|
| **Framework** | Next.js 15.5 (App Router + Turbopack) |
| **UI** | React 19, Tailwind CSS 4 |
| **State Management** | Zustand |
| **Database** | MySQL + Prisma ORM |
| **Authentication** | JWT (jsonwebtoken + bcryptjs) |
| **File Upload** | Cloudinary |
| **Charts** | amCharts 5 |
| **Icons** | Lucide React, React Icons, FontAwesome, HugeIcons |
| **Animation** | Motion (Framer Motion) |
| **HTTP Client** | Axios |
| **Thai Font** | Kanit (Google Fonts), PANITidyDemo (Local Font) |
| **Notifications** | LINE Notify, React Toastify |

---

## 🚀 เริ่มต้นใช้งาน

### Prerequisites

- Node.js 18+
- MySQL database
- Cloudinary account (สำหรับ upload รูปภาพ)

### ติดตั้ง

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. คัดลอกไฟล์ .env.example เป็น .env และกรอกค่า
cp .env.example .env

# 3. รัน Prisma migration
npx prisma migrate dev

# 4. Seed ข้อมูลพื้นฐาน
npm run prisma:seed

# 5. เริ่มต้น development server
npm run dev
```

เปิด browser ไปที่ **http://localhost:3000** จะเข้าสู่หน้าหลักของเว็บไซต์

### Scripts

| Command | คำอธิบาย |
|---------|----------|
| `npm run dev` | รัน dev server (Turbopack) |
| `npm run build` | Build สำหรับ production |
| `npm run start` | รัน production server |
| `npm run lint` | ตรวจสอบ code ด้วย ESLint |

---

## 🌐 เส้นทาง (Routes) หน้าเว็บ

### หน้าหลัก

| Path | คำอธิบาย |
|------|----------|
| `/` | หน้า Landing page (Header + Hero + HomePage + Footer) |

### 🌐 เว็บไซต์สาธารณะ (`/main/*`)

| Path | คำอธิบาย |
|------|----------|
| `/main` | หน้าแรกของเว็บสาธารณะ |
| `/main/about/vision` | วิสัยทัศน์โรงพยาบาล |
| `/main/about/history` | ประวัติโรงพยาบาล |
| `/main/about/purpose` | วัตถุประสงค์ |
| `/main/about/structure` | โครงสร้างองค์กร |
| `/main/about/department` | รายชื่อแผนก |
| `/main/about/department/[slug]` | รายละเอียดแผนก (ตาม slug) |
| `/main/services/clinics` | คลินิกทั้งหมด |
| `/main/services/clinics/OPD` | คลินิก OPD |
| `/main/services/clinics/IPD` | คลินิก IPD |
| `/main/services/clinics/Dent` | คลินิกทันตกรรม |
| `/main/services/clinics/PT` | คลินิกกายภาพบำบัด |
| `/main/services/clinics/PPCU` | คลินิก PPCU |
| `/main/services/clinics/SatPCU` | คลินิก SatPCU |
| `/main/services/clinics/SpecialClinic` | คลินิกเฉพาะทาง |
| `/main/services/clinics/ThaiMassage` | นวดแผนไทย |
| `/main/services/doctors` | รายชื่อแพทย์ |
| `/main/services/schedule` | ตารางเวลาให้บริการ |
| `/main/news` | ข่าวสาร |
| `/main/contact` | ติดต่อเรา |
| `/main/donate` | บริจาค |
| `/main/policy` | ระเบียบ/เอกสาร |
| `/main/externalAgencies` | หน่วยงานภายนอก |

### 🛒 จัดซื้อจัดจ้าง (`/main/procurement/*`)

| Path | คำอธิบาย |
|------|----------|
| `/main/procurement` | หน้าจัดซื้อจัดจ้าง (Public) |
| `/main/procurement/admin` | จัดการจัดซื้อจัดจ้าง (Admin) |

### 👤 ข้อมูลพนักงาน (`/main/employee/*`)

| Path | คำอธิบาย |
|------|----------|
| `/main/employee` | หน้าพนักงาน (ต้อง login) |
| `/main/employee/Sahakorn` | ข้อมูลสหกรณ์ |
| `/main/employee/SalaryModule` | 模块เงินเดือน |
| `/main/employee/TelNumber` | หมายเลขโทรศัพท์ |
| `/main/employee/Rules` | ระเบียบพนักงาน |

### 📦 ระบบคลังสินค้า/เวชภัณฑ์ (`/inventory/*`)

| Path | คำอธิบาย |
|------|----------|
| `/inventory` | หน้าเข้าสู่ระบบคลัง |
| `/inventory/admin` | Dashboard ผู้ดูแลระบบคลัง |
| `/inventory/admin/addproduct` | เพิ่มสินค้า |
| `/inventory/admin/manage` | จัดการสินค้า |
| `/inventory/admin/product` | รายการสินค้า |
| `/inventory/admin/category` | จัดการหมวดหมู่ |
| `/inventory/admin/orders` | จัดการคำสั่งซื้อ |
| `/inventory/admin/report` | รายงาน |
| `/inventory/user` | หน้าผู้ใช้งานคลัง |
| `/inventory/user/history` | ประวัติการสั่งซื้อ |

---

## 🔌 API Routes

### Authentication

| Method | Path | คำอธิบาย |
|--------|------|----------|
| POST | `/api/login` | เข้าสู่ระบบ (email + password → JWT token) |
| POST | `/api/register` | สมัครสมาชิก |
| POST | `/api/employee-login` | เข้าสู่ระบบพนักงาน |
| GET | `/api/current-admin` | ข้อมูล admin ปัจจุบัน |
| GET | `/api/current-user` | ข้อมูล user ปัจจุบัน |
| PUT | `/api/change-role` | เปลี่ยน role ผู้ใช้ |
| PUT | `/api/change-status` | เปลี่ยนสถานะผู้ใช้ |

### Products

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/api/products/[count]` | ดึงสินค้าตามจำนวน |
| GET | `/api/product/[id]` | ดึงสินค้าตาม ID |
| POST | `/api/product` | เพิ่มสินค้าใหม่ |
| GET | `/api/productby` | ดึงสินค้าโดย filter |
| GET | `/api/card` | ข้อมูลการ์ด (Product/Cart/History) |

### Categories

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET/POST | `/api/category` | ดึง/เพิ่มหมวดหมู่ |
| PUT/DELETE | `/api/category/[id]` | แก้ไข/ลบหมวดหมู่ |

### Users & Cart

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/api/users` | รายชื่อผู้ใช้ทั้งหมด |
| GET/PUT | `/api/user/cart` | ดึง/อัปเดตตะกร้าสินค้า |
| GET | `/api/user/order` | ดึงคำสั่งซื้อของ user |
| GET | `/api/user/department` | ดึงข้อมูลแผนกของ user |
| GET | `/api/search/filters` | ค้นหาสินค้าแบบ filter |

### Inventory Admin

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET/POST | `/api/admin` | จัดการสินค้า (Admin) |
| GET/PUT | `/api/admin-ecom/orders` | จัดการคำสั่งซื้อ |
| PUT | `/api/admin-ecom/order-status` | อัปเดตสถานะคำสั่งซื้อ |

### Departments & Documents

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET/POST | `/api/department` | จัดการแผนก |

### Images

| Method | Path | คำอธิบาย |
|--------|------|----------|
| POST | `/api/images` | อัปโหลด/จัดการรูปภาพ (Cloudinary) |
| DELETE | `/api/removeImage` | ลบรูปภาพ |

### Receive (รับสินค้า)

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET/POST | `/api/receive` | รายการรับสินค้า |
| GET/PUT/DELETE | `/api/receive/[id]` | จัดการรายการรับสินค้า |

### Webhook

| Method | Path | คำอธิบาย |
|--------|------|----------|
| POST | `/api/webhook/line` | LINE Webhook (LINE Notify / Messaging API) |

---

## 🧩 Components

| Component | ไฟล์ | คำอธิบาย |
|-----------|------|----------|
| Header | `components/Header.tsx` | Header นำทางหลัก |
| Footer | `components/Footer.tsx` | Footer ด้านล่าง |
| Hero | `components/Hero.tsx` | Hero section หน้าแรก |
| HomePage | `components/HomePage.tsx` | เนื้อหาหน้าแรก |
| NewsCard | `components/NewsCard.tsx` | การ์ดแสดงข่าวสาร |
| NewsModal | `components/NewsModal.tsx` | Modal แสดงรายละเอียดข่าว |
| InformationCard | `components/InformationCard.tsx` | การ์ดแสดงข้อมูลทั่วไป |
| EmployeeCard | `components/EmployeeCard.tsx` | การ์ดแสดงข้อมูลพนักงาน |
| AnnouncementPopup | `components/AnnouncementPopup.jsx` | Popup สำหรับประกาศ |

### Inventory Components (`app/api/card/`)

| Component | คำอธิบาย |
|-----------|----------|
| ProductCard | การ์ดสินค้า |
| CartCard | การ์ดตะกร้าสินค้า |
| ListCart | รายการตะกร้า |
| SearchCard | การ์ดค้นหา |
| SummaryCard | การ์ดสรุปยอด |
| HistoryCard | การ์ดประวัติ |
| PrintOrder | พิมพ์คำสั่งซื้อ |
| PrintReceive | พิมพ์ใบรับสินค้า |
| PrintReport | พิมพ์รายงาน |

### Route Protection (`app/api/routes/`)

| Component | คำอธิบาย |
|-----------|----------|
| AppRoutes | การกำหนดเส้นทาง |
| ProtectRouteAdmin | ป้องกันเส้นทาง admin |
| ProtectRouteUser | ป้องกันเส้นทาง user |
| LoadingToRedirect | Loading redirect |

---

## 🗃 โครงสร้างฐานข้อมูล (Prisma Schema)

| Model | คำอธิบาย |
|-------|----------|
| **User** | ผู้ใช้ระบบ (email, password, name, role, office, dept) |
| **Product** | สินค้า (title, price, quantity, sold, category) |
| **Category** | หมวดหมู่สินค้า |
| **Order** | คำสั่งซื้อ (products, cartTotal, orderStatus) |
| **ProductOnOrder** | รายการสินค้าในคำสั่งซื้อ |
| **Cart** | ตะกร้าสินค้า |
| **ProductOnCart** | รายการสินค้าในตะกร้า |
| **Image** | รูปภาพสินค้า (Cloudinary) |
| **Department** | แผนก (dept, deptcode, office) |
| **DepartmentConfig** | ตั้งค่าแผนก (slug, uploadPassword, uploadDir) |
| **DepartmentDocument** | เอกสารของแผนก |
| **PolicyDocument** | เอกสารระเบียบ |
| **Procurement** | จัดซื้อจัดจ้าง (title, fileUrl, category) |
| **ReceiveHistory** | ประวัติรับสินค้า |

---

## 📌 หมายเหตุ

- หน้าเว็บสาธารณะ `/main/*` ใช้ layout ที่มี Header + Footer อัตโนมัติ
- ระบบคลังสินค้า `/inventory/*` มี Auth interceptor ที่จะ redirect ไปหน้า login เมื่อ token หมดอายุ (401)
- พนักงานต้อง login ก่อนเข้า `/main/employee/*` (middleware ตรวจสอบ auth_token cookie)
- ไฟล์ที่ upload จะเก็บใน Cloudinary (ไม่เก็บใน server)
- State management ใช้ Zustand + persist (เก็บใน localStorage)
- Server Actions body size limit ตั้งไว้ที่ 10MB
