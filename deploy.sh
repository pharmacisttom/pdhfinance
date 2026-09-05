#!/usr/bin/env bash
# ==============================================================================
# FINANCE CONTROL PLATFORM - AUTOMATED VPS DEPLOYMENT SCRIPT
# Domain: https://finance.pluakdaenghospital.cloud
# Repository: https://github.com/pharmacisttom/pdhfinance.git
# OS: Ubuntu 22.04 / 24.04 LTS
# ==============================================================================

set -e

DOMAIN="finance.pluakdaenghospital.cloud"
REPO_URL="https://github.com/pharmacisttom/pdhfinance.git"
APP_DIR="/var/www/pdhfinance"
DB_NAME="pdhfinance"
DB_USER="pdhuser"
DB_PASS="PdhFinanceSecure2026!@#"
ADMIN_EMAIL="admin@pluakdaenghospital.cloud"

echo "======================================================================"
echo " Starting Automated Deployment for https://${DOMAIN}"
echo "======================================================================"

# 1. Update system packages
echo ">>> [1/9] Updating system packages..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw fail2ban unzip build-essential nginx certbot python3-certbot-nginx mysql-server

# 2. Install Node.js 20 LTS & PM2
echo ">>> [2/9] Installing Node.js 20 LTS and PM2..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi
sudo npm install -g pm2

# 3. Configure MySQL Database
echo ">>> [3/9] Configuring MySQL 8 Database..."
sudo systemctl enable mysql
sudo systemctl start mysql

sudo mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 4. Clone or update repository
echo ">>> [4/9] Setting up application source code at ${APP_DIR}..."
sudo mkdir -p "${APP_DIR}"
sudo chown -R $USER:$USER "${APP_DIR}"

if [ -d "${APP_DIR}/.git" ]; then
  cd "${APP_DIR}"
  git fetch --all
  git reset --hard origin/main
else
  git clone "${REPO_URL}" "${APP_DIR}"
  cd "${APP_DIR}"
fi

# 5. Configure environment variables (.env)
echo ">>> [5/9] Creating .env configuration..."
SECRET_KEY=$(openssl rand -hex 32)
cat <<EOF > "${APP_DIR}/.env"
NODE_ENV="production"
PORT=3000
APP_NAME="FINANCE CONTROL PLATFORM"
APP_URL="https://${DOMAIN}"
TZ="Asia/Bangkok"
DEFAULT_FISCAL_YEAR=2567

DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@localhost:3306/${DB_NAME}?charset=utf8mb4"
SESSION_SECRET="${SECRET_KEY}"
COOKIE_SECURE=true
UPLOAD_DIR="${APP_DIR}/uploads"
EOF

mkdir -p "${APP_DIR}/uploads"

# 6. Install dependencies and build Next.js app
echo ">>> [6/9] Installing dependencies and building Next.js application..."
cd "${APP_DIR}"
npm install
npx prisma generate
npx prisma db push --accept-data-loss
node prisma/seed.js || true
node scripts/update-admin-password.js || true
npm run build

# 7. Start application with PM2
echo ">>> [7/9] Starting application process with PM2..."
pm2 delete pdhfinance 2>/dev/null || true
pm2 start npm --name "pdhfinance" -- start -- -p 3000
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME || true

# 8. Configure Nginx Reverse Proxy
echo ">>> [8/9] Configuring Nginx Reverse Proxy..."
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"
sudo tee "${NGINX_CONF}" > /dev/null <<EOF
server {
    listen 80;
    server_name ${DOMAIN};

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    gzip on;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

sudo ln -sf "${NGINX_CONF}" "/etc/nginx/sites-enabled/"
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# 9. Setup SSL Certificate (Let's Encrypt)
echo ">>> [9/9] Obtaining SSL Certificate via Let's Encrypt Certbot..."
sudo certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos -m "${ADMIN_EMAIL}" --redirect || {
  echo "⚠️ SSL issuance was skipped or encountered an issue. (Ensure DNS A record points to this VPS IP)."
}

# Firewall setup
sudo ufw allow 'Nginx Full'
sudo ufw allow 22/tcp
sudo ufw --force enable || true

echo "======================================================================"
echo " 🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "======================================================================"
echo " Web Application URL : https://${DOMAIN}"
echo " Super Admin Username: admin"
echo " Super Admin Password: pdhfinance10832"
echo " App Directory       : ${APP_DIR}"
echo " Database Name       : ${DB_NAME} (User: ${DB_USER})"
echo " PM2 Status          : pm2 status pdhfinance"
echo " Nginx Status        : sudo systemctl status nginx"
echo "======================================================================"
