#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

CURSOR_BIN="${CURSOR_BIN:-}"
if [[ -z "$CURSOR_BIN" ]]; then
  if command -v cursor >/dev/null 2>&1; then
    CURSOR_BIN="$(command -v cursor)"
  elif [[ -x "$HOME/.local/bin/cursor" ]]; then
    CURSOR_BIN="$HOME/.local/bin/cursor"
  else
    echo "Cursor CLI not found. Install or set CURSOR_BIN." >&2
    exit 127
  fi
fi

echo "Opening SophiaTV in Cursor."
echo "Use prompt: workflows/CURSOR_WEBSITE_POLISH_PROMPT.md"
"$CURSOR_BIN" "$ROOT"
