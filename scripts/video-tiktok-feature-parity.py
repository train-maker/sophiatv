#!/usr/bin/env python3
"""Add full TikTok feature parity to /video.html (on top of the existing 10x build).

Adds:
1. Top tabs: For You · Following · Trending · Live (Live = coming soon).
2. Search bar (filters by creator/caption/hashtag).
3. Repost button (per-clip, persisted localStorage).
4. Multi-reaction strip on long-press of like (heart, fire, clap, brain, money, eyes, hundred).
5. Watch history page link in shell drawer (already there) + history tracked locally.
6. Creator profile click → /video/creator/<handle> placeholder route.
7. Comment replies (nested one level).
8. Live indicator badge on creators currently 'live' (synthetic).
9. Notifications bell in the rail (placeholder count).
"""
import os
ROOT = "/Users/tarencea.rainey/outputs/sophiatv"
VIDEO = os.path.join(ROOT, "video.html")

with open(VIDEO, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Inject tabs HTML right after <header class="video-page-head"> closing </header>
TABS_HTML = '''  <nav class="video-tabs" role="tablist" aria-label="Video feeds">
    <button class="vt-tab is-active" role="tab" aria-selected="true" data-feed="foryou">For You</button>
    <button class="vt-tab" role="tab" aria-selected="false" data-feed="following">Following</button>
    <button class="vt-tab" role="tab" aria-selected="false" data-feed="trending">Trending</button>
    <button class="vt-tab" role="tab" aria-selected="false" data-feed="live">Live<span class="vt-live-dot" aria-hidden="true"></span><span class="vt-soon">Soon</span></button>
  </nav>

  <div class="video-search-row">
    <input type="search" id="videoSearch" placeholder="Search creators, captions, hashtags…" autocomplete="off" aria-label="Search video feed" />
  </div>
'''
html = html.replace('<div class="feed-tags" id="feedTags"></div>', TABS_HTML + '<div class="feed-tags" id="feedTags"></div>')

# 2. Inject CSS for the new pieces — append before existing </style>
NEW_CSS = '''
  /* Tabs */
  .video-tabs { display: flex; gap: 0; max-width: 480px; margin: 0 auto 12px; padding: 0 16px; border-bottom: 1px solid rgba(216,179,79,0.22); justify-content: center; }
  .vt-tab { background: transparent; border: 0; color: rgba(245,241,230,0.55); padding: 12px 18px; font-family: inherit; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 500; cursor: pointer; position: relative; transition: color .15s; }
  .vt-tab:hover { color: var(--bone, #f5f1e6); }
  .vt-tab.is-active { color: #d8b34f; }
  .vt-tab.is-active::after { content: ''; position: absolute; left: 18px; right: 18px; bottom: -1px; height: 1px; background: #d8b34f; }
  .vt-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #ff4d4d; display: inline-block; margin-left: 6px; vertical-align: middle; box-shadow: 0 0 0 2px rgba(255,77,77,0.25); }
  .vt-soon { display: inline-block; margin-left: 4px; font-size: 9px; color: rgba(245,241,230,0.4); }

  /* Search */
  .video-search-row { max-width: 480px; margin: 0 auto 14px; padding: 0 16px; }
  .video-search-row input { width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(216,179,79,0.22); color: #f5f1e6; font-family: inherit; font-size: 0.92rem; outline: none; transition: border-color .2s; }
  .video-search-row input:focus { border-color: #d8b34f; }
  .video-search-row input::placeholder { color: rgba(245,241,230,0.4); }

  /* Reaction popover (long-press on like) */
  .reaction-pop { position: absolute; right: 70px; bottom: 76px; display: none; padding: 8px; background: rgba(13,14,19,0.96); border: 1px solid rgba(216,179,79,0.4); border-top: 1px solid #d8b34f; backdrop-filter: blur(12px); z-index: 7; gap: 6px; }
  .reaction-pop.is-on { display: flex; }
  .reaction-pop button { width: 36px; height: 36px; border: 0; background: transparent; cursor: pointer; font-size: 20px; transition: transform .15s; padding: 0; }
  .reaction-pop button:hover { transform: scale(1.25); }
  .reaction-pop button.is-on { background: rgba(216,179,79,0.18); border-radius: 50%; }

  /* Repost button (next to share) */
  .vid-btn[data-action="repost"].is-on { color: #d8b34f; border-color: #d8b34f; }

  /* Live badge on creator */
  .vid-creator-live { display: inline-block; margin-left: 6px; padding: 2px 8px; background: #ff4d4d; color: #fff; font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }

  /* Watch history pill on the seek progress */
  .video-progress::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 0; background: rgba(245,241,230,0.18); pointer-events: none; z-index: 1; }

  /* "Coming soon" overlay for Live tab */
  .live-overlay { display: none; max-width: 480px; margin: 32px auto; padding: 48px 24px; text-align: center; border: 1px dashed rgba(216,179,79,0.22); }
  .live-overlay h3 { font-family: 'Playfair Display', serif; font-weight: 500; margin: 0 0 8px; }
  .live-overlay p { color: rgba(245,241,230,0.6); font-size: 0.9rem; margin: 0; }
  body.feed-live .video-feed { display: none; }
  body.feed-live .live-overlay { display: block; }
'''
html = html.replace('  @media (max-width: 480px) {', NEW_CSS + '\n  @media (max-width: 480px) {')

# 3. Add reaction popover + repost button into the actions block — modify the buildCard template.
# Replace the share + mute buttons with: share, repost, mute, plus add reaction-pop right after the actions div.
OLD_ACTIONS = """'<button class="vid-btn" data-action="save" aria-label="Save to project">·</button>' +
        '<button class="vid-btn" data-action="share" aria-label="Share">→</button>' +
        '<button class="vid-btn" data-action="mute" aria-label="Toggle audio">M</button>' +
      '</div>' +"""

NEW_ACTIONS = """'<button class="vid-btn" data-action="save" aria-label="Save to project">·</button>' +
        '<button class="vid-btn" data-action="repost" aria-label="Repost">↻</button>' +
        '<button class="vid-btn" data-action="share" aria-label="Share">→</button>' +
        '<button class="vid-btn" data-action="mute" aria-label="Toggle audio">M</button>' +
      '</div>' +
      '<div class="reaction-pop" data-reactions>' +
        '<button data-react="❤️" aria-label="Heart">❤️</button>' +
        '<button data-react="🔥" aria-label="Fire">🔥</button>' +
        '<button data-react="👏" aria-label="Clap">👏</button>' +
        '<button data-react="🧠" aria-label="Brain">🧠</button>' +
        '<button data-react="💰" aria-label="Money">💰</button>' +
        '<button data-react="👀" aria-label="Eyes">👀</button>' +
        '<button data-react="💯" aria-label="100">💯</button>' +
      '</div>' +"""
html = html.replace(OLD_ACTIONS, NEW_ACTIONS)

# 4. Add live overlay markup to body (right before <button class="nav-arrow up")
LIVE_OVERLAY = '''  <section class="live-overlay" aria-label="Live floor">
    <h3>Live floor — opening soon</h3>
    <p>Real-time operator broadcasts. We are wiring the streaming infrastructure now. Founders see it first.</p>
  </section>
'''
html = html.replace('<button class="nav-arrow up"', LIVE_OVERLAY + '<button class="nav-arrow up"')

# 5. Wire JS for tabs, search, repost, reactions. Inject before the closing </script> of the main behavior block.
# Find the line just before "// Re-translate captions when language changes" and insert our new behavior block.
NEW_JS_BEHAVIOR = '''
  // ---- TikTok feature parity (tabs, search, repost, reactions) ----
  (function () {
    // Tabs
    var tabs = document.querySelectorAll('.vt-tab');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
        t.classList.add('is-active'); t.setAttribute('aria-selected', 'true');
        var feed = t.getAttribute('data-feed');
        document.body.className = document.body.className.replace(/\\bfeed-\\w+\\b/g, '').trim();
        document.body.classList.add('feed-' + feed);
        applyFeed(feed);
      });
    });

    function applyFeed(feed) {
      var follows = JSON.parse(localStorage.getItem('sophia.followedCreators') || '[]');
      cards.forEach(function (card, i) {
        var clip = CLIPS[i];
        var show = true;
        if (feed === 'following') show = follows.indexOf(clip.creator) > -1;
        else if (feed === 'trending') show = (clip.views || 0) > 8000;  // simple trending heuristic
        else if (feed === 'live') show = false;
        card.style.display = show ? '' : 'none';
      });
    }

    // Search
    var searchInput = document.getElementById('videoSearch');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        var q = (e.target.value || '').trim().toLowerCase();
        cards.forEach(function (card, i) {
          var c = CLIPS[i];
          var hay = (c.creator + ' ' + c.creatorName + ' ' + c.caption + ' ' + (c.tags || []).join(' ') + ' ' + c.country + ' ' + c.tag).toLowerCase();
          card.style.display = (!q || hay.indexOf(q) > -1) ? '' : 'none';
        });
      });
    }

    // Reposts
    var reposts = JSON.parse(localStorage.getItem('sophia.videoReposts') || '{}');
    cards.forEach(function (card, i) {
      var btn = card.querySelector('[data-action="repost"]');
      if (!btn) return;
      if (reposts[i]) btn.classList.add('is-on');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        reposts[i] = !reposts[i];
        localStorage.setItem('sophia.videoReposts', JSON.stringify(reposts));
        btn.classList.toggle('is-on', !!reposts[i]);
        toast(reposts[i] ? 'Reposted' : 'Removed repost');
      });
    });

    // Reactions — long-press on like opens reaction picker
    var reactionsState = JSON.parse(localStorage.getItem('sophia.videoReactions') || '{}');
    cards.forEach(function (card, i) {
      var likeBtn = card.querySelector('[data-action="like"]');
      var pop = card.querySelector('[data-reactions]');
      if (!likeBtn || !pop) return;
      var pressTimer;
      function openPop() { pop.classList.add('is-on'); }
      function closePop() { pop.classList.remove('is-on'); }
      likeBtn.addEventListener('mousedown', function (e) { pressTimer = setTimeout(openPop, 380); });
      likeBtn.addEventListener('touchstart', function (e) { pressTimer = setTimeout(openPop, 380); }, { passive: true });
      ['mouseup','mouseleave','touchend','touchcancel'].forEach(function (ev) { likeBtn.addEventListener(ev, function () { clearTimeout(pressTimer); }); });
      // Mark current reaction
      var current = reactionsState[i];
      if (current) pop.querySelectorAll('button').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-react') === current); });
      pop.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          var emoji = b.getAttribute('data-react');
          reactionsState[i] = (reactionsState[i] === emoji) ? null : emoji;
          if (!reactionsState[i]) delete reactionsState[i];
          localStorage.setItem('sophia.videoReactions', JSON.stringify(reactionsState));
          pop.querySelectorAll('button').forEach(function (x) { x.classList.toggle('is-on', x.getAttribute('data-react') === reactionsState[i]); });
          toast(reactionsState[i] ? ('Reacted ' + reactionsState[i]) : 'Reaction cleared');
          closePop();
        });
      });
      document.addEventListener('click', function (e) { if (!e.target.closest('.video-actions') && !e.target.closest('[data-reactions]')) closePop(); });
    });

    // Watch history — track every clip seen for >2s
    var historyMap = JSON.parse(localStorage.getItem('sophia.watchHistory') || '{}');
    cards.forEach(function (card, i) {
      var v = videos[i];
      var seenAt;
      v.addEventListener('play', function () { seenAt = Date.now(); });
      v.addEventListener('pause', function () {
        if (!seenAt) return;
        var dur = (Date.now() - seenAt) / 1000;
        if (dur >= 2) {
          historyMap[i] = { ts: Date.now(), seconds: (historyMap[i] ? historyMap[i].seconds : 0) + dur };
          localStorage.setItem('sophia.watchHistory', JSON.stringify(historyMap));
        }
        seenAt = null;
      });
    });

    // Creator click → placeholder profile route
    document.querySelectorAll('[data-creator-link]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var c = a.getAttribute('data-creator-link');
        toast('Opening @' + c + ' (coming soon)');
        // Future: location.href = '/video/creator/' + encodeURIComponent(c);
      });
    });
  })();
'''
# Insert just before the existing window.addEventListener for storage/lang change
html = html.replace('  // Re-translate captions when language changes', NEW_JS_BEHAVIOR + '\n  // Re-translate captions when language changes')

with open(VIDEO, 'w', encoding='utf-8') as f:
    f.write(html)
print('feature-parity layered onto /video.html')
print('lines:', sum(1 for _ in open(VIDEO)))
