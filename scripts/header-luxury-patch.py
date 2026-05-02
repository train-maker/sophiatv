#!/usr/bin/env python3
"""Two patches on index.html:
1) Replace the 'S' in 'SophiaTV' wordmark with the logo mark, so it reads [mark]ophia Operator.
2) Add a gold-trim frame around the sticky section nav (hairline gold lines top + bottom).
"""
import re, sys, os

ROOT = "/Users/tarencea.rainey/outputs/sophiatv"
INDEX = os.path.join(ROOT, "index.html")

with open(INDEX, "r", encoding="utf-8") as f:
    html = f.read()

# --- 1) Wordmark — logo replaces 'S' in "Sophia Operator"
new_brand = '''<a href="/" class="sv-brand" aria-label="Sophia Operator home">
      <img src="/assets/brand/sophia-mark-256.png" alt="" class="sv-brand-mark" width="48" height="48" />
      <span>ophia <em>Operator</em></span>
    </a>'''

old_brand_re = re.compile(
    r'<a href="/" class="sv-brand"[^>]*>\s*<img[^>]+/>\s*<span>[^<]*<em>[^<]*</em>[^<]*</span>\s*</a>',
    re.DOTALL,
)
m = old_brand_re.search(html)
if m:
    html = html[:m.start()] + new_brand + html[m.end():]
    print("brand wordmark replaced — logo as first letter")
else:
    print("could not find sv-brand block — skipping wordmark patch")

# --- 2) Gold trim CSS additions for the header
luxury_css = '''
  /* Gold-trim header — 5-star hotel feel */
  .sv-section-nav { box-shadow: inset 0 1px 0 rgba(255,245,194,0.18); }
  .sv-section-nav::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,240,166,0.65) 18%, rgba(216,179,79,0.85) 50%, rgba(255,240,166,0.65) 82%, transparent); pointer-events: none; }
  .sv-section-nav::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(216,179,79,0.55) 50%, transparent); pointer-events: none; }
  .sv-section-nav { position: sticky; }
  .sv-brand-mark { height: 38px; width: auto; display: inline-block; vertical-align: -8px; margin-right: 2px; filter: drop-shadow(0 4px 10px rgba(216,179,79,0.32)); }
  .sv-brand { gap: 0 !important; }
  .sv-brand span { font-family: 'Playfair Display', Georgia, serif !important; font-size: 1.35rem !important; font-weight: 600 !important; color: var(--bone) !important; letter-spacing: -0.01em !important; line-height: 1; }
  .sv-brand span em { font-style: normal !important; color: var(--gold) !important; margin-left: 6px; font-weight: 500; letter-spacing: 0.04em; font-size: 0.78em; vertical-align: 2px; }
  /* Hairline gold underline below entire header band — luxury cartouche feel */
  .sv-section-nav-inner { position: relative; }
'''

# Insert just before the </style> in the head <style> block
style_close = html.find('</style>')
if style_close > -1 and 'Gold-trim header' not in html:
    html = html[:style_close] + luxury_css + html[style_close:]
    print("gold-trim CSS injected")

with open(INDEX, "w", encoding="utf-8") as f:
    f.write(html)

print("\nDone.")
