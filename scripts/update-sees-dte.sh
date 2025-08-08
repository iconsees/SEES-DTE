#!/bin/bash
APP_DIR="/var/www/SEES-DTE"
cd "$APP_DIR" || { echo "No existe $APP_DIR"; exit 1; }
git reset --hard
git pull origin main || true
cd backend && (npm ci || npm install)
cd ../frontend && (npm ci || npm install) && npm run build
pm2 restart sees-dte-backend --update-env
nginx -t && systemctl reload nginx
