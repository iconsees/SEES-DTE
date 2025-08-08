module.exports = {
  apps: [{
    name: "sees-dte-backend",
    script: "src/server.js",
    cwd: "./backend",
    env: { NODE_ENV: "production" }
  }]
}
