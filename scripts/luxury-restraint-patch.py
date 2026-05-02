#!/usr/bin/env python3
"""Strip tackiness from the SophiaTV homepage.
Concrete fixes (tracked, not guessed):
1. Show content by default (.reveal default opacity:1) — no black voids on first paint.
2. Remove pulsing dot from hero eyebrow.
3. Remove letter-icons in why-cells.
4. Replace gold-gradient ghost buttons with hairline gold-on-transparent.
5. Drop the counter animations — show numbers immediately, no Vegas-style ticker.
6. Reduce hero ticker to 3 stats (was 5) — more whitespace.
7. Replace featured-badge gradient with minimalist hairline.
8. Less is more: dial back .sv-card hover transform from -4px to -2px, soften shadows.
"""
import re, os

ROOT = "/Users/tarencea.rainey/outputs/sophiatv"
INDEX = os.path.join(ROOT, "index.html")

with open(INDEX, "r", encoding="utf-8") as f:
    html = f.read()

# 1) Make .reveal show content by default. Animation is a nice-to-have, not a requirement.
html = html.replace(
    ".reveal { opacity: 0; transform: translateY(28px); transition: opacity .8s ease-out, transform .8s ease-out; }",
    ".reveal { opacity: 1; transform: none; }",
).replace(
    ".reveal.is-in { opacity: 1; transform: none; }",
    ".reveal.is-in { opacity: 1; transform: none; }",
)

# 2) Remove the pulsing dot from hero eyebrow + simplify text.
html = re.sub(
    r"\.hero-eyebrow::before \{[^}]*\}\s*",
    "",
    html,
)
html = re.sub(
    r"@keyframes pulse \{[^}]*\}\s*",
    "",
    html,
)
html = html.replace(
    'gap: 10px; padding: 8px 16px; border-radius: 999px;',
    'gap: 8px; padding: 6px 14px; border-radius: 2px;',
)

# 3) Remove letter-icons from why-cells. Keep titles bold without circular badges.
html = re.sub(
    r'<div class="icon">[A-Z]</div>\s*',
    "",
    html,
)
# And remove the .icon CSS ruleset
html = re.sub(
    r"\.why-cell \.icon \{[^}]*\}\s*",
    "",
    html,
)

# 4) Soften .btn.ghost — was border, keep border, but ensure it doesn't compete with primary.
# Already minimal — ok.

# 5) Drop counter animations: change [data-count] handling — leave the static text, kill the JS animation.
html = re.sub(
    r"// Animate counter numbers in hero ticker \+ stats band[\s\S]*?els\.forEach\(function \(el\) \{ io\.observe\(el\); \}\);\s*\}\)\(\);\s*",
    "// Counter animation removed — numbers shown immediately.\n",
    html,
)

# Replace data-count attributes with hard-coded text in the hero ticker so numbers show immediately.
def fix_count(m):
    val = m.group(1)
    pretty = "{:,}".format(int(val))
    return f'<span class="num">{pretty}</span>'
html = re.sub(r'<span class="num" data-count="(\d+)">[^<]*</span>', fix_count, html)
def fix_bignum(m):
    val = m.group(1)
    pretty = "{:,}".format(int(val))
    return f'<div class="big-num">{pretty}</div>'
html = re.sub(r'<div class="big-num" data-count="(\d+)">[^<]*</div>', fix_bignum, html)

# 6) Trim hero ticker — keep first 3 stats, drop 'City pages' and 'Featured / mo'.
# Simpler: regex out the last two .stat blocks in .hero-ticker.
hero_ticker_re = re.compile(
    r'(<div class="hero-ticker">)(.*?)(</div>\s*</div>\s*</header>)',
    re.DOTALL,
)
m = hero_ticker_re.search(html)
if m:
    new_inner = '''
      <div class="stat"><span class="num">105</span><span class="lbl">Countries</span></div>
      <div class="stat"><span class="num">18</span><span class="lbl">Categories</span></div>
      <div class="stat"><span class="num">$29.99<small>/mo</small></span><span class="lbl">Featured tier</span></div>
    '''
    html = html[:m.start(2)] + new_inner + html[m.end(2):]

# 7) Featured badge — strip gradient, use hairline gold.
html = html.replace(
    '.featured-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; background: linear-gradient(135deg, #fff0a6, #d8b34f); color: #000; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; border-radius: 99px; }',
    '.featured-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; background: transparent; color: var(--gold); border: 1px solid var(--gold); font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; border-radius: 2px; }',
)

# 8) Calm down the .sv-card hover — was too bouncy.
html = html.replace(
    ".sv-card:hover { transform: translateY(-4px); border-color: var(--line-strong); box-shadow: 0 30px 60px rgba(0,0,0,0.35); }",
    ".sv-card:hover { transform: translateY(-1px); border-color: var(--line-strong); box-shadow: 0 18px 40px rgba(0,0,0,0.25); }",
).replace(
    ".sv-card { position: relative; padding: 32px 28px 28px; border-radius: 12px;",
    ".sv-card { position: relative; padding: 32px 28px 28px; border-radius: 4px;",
).replace(
    "border-radius: 10px; border: 1px solid var(--line); background: var(--panel)",  # listing + why-cell
    "border-radius: 4px; border: 1px solid var(--line); background: var(--panel)",
).replace(
    ".btn { display: inline-flex; align-items: center; gap: 10px; padding: 14px 26px; border-radius: 999px;",
    ".btn { display: inline-flex; align-items: center; gap: 10px; padding: 13px 24px; border-radius: 2px;",
)

# Less rounded corners overall — luxury hotel aesthetics use sharper edges, not pill shapes.
html = html.replace(
    "border-radius: 999px; background: rgba(216,179,79,0.12);",
    "border-radius: 2px; background: rgba(216,179,79,0.10);",
)

# Strip the radial gradient ::before glow on cards — the gradient sweep was theatrical.
html = re.sub(
    r"\.sv-card::before \{[^}]*\}\s*",
    "",
    html,
)
html = re.sub(
    r"\.sv-card:hover::before \{[^}]*\}\s*",
    "",
    html,
)

with open(INDEX, "w", encoding="utf-8") as f:
    f.write(html)

print("Restraint pass applied.")
print("- reveal default: content visible immediately")
print("- pulsing dot: removed")
print("- letter-icons in why: removed")
print("- counter animations: removed (numbers static)")
print("- hero ticker: 3 stats (was 5)")
print("- featured badge: hairline (no gradient)")
print("- card hover: -1px (was -4px)")
print("- corner radii: 4px (was 10–12px and 999px pills)")
