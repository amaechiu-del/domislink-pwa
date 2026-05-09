#!/usr/bin/env bash
# generate-curriculum.sh
#
# Seeds the DomisLink database with 60 WAEC lessons via the API.
# Usage:
#   ./scripts/generate-curriculum.sh [API_URL]
#
# Examples:
#   ./scripts/generate-curriculum.sh                             # uses localhost:3001
#   ./scripts/generate-curriculum.sh http://my-eb-env.amazonaws.com

set -euo pipefail

API_URL="${1:-http://localhost:3001}"

echo "=================================================="
echo " DomisLink — Curriculum Generator"
echo " Target: ${API_URL}"
echo "=================================================="

echo "[1/2] Checking API health..."
HEALTH=$(curl -fsSL --max-time 10 "${API_URL}/api/health" 2>&1) || {
  echo "❌ API is not reachable at ${API_URL}"
  echo "   Make sure the API is running and POCKETBASE_URL is set."
  exit 1
}
echo "   Response: ${HEALTH}"

echo ""
echo "[2/2] Generating curriculum (60 lessons across 6 subjects)..."
RESULT=$(curl -fsSL --max-time 120 -X POST "${API_URL}/api/curriculum/generate" \
  -H "Content-Type: application/json") || {
  echo "❌ Curriculum generation request failed."
  exit 1
}

echo "   Response: ${RESULT}"

SUCCESS=$(echo "$RESULT" | grep -o '"success":true' || true)
if [ -n "$SUCCESS" ]; then
  CREATED=$(echo "$RESULT" | grep -o '"created":[0-9]*' | grep -o '[0-9]*' || echo "?")
  ERRORS=$(echo "$RESULT" | grep -o '"errors":[0-9]*' | grep -o '[0-9]*' || echo "?")
  echo ""
  echo "=================================================="
  echo " ✅ Curriculum generated!"
  echo "    Lessons created: ${CREATED}"
  echo "    Errors:          ${ERRORS}"
  echo ""
  echo " Open your app and navigate to /lessons to see them."
  echo "=================================================="
else
  echo ""
  echo "❌ Generation may have failed. Full response:"
  echo "$RESULT"
  exit 1
fi
