# Free Model Worker Tasks

Use this when a session needs support work without spending money.

## Local Model Commands

```bash
ollama list
OLLAMA_MODEL=qwen2.5-coder:7b npm run audit:ollama
OLLAMA_MODEL=deepseek-r1:7b npm run audit:ollama
OLLAMA_MODEL=llama3.1:8b npm run audit:ollama
```

## Standing Tasks

### `qwen2.5-coder:7b`

Review one changed JS/CSS/HTML file at a time.

Ask for:

- broken selectors,
- unsafe assumptions,
- mobile layout risks,
- missing fallback behavior,
- smaller patch suggestion.

### `deepseek-r1:7b`

Review business logic and launch risk.

Ask for:

- fastest path to revenue,
- trust blockers,
- fake/weak claim risks,
- approval gates,
- what to build next with no paid service.

### `llama3.1:8b`

Rank app ideas.

Ask for:

- buyer urgency,
- offline-first MVP scope,
- simplest monetization,
- why now,
- one next build action.

### `gemma3:4b-it-qat`

Summarize and clean copy.

Ask for:

- shorter premium wording,
- clearer CTA,
- jargon removal,
- 5-bullet executive recap.

### `qwen2.5:3b`

Cheap triage.

Ask for:

- classify ideas by category,
- extract TODOs,
- spot duplicate ideas,
- produce concise checklists.

## Cloud-Free-Tier Tasks

Use only after API-key/data approval:

- OpenRouter free router: external model comparison on non-sensitive prompts.
- Gemini free tier: structured extraction, copy alternatives, multimodal checks on non-sensitive screenshots.
- Groq free tier: speed tests and short classification.
- Hugging Face free inference: model experiments and open-model comparisons.

