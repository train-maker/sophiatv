# Claude Code Install Notes

Claude should use this plugin immediately for SophiaTV work.

## Load

Read these files first:

```text
plugins/sophia-operator/skills/sophia-operator/SKILL.md
plugins/sophia-operator/TROUBLESHOOTING.md
BUSINESS_HANDOFF.md
CLAUDE.md
```

## Required Behavior

Use the Sophia Operator handoff format:

```text
Objective:
User flow:
Implementation:
Verification:
Production needs:
Files changed:
```

Before marking a change complete, run:

```bash
bash plugins/sophia-operator/scripts/sophia-check.sh
```

If browser UI changed, also inspect the affected page in local preview:

```text
http://127.0.0.1:4173/
```

## Stop Conditions

Stop and ask Tarence before any paid plan, paid feature, deployment billing action, API key creation, secret entry, account permission change, or sensitive data transmission.

