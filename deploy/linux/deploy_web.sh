#!/usr/bin/env bash
set -euo pipefail

# Deploy and (re)start Next.js app as a systemd service
# Required envs (can be empty defaults):
# - NEXT_PUBLIC_API_BASE_URL: backend gateway base url
# - APP_PORT: port to listen (default 3000)
# - GIT_SHA: build identifier

APP_DIR="/opt/blog-system-web"
APP_PORT="${APP_PORT:-3000}"
SERVICE_USER="${SERVICE_USER:-$USER}"
export NEXT_PUBLIC_API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL:-}"
export NODE_ENV=production

# Resolve user home and potential NVM dir early for build step
USER_HOME=$(getent passwd "$SERVICE_USER" | cut -d: -f6 || echo "/home/$SERVICE_USER")
NVM_DIR="${NVM_DIR:-$USER_HOME/.nvm}"

cd "$APP_DIR"

# Prefer NVM if available; otherwise use system Node (/usr/local/bin)
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh" || true
  nvm use 20 >/dev/null 2>&1 || true
fi
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"

node -v || true
npm -v || true

echo "[INFO] Installing dependencies (including dev for build)..."
npm ci

echo "[INFO] Building Next.js app..."
npm run build

echo "[INFO] Pruning dev dependencies for runtime..."
npm prune --omit=dev

SERVICE_FILE="/etc/systemd/system/blog-system-web.service"
TMP_SERVICE_FILE="/tmp/blog-system-web.service"

cat > "$TMP_SERVICE_FILE" <<SERVICE
[Unit]
Description=blog-system-web (Next.js)
After=network.target

[Service]
Type=simple
User=${SERVICE_USER}
Environment=NODE_ENV=production
Environment=PORT=${APP_PORT}
Environment=NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
Environment=NVM_DIR=${NVM_DIR}
Environment=NODE_OPTIONS=--max-old-space-size=512
Environment=PATH=/usr/local/bin:/usr/bin:/bin
AmbientCapabilities=CAP_NET_BIND_SERVICE
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
NoNewPrivileges=true
WorkingDirectory=${APP_DIR}
ExecStart=/bin/bash -lc 'if [ -s ${NVM_DIR}/nvm.sh ]; then source ${NVM_DIR}/nvm.sh && nvm use 20 >/dev/null; fi; npm run start -- -p ${APP_PORT}'
Restart=always
RestartSec=3
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICE

if command -v sudo >/dev/null 2>&1; then SUDO=sudo; else SUDO=""; fi

$SUDO mv "$TMP_SERVICE_FILE" "$SERVICE_FILE"
$SUDO systemctl daemon-reload

echo "[INFO] Restarting blog-system-web.service..."
$SUDO systemctl enable blog-system-web.service
$SUDO systemctl restart blog-system-web.service

echo "[OK] Service restarted on port ${APP_PORT}. Git: ${GIT_SHA:-unknown}"


