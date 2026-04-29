#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

MODEL="${OLLAMA_MODEL:-llama3.1:8b}"
PROMPT_FILE="${1:-workflows/OLLAMA_WEBSITE_CRITIQUE_PROMPT.md}"

if ! command -v ollama >/dev/null 2>&1; then
  echo "Ollama not found." >&2
  exit 127
fi

if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "Prompt file not found: $PROMPT_FILE" >&2
  exit 2
fi

{
  cat "$PROMPT_FILE"
  printf '\n\nReview these current files for concrete website risks:\n\n'
  printf '\n--- index excerpt ---\n'
  sed -n '1,80p;555,835p' index.html
  printf '\n--- social excerpt ---\n'
  sed -n '1,180p;260,380p' social.html
  printf '\n--- final CSS excerpt ---\n'
  tail -220 future.css
} | ollama run "$MODEL"
