# Anti-Slop Check — Codex prompt

Use before declaring any visual change ready for deploy.

---

Run the `$sophia-anti-slop` check on `<file or diff>`.

Workflow (the skill packages this):
1. Banned-superlative grep: `rg -i 'revolutionary|game.changing|cutting.edge|next.generation|world.class|industry.leading|best.in.class|unparalleled|state.of.the.art' <file>`
2. Live-shape markup grep: `rg 'live-pill|vcard-live|vcard-live-tag|scanlines|ma-purple' <file>`
3. Launch-preview language grep: `rg -i 'GLOBAL DIRECTORY · LAUNCH PREVIEW|SOPHIA MARKET — PREVIEW' <file>`
4. Emoji UI grep: `rg -P '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' <file>`
5. Pulse animation grep: `rg '@keyframes pulse|animation:.*pulse' <file>`

Then apply both Squint Tests:
- **Squint Test:** From arm's length, blur until words are unreadable. Reads as serious product or generated demo? If demo → block.
- **Mansa Musa Squint Test:** Does this signal importance? Is wealth shown not stated? Is exclusivity structural? Is scarcity honored never faked?

Report format:
```
=== Anti-Slop Report — <file> ===

Banned superlatives    : <count> | <list>
Live-shape markup      : <count> | <list>
Launch-preview language: <count> | <list>
Emoji UI               : <count>
Pulse animations       : <count>

Squint Test           : PASS/FAIL
Mansa Musa Squint Test: PASS/FAIL

Verdict: ship / block / fix-required

Required fixes:
- <specific line + concrete replacement>
```

If verdict is "ship," the file is ready for the verification gates.
If "block" or "fix-required," apply the listed fixes and re-run.
