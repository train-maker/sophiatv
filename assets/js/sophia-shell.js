/* SophiaTV Luxury Shell — auto-injects unified header, drawer, chat FAB, language picker.
 * Drop <link rel="stylesheet" href="/assets/css/sophia-shell.css">
 *  + <script src="/assets/js/sophia-shell.js" defer data-active="market"></script>
 * on any page and the shell appears.
 *
 * Set data-active="<key>" on the script tag to highlight the matching nav link.
 * Keys: home | market | video | social | wellness | tools | vision | pricing | dashboard
 */
(function () {
  'use strict';

  var SCRIPT = document.currentScript;
  var ACTIVE_KEY = (SCRIPT && SCRIPT.dataset.active) || (function () {
    var p = location.pathname.replace(/\/$/, '');
    if (p === '' || p === '/index.html') return 'home';
    if (p.indexOf('/market') === 0) return 'market';
    if (p.indexOf('/video') === 0) return 'video';
    if (p.indexOf('/social') === 0) return 'social';
    if (p.indexOf('/wellness') === 0 || p.indexOf('/natural-cures') === 0) return 'wellness';
    if (p.indexOf('/everyday-tools') === 0 || p.indexOf('/budget-planner') === 0) return 'tools';
    if (p.indexOf('/camera') === 0 || p === '/vision') return 'vision';
    if (p.indexOf('/pricing') === 0) return 'pricing';
    if (p.indexOf('/dashboard') === 0) return 'dashboard';
    return null;
  })();

  // Mark for "active" — sx-link.is-active
  function active(key) { return ACTIVE_KEY === key ? ' is-active' : ''; }

  var LANGS = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'pt', label: 'Portuguese' },
    { code: 'ar', label: 'Arabic' },
    { code: 'zh', label: 'Chinese' },
    { code: 'hi', label: 'Hindi' },
    { code: 'de', label: 'German' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ru', label: 'Russian' },
  ];

  var currentLang = localStorage.getItem('sophia.lang') || 'en';

  function buildHeader() {
    var nav = document.createElement('nav');
    nav.className = 'sx-section-nav';
    nav.setAttribute('aria-label', 'Sophia Operator sections');
    nav.innerHTML = '<div class="sx-section-nav-inner">' +
      '<button class="sx-burger" type="button" aria-label="Open menu" aria-controls="sxDrawer" aria-expanded="false" data-burger>' +
        '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>' +
      '</button>' +
      '<a href="/" class="sx-brand" aria-label="Sophia Operator home">' +
        '<img src="/assets/brand/sophia-mark-256.png" alt="" />' +
        '<span>ophia <em>Operator</em></span>' +
      '</a>' +
      '<ul class="sx-menu" role="menubar">' +
        '<li role="none"><a role="menuitem" href="/" class="sx-link' + active('home') + '">Home</a></li>' +
        '<li role="none" class="sx-has-dd"><button role="menuitem" class="sx-link' + active('market') + '" aria-haspopup="true" aria-expanded="false" data-toggle>Market<span class="sx-caret" aria-hidden="true">⌄</span></button>' +
          '<div class="sx-dd" role="menu" aria-label="Market sections">' +
            '<a role="menuitem" href="/market"><span class="sx-dd-title">Browse the floor</span><span class="sx-dd-sub">Featured · 105 countries</span></a>' +
            '<a role="menuitem" href="/market/regions/"><span class="sx-dd-title">By region</span><span class="sx-dd-sub">Americas · EU · Africa · MENA · APAC</span></a>' +
            '<a role="menuitem" href="/market/categories/"><span class="sx-dd-title">By category</span><span class="sx-dd-sub">18 industry verticals</span></a>' +
            '<a role="menuitem" href="/market/featured/"><span class="sx-dd-title">Featured</span><span class="sx-dd-sub">Verified businesses</span></a>' +
            '<a role="menuitem" href="/market/recent/"><span class="sx-dd-title">Recently added</span><span class="sx-dd-sub">Newest operators</span></a>' +
            '<a role="menuitem" href="/market/saved/"><span class="sx-dd-title">Saved</span><span class="sx-dd-sub">Your bookmarked listings</span></a>' +
            '<a role="menuitem" href="/submit/basics/" class="sx-dd-cta"><span class="sx-dd-title">List your business</span><span class="sx-dd-sub">Free or Featured at $29.99/mo →</span></a>' +
          '</div>' +
        '</li>' +
        '<li role="none" class="sx-has-dd"><button role="menuitem" class="sx-link' + active('video') + '" aria-haspopup="true" aria-expanded="false" data-toggle>Video<span class="sx-caret" aria-hidden="true">⌄</span></button>' +
          '<div class="sx-dd" role="menu" aria-label="Video sections">' +
            '<a role="menuitem" href="/video"><span class="sx-dd-title">Feed</span><span class="sx-dd-sub">Vertical scroll · operator updates</span></a>' +
            '<a role="menuitem" href="/video/saved/"><span class="sx-dd-title">Saved clips</span><span class="sx-dd-sub">Your bookmarked videos</span></a>' +
          '</div>' +
        '</li>' +
        '<li role="none"><a role="menuitem" href="/social" class="sx-link' + active('social') + '">Social</a></li>' +
        '<li role="none" class="sx-has-dd"><button role="menuitem" class="sx-link' + active('wellness') + '" aria-haspopup="true" aria-expanded="false" data-toggle>Wellness<span class="sx-caret" aria-hidden="true">⌄</span></button>' +
          '<div class="sx-dd" role="menu" aria-label="Wellness sections">' +
            '<a role="menuitem" href="/wellness"><span class="sx-dd-title">Operator wellness</span><span class="sx-dd-sub">Pillars · longevity</span></a>' +
            '<a role="menuitem" href="/natural-cures"><span class="sx-dd-title">Natural cures</span><span class="sx-dd-sub">Plants · minerals · protocols</span></a>' +
          '</div>' +
        '</li>' +
        '<li role="none" class="sx-has-dd"><button role="menuitem" class="sx-link' + active('tools') + '" aria-haspopup="true" aria-expanded="false" data-toggle>Tools<span class="sx-caret" aria-hidden="true">⌄</span></button>' +
          '<div class="sx-dd" role="menu" aria-label="Tools sections">' +
            '<a role="menuitem" href="/everyday-tools"><span class="sx-dd-title">Everyday tools</span><span class="sx-dd-sub">Translator · helpers</span></a>' +
            '<a role="menuitem" href="/budget-planner"><span class="sx-dd-title">Budget planner</span><span class="sx-dd-sub">Cross-border budgets</span></a>' +
          '</div>' +
        '</li>' +
        '<li role="none"><a role="menuitem" href="/camera" class="sx-link' + active('vision') + '">Vision</a></li>' +
        '<li role="none" class="sx-has-dd"><button role="menuitem" class="sx-link' + active('pricing') + '" aria-haspopup="true" aria-expanded="false" data-toggle>Pricing<span class="sx-caret" aria-hidden="true">⌄</span></button>' +
          '<div class="sx-dd" role="menu" aria-label="Pricing sections">' +
            '<a role="menuitem" href="/pricing"><span class="sx-dd-title">Marketplace plans</span><span class="sx-dd-sub">Free · Featured · Enterprise</span></a>' +
            '<a role="menuitem" href="/pricing/creator/"><span class="sx-dd-title">Creator plans</span><span class="sx-dd-sub">Operator · Builder · Founder</span></a>' +
            '<a role="menuitem" href="/pricing/compare/"><span class="sx-dd-title">Compare all</span><span class="sx-dd-sub">Side-by-side feature matrix</span></a>' +
          '</div>' +
        '</li>' +
        '<li role="none" class="sx-has-dd"><button role="menuitem" class="sx-link' + active('dashboard') + '" aria-haspopup="true" aria-expanded="false" data-toggle>Dashboard<span class="sx-caret" aria-hidden="true">⌄</span></button>' +
          '<div class="sx-dd" role="menu" aria-label="Dashboard sections">' +
            '<a role="menuitem" href="/dashboard"><span class="sx-dd-title">Overview</span><span class="sx-dd-sub">Hub of your account</span></a>' +
            '<a role="menuitem" href="/dashboard/listings/"><span class="sx-dd-title">My listings</span><span class="sx-dd-sub">Edit · manage</span></a>' +
            '<a role="menuitem" href="/dashboard/inquiries/"><span class="sx-dd-title">Inquiries</span><span class="sx-dd-sub">Buyer messages</span></a>' +
            '<a role="menuitem" href="/dashboard/performance/"><span class="sx-dd-title">Performance</span><span class="sx-dd-sub">Views · clicks · reach</span></a>' +
            '<a role="menuitem" href="/dashboard/subscription/"><span class="sx-dd-title">Plan and billing</span><span class="sx-dd-sub">Subscription · invoices</span></a>' +
            '<a role="menuitem" href="/dashboard/ai/"><span class="sx-dd-title">AI assistant</span><span class="sx-dd-sub">Sophia AI · listing help</span></a>' +
          '</div>' +
        '</li>' +
      '</ul>' +
      '<div class="sx-actions">' +
        '<div class="sx-lang">' +
          '<button class="sx-lang-btn" type="button" data-lang-toggle aria-haspopup="true" aria-expanded="false">' +
            '<span data-lang-current>' + currentLang.toUpperCase() + '</span><span class="sx-caret" aria-hidden="true">⌄</span>' +
          '</button>' +
          '<div class="sx-lang-pop" role="menu" aria-label="Language"></div>' +
        '</div>' +
        '<a class="sx-ghost" href="/login.html">Sign in</a>' +
        '<a class="sx-fill" href="/signup.html">Get started</a>' +
      '</div>' +
    '</div>';
    return nav;
  }

  function buildDrawer() {
    var aside = document.createElement('aside');
    aside.className = 'sx-drawer';
    aside.id = 'sxDrawer';
    aside.setAttribute('role', 'dialog');
    aside.setAttribute('aria-modal', 'true');
    aside.setAttribute('aria-label', 'Sophia Operator menu');
    aside.setAttribute('aria-hidden', 'true');
    aside.innerHTML = '<div class="sx-drawer-head">' +
      '<a href="/" class="sx-brand"><img src="/assets/brand/sophia-mark-256.png" alt="" /><span>ophia <em>Operator</em></span></a>' +
      '<button class="sx-drawer-close" type="button" aria-label="Close menu" data-drawer-close>×</button>' +
    '</div>' +
    '<div class="sx-drawer-search">' +
      '<input type="search" placeholder="Search the floor — operators, listings, tools…" autocomplete="off" data-drawer-search />' +
    '</div>' +
    '<nav class="sx-drawer-nav" aria-label="All sections">' +
      '<a href="/" class="sx-drawer-link' + active('home') + '" data-name="Home">Home</a>' +
      '<details class="sx-drawer-group" data-name="Market"' + (ACTIVE_KEY === 'market' ? ' open' : '') + '>' +
        '<summary class="sx-drawer-link"><span>Market</span><span class="sx-chev">›</span></summary>' +
        '<div class="sx-drawer-children">' +
          '<a href="/market" data-name="Browse the floor">Browse the floor</a>' +
          '<a href="/market/regions/" data-name="By region">By region</a>' +
          '<a href="/market/categories/" data-name="By category">By category</a>' +
          '<a href="/market/featured/" data-name="Featured">Featured</a>' +
          '<a href="/market/recent/" data-name="Recently added">Recently added</a>' +
          '<a href="/market/saved/" data-name="Saved">Saved</a>' +
          '<a href="/submit/basics/" data-name="List your business" class="sx-cta">List your business →</a>' +
        '</div>' +
      '</details>' +
      '<details class="sx-drawer-group" data-name="Video"' + (ACTIVE_KEY === 'video' ? ' open' : '') + '>' +
        '<summary class="sx-drawer-link"><span>Video</span><span class="sx-chev">›</span></summary>' +
        '<div class="sx-drawer-children">' +
          '<a href="/video" data-name="Feed">Feed</a>' +
          '<a href="/video/saved/" data-name="Saved clips">Saved clips</a>' +
        '</div>' +
      '</details>' +
      '<a href="/social" class="sx-drawer-link' + active('social') + '" data-name="Social">Social</a>' +
      '<details class="sx-drawer-group" data-name="Wellness"' + (ACTIVE_KEY === 'wellness' ? ' open' : '') + '>' +
        '<summary class="sx-drawer-link"><span>Wellness</span><span class="sx-chev">›</span></summary>' +
        '<div class="sx-drawer-children">' +
          '<a href="/wellness" data-name="Operator wellness">Operator wellness</a>' +
          '<a href="/natural-cures" data-name="Natural cures library">Natural cures library</a>' +
        '</div>' +
      '</details>' +
      '<details class="sx-drawer-group" data-name="Tools"' + (ACTIVE_KEY === 'tools' ? ' open' : '') + '>' +
        '<summary class="sx-drawer-link"><span>Tools</span><span class="sx-chev">›</span></summary>' +
        '<div class="sx-drawer-children">' +
          '<a href="/everyday-tools" data-name="Everyday tools">Everyday tools</a>' +
          '<a href="/budget-planner" data-name="Budget planner">Budget planner</a>' +
        '</div>' +
      '</details>' +
      '<a href="/camera" class="sx-drawer-link' + active('vision') + '" data-name="Vision">Vision</a>' +
      '<details class="sx-drawer-group" data-name="Pricing"' + (ACTIVE_KEY === 'pricing' ? ' open' : '') + '>' +
        '<summary class="sx-drawer-link"><span>Pricing</span><span class="sx-chev">›</span></summary>' +
        '<div class="sx-drawer-children">' +
          '<a href="/pricing" data-name="Marketplace plans">Marketplace plans</a>' +
          '<a href="/pricing/creator/" data-name="Creator plans">Creator plans</a>' +
          '<a href="/pricing/compare/" data-name="Compare all">Compare all</a>' +
        '</div>' +
      '</details>' +
      '<details class="sx-drawer-group" data-name="Dashboard"' + (ACTIVE_KEY === 'dashboard' ? ' open' : '') + '>' +
        '<summary class="sx-drawer-link"><span>Dashboard</span><span class="sx-chev">›</span></summary>' +
        '<div class="sx-drawer-children">' +
          '<a href="/dashboard" data-name="Overview">Overview</a>' +
          '<a href="/dashboard/listings/" data-name="My listings">My listings</a>' +
          '<a href="/dashboard/inquiries/" data-name="Inquiries">Inquiries</a>' +
          '<a href="/dashboard/performance/" data-name="Performance">Performance</a>' +
          '<a href="/dashboard/subscription/" data-name="Plan and billing">Plan and billing</a>' +
          '<a href="/dashboard/ai/" data-name="AI assistant">AI assistant</a>' +
        '</div>' +
      '</details>' +
    '</nav>' +
    '<div class="sx-drawer-foot">' +
      '<a class="sx-drawer-signin" href="/login.html">Sign in</a>' +
      '<a class="sx-drawer-cta" href="/signup.html">Get started</a>' +
    '</div>';

    var scrim = document.createElement('div');
    scrim.className = 'sx-scrim';
    scrim.setAttribute('data-drawer-close', '');
    return [aside, scrim];
  }

  function buildChatFab() {
    var fab = document.createElement('button');
    fab.className = 'sx-chat-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Open Sophia AI chat');
    fab.setAttribute('data-chat-toggle', '');
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12c0 4.418-4.03 8-9 8a9.5 9.5 0 0 1-3.6-.7L3 21l1.7-5.4A8.5 8.5 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>';

    var panel = document.createElement('aside');
    panel.className = 'sx-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Sophia AI chat');
    panel.innerHTML = '<div class="sx-chat-head">' +
      '<div><h3>Sophia AI</h3><div class="sub">Concierge · Operator assistant</div></div>' +
      '<button class="sx-chat-close" type="button" aria-label="Close" data-chat-close>×</button>' +
    '</div>' +
    '<div class="sx-chat-thread" data-chat-thread><div class="sx-chat-msg sophia">How can I help on the floor today?</div></div>' +
    '<form class="sx-chat-foot" data-chat-form>' +
      '<input type="text" placeholder="Ask Sophia…" data-chat-input autocomplete="off" />' +
      '<button type="submit">Send</button>' +
    '</form>';
    return [fab, panel];
  }

  // === Behavior ===
  function wireDropdowns() {
    document.querySelectorAll('.sx-has-dd').forEach(function (it) {
      var btn = it.querySelector('[data-toggle]');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var willOpen = it.dataset.open !== 'true';
        document.querySelectorAll('.sx-has-dd').forEach(function (other) {
          if (other !== it) { other.dataset.open = 'false'; var b = other.querySelector('[data-toggle]'); if (b) b.setAttribute('aria-expanded', 'false'); }
        });
        it.dataset.open = willOpen ? 'true' : 'false';
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.sx-has-dd')) {
        document.querySelectorAll('.sx-has-dd').forEach(function (it) { it.dataset.open = 'false'; });
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') document.querySelectorAll('.sx-has-dd').forEach(function (it) { it.dataset.open = 'false'; });
    });
  }

  function wireDrawer() {
    var burger = document.querySelector('[data-burger]');
    var drawer = document.getElementById('sxDrawer');
    var closers = document.querySelectorAll('[data-drawer-close]');
    var search = document.querySelector('[data-drawer-search]');
    if (!burger || !drawer) return;
    function open() { document.body.classList.add('sx-drawer-open'); drawer.setAttribute('aria-hidden', 'false'); burger.setAttribute('aria-expanded', 'true'); setTimeout(function () { search && search.focus(); }, 250); }
    function close() { document.body.classList.remove('sx-drawer-open'); drawer.setAttribute('aria-hidden', 'true'); burger.setAttribute('aria-expanded', 'false'); if (search) { search.value = ''; filter(''); } burger.focus(); }
    burger.addEventListener('click', function () { document.body.classList.contains('sx-drawer-open') ? close() : open(); });
    closers.forEach(function (b) { b.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('sx-drawer-open')) close(); });
    function filter(q) {
      q = (q || '').trim().toLowerCase();
      drawer.querySelectorAll('a[data-name]').forEach(function (el) { var n = (el.getAttribute('data-name') || '').toLowerCase(); el.classList.toggle('is-hidden', !!q && n.indexOf(q) < 0); });
      drawer.querySelectorAll('details.sx-drawer-group').forEach(function (g) {
        var groupName = (g.getAttribute('data-name') || '').toLowerCase();
        var groupMatches = !q || groupName.indexOf(q) >= 0;
        var anyChild = false;
        g.querySelectorAll('a[data-name]').forEach(function (a) { var n = (a.getAttribute('data-name') || '').toLowerCase(); if (!q || n.indexOf(q) >= 0) anyChild = true; });
        var visible = groupMatches || anyChild;
        g.style.display = visible ? '' : 'none';
        if (q && anyChild) g.setAttribute('open', '');
      });
    }
    if (search) search.addEventListener('input', function (e) { filter(e.target.value); });
  }

  function wireChat() {
    var fab = document.querySelector('[data-chat-toggle]');
    var panel = document.querySelector('.sx-chat-panel');
    var closer = document.querySelector('[data-chat-close]');
    var form = document.querySelector('[data-chat-form]');
    var input = document.querySelector('[data-chat-input]');
    var thread = document.querySelector('[data-chat-thread]');
    if (!fab || !panel) return;
    fab.addEventListener('click', function () { panel.classList.toggle('is-open'); if (panel.classList.contains('is-open')) input && input.focus(); });
    closer && closer.addEventListener('click', function () { panel.classList.remove('is-open'); });
    form && form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = (input.value || '').trim(); if (!msg) return;
      var youEl = document.createElement('div'); youEl.className = 'sx-chat-msg you'; youEl.textContent = msg; thread.appendChild(youEl);
      input.value = '';
      var pending = document.createElement('div'); pending.className = 'sx-chat-msg sophia'; pending.textContent = 'Thinking…'; thread.appendChild(pending);
      thread.scrollTop = thread.scrollHeight;
      fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }) })
        .then(function (r) { return r.json(); })
        .then(function (j) { pending.textContent = j.reply || 'Sophia AI is offline — connect ANTHROPIC_API_KEY in Vercel.'; thread.scrollTop = thread.scrollHeight; })
        .catch(function () { pending.textContent = 'Connection error — try again.'; });
    });
  }

  function wireLang() {
    var btn = document.querySelector('[data-lang-toggle]');
    var pop = document.querySelector('.sx-lang-pop');
    var cur = document.querySelector('[data-lang-current]');
    var wrap = document.querySelector('.sx-lang');
    if (!btn || !pop || !wrap) return;
    pop.innerHTML = LANGS.map(function (l) { return '<button type="button" data-lang="' + l.code + '" class="' + (l.code === currentLang ? 'is-on' : '') + '">' + l.label + '</button>'; }).join('');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = wrap.dataset.open !== 'true';
      wrap.dataset.open = open ? 'true' : 'false';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.sx-lang')) wrap.dataset.open = 'false'; });
    pop.querySelectorAll('button[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () {
        var code = b.getAttribute('data-lang');
        currentLang = code;
        localStorage.setItem('sophia.lang', code);
        cur.textContent = code.toUpperCase();
        pop.querySelectorAll('button').forEach(function (x) { x.classList.toggle('is-on', x.getAttribute('data-lang') === code); });
        wrap.dataset.open = 'false';
        translatePage(code);
      });
    });
    // Apply on load if a non-English language is saved
    if (currentLang && currentLang !== 'en') translatePage(currentLang);
  }

  function translatePage(target) {
    if (target === 'en') { location.reload(); return; }
    // Collect short visible text nodes — restraint: only h1/h2/h3/p/a/span/li/button under <main>, <header>, <section>, <footer>.
    var sel = 'h1, h2, h3, h4, p, .sv-eyebrow, .sx-dd-title, .sx-dd-sub, .sx-link, .sx-drawer-link, .sx-drawer-children a, .sx-chat-fab, .sx-chat-head h3';
    var nodes = Array.from(document.querySelectorAll(sel)).filter(function (n) {
      return n.children.length === 0 && (n.textContent || '').trim().length > 1 && (n.textContent || '').trim().length < 320;
    });
    nodes.forEach(function (n) {
      var text = n.textContent.trim();
      if (!text || n.dataset.svTranslated === target) return;
      fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text, source: 'en', target: target, mode: 'translate' }) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.translated) { n.textContent = j.translated; n.dataset.svTranslated = target; }
        })
        .catch(function () { /* fail silently — keep English */ });
    });
  }

  // === Init ===
  function init() {
    var existing = document.querySelector('.sx-section-nav');
    if (existing) return;  // already mounted (e.g. home)

    var header = buildHeader();
    var drawerParts = buildDrawer();
    var chatParts = buildChatFab();

    document.body.insertBefore(header, document.body.firstChild);
    document.body.appendChild(drawerParts[0]);  // aside
    document.body.appendChild(drawerParts[1]);  // scrim
    document.body.appendChild(chatParts[0]);    // fab
    document.body.appendChild(chatParts[1]);    // panel

    wireDropdowns();
    wireDrawer();
    wireChat();
    wireLang();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
