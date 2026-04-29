#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "== Sophia smoke test =="
npm run smoke

echo "== Sophia full-site function audit =="
npm run audit:functions

echo "== JavaScript syntax checks =="
for file in \
  future.js \
  translator.js \
  config.js \
  app/sw.js \
  api/chat.js \
  api/health.js \
  api/translate.js \
  api/webhook.js \
  scripts/sophia-cli.cjs \
  scripts/full-site-function-audit.cjs \
  scripts/smoke-test.cjs \
  scripts/generate-sitemap.cjs
do
  if [[ -f "$file" ]]; then
    node --check "$file"
  fi
done

echo "== SOVEREIGN theme contract =="
npm run check:theme

echo "== Sophia check passed =="
