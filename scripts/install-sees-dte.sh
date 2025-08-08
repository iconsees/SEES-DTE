#!/bin/bash
set -e
DOMAIN="dte.seesdata.com"
ADMIN_NOTIFY="lduarte@proyectosees.com"
APP_DIR="/var/www/SEES-DTE"
DB_NAME="sees_dte"
DB_USER="dte_user"
DB_PASS="Pl717200$$125er"

apt update && apt upgrade -y
apt install -y git curl build-essential nginx mysql-server
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm i -g pm2
apt install -y certbot python3-certbot-nginx

# MySQL 8.4+ (sin mysql_native_password)
mysql -uroot <<SQL
ALTER USER 'root'@'localhost' IDENTIFIED BY '${DB_PASS}';
FLUSH PRIVILEGES;
SQL
mysql -uroot -p"${DB_PASS}" <<SQL
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL

mkdir -p /var/www && cd /var/www
if [ ! -d "${APP_DIR}" ]; then mkdir -p "${APP_DIR}"; fi

# Se espera que ya exista el checkout del repo en ${APP_DIR}
cd "${APP_DIR}/backend"
cp -n .env.example .env || true
npm ci || npm install
npm run migrate || true

# PM2 config con ruta absoluta
cp -f "${APP_DIR}/deploy/pm2.config.js" "${APP_DIR}/deploy/pm2.config.js"
pm2 delete sees-dte-backend || true
pm2 start "${APP_DIR}/deploy/pm2.config.js"
pm2 save

cd "${APP_DIR}/frontend"
npm ci || npm install
npm run build

cp -f "${APP_DIR}/deploy/nginx.http.conf" /etc/nginx/sites-available/sees-dte
ln -sfn /etc/nginx/sites-available/sees-dte /etc/nginx/sites-enabled/sees-dte
nginx -t && systemctl reload nginx

# SSL
certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos -m "${ADMIN_NOTIFY}" --redirect || true

systemctl enable nginx
systemctl enable mysql
pm2 startup systemd -u $(logname) --hp /home/$(logname) || true
pm2 save

# @reboot check
cat >/usr/local/bin/check-sees-dte.sh <<'CHECK'
#!/bin/bash
if ! systemctl is-active --quiet mysql; then systemctl start mysql; fi
if ! systemctl is-active --quiet nginx; then systemctl start nginx; fi
if ! pm2 list | grep -q sees-dte-backend; then
  cd /var/www/SEES-DTE/backend || exit 1
  pm2 start /var/www/SEES-DTE/deploy/pm2.config.js
  pm2 save
fi
CHECK
chmod +x /usr/local/bin/check-sees-dte.sh
(crontab -l 2>/null | grep -q "check-sees-dte.sh") || (crontab -l 2>/dev/null; echo "@reboot /usr/local/bin/check-sees-dte.sh >> /var/log/sees-dte-startup.log 2>&1") | crontab -
echo "OK"
