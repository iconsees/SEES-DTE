// Ruta absoluta recomendada en producción (ajusta si cambia):
module.exports = {
  apps: [{
    name: "sees-dte-backend",
    script: "/var/www/SEES-DTE/backend/src/server.js",
    env: { NODE_ENV: "production" }
  }]
}
