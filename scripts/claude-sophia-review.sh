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

PROMPT_FILE="${1:-workflows/CLAUDE_CODE_WEBSITE_REVIEW_PROMPT.md}"
if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "Prompt file not found: $PROMPT_FILE" >&2
  exit 2
fi

"$CLAUDE_BIN" -p "$(cat "$PROMPT_FILE")"
