# Cursor Sophia Website Polish Prompt

You are Cursor helping Codex finish SophiaTV.

Tarence approved Cursor as support staff. Codex owns final judgment and verification. Cursor should make bounded polish proposals or isolated patches only.

Open this repo:

```text
/Users/tarencea.rainey/outputs/sophiatv
```

Read:

```text
NEW_DEVICE_START_HERE.md
CODEX.md
SOPHIA_ENGINEERING_OS.md
CURSOR_AGENT_PROMPT.md
workflows/AGENT_FINISH_WEBSITE_PLAN.md
```

Task:

Do a focused UI polish pass for the Sophia website. Keep edits scoped. Do not revert Codex, Claude, Ollama, or user changes.

Locked design:

- Use `assets/brand/sophia-logo-premium.png`.
- Keep hero copy: "The world, translated into opportunity."
- Core promise: Sophia pulls back language barriers so people can communicate, trade, learn, and connect across the world.
- Elegant, premium, restrained, futuristic.
- No cartoon/play-button branding.
- No fake live claims or generic AI fluff.
- Free/local tools only.

Best first targets:

- `index.html`
- `style.css`
- `future.css`
- `social.html`
- `session.html`

Focus:

- mobile text fit,
- hero spacing,
- CTA clarity,
- typography consistency,
- nav/logo polish,
- no horizontal overflow.

Before saying done:

```bash
npm run check
```

For broad visual changes:

```bash
npm run audit:playwright
```

Output if reviewing only:

```text
Cursor polish findings:
1.
2.
3.

Exact files to patch:
Verification needed:
```
