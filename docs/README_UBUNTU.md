# Guía rápida Ubuntu (sin Docker)
1) Instalar Node 18+, Nginx, PM2, MySQL
2) Copiar `.env.example` a `.env` en backend/ y completar
3) `cd backend && npm install && npm run migrate && pm2 start ../deploy/pm2.config.js && pm2 save`
4) `cd ../frontend && npm install && npm run build`
5) Nginx: copiar `deploy/nginx.ssl.conf` y habilitar; luego Certbot
