#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

CLAUDE_BIN="${CLAUDE_BIN:-}"
if [[ -z "$CLAUDE_BIN" ]]; then
  if command -v claude >/dev/null 2>&1; then
    CLAUDE_BIN="$(command -v claude)"
  elif [[ -x "$HOME/.local/bin/claude" ]]; then
    CLAUDE_BIN="$HOME/.local/bin/claude"
  else
    echo "Claude Code CLI not found. Install or set CLAUDE_BIN." >&2
    exit 127
  fi
fi

"$CLAUDE_BIN" -p "$(cat workflows/CLAUDE_10_HOUR_SOPHIA_HANDOFF.md)"
