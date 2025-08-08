#!/bin/bash
DOMAIN="dte.seesdata.com"
LOGFILE="/var/log/ssl_renewal.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$DATE] Verificando SSL $DOMAIN" >> $LOGFILE
certbot renew --quiet --deploy-hook "systemctl reload nginx && echo '[$DATE] Renovado' >> $LOGFILE"
