#!/usr/bin/env python3
"""Add a hamburger → left drawer to index.html.
Per LUXURY-DESIGN-PRINCIPLES.md: hairline gold border, dark panel, slow editorial fade,
sentence-case, restrained gold. Same content as the top dropdowns but vertical with
collapsible groups + search field at top + sign-in/get-started pinned at bottom.
"""
import re, os

ROOT = "/Users/tarencea.rainey/outputs/sophiatv"
INDEX = os.path.join(ROOT, "index.html")

with open(INDEX, "r", encoding="utf-8") as f:
    html = f.read()

# Insert hamburger button right inside the .sv-section-nav-inner, before the brand,
# so it sits on the left edge of the header on every viewport.
HAMBURGER_BTN = '''<button class="sv-burger" type="button" aria-label="Open menu" aria-controls="svDrawer" aria-expanded="false" data-burger>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
    '''

# Inject hamburger right after the opening of .sv-section-nav-inner div.
m = re.search(r'(<div class="sv-section-nav-inner">\s*)', html)
if m and 'class="sv-burger"' not in html:
    html = html[:m.end()] + HAMBURGER_BTN + html[m.end():]
    print("hamburger button injected")

# Drawer markup (added before </body>).
DRAWER_HTML = '''
<aside class="sv-drawer" id="svDrawer" role="dialog" aria-modal="true" aria-label="Sophia Operator menu" aria-hidden="true">
  <div class="sv-drawer-head">
    <a href="/" class="sv-drawer-brand" aria-label="Sophia Operator home">
      <img src="/assets/brand/sophia-mark-256.png" alt="" width="40" height="40" />
      <span>ophia <em>Operator</em></span>
    </a>
    <button class="sv-drawer-close" type="button" aria-label="Close menu" data-drawer-close>×</button>
  </div>

  <div class="sv-drawer-search">
    <label for="svSearch" class="sr-only">Search the floor</label>
    <input id="svSearch" type="search" placeholder="Search the floor — operators, listings, tools…" autocomplete="off" />
  </div>

  <nav class="sv-drawer-nav" aria-label="All sections">
    <a href="/" class="sv-drawer-link sv-drawer-leaf is-active" data-name="Home" aria-current="page">Home</a>

    <details class="sv-drawer-group" data-name="Market">
      <summary class="sv-drawer-link"><span>Market</span><span class="chev" aria-hidden="true">›</span></summary>
      <div class="sv-drawer-children">
        <a href="/market" data-name="Browse the floor">Browse the floor</a>
        <a href="/market/regions/" data-name="By region">By region</a>
        <a href="/market/categories/" data-name="By category">By category</a>
        <a href="/market/featured/" data-name="Featured">Featured</a>
        <a href="/market/recent/" data-name="Recently added">Recently added</a>
        <a href="/market/saved/" data-name="Saved">Saved</a>
        <a href="/submit/basics/" data-name="List your business" class="dd-cta">List your business →</a>
      </div>
    </details>

    <details class="sv-drawer-group" data-name="Video">
      <summary class="sv-drawer-link"><span>Video</span><span class="chev" aria-hidden="true">›</span></summary>
      <div class="sv-drawer-children">
        <a href="/video" data-name="Feed">Feed</a>
        <a href="/video/saved/" data-name="Saved clips">Saved clips</a>
      </div>
    </details>

    <a href="/social" class="sv-drawer-link sv-drawer-leaf" data-name="Social">Social</a>

    <details class="sv-drawer-group" data-name="Wellness">
      <summary class="sv-drawer-link"><span>Wellness</span><span class="chev" aria-hidden="true">›</span></summary>
      <div class="sv-drawer-children">
        <a href="/wellness" data-name="Operator wellness">Operator wellness</a>
        <a href="/natural-cures" data-name="Natural cures library">Natural cures library</a>
      </div>
    </details>

    <details class="sv-drawer-group" data-name="Tools">
      <summary class="sv-drawer-link"><span>Tools</span><span class="chev" aria-hidden="true">›</span></summary>
      <div class="sv-drawer-children">
        <a href="/everyday-tools" data-name="Everyday tools">Everyday tools</a>
        <a href="/budget-planner" data-name="Budget planner">Budget planner</a>
      </div>
    </details>

    <a href="/camera" class="sv-drawer-link sv-drawer-leaf" data-name="Vision">Vision</a>

    <details class="sv-drawer-group" data-name="Pricing">
      <summary class="sv-drawer-link"><span>Pricing</span><span class="chev" aria-hidden="true">›</span></summary>
      <div class="sv-drawer-children">
        <a href="/pricing" data-name="Marketplace plans">Marketplace plans</a>
        <a href="/pricing/creator/" data-name="Creator plans">Creator plans</a>
        <a href="/pricing/compare/" data-name="Compare all">Compare all</a>
      </div>
    </details>

    <details class="sv-drawer-group" data-name="Dashboard">
      <summary class="sv-drawer-link"><span>Dashboard</span><span class="chev" aria-hidden="true">›</span></summary>
      <div class="sv-drawer-children">
        <a href="/dashboard" data-name="Overview">Overview</a>
        <a href="/dashboard/listings/" data-name="My listings">My listings</a>
        <a href="/dashboard/inquiries/" data-name="Inquiries">Inquiries</a>
        <a href="/dashboard/performance/" data-name="Performance">Performance</a>
        <a href="/dashboard/subscription/" data-name="Plan and billing">Plan and billing</a>
        <a href="/dashboard/ai/" data-name="AI assistant">AI assistant</a>
      </div>
    </details>
  </nav>

  <div class="sv-drawer-foot">
    <a class="sv-drawer-signin" href="/login.html">Sign in</a>
    <a class="sv-drawer-cta" href="/signup.html">Get started</a>
  </div>
</aside>
<div class="sv-drawer-scrim" data-drawer-close></div>
'''

# Add drawer right before </body> (and before any existing trailing scripts is fine).
if 'id="svDrawer"' not in html:
    body_close = html.rfind("</body>")
    if body_close > -1:
        html = html[:body_close] + DRAWER_HTML + "\n" + html[body_close:]
        print("drawer markup injected")

# CSS
DRAWER_CSS = '''
  /* ------------ HAMBURGER + DRAWER (luxury concierge nav) ------------ */
  .sv-burger { width: 40px; height: 40px; padding: 0; margin-right: 6px; background: transparent; border: 1px solid var(--rule); border-radius: 0; cursor: pointer; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; transition: border-color .2s var(--ease-quick); flex-shrink: 0; }
  .sv-burger:hover { border-color: var(--gold); }
  .sv-burger span { display: block; width: 18px; height: 1px; background: var(--bone); transition: transform .25s var(--ease-edit), opacity .2s var(--ease-quick); }
  body.sv-drawer-open .sv-burger span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
  body.sv-drawer-open .sv-burger span:nth-child(2) { opacity: 0; }
  body.sv-drawer-open .sv-burger span:nth-child(3) { transform: translateY(-5px) rotate(-45deg); }

  .sv-drawer { position: fixed; top: 0; bottom: 0; left: 0; width: min(380px, 86vw); background: rgba(13,14,19,0.98); backdrop-filter: blur(24px) saturate(150%); border-right: 1px solid var(--gold); z-index: 200; display: flex; flex-direction: column; transform: translateX(-100%); transition: transform .42s var(--ease-edit); will-change: transform; }
  body.sv-drawer-open .sv-drawer { transform: translateX(0); }
  .sv-drawer-scrim { position: fixed; inset: 0; background: rgba(6,7,10,0.7); backdrop-filter: blur(2px); opacity: 0; visibility: hidden; transition: opacity .35s var(--ease-edit), visibility 0s linear .35s; z-index: 199; cursor: pointer; }
  body.sv-drawer-open .sv-drawer-scrim { opacity: 1; visibility: visible; transition-delay: 0s, 0s; }

  .sv-drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 22px 24px; border-bottom: 1px solid var(--rule); }
  .sv-drawer-brand { display: inline-flex; align-items: center; gap: 0; text-decoration: none; }
  .sv-drawer-brand img { height: 36px; width: auto; vertical-align: middle; }
  .sv-drawer-brand span { font-family: 'Playfair Display', Georgia, serif; font-size: 1.2rem; font-weight: 600; color: var(--bone); letter-spacing: -0.01em; }
  .sv-drawer-brand span em { font-style: normal; color: var(--gold); margin-left: 6px; font-weight: 500; letter-spacing: 0.04em; font-size: 0.78em; vertical-align: 2px; }
  .sv-drawer-close { background: transparent; border: 1px solid var(--rule); color: var(--bone); width: 36px; height: 36px; font-size: 1.4rem; line-height: 1; cursor: pointer; transition: border-color .2s; }
  .sv-drawer-close:hover { border-color: var(--gold); color: var(--gold); }

  .sv-drawer-search { padding: 18px 24px; border-bottom: 1px solid var(--rule); }
  .sv-drawer-search input { width: 100%; padding: 12px 14px; background: rgba(255,255,255,0.04); border: 1px solid var(--rule); border-radius: 0; color: var(--bone); font-family: inherit; font-size: 0.92rem; outline: none; transition: border-color .2s; }
  .sv-drawer-search input::placeholder { color: rgba(245,241,230,0.4); }
  .sv-drawer-search input:focus { border-color: var(--gold); }

  .sv-drawer-nav { flex: 1; overflow-y: auto; padding: 12px 0; -webkit-overflow-scrolling: touch; }
  .sv-drawer-link { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; color: var(--bone) !important; text-decoration: none; font-family: 'Playfair Display', Georgia, serif; font-size: 1.04rem; font-weight: 500; letter-spacing: -0.005em; cursor: pointer; transition: background .2s var(--ease-quick), color .2s var(--ease-quick); border-left: 1px solid transparent; }
  .sv-drawer-link:hover { background: rgba(216,179,79,0.06); border-left-color: var(--gold); color: var(--bone); }
  .sv-drawer-link.is-active { color: var(--gold) !important; border-left-color: var(--gold); }
  .sv-drawer-link::-webkit-details-marker { display: none; }
  .sv-drawer-group summary { list-style: none; }
  .sv-drawer-group .chev { font-size: 1.2rem; color: rgba(245,241,230,0.45); transition: transform .25s var(--ease-edit); }
  .sv-drawer-group[open] .chev { transform: rotate(90deg); color: var(--gold); }
  .sv-drawer-children { display: flex; flex-direction: column; padding: 4px 0 14px; }
  .sv-drawer-children a { padding: 10px 24px 10px 40px; font-family: 'Inter', sans-serif; font-size: 0.86rem; font-weight: 400; color: rgba(245,241,230,0.66) !important; text-decoration: none; letter-spacing: 0.02em; transition: color .15s, background .15s; border-left: 1px solid transparent; }
  .sv-drawer-children a:hover { color: var(--bone) !important; background: rgba(216,179,79,0.04); border-left-color: var(--gold); }
  .sv-drawer-children a.dd-cta { color: var(--gold) !important; font-weight: 500; }
  .sv-drawer-children a.is-hidden, .sv-drawer-link.is-hidden { display: none; }

  .sv-drawer-foot { padding: 16px 24px 22px; border-top: 1px solid var(--rule); display: flex; gap: 10px; }
  .sv-drawer-foot a { flex: 1; padding: 12px 16px; text-align: center; text-decoration: none; font-size: 11px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; border-radius: 2px; }
  .sv-drawer-signin { background: transparent; color: var(--bone); border: 1px solid rgba(245,241,230,0.35); }
  .sv-drawer-signin:hover { border-color: var(--gold); color: var(--gold); }
  .sv-drawer-cta { background: var(--bone); color: var(--ink, #06070a); }
  .sv-drawer-cta:hover { background: var(--gold); color: #000; }

  body.sv-drawer-open { overflow: hidden; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0; }

  /* On narrow viewports the drawer is the primary nav — hide the horizontal menu */
  @media (max-width: 880px) {
    .sv-menu { display: none; }
    .sv-burger { margin-right: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .sv-drawer, .sv-drawer-scrim, .sv-burger span, .chev { transition: none !important; }
  }
  /* ------------ END HAMBURGER + DRAWER ------------ */
'''

style_close = html.find("</style>")
if style_close > -1 and "HAMBURGER + DRAWER (luxury concierge nav)" not in html:
    html = html[:style_close] + DRAWER_CSS + html[style_close:]
    print("drawer CSS injected")

# JS — open/close + ESC + outside click + search filter
DRAWER_JS = '''
<script>
  // Drawer nav — open/close, ESC, search filter, focus trap-lite.
  (function () {
    var burger = document.querySelector('[data-burger]');
    var drawer = document.getElementById('svDrawer');
    var closers = document.querySelectorAll('[data-drawer-close]');
    var search = document.getElementById('svSearch');
    if (!burger || !drawer) return;

    function open() {
      document.body.classList.add('sv-drawer-open');
      drawer.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      setTimeout(function () { search && search.focus(); }, 250);
    }
    function close() {
      document.body.classList.remove('sv-drawer-open');
      drawer.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      if (search) { search.value = ''; filter(''); }
      burger.focus();
    }
    burger.addEventListener('click', function () {
      if (document.body.classList.contains('sv-drawer-open')) close(); else open();
    });
    closers.forEach(function (b) { b.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('sv-drawer-open')) close();
    });

    // Live search filter — match against data-name on every link in the drawer.
    function filter(q) {
      q = (q || '').trim().toLowerCase();
      var anyMatch = false;
      drawer.querySelectorAll('[data-name]').forEach(function (el) {
        var name = (el.getAttribute('data-name') || '').toLowerCase();
        var match = !q || name.indexOf(q) > -1;
        // For child <a>s, we hide the <a> directly.
        // For groups (summary), we hide the entire <details> if no children match.
        if (el.tagName === 'A' || el.tagName === 'DETAILS') {
          el.classList.toggle('is-hidden', !match && el.tagName === 'A');
        }
        if (match) anyMatch = true;
      });
      // Group visibility: a group is visible if its summary OR any child matches.
      drawer.querySelectorAll('details.sv-drawer-group').forEach(function (g) {
        var groupName = (g.getAttribute('data-name') || '').toLowerCase();
        var groupMatches = !q || groupName.indexOf(q) > -1;
        var anyChild = false;
        g.querySelectorAll('a[data-name]').forEach(function (a) {
          var n = (a.getAttribute('data-name') || '').toLowerCase();
          if (!q || n.indexOf(q) > -1) anyChild = true;
          a.classList.toggle('is-hidden', !!q && !(n.indexOf(q) > -1) && !groupMatches);
        });
        var visible = groupMatches || anyChild;
        g.style.display = visible ? '' : 'none';
        if (q && anyChild) g.setAttribute('open', '');
      });
    }
    if (search) search.addEventListener('input', function (e) { filter(e.target.value); });
  })();
</script>'''

if "Drawer nav — open/close" not in html:
    body_close = html.rfind("</body>")
    if body_close > -1:
        html = html[:body_close] + DRAWER_JS + "\n" + html[body_close:]
        print("drawer JS injected")

with open(INDEX, "w", encoding="utf-8") as f:
    f.write(html)

print("Done.")
