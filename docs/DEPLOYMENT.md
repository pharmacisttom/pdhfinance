# คู่มือการติดตั้งระบบบน Ubuntu 24.04 LTS VPS (Deployment Guide)

คู่มือนี้อธิบายขั้นตอนการนำระบบ **FINANCE CONTROL PLATFORM** ไปใช้งานจริงบนเครื่อง Server / VPS ระบบปฏิบัติการ **Ubuntu 24.04 LTS** ด้วย **Node.js LTS, Nginx Reverse Proxy, PM2 Process Manager, MySQL 8 และ SSL (Let's Encrypt)**

---

## 1. เตรียมความพร้อม Server (System Prerequisites)

อัปเดตระบบปฏิบัติการและติดตั้งแพ็กเกจพื้นฐาน:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw fail2ban unzip build-essential
```

---

## 2. ติดตั้ง Node.js LTS (v20.x หรือ v22.x)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v # ตรวจสอบเวอร์ชัน Node.js
npm -v  # ตรวจสอบเวอร์ชัน npm
```

ติดตั้ง PM2 สำหรับจัดการ Process การทำงานของแอปพลิเคชัน:
```bash
sudo npm install -g pm2
```

---

## 3. ติดตั้งและตั้งค่า MySQL 8 Database Server

```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

สร้างฐานข้อมูลและผู้ใช้งานสำหรับระบบ (กำหนด collation เป็น `utf8mb4_unicode_ci`):

```sql
sudo mysql -u root -p

CREATE DATABASE pdhfinance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pdhuser'@'localhost' IDENTIFIED BY 'StrongPassword123!@#';
GRANT ALL PRIVILEGES ON pdhfinance.* TO 'pdhuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 4. Clone Source Code และ Build Production

สร้างไดเรกทอรีสำหรับแอปพลิเคชัน:

```bash
sudo mkdir -p /var/www/pdhfinance
sudo chown -R $USER:$USER /var/www/pdhfinance
cd /var/www/pdhfinance

# Clone Source Code จาก Git Repository
git clone https://github.com/your-org/pdhfinance.git .

# ติดตั้ง Dependencies
npm install

# สร้างโฟลเดอร์สำหรับอัปโหลดไฟล์
mkdir -p uploads

# สร้างและแก้ไขไฟล์ .env
cp .env.example .env
nano .env
```

### การตั้งค่าใน `.env`:
```ini
NODE_ENV="production"
PORT=3000
APP_NAME="FINANCE CONTROL PLATFORM"
APP_URL="https://finance.your-hospital.go.th"
TZ="Asia/Bangkok"
DEFAULT_FISCAL_YEAR=2569

DATABASE_URL="mysql://pdhuser:StrongPassword123!@#@localhost:3306/pdhfinance?charset=utf8mb4"
SESSION_SECRET="e9f1c7d8b5a32468172938475620193847561029384756"
COOKIE_SECURE=true
UPLOAD_DIR="/var/www/pdhfinance/uploads"
```

### ทำการ Migrate Database และ Build Production:
```bash
npx prisma generate
npx prisma migrate deploy
npm run build
```

---

## 5. เริ่มต้นการทำงานด้วย PM2

```bash
pm2 start npm --name "pdhfinance" -- start -- -p 3000

# ตั้งค่าให้ PM2 ทำงานอัตโนมัติเมื่อ Server Restart
pm2 startup
pm2 save
```

คำสั่งจัดการ PM2 ที่สำคัญ:
```bash
pm2 status pdhfinance     # ตรวจสอบสถานะ
pm2 logs pdhfinance       # ดู Application Logs
pm2 restart pdhfinance    # รีสตาร์ทระบบ
```

---

## 6. ติดตั้งและตั้งค่า Nginx Reverse Proxy

ติดตั้ง Nginx:
```bash
sudo apt install -y nginx
```

สร้างไฟล์ Configuration สำหรับ Nginx:
```bash
sudo nano /etc/nginx/sites-available/pdhfinance
```

ใส่เนื้อหา Configuration ดังนี้:
```nginx
server {
    listen 80;
    server_name finance.your-hospital.go.th;

    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

เปิดใช้งานไซต์และทดสอบ Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/pdhfinance /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 7. ติดตั้ง SSL Certificate ฟรีด้วย Certbot (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d finance.your-hospital.go.th
```

---

## 8. การตั้งค่า Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 9. การอัปเดตระบบเวอร์ชันใหม่ (Update / CI/CD)

```bash
cd /var/www/pdhfinance
git pull origin main
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 reload pdhfinance
```
