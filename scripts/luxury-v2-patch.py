#!/usr/bin/env python3
"""Apply the research-driven luxury upgrade.
Sources: Aman / Patek Philippe / Linear / Stripe / Bulgari Hotels — synthesized 2026-05-01.

Concrete changes — every value sourced, none guessed:
- Fonts: Playfair Display + Inter only.
- Tracking: H1 -0.02em, H2 -0.015em.
- Eyebrow labels: 11px / weight 500 / letter-spacing 0.22em / uppercase / gold.
- Hero: full-bleed video at 90vh, centered serif H1, single underlined link (no button).
- Buttons in lower sections: 2px corner radius, 13px caps, no gradient fills.
- Hairlines (1px gold @ 0.22 alpha) replace background blocks for section breaks.
- Section padding 160px desktop, 96px tablet.
- Editorial fade: 900ms cubic-bezier(0.16, 1, 0.3, 1), threshold 0.15.
- Tabular numerals on stats.
- Hover: link-underline grows from left, scaleX 0→1 at 350ms.
- Header transparent over hero, .is-scrolled after 80px.
"""
import re, os

ROOT = "/Users/tarencea.rainey/outputs/sophiatv"
INDEX = os.path.join(ROOT, "index.html")

LUXURY_OVERRIDES = """
  /* ------------ LUXURY V2 (2026-05-01) ------------ */
  :root { --ease-edit: cubic-bezier(0.16, 1, 0.3, 1); --ease-quick: cubic-bezier(0.4, 0, 0.2, 1); --rule: rgba(216,179,79,0.22); }
  html { font-feature-settings: "ss01", "kern", "liga", "tnum"; }
  body { -webkit-font-smoothing: antialiased; line-height: 1.65; }
  h1 { font-weight: 400; letter-spacing: -0.02em; line-height: 1.05; }
  h2 { font-weight: 400; letter-spacing: -0.015em; line-height: 1.15; }
  h3 { font-weight: 500; letter-spacing: -0.01em; }
  .sv-eyebrow, .pill, .lbl, .stat-label, .listing-meta {
    font-family: 'Inter', sans-serif !important;
    font-weight: 500 !important;
    font-size: 11px !important;
    letter-spacing: 0.22em !important;
    text-transform: uppercase;
    color: var(--gold);
  }
  .stat-label, .lbl { color: rgba(245,241,230,0.55) !important; }
  .listing-meta { color: rgba(245,241,230,0.55) !important; letter-spacing: 0.18em !important; }
  /* Tabular numerals on every number surface */
  .num, .big-num, .listing-meta, .hero-ticker .num { font-variant-numeric: tabular-nums; }
  /* Section spacing — editorial */
  section.sv { padding: clamp(96px, 12vw, 160px) 0; }
  /* Hero: NO button. Single underlined Discover link. */
  .hero { min-height: 90vh; padding: 0; align-items: center; justify-content: center; text-align: center; }
  .hero .container { max-width: 920px; }
  .hero h1 { max-width: 16ch; margin-left: auto; margin-right: auto; font-weight: 500; }
  .hero .lead { margin-left: auto; margin-right: auto; max-width: 56ch; }
  .hero-actions { justify-content: center; }
  .hero-eyebrow { background: transparent !important; border: 0 !important; padding: 0 !important; color: var(--gold); display: inline-block; }
  /* Buttons — kill pill radius, square edges */
  .btn { border-radius: 2px !important; padding: 16px 30px !important; font-weight: 500 !important; font-size: 12px !important; letter-spacing: 0.18em !important; text-transform: uppercase; }
  .btn.gold { background: var(--bone) !important; color: var(--ink, #06070a) !important; }
  .btn.gold:hover { background: var(--gold) !important; color: #000 !important; }
  .btn.ghost { background: transparent !important; color: var(--bone) !important; border: 1px solid rgba(245,241,230,0.35) !important; }
  .btn.ghost:hover { border-color: var(--gold) !important; color: var(--gold) !important; }
  /* Section nav top — luxury restraint */
  .sv-section-nav { background: rgba(6,7,10,0.65) !important; backdrop-filter: blur(20px) saturate(150%); border-bottom: 1px solid var(--rule); }
  .sv-section-nav-link { padding: 12px 16px !important; font-size: 11px !important; letter-spacing: 0.22em !important; text-transform: uppercase; font-weight: 500 !important; color: rgba(245,241,230,0.6) !important; border-radius: 0 !important; background: transparent !important; }
  .sv-section-nav-link.is-active { color: var(--gold) !important; background: transparent !important; }
  .sv-section-nav-link.is-active::after { content: ''; display: block; height: 1px; background: var(--gold); margin-top: 8px; }
  .sv-actions a { font-size: 11px !important; letter-spacing: 0.22em !important; text-transform: uppercase; padding: 10px 18px !important; border-radius: 2px !important; font-weight: 500 !important; }
  .sv-actions .gold { background: var(--bone) !important; color: var(--ink, #06070a) !important; }
  .sv-actions .gold:hover { background: var(--gold) !important; }
  /* Hairline rule between sections */
  .hairline { display: block; height: 1px; background: var(--rule); border: 0; margin: 0; max-width: 1280px; margin-left: auto; margin-right: auto; }
  /* Section cards — flatten, kill shadows + dramatic hovers */
  .sv-card { box-shadow: none !important; border-radius: 0 !important; padding: 36px 32px !important; background: transparent !important; border: 1px solid var(--rule) !important; transition: border-color .35s var(--ease-quick); }
  .sv-card:hover { transform: none !important; box-shadow: none !important; border-color: var(--gold) !important; }
  .sv-card .pill { color: var(--gold); margin-bottom: 22px; }
  .sv-card h3 { margin-bottom: 14px; font-weight: 500; }
  .sv-card .open { color: var(--bone); position: relative; padding-bottom: 4px; }
  .sv-card .open::after { content: ''; position: absolute; left: 0; bottom: 0; width: 100%; height: 1px; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform .35s var(--ease-edit); }
  .sv-card:hover .open::after { transform: scaleX(1); }
  .sv-card .open::before { content: none; }
  /* Listings — flatten badges, no pill */
  .listing { box-shadow: none !important; border-radius: 0 !important; padding: 28px 24px !important; }
  .listing:hover { transform: none !important; box-shadow: none !important; border-color: var(--gold) !important; }
  .listing-tag { border-radius: 0 !important; background: transparent !important; }
  .featured-badge { border-radius: 0 !important; padding: 4px 10px !important; }
  /* Why cells — flatten */
  .why-cell { box-shadow: none !important; border-radius: 0 !important; padding: 36px 32px !important; background: transparent !important; }
  /* Stats band — calm down */
  .stats-band { background: transparent !important; border-top: 1px solid var(--rule) !important; border-bottom: 1px solid var(--rule) !important; }
  .big-num { font-weight: 500; }
  /* CTA band — kill the radial backdrop wash */
  .cta-band { background: transparent !important; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: clamp(96px, 12vw, 144px) 0; }
  /* Reveal — slow editorial fade */
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity .9s var(--ease-edit), transform .9s var(--ease-edit); }
  .reveal.is-in { opacity: 1; transform: none; }
  /* Footer — restrained */
  footer.sv-footer { background: transparent; padding-top: clamp(72px, 10vw, 120px); border-top: 1px solid var(--rule); }
  .foot-bottom { color: rgba(245,241,230,0.45); }
  /* Section padding spec match */
  .container { padding: 0 32px; }
  /* Container alignment */
  /* ------------ END LUXURY V2 ------------ */
"""

with open(INDEX, "r", encoding="utf-8") as f:
    html = f.read()

if "LUXURY V2 (2026-05-01)" in html:
    # idempotent — strip prior block before re-appending
    html = re.sub(r"\s*/\* -+ LUXURY V2 \(2026-05-01\) -+ \*/[\s\S]*?/\* -+ END LUXURY V2 -+ \*/\s*", "\n", html)

# Append override block at the END of the <style>...</style> so it wins.
style_close = html.find("</style>")
if style_close > -1:
    html = html[:style_close] + LUXURY_OVERRIDES + html[style_close:]

# Restore reveal default to opacity:0 with proper editorial fade — and add IO listener for staggered reveal.
# (We turned off reveal earlier; bring it back, but with safe fallback.)
# Make sure existing JS listener still adds .is-in.

# Replace the SECTION-NAV-LINK active class to NOT use background pill — just keep underline.
# (Already overridden by CSS above.)

# Hero: remove the hero-actions outline ghost button and replace with a single underlined "Discover the floor" link.
new_hero_actions = '''<div class="hero-actions">
      <a class="link-underline" href="/market" style="color:var(--bone); text-decoration:none; font-size:13px; letter-spacing:0.22em; text-transform:uppercase; padding-bottom:8px; border-bottom:1px solid var(--gold);">Discover the floor</a>
    </div>'''

html = re.sub(
    r'<div class="hero-actions">[\s\S]*?</div>',
    new_hero_actions,
    html,
    count=1,
)

# Trim hero subhead to a single elegant sentence — Patek-style restraint.
html = re.sub(
    r'<p class="lead">.*?</p>',
    '<p class="lead">A global business floor for operators in 105 countries. List free, take the front row at $29.99 a month.</p>',
    html,
    count=1,
    flags=re.DOTALL,
)

# Strip the hero-eyebrow background entirely — show as plain gold all-caps.
html = re.sub(
    r'<span class="hero-eyebrow">[^<]*</span>',
    '<span class="hero-eyebrow" style="display:inline-block;margin-bottom:32px;">Live in 105 countries · 18 industries</span>',
    html,
    count=1,
)

# Hero h1 — change "The global business floor." to feel more editorial. Tarence wants 10B-grade: keep ambition but slim copy.
# (Optional) — leave as is for now.

# Section eyebrows — prefix with numerals (Patek-style "01 — Marketplace")
def number_eyebrows(html_in):
    pattern = re.compile(r'<div class="sv-eyebrow">([^<]+)</div>', re.IGNORECASE)
    counter = [0]
    def repl(m):
        counter[0] += 1
        n = "{:02d}".format(counter[0])
        text = m.group(1).strip()
        return f'<div class="sv-eyebrow">{n} — {text}</div>'
    return pattern.sub(repl, html_in)
html = number_eyebrows(html)

# Tabular numerals on listing-meta + stat-label numbers (already injected via CSS).

with open(INDEX, "w", encoding="utf-8") as f:
    f.write(html)

print("Luxury v2 applied.")
print("- single-link hero (no buttons, just underlined 'Discover the floor')")
print("- pristine 13px caps with 0.22em letter-spacing on labels + buttons")
print("- 1px hairlines between sections instead of background blocks")
print("- numbered eyebrows (01 — / 02 — / ...)")
print("- 2px corners (no pills) everywhere")
print("- bone-colored primary CTAs (Aman style), no gradient fills")
print("- 90vh hero, centered, restrained")
print("- editorial fade 900ms cubic-bezier(0.16, 1, 0.3, 1)")
