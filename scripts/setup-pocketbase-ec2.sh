#!/usr/bin/env bash
# setup-pocketbase-ec2.sh
#
# Run this on a fresh Ubuntu EC2 instance to install PocketBase as a systemd service.
# Usage:
#   chmod +x setup-pocketbase-ec2.sh
#   sudo ./setup-pocketbase-ec2.sh
#
# Requirements:
#   - Ubuntu 22.04 or later
#   - Run as root or with sudo

set -euo pipefail

PB_VERSION="0.22.20"
PB_DIR="/opt/pocketbase"
PB_USER="pocketbase"
PB_DATA_DIR="/var/lib/pocketbase"
PB_PORT="8090"

echo "=================================================="
echo " DomisLink — PocketBase EC2 Setup"
echo " Version: ${PB_VERSION}"
echo "=================================================="

# ── 1. Install prerequisites ──────────────────────────
echo "[1/6] Installing prerequisites..."
apt-get update -qq
apt-get install -y -qq unzip curl ufw

# ── 2. Create service user and directories ────────────
echo "[2/6] Creating system user and directories..."
id -u "$PB_USER" &>/dev/null || useradd --system --no-create-home --shell /usr/sbin/nologin "$PB_USER"
mkdir -p "$PB_DIR" "$PB_DATA_DIR"
chown "$PB_USER:$PB_USER" "$PB_DIR" "$PB_DATA_DIR"

# ── 3. Download PocketBase ────────────────────────────
echo "[3/6] Downloading PocketBase v${PB_VERSION}..."
ARCH="amd64"
[ "$(uname -m)" = "aarch64" ] && ARCH="arm64"

DOWNLOAD_URL="https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${ARCH}.zip"
TMP_ZIP="/tmp/pocketbase.zip"

curl -fsSL "$DOWNLOAD_URL" -o "$TMP_ZIP"
unzip -q "$TMP_ZIP" pocketbase -d "$PB_DIR"
rm "$TMP_ZIP"
chmod +x "${PB_DIR}/pocketbase"
chown "$PB_USER:$PB_USER" "${PB_DIR}/pocketbase"

echo "   PocketBase binary: ${PB_DIR}/pocketbase"

# ── 4. Create systemd service ─────────────────────────
echo "[4/6] Creating systemd service..."
cat > /etc/systemd/system/pocketbase.service <<EOF
[Unit]
Description=PocketBase — DomisLink database
After=network.target

[Service]
Type=simple
User=${PB_USER}
Group=${PB_USER}
WorkingDirectory=${PB_DIR}
ExecStart=${PB_DIR}/pocketbase serve \
  --http=0.0.0.0:${PB_PORT} \
  --dir=${PB_DATA_DIR}/pb_data \
  --publicDir=${PB_DATA_DIR}/pb_public
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=pocketbase

# Harden service
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=${PB_DATA_DIR}

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable pocketbase
systemctl start pocketbase

# ── 5. Configure UFW firewall ─────────────────────────
echo "[5/6] Configuring firewall..."
ufw allow ssh
ufw allow "$PB_PORT"/tcp
ufw --force enable

# ── 6. Verify service is running ─────────────────────
echo "[6/6] Verifying PocketBase is running..."
sleep 3

if systemctl is-active --quiet pocketbase; then
  PUBLIC_IP=$(curl -fsSL --max-time 5 http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "<your-ec2-ip>")
  echo ""
  echo "=================================================="
  echo " ✅ PocketBase is running!"
  echo ""
  echo " Admin UI:  http://${PUBLIC_IP}:${PB_PORT}/_/"
  echo " API:       http://${PUBLIC_IP}:${PB_PORT}/api/"
  echo ""
  echo " NEXT STEP: Open http://${PUBLIC_IP}:${PB_PORT}/_/"
  echo "   1. Create your admin account"
  echo "   2. Import the lessons collection schema:"
  echo "      scripts/pb-schema.json"
  echo "   3. Set PocketBase URL in your EB env vars:"
  echo "      POCKETBASE_URL=http://${PUBLIC_IP}:${PB_PORT}"
  echo "=================================================="
else
  echo "❌ PocketBase failed to start. Check logs:"
  echo "   journalctl -u pocketbase -n 50"
  exit 1
fi
