# Everyday App Factory Workflow

Created: 2026-04-25
Pattern: LangGraph state + AutoGen manager + CrewAI flow/crew

## Goal

Continuously identify everyday pain points and convert the safest/highest-value ones into simple local Sophia tools or prototype apps.

## State

- status: intake | planning | executing | reviewing | waiting_owner | done | blocked
- current_step: choose app idea, build small usable tool, verify links/UI, update everyday tools index
- artifacts: HTML/CSS/JS files, sitemap links, Paperclip tasks, memory notes
- decisions: prioritize broad daily usefulness, offline/local storage where possible, no medical/legal/financial promises
- blockers: paid APIs, regulated advice, account integrations, deployment gates
- next_action: build next browser-only utility and verify with `npm run check`

## Roles

- Flow Controller: Codex / Paperclip issue
- Specialist Crew:
  - Research: complaint scout and local web research with sources
  - Builder: Codex implements static app/tool
  - Reviewer: accessibility, mobile layout, link checks, risk language
  - Local/Free Model: Ollama suggests app ideas and copy variants
- Human Owner Gate: Tarence for secrets, paid services, account actions, publishing, destructive changes.

## Steps

1. Intake: capture request and constraints.
2. Plan: define artifacts, checks, and approval gates.
3. Execute: complete safe local work first.
4. Review: verify output against goal and safety gates.
5. Checkpoint: write status to Paperclip and memory.
6. Gate: stop only if owner action is required.
7. Resume: next heartbeat continues from current_step.

## Side Effects

Allowed: local static tool creation, local storage features, link updates, browser previews, Paperclip comments.

Gate: production deploy, paid APIs, health/legal/financial diagnosis, account integrations, deleting user data.

## Verification

- Local checks: `npm run check`
- Browser checks: open modified static pages
- Artifact checks: links resolve, localStorage works, no console-breaking syntax
- Paperclip update: SOP-8 and relevant build issue

## Done Criteria

- Artifacts exist.
- Verification passed.
- Paperclip/memory updated.
- Any owner-only actions are clearly separated.
