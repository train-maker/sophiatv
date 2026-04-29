#!/usr/bin/env bash
set -euo pipefail

cat <<'EOF'
Sophia Claude Code startup context:
- Read CLAUDE.md, CODEX.md, and SOPHIA_ENGINEERING_OS.md before website work.
- Official Sophia Claude Code guide:
  /Users/tarencea.rainey/Documents/Sophia Brain/03 - Sophia OS/library/CLAUDE-CODE-COMPLETE-GUIDE-FOR-SOPHIA-2026-04-29.md
- Vault coordination:
  /Users/tarencea.rainey/Documents/Sophia Brain/03 - Sophia OS/agent-sync/
- Project Claude pack:
  .claude/README.md
  .claude/memory/
  .claude/commands/
  .claude/agents/
  .claude/prompts/
- Best startup command: /start-sophia
- Full website build command: /god-mode-website-build <objective>
- Completion gate command: /ship-quality
- Codex owns final integration and final verification.
- Do not use secrets, billing, account actions, paid tools, public deploys, publishing, destructive commands, or unknown installs without Tarence approval.
- For meaningful local work, verify with:
  npm run check
  npm run audit:playwright
EOF
