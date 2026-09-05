# นโยบายและการสำรองข้อมูล (Database & Files Backup Policy)

คู่มือนี้กำหนดมาตรฐานการสำรองข้อมูล (Backup) และการกู้คืนข้อมูล (Restore) สำหรับระบบ **FINANCE CONTROL PLATFORM** เพื่อป้องกันความเสียหายของข้อมูลทางการเงินตามมาตรฐานความมั่นคงปลอดภัยภาครัฐ

---

## 1. นโยบายการสำรองข้อมูล (Backup Strategy)

- **Daily Backup**: สำรองฐานข้อมูล MySQL ทุกวันเวลา 01:00 น. (เก็บบันทึกย้อนหลัง 30 วัน)
- **Weekly Full Backup**: สำรองข้อมูลทั้งฐานข้อมูลและโฟลเดอร์ไฟล์แนบ (Uploads) ทุกวันอาทิตย์เวลา 02:00 น. (เก็บบันทึกย้อนหลัง 12 สัปดาห์)
- **Monthly Archive**: จัดเก็บไฟล์สำรองสิ้นเดือนไว้ใน Secure Remote Storage / Cloud Storage เพื่อประโยชน์ในการตรวจสอบทางบัญชีย้อนหลัง 10 ปี

---

## 2. สคริปต์สำรองข้อมูลฐานข้อมูล MySQL อัตโนมัติ

สร้างสคริปต์สำรองข้อมูลที่ `/var/scripts/backup_mysql.sh`:

```bash
sudo mkdir -p /var/scripts /var/backups/pdhfinance
sudo nano /var/scripts/backup_mysql.sh
```

ใส่เนื้อหาสคริปต์:

```bash
#!/bin/bash
# ====================================================================
# MySQL Automated Backup Script for FINANCE CONTROL PLATFORM
# ====================================================================

BACKUP_DIR="/var/backups/pdhfinance"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="pdhfinance"
DB_USER="pdhuser"
DB_PASS="StrongPassword123!@#"
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

# 1. Export MySQL Database with gzip compression
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_${TIMESTAMP}.sql.gz"

mysqldump --user="$DB_USER" --password="$DB_PASS" \
  --single-transaction \
  --quick \
  --routines \
  --triggers \
  --default-character-set=utf8mb4 \
  "$DB_NAME" | gzip -9 > "$BACKUP_FILE"

# 2. Set strict file permissions
chmod 600 "$BACKUP_FILE"

# 3. Log Result
if [ $? -eq 0 ]; then
  echo "[$(date)] SUCCESS: Database backup completed successfully to $BACKUP_FILE" >> /var/log/pdh_backup.log
else
  echo "[$(date)] ERROR: Database backup failed!" >> /var/log/pdh_backup.log
fi

# 4. Remove backups older than retention days
find "$BACKUP_DIR" -name "${DB_NAME}_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
```

กำหนดสิทธิ์ให้รันสคริปต์ได้:
```bash
sudo chmod +x /var/scripts/backup_mysql.sh
```

---

## 3. การตั้งเวลาทำงานอัตโนมัติด้วย Cron Job

เปิดแก้ไข Crontab:
```bash
sudo crontab -e
```

เพิ่มคำสั่งสำรองข้อมูลทุกวันเวลา 01:00 น.:
```cron
# รันสำรองฐานข้อมูล MySQL ทุกวันเวลา 01:00 น.
0 1 * * * /var/scripts/backup_mysql.sh

# สำรองโฟลเดอร์ไฟล์แนบ (Uploads) ทุกวันอาทิตย์เวลา 02:00 น.
0 2 * * 0 tar -czf /var/backups/pdhfinance/uploads_backup_$(date +\%Y\%m\%d).tar.gz /var/www/pdhfinance/uploads
```

---

## 4. ขั้นตอนการกู้คืนข้อมูล (Database Restoration Procedure)

ในกรณีเกิดเหตุฉุกเฉินหรือต้องการกู้คืนข้อมูล สามารถดำเนินการได้ดังนี้:

### 1. แตกไฟล์สำรองข้อมูล (.sql.gz)
```bash
gunzip -k /var/backups/pdhfinance/pdhfinance_backup_YYYYMMDD_HHMMSS.sql.gz
```

### 2. นำเข้าข้อมูลเข้าฐานข้อมูล MySQL
```bash
mysql -u pdhuser -p pdhfinance < /var/backups/pdhfinance/pdhfinance_backup_YYYYMMDD_HHMMSS.sql
```

### 3. ตรวจสอบความถูกต้องและรีสตาร์ทบริการ
```bash
pm2 restart pdhfinance
```
