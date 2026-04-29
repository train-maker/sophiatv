# Sophia Model Routing Matrix

Purpose: use Claude Code, Cursor, and Ollama as a small AI staff without wasting Codex context or drifting Sophia backward.

## CEO Rule

Codex owns the critical path, final judgment, final verification, and user-facing status.

Use support models for bounded work: review, critique, copy pass, local second opinions, isolated implementation with clear file ownership, repetitive summaries, and extraction.

Never delegate secrets, billing, account permission changes, paid-service setup, deployment authority, publishing, or login-only/private data unless Tarence explicitly approves that exact action.

## Claude Code Models

Use Claude Code model aliases:

- `opus`
- `sonnet`
- `haiku`
- `opusplan`

Default routing:

| Model | Sophia job | Use when | Avoid when |
| --- | --- | --- | --- |
| `opus` | Deep product architecture, hard bug triage, major design-system decisions, launch-risk review | The problem is ambiguous, high stakes, or Sonnet already struggled | Simple edits, quick summaries, mechanical checks |
| `sonnet` | Main Claude coding/review work | UI polish, JS fixes, CSS review, route behavior, accessibility pass, copy edits, test failure triage | Huge strategy decisions that need deeper reasoning |
| `haiku` | Fast cheap passes | Summarize logs, extract TODOs, scan copy for tone, categorize issues, compare short snippets | Architecture, complex code edits, final launch judgment |
| `opusplan` | Hybrid planning/execution | Big website changes where Claude should reason deeply first and then implement efficiently | Tiny patches or review-only tasks |

Recommended commands:

```bash
claude --model opusplan
claude --model sonnet -p "$(cat workflows/CLAUDE_CODE_WEBSITE_REVIEW_PROMPT.md)"
claude --model haiku -p "Summarize launch blockers in the latest terminal output only."
npm run audit:claude
```

## Ollama Local Models

Check installed models:

```bash
ollama list
```

Current routing:

| Model | Sophia job |
| --- | --- |
| `llama3.1:8b` | General local critique, copy review, feature-risk second opinion |
| `gemma3:4b-it-qat` | Fast local summarization and concise UX/copy critique |
| `qwen2.5:3b` | Very cheap local code/copy sanity checks |
| `qwen2.5-coder:7b` | Local code-focused review once installed |
| `deepseek-r1:7b` | Local reasoning critique once installed |

Recommended commands:

```bash
npm run audit:ollama
OLLAMA_MODEL=qwen2.5-coder:7b npm run audit:ollama
OLLAMA_MODEL=deepseek-r1:7b npm run audit:ollama
```

## Cursor

Cursor is for hands-on UI polish in the repo when a visual/code pass is useful.

Recommended command:

```bash
npm run open:cursor
```

Cursor should read:

```text
workflows/CURSOR_WEBSITE_POLISH_PROMPT.md
```

## OpenRouter

OpenRouter is an optional cloud model gateway. Treat it as account/key-gated, even when a model is labeled free, because it still routes prompts through an external service and requires an API key.

Gate:

- Do not use OpenRouter until Tarence explicitly provides/approves the setup path.
- Prefer keys with credit limits.
- Do not send secrets, private customer data, unpublished sensitive business data, account pages, or login-only data.
- Prefer local Ollama first for non-sensitive critique.

Useful OpenRouter jobs after approval:

| Job | Model type to choose |
| --- | --- |
| Cheap broad copy critique | Free/low-cost fast model |
| Second opinion across model families | Gemini, Mistral, Llama, or Qwen class model |
| Agentic coding/reasoning experiment | Kimi/Moonshot model such as Kimi K2-class when available |
| Visual/copy reasoning | Multimodal-capable model if screenshots are included |
| Code review fallback | Strong coding model available through OpenRouter |

OpenRouter should not become Sophia's default production dependency until cost, logging/data policy, rate limits, and fallback behavior are intentionally scoped.

## Kimi / Moonshot

Kimi is a strong candidate for coding-agent and long-context reasoning experiments, especially through OpenRouter or Moonshot's own API. Treat it as external/account-gated for Sophia.

Use Kimi for:

- alternate coding-agent review when Claude and Codex disagree,
- long-context repo or launch-risk critique,
- agentic implementation experiments in disposable branches,
- comparing Claude/Codex decisions against another model family.

Do not use Kimi for:

- secrets, credentials, private account pages, or customer data,
- paid/API usage without Tarence approval,
- final launch judgment,
- production dependency decisions before cost and data policy are reviewed.

## Task Routing

| Task | First model/tool | Backup |
| --- | --- | --- |
| Final launch blocker review | Claude `sonnet` via `npm run audit:claude` | Claude `opus` if findings conflict or stakes are high |
| Major architecture or product positioning | Claude `opus` or `opusplan` | Codex local judgment |
| CSS/visual polish | Cursor or Claude `sonnet` | Playwright screenshots/audit |
| Fast copy/tone scan | Claude `haiku` | Ollama `gemma3:4b-it-qat` |
| Local no-spend critique | Ollama `llama3.1:8b` | Ollama `qwen2.5:3b` |
| Code-specific local critique | Ollama `qwen2.5-coder:7b` | Claude `sonnet` |
| Reasoning-heavy local critique | Ollama `deepseek-r1:7b` | Claude `opus` |
| External multi-model second opinion | OpenRouter after explicit key/setup approval | Local Ollama |
| Kimi agentic coding comparison | OpenRouter/Moonshot Kimi after key/spend approval | Claude `sonnet` or Ollama `qwen2.5-coder:7b` |

## Verification

After any accepted model work:

```bash
npm run check
npm run audit:functions
npm run audit:playwright
```

Only Codex or Tarence should decide that work is complete.
