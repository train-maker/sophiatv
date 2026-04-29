# GitHub Agent Reference Repos

These repositories are local reference checkouts for Sophia engineering workflow design. They are not application dependencies.

## Checkouts

| Repo | Local path | Primary use |
| --- | --- | --- |
| `openai/skills` | `references/github-agent-repos/skills` | Codex skill structure, examples, and packaging conventions |
| `VoltAgent/awesome-codex-subagents` | `references/github-agent-repos/awesome-codex-subagents` | Subagent role ideas and Codex team patterns |
| `VoltAgent/awesome-agent-skills` | `references/github-agent-repos/awesome-agent-skills` | Agent skill libraries and reusable workflow ideas |
| `sorrycc/awesome-code-agents` | `references/github-agent-repos/awesome-code-agents` | Coding-agent landscape and tooling references |
| `langchain-ai/langchain` | `references/github-agent-repos/langchain` | Agent workflow, tool calling, retrieval, and state patterns |
| `microsoft/autogen` | `references/github-agent-repos/autogen` | Multi-agent orchestration, group chat, and handoff patterns |
| `geekan/MetaGPT` | `references/github-agent-repos/MetaGPT` | Software-company-style role decomposition and SOP patterns |

## Rules

- Inspect before using.
- Do not install blindly.
- Do not copy large code blocks into Sophia.
- Do not add runtime dependencies without approval.
- Do not use these repos to change auth, payments, admin, secrets, or deployment without approval.

## Update Command

From the Sophia repo root:

```bash
for d in references/github-agent-repos/*; do
  if [ -d "$d/.git" ]; then
    git -C "$d" pull --ff-only
  fi
done
```
