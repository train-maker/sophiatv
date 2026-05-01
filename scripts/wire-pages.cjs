#!/usr/bin/env node
// Two patches:
// 1) Add a section-nav strip to index.html (below landing-topbar) so the home page exposes all sections.
// 2) Rebuild video.html with real <video> sources + IntersectionObserver autoplay-on-scroll (TikTok feel).

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// =================== 1) INDEX.HTML SECTION NAV STRIP ===================
const SECTION_NAV_STRIP = `<!-- SOPHIA-SECTION-NAV start -->
<style>
  .sv-section-nav { position:sticky; top:0; z-index:60; background: rgba(6,7,10,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(200,162,74,0.18); }
  .sv-section-nav-inner { max-width:1280px; margin:0 auto; display:flex; gap:2px; padding:0 24px; overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
  .sv-section-nav-inner::-webkit-scrollbar { display:none; }
  .sv-section-nav-link { padding:14px 16px; color:rgba(245,241,230,0.66); text-decoration:none; font-size:0.85rem; font-weight:500; letter-spacing:0.04em; white-space:nowrap; border-bottom:2px solid transparent; transition:color .2s, border-color .2s; font-family: Inter, system-ui, sans-serif; }
  .sv-section-nav-link:hover { color: #f5f1e6; }
  .sv-section-nav-link.is-active { color: #d8b34f; border-bottom-color: #d8b34f; font-weight:600; }
  @media (max-width:640px) { .sv-section-nav-inner { padding:0 12px; } .sv-section-nav-link { padding:12px 12px; font-size:0.8rem; } }
</style>
<nav class="sv-section-nav" aria-label="SophiaTV sections">
  <div class="sv-section-nav-inner">
    <a href="/" class="sv-section-nav-link is-active" aria-current="page">Home</a>
    <a href="/video" class="sv-section-nav-link">Video</a>
    <a href="/social" class="sv-section-nav-link">Social</a>
    <a href="/market" class="sv-section-nav-link">Market</a>
    <a href="/wellness" class="sv-section-nav-link">Wellness</a>
    <a href="/everyday-tools" class="sv-section-nav-link">Tools</a>
    <a href="/pricing" class="sv-section-nav-link">Pricing</a>
    <a href="/dashboard" class="sv-section-nav-link">Dashboard</a>
  </div>
</nav>
<!-- SOPHIA-SECTION-NAV end -->
`;

const indexPath = path.join(ROOT, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Strip any prior insertion so this is idempotent
indexHtml = indexHtml.replace(/<!-- SOPHIA-SECTION-NAV start -->[\s\S]*?<!-- SOPHIA-SECTION-NAV end -->\n?/g, '');

// Insert right after <body...> opening tag
if (/<body[^>]*>/.test(indexHtml)) {
  indexHtml = indexHtml.replace(/(<body[^>]*>)/, `$1\n${SECTION_NAV_STRIP}`);
  fs.writeFileSync(indexPath, indexHtml);
  console.log('updated: index.html (section nav strip inserted)');
} else {
  console.log('skip: index.html (no <body> tag found)');
}

// =================== 2) WIRE VIDEO.HTML ===================
// Use Pexels free stock vertical-ish clips and Google's open BBB sample as fallbacks.
// These URLs serve direct .mp4 — no embed iframes — so autoplay-on-scroll works cleanly.
const CLIPS = [
  {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: '',
    creator: '@sophia_operator',
    caption: 'SophiaMarket is live in 105 countries. Free listings, $29.99 Featured.',
    tag: 'Market',
  },
  {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: '',
    creator: '@global_signals',
    caption: 'How African markets are shifting in 2026 — what operators need to know.',
    tag: 'Signals',
  },
  {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    poster: '',
    creator: '@natural_cures',
    caption: 'Three foods that change everything. Watch full breakdown on /wellness.',
    tag: 'Wellness',
  },
  {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    poster: '',
    creator: '@operator_daily',
    caption: 'How a Lagos importer sourced electronics from Shenzhen using SophiaMarket.',
    tag: 'Story',
  },
  {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    poster: '',
    creator: '@sophia_creators',
    caption: 'Become a Builder — stream up to 4 hrs/day, paid sessions, custom landing.',
    tag: 'Creators',
  },
  {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    poster: '',
    creator: '@sophia_film',
    caption: 'Operator-curated short film of the week. New drops every Friday.',
    tag: 'Film',
  },
];

const NAV_LINKS = `      <div class="nav-links">
        <a href="/" class="nav-link">Home</a>
        <a href="/video.html" class="nav-link" style="color:var(--gold);" aria-current="page">Video</a>
        <a href="/social.html" class="nav-link">Social</a>
        <a href="/market.html" class="nav-link">Market</a>
        <a href="/wellness.html" class="nav-link">Wellness</a>
        <a href="/everyday-tools.html" class="nav-link">Tools</a>
        <a href="/pricing.html" class="nav-link">Pricing</a>
        <a href="/dashboard.html" class="nav-link">Dashboard</a>
      </div>`;

const cardsHtml = CLIPS.map((c, i) => `
    <article class="video-card" data-idx="${i}">
      <video class="video-el" src="${c.src}" muted loop playsinline preload="metadata"${c.poster ? ` poster="${c.poster}"` : ''}></video>
      <div class="video-tag">${c.tag}</div>
      <div class="video-overlay">
        <div class="video-creator">${c.creator}</div>
        <div class="video-caption">${c.caption}</div>
      </div>
      <div class="video-actions">
        <button class="vid-btn" data-action="like" aria-label="Like">+</button>
        <button class="vid-btn" data-action="comment" aria-label="Comment">~</button>
        <button class="vid-btn" data-action="share" aria-label="Share">→</button>
        <button class="vid-btn vid-btn-mute" data-action="mute" aria-label="Toggle audio" title="Tap to unmute">M</button>
      </div>
      <div class="video-progress" aria-hidden="true"><span></span></div>
    </article>`).join('\n');

const videoHtml = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Video — SophiaTV</title>
<meta name="description" content="Vertical video feed on SophiaTV — operator updates, market signals, creator content. TikTok-style scroll, global reach." />
<link rel="canonical" href="https://sophiatv.vercel.app/video.html" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Video — SophiaTV" />
<meta property="og:description" content="Vertical video feed on SophiaTV. TikTok-style scroll." />
<meta property="og:url" content="https://sophiatv.vercel.app/video.html" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="stylesheet" href="/assets/css/sovereign.css" />
<link rel="stylesheet" href="/style.css" />
<link rel="stylesheet" href="/future.css" />
<link rel="icon" href="/assets/brand/sophia-logo-premium.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://commondatastorage.googleapis.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
<style>
  body { background: #06070a; color: #f5f1e6; font-family: Inter, system-ui, sans-serif; margin: 0; }
  .video-shell { padding-top: 64px; min-height: 100vh; }
  .video-page-head { max-width: 480px; margin: 96px auto 16px; padding: 0 16px; }
  .video-page-head h1 { font-family: Georgia, serif; font-size: clamp(28px, 4vw, 36px); font-weight: 500; margin: 0 0 6px; }
  .video-page-head p { color: rgba(245,241,230,0.6); font-size: 0.9rem; margin: 0; }
  .video-feed { max-width: 480px; margin: 0 auto; padding: 16px 0 80px; display: flex; flex-direction: column; gap: 16px; }
  .video-card { position: relative; aspect-ratio: 9 / 16; max-height: calc(100vh - 96px); width: 100%; background: #111217; border: 1px solid rgba(200,162,74,0.18); border-radius: 8px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.4); cursor: pointer; }
  .video-el { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; background: #0a0b10; }
  .video-tag { position: absolute; top: 14px; left: 14px; background: rgba(0,0,0,0.55); border: 1px solid rgba(200,162,74,0.4); color: #d8b34f; padding: 4px 10px; border-radius: 2px; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; backdrop-filter: blur(6px); }
  .video-overlay { position: absolute; left: 16px; right: 70px; bottom: 28px; pointer-events: none; text-shadow: 0 2px 8px rgba(0,0,0,0.7); }
  .video-creator { font-weight: 700; font-size: 1rem; color: #f5f1e6; margin-bottom: 6px; }
  .video-caption { font-size: 0.88rem; color: rgba(245,241,230,0.92); line-height: 1.4; }
  .video-actions { position: absolute; right: 12px; bottom: 24px; display: flex; flex-direction: column; gap: 12px; }
  .vid-btn { width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(200,162,74,0.25); color: #f5f1e6; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; backdrop-filter: blur(8px); transition: all .15s; font-family: inherit; font-weight: 600; }
  .vid-btn:hover, .vid-btn:active { border-color: var(--gold, #d8b34f); transform: scale(1.05); }
  .vid-btn.is-on { background: rgba(216,179,79,0.2); border-color: var(--gold, #d8b34f); color: #d8b34f; }
  .video-progress { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(0,0,0,0.4); }
  .video-progress span { display: block; height: 100%; width: 0; background: var(--gold, #d8b34f); transition: width .1s linear; }
  .video-empty { padding: 60px 24px; text-align: center; color: rgba(245,241,230,0.5); border: 1px dashed rgba(200,162,74,0.2); border-radius: 8px; font-size: 0.9rem; }
  .video-empty a { color: var(--gold, #d8b34f); text-decoration: none; font-weight: 600; }
  @media (max-width: 480px) { .video-feed { padding: 8px 0 60px; gap: 0; scroll-snap-type: y mandatory; height: calc(100vh - 64px); overflow-y: auto; } .video-card { border-radius: 0; max-height: calc(100vh - 64px); height: calc(100vh - 64px); scroll-snap-align: start; flex-shrink: 0; } .video-page-head { display: none; } .video-shell { padding-top: 56px; } }
</style>
</head><body>
<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="logo">
      <img src="/assets/brand/sophia-logo-premium.png" alt="" class="logo-img logo-premium-img" width="32" height="32" />
      <span class="logo-text">Sophia<em>TV</em></span>
    </a>
${NAV_LINKS}
  </div>
</nav>

<div class="video-shell">
  <header class="video-page-head">
    <h1>Video</h1>
    <p>Vertical scroll · operator updates, market signals, creator drops. Tap a clip to play with sound.</p>
  </header>

  <main class="video-feed" id="videoFeed" aria-label="Vertical video feed">
${cardsHtml}
    <div class="video-empty">More clips coming. Follow creators on <a href="/social">Social</a> or <a href="/dashboard">become a Builder</a>.</div>
  </main>
</div>

<script>
  // Autoplay the most-visible video, pause others. TikTok-style.
  (function () {
    var feed = document.getElementById('videoFeed');
    if (!feed) return;
    var cards = Array.prototype.slice.call(feed.querySelectorAll('.video-card'));
    var videos = cards.map(function (c) { return c.querySelector('video'); });
    var unmuted = false;

    // Tap-to-unmute (one global toggle keeps state across cards)
    cards.forEach(function (card, i) {
      var v = videos[i];
      var muteBtn = card.querySelector('[data-action="mute"]');
      var progressBar = card.querySelector('.video-progress span');

      function syncMute() {
        v.muted = !unmuted;
        if (muteBtn) {
          muteBtn.textContent = unmuted ? 'M' : 'M';
          muteBtn.classList.toggle('is-on', unmuted);
          muteBtn.title = unmuted ? 'Tap to mute' : 'Tap to unmute';
        }
      }
      syncMute();

      card.addEventListener('click', function (e) {
        // Tap on a control button shouldn't toggle play
        if (e.target.closest('.vid-btn')) return;
        if (v.paused) v.play().catch(function(){}); else v.pause();
      });

      if (muteBtn) {
        muteBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          unmuted = !unmuted;
          videos.forEach(function (vv, j) {
            vv.muted = !unmuted;
            var b = cards[j].querySelector('[data-action="mute"]');
            if (b) { b.classList.toggle('is-on', unmuted); b.title = unmuted ? 'Tap to mute' : 'Tap to unmute'; }
          });
        });
      }

      // Like button — local-only counter, persists in localStorage
      var likeBtn = card.querySelector('[data-action="like"]');
      var key = 'sophia.videoLikes';
      var likes = JSON.parse(localStorage.getItem(key) || '{}');
      if (likes[i]) likeBtn.classList.add('is-on');
      likeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        likes[i] = !likes[i];
        localStorage.setItem(key, JSON.stringify(likes));
        likeBtn.classList.toggle('is-on', !!likes[i]);
      });

      // Share button — copy URL to clipboard
      var shareBtn = card.querySelector('[data-action="share"]');
      shareBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var u = location.origin + '/video?clip=' + i;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(u).then(function () {
            shareBtn.textContent = '✓';
            setTimeout(function () { shareBtn.textContent = '→'; }, 1200);
          });
        }
      });

      // Comment button — focus comment input (placeholder)
      var cmtBtn = card.querySelector('[data-action="comment"]');
      cmtBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        cmtBtn.classList.add('is-on');
        setTimeout(function(){ cmtBtn.classList.remove('is-on'); }, 800);
      });

      // Progress bar
      v.addEventListener('timeupdate', function () {
        if (!v.duration) return;
        progressBar.style.width = ((v.currentTime / v.duration) * 100) + '%';
      });
    });

    // IntersectionObserver: play whichever video is most visible
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target.querySelector('video');
        if (!v) return;
        if (e.isIntersecting && e.intersectionRatio > 0.55) {
          v.play().catch(function(){});
        } else {
          v.pause();
        }
      });
    }, { threshold: [0, 0.25, 0.55, 0.85, 1] });

    cards.forEach(function (c) { io.observe(c); });
  })();
</script>
</body></html>`;

fs.writeFileSync(path.join(ROOT, 'video.html'), videoHtml);
console.log('updated: video.html (real video sources + autoplay-on-scroll wired)');

console.log('\nDone.');
