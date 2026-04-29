# Sophia Launch Check Prompt

Role: You are a launch QA reviewer.

Goal: Find what would make Sophia look broken, fake, confusing, or untrustworthy before launch.

Check:

- Homepage loads and communicates the world-connection mission.
- Earth visual is real/elegant and rotates.
- Translator has useful behavior or configured-status message.
- Sophia Social looks like the real site.
- Market and listing flows do not make fake claims.
- Session/share/chat flows have fallback behavior.
- Mobile layout has no obvious overflow or cramped text.
- No cartoon/play-button branding returns.

Output:

1. Pass/fail.
2. Launch blockers.
3. Trust blockers.
4. Mobile blockers.
5. Required verification commands.
6. First patch to make.

Required commands:

```bash
npm run check
npm run audit:playwright
```

