# YouTube-Inspired Sophia Media Workflow

Purpose: bring YouTube-level product polish into Sophia without copying YouTube's UI, code, branding, or private behavior.

Reverse-engineering rule: break down public behavior and rebuild an original Sophia version. Study the workflow, interaction model, information architecture, performance strategy, and product psychology. Do not copy protected implementation or brand expression.

## Build Direction

Sophia should feel like a media operating system for global communication:

- Watch and read in any language.
- Keep chat, transcripts, and translation beside the media.
- Let users keep a mini-player open while browsing tools.
- Give creators a checklist that moves content from idea to publish-ready.
- Keep keyboard shortcuts and accessibility visible in the interaction model, not as an afterthought.

## Feature Queue

1. Sophia Player module:
   - media frame,
   - transcript drawer,
   - translated captions toggle,
   - text-to-speech status,
   - chapter rail,
   - mini-player action.

2. Keyboard shortcuts:
   - `/` open command/search,
   - `k` player play/pause placeholder,
   - `c` captions toggle,
   - `t` translation toggle,
   - `i` mini-player toggle,
   - `esc` close overlays.

3. Creator dashboard:
   - title status,
   - description status,
   - tags status,
   - thumbnail status,
   - captions status,
   - translations status,
   - publish gate.

4. Live translation:
   - original captions,
   - translated captions,
   - translated voice status,
   - pinned message,
   - moderation queue.

## Guardrails

- Do not copy YouTube layout, icons, code, branding, or private/logged-in screens.
- Do not claim upload/publishing integrations until account/API setup is approved.
- Build local prototype states first.
- Verify with Playwright before calling any media workflow complete.
