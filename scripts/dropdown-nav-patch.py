#!/usr/bin/env python3
"""Convert the flat sv-section-nav into a dropdown / mega-menu config.

Architecture:
- Top-level items become buttons with aria-expanded.
- Each parent has a sibling .sv-dropdown panel containing sub-page links.
- Desktop: hover or focus-within reveals dropdown.
- Mobile: tap toggles dropdown (aria-expanded controlled by JS).
- Style: hairline gold border, dark panel, slow fade. No drop shadows.

Per LUXURY-DESIGN-PRINCIPLES.md: no pills, no gradients on dropdown items,
gold underline on active, restrained.
"""
import re, os

ROOT = "/Users/tarencea.rainey/outputs/sophiatv"
INDEX = os.path.join(ROOT, "index.html")

with open(INDEX, "r", encoding="utf-8") as f:
    html = f.read()

# Find the sv-section-nav-inner block and replace the entire link set.
# The new structure uses <ul class="sv-menu"> with nested <li>s and dropdown panels.

OLD_BLOCK_RE = re.compile(
    r'<a href="/" class="sv-section-nav-link is-active"[^>]*>Home</a>\s*'
    r'<a href="/market"[^>]*>Market</a>\s*'
    r'<a href="/video"[^>]*>Video</a>\s*'
    r'<a href="/social"[^>]*>Social</a>\s*'
    r'<a href="/wellness"[^>]*>Wellness</a>\s*'
    r'<a href="/everyday-tools"[^>]*>Tools</a>\s*'
    r'<a href="/camera"[^>]*>Vision</a>\s*'
    r'<a href="/pricing"[^>]*>Pricing</a>\s*'
    r'<a href="/dashboard"[^>]*>Dashboard</a>',
    re.DOTALL,
)

NEW_BLOCK = '''<ul class="sv-menu" role="menubar">
      <li role="none"><a role="menuitem" href="/" class="sv-section-nav-link is-active" aria-current="page">Home</a></li>

      <li role="none" class="has-dropdown">
        <button role="menuitem" class="sv-section-nav-link" aria-haspopup="true" aria-expanded="false" data-toggle>Market<span class="caret" aria-hidden="true">⌄</span></button>
        <div class="sv-dropdown" role="menu" aria-label="Market sections">
          <a role="menuitem" href="/market" class="dd-link"><span class="dd-title">Browse the floor</span><span class="dd-sub">Featured listings · 105 countries</span></a>
          <a role="menuitem" href="/market/regions/" class="dd-link"><span class="dd-title">By region</span><span class="dd-sub">Americas · EU · Africa · MENA · APAC</span></a>
          <a role="menuitem" href="/market/categories/" class="dd-link"><span class="dd-title">By category</span><span class="dd-sub">18 industry verticals</span></a>
          <a role="menuitem" href="/market/featured/" class="dd-link"><span class="dd-title">Featured</span><span class="dd-sub">Top-tier verified businesses</span></a>
          <a role="menuitem" href="/market/recent/" class="dd-link"><span class="dd-title">Recently added</span><span class="dd-sub">Newest operators on the floor</span></a>
          <a role="menuitem" href="/market/saved/" class="dd-link"><span class="dd-title">Saved</span><span class="dd-sub">Your bookmarked listings</span></a>
          <a role="menuitem" href="/submit/basics/" class="dd-link dd-cta"><span class="dd-title">List your business</span><span class="dd-sub">Free or Featured at $29.99/mo →</span></a>
        </div>
      </li>

      <li role="none" class="has-dropdown">
        <button role="menuitem" class="sv-section-nav-link" aria-haspopup="true" aria-expanded="false" data-toggle>Video<span class="caret" aria-hidden="true">⌄</span></button>
        <div class="sv-dropdown" role="menu" aria-label="Video sections">
          <a role="menuitem" href="/video" class="dd-link"><span class="dd-title">Feed</span><span class="dd-sub">Vertical scroll · operator updates</span></a>
          <a role="menuitem" href="/video/saved/" class="dd-link"><span class="dd-title">Saved clips</span><span class="dd-sub">Your bookmarked videos</span></a>
        </div>
      </li>

      <li role="none"><a role="menuitem" href="/social" class="sv-section-nav-link">Social</a></li>

      <li role="none" class="has-dropdown">
        <button role="menuitem" class="sv-section-nav-link" aria-haspopup="true" aria-expanded="false" data-toggle>Wellness<span class="caret" aria-hidden="true">⌄</span></button>
        <div class="sv-dropdown" role="menu" aria-label="Wellness sections">
          <a role="menuitem" href="/wellness" class="dd-link"><span class="dd-title">Operator wellness</span><span class="dd-sub">Pillars · longevity · clarity</span></a>
          <a role="menuitem" href="/natural-cures" class="dd-link"><span class="dd-title">Natural cures library</span><span class="dd-sub">Plants · minerals · protocols</span></a>
        </div>
      </li>

      <li role="none" class="has-dropdown">
        <button role="menuitem" class="sv-section-nav-link" aria-haspopup="true" aria-expanded="false" data-toggle>Tools<span class="caret" aria-hidden="true">⌄</span></button>
        <div class="sv-dropdown" role="menu" aria-label="Tools sections">
          <a role="menuitem" href="/everyday-tools" class="dd-link"><span class="dd-title">Everyday tools</span><span class="dd-sub">Translator · converters · helpers</span></a>
          <a role="menuitem" href="/budget-planner" class="dd-link"><span class="dd-title">Budget planner</span><span class="dd-sub">Cross-border operator budgets</span></a>
        </div>
      </li>

      <li role="none"><a role="menuitem" href="/camera" class="sv-section-nav-link">Vision</a></li>

      <li role="none" class="has-dropdown">
        <button role="menuitem" class="sv-section-nav-link" aria-haspopup="true" aria-expanded="false" data-toggle>Pricing<span class="caret" aria-hidden="true">⌄</span></button>
        <div class="sv-dropdown" role="menu" aria-label="Pricing sections">
          <a role="menuitem" href="/pricing" class="dd-link"><span class="dd-title">Marketplace plans</span><span class="dd-sub">Free · Featured $29.99 · Enterprise</span></a>
          <a role="menuitem" href="/pricing/creator/" class="dd-link"><span class="dd-title">Creator plans</span><span class="dd-sub">Operator · Builder · Founder</span></a>
          <a role="menuitem" href="/pricing/compare/" class="dd-link"><span class="dd-title">Compare all</span><span class="dd-sub">Side-by-side feature matrix</span></a>
        </div>
      </li>

      <li role="none" class="has-dropdown">
        <button role="menuitem" class="sv-section-nav-link" aria-haspopup="true" aria-expanded="false" data-toggle>Dashboard<span class="caret" aria-hidden="true">⌄</span></button>
        <div class="sv-dropdown" role="menu" aria-label="Dashboard sections">
          <a role="menuitem" href="/dashboard" class="dd-link"><span class="dd-title">Overview</span><span class="dd-sub">Hub of your account</span></a>
          <a role="menuitem" href="/dashboard/listings/" class="dd-link"><span class="dd-title">My listings</span><span class="dd-sub">Edit, manage, archive</span></a>
          <a role="menuitem" href="/dashboard/inquiries/" class="dd-link"><span class="dd-title">Inquiries</span><span class="dd-sub">Buyer messages</span></a>
          <a role="menuitem" href="/dashboard/performance/" class="dd-link"><span class="dd-title">Performance</span><span class="dd-sub">Views, clicks, reach</span></a>
          <a role="menuitem" href="/dashboard/subscription/" class="dd-link"><span class="dd-title">Plan &amp; billing</span><span class="dd-sub">Subscription, invoices</span></a>
          <a role="menuitem" href="/dashboard/ai/" class="dd-link"><span class="dd-title">AI assistant</span><span class="dd-sub">Sophia AI · listing help</span></a>
        </div>
      </li>
    </ul>'''

m = OLD_BLOCK_RE.search(html)
if m:
    html = html[:m.start()] + NEW_BLOCK + html[m.end():]
    print("nav block replaced with dropdown structure")
else:
    print("WARNING: old nav block not found; aborting")
    raise SystemExit(1)

# Now append CSS for the dropdown system at end of <style>.
DROPDOWN_CSS = '''
  /* ------------ DROPDOWN NAV (luxury hotel mega-menu) ------------ */
  .sv-menu { list-style: none; margin: 0; padding: 0; display: flex; align-items: center; gap: 0; flex-wrap: wrap; }
  .sv-menu > li { position: relative; }
  .sv-menu > li > .sv-section-nav-link { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: 0; cursor: pointer; font-family: inherit; }
  .sv-menu > li > button.sv-section-nav-link::-moz-focus-inner { border: 0; }
  .caret { font-size: 0.7em; opacity: 0.55; line-height: 1; transition: transform .25s var(--ease-edit); }
  .has-dropdown[data-open="true"] > .sv-section-nav-link .caret { transform: rotate(180deg); opacity: 1; }
  .has-dropdown[data-open="true"] > .sv-section-nav-link { color: var(--gold) !important; }
  .has-dropdown[data-open="true"] > .sv-section-nav-link::after { content: ''; display: block; height: 1px; background: var(--gold); margin-top: 8px; position: absolute; left: 16px; right: 16px; bottom: -1px; }

  .sv-dropdown {
    position: absolute; top: calc(100% + 1px); left: 0;
    min-width: 320px;
    background: rgba(13, 14, 19, 0.96);
    border: 1px solid var(--rule);
    border-top: 1px solid var(--gold);
    backdrop-filter: blur(20px) saturate(150%);
    padding: 8px 0;
    opacity: 0; visibility: hidden; transform: translateY(-6px);
    transition: opacity .25s var(--ease-edit), transform .25s var(--ease-edit), visibility 0s linear .25s;
    z-index: 90;
    border-radius: 0;
  }
  .has-dropdown[data-open="true"] > .sv-dropdown,
  .has-dropdown:hover > .sv-dropdown,
  .has-dropdown:focus-within > .sv-dropdown {
    opacity: 1; visibility: visible; transform: translateY(0);
    transition-delay: 0s, 0s, 0s;
  }
  .dd-link {
    display: flex; flex-direction: column; gap: 2px;
    padding: 14px 22px;
    text-decoration: none;
    color: var(--bone);
    border-left: 1px solid transparent;
    transition: background .2s var(--ease-quick), border-color .2s var(--ease-quick);
  }
  .dd-link:hover, .dd-link:focus-visible {
    background: rgba(216,179,79,0.06);
    border-left-color: var(--gold);
    outline: none;
  }
  .dd-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 0.96rem;
    font-weight: 500;
    letter-spacing: -0.005em;
    color: var(--bone);
  }
  .dd-sub {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(245,241,230,0.5);
  }
  .dd-link.dd-cta {
    background: rgba(216,179,79,0.08);
    border-left-color: var(--gold);
  }
  .dd-link.dd-cta .dd-title { color: var(--gold); }
  .dd-link.dd-cta:hover { background: rgba(216,179,79,0.14); }

  @media (max-width: 880px) {
    .sv-menu { flex-direction: row; flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .sv-menu::-webkit-scrollbar { display: none; }
    .sv-dropdown { position: fixed; left: 0; right: 0; min-width: 0; width: 100%; top: 56px; max-height: calc(100vh - 56px); overflow-y: auto; }
  }
  /* Reduced motion respect */
  @media (prefers-reduced-motion: reduce) {
    .sv-dropdown, .caret { transition: none !important; }
  }
  /* ------------ END DROPDOWN NAV ------------ */
'''

style_close = html.find("</style>")
if style_close > -1 and "DROPDOWN NAV (luxury hotel mega-menu)" not in html:
    html = html[:style_close] + DROPDOWN_CSS + html[style_close:]
    print("dropdown CSS injected")

# JavaScript — handle click toggle on mobile, click-outside-close, ESC close, keyboard nav.
DROPDOWN_JS = '''
<script>
  // Dropdown nav — click toggle (mobile + keyboard), click-outside close, ESC close.
  (function () {
    var items = document.querySelectorAll('.has-dropdown');
    function closeAll(except) {
      items.forEach(function (it) {
        if (it !== except) {
          it.dataset.open = 'false';
          var btn = it.querySelector('[data-toggle]');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
    }
    items.forEach(function (it) {
      var btn = it.querySelector('[data-toggle]');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var willOpen = it.dataset.open !== 'true';
        closeAll(willOpen ? it : null);
        it.dataset.open = willOpen ? 'true' : 'false';
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.has-dropdown')) closeAll(null);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });
  })();
</script>'''

# Insert JS before </body>
if "Dropdown nav — click toggle" not in html:
    body_close = html.rfind("</body>")
    if body_close > -1:
        html = html[:body_close] + DROPDOWN_JS + "\n" + html[body_close:]
        print("dropdown JS injected")

with open(INDEX, "w", encoding="utf-8") as f:
    f.write(html)

print("Done.")
