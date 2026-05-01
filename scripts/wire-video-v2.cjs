#!/usr/bin/env node
// Replace video.html with a TikTok+YouTube-quality vertical video feed.
// Plus: /video/saved/index.html with the user's liked clips.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

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

const NAV_LINKS_SAVED = NAV_LINKS.replace('class="nav-link" style="color:var(--gold);" aria-current="page">Video', 'class="nav-link">Video');

// 8 starter clips — synthetic counts make the page feel populated. Real backend can override.
const CLIPS = [
  { src: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4', creator: 'sophia_operator', creatorName: 'Sophia Operator', caption: 'SophiaMarket is live in 105 countries. Free listings, $29.99 Featured. Tap to learn how to list your business in under 60 seconds.', tag: 'Market', tags: ['#sophiamarket','#listings','#globalbusiness'], views: 18420, likes: 1240, comments: 86 },
  { src: 'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_5MB.mp4', creator: 'global_signals', creatorName: 'Global Signals', caption: 'How African markets are shifting in 2026. The next wave of B2B trade is going direct.', tag: 'Signals', tags: ['#africa','#trade','#b2b'], views: 9210, likes: 612, comments: 41 },
  { src: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_5MB.mp4', creator: 'natural_cures', creatorName: 'Natural Cures', caption: 'Three foods that change everything. Watch the full breakdown on /wellness.', tag: 'Wellness', tags: ['#wellness','#health','#operatorlife'], views: 24310, likes: 2103, comments: 198 },
  { src: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', creator: 'operator_daily', creatorName: 'Operator Daily', caption: 'A Lagos importer sourced electronics from Shenzhen using SophiaMarket. Story in the comments.', tag: 'Story', tags: ['#story','#lagos','#shenzhen'], views: 6745, likes: 488, comments: 73 },
  { src: 'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4', creator: 'sophia_creators', creatorName: 'Sophia Creators', caption: 'Become a Builder — stream up to 4 hrs/day, paid sessions, custom landing page.', tag: 'Creators', tags: ['#creators','#builder','#sophiatv'], views: 4129, likes: 290, comments: 22 },
  { src: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4', creator: 'sophia_film', creatorName: 'Sophia Film', caption: 'Operator-curated short film of the week. New drops every Friday.', tag: 'Film', tags: ['#film','#friday','#shortfilm'], views: 11892, likes: 904, comments: 132 },
  { src: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4', creator: 'budget_brain', creatorName: 'Budget Brain', caption: 'Quick budget hack for operators living between countries. 60 seconds.', tag: 'Tools', tags: ['#budget','#tools'], views: 5420, likes: 412, comments: 38 },
  { src: 'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_5MB.mp4', creator: 'sophia_signals', creatorName: 'Sophia Signals', caption: 'AI-generated daily signals for your industry. Subscribe in the dashboard.', tag: 'AI', tags: ['#ai','#signals','#daily'], views: 14280, likes: 1102, comments: 89 },
];

const SHARED_CSS = `
  body { background: #06070a; color: #f5f1e6; font-family: Inter, system-ui, sans-serif; margin: 0; }
  .video-shell { padding-top: 64px; min-height: 100vh; }
  .video-page-head { max-width: 480px; margin: 96px auto 16px; padding: 0 16px; }
  .video-page-head h1 { font-family: Georgia, serif; font-size: clamp(28px, 4vw, 36px); font-weight: 500; margin: 0 0 6px; }
  .video-page-head p { color: rgba(245,241,230,0.6); font-size: 0.9rem; margin: 0; }
  .feed-tags { display: flex; gap: 6px; max-width: 480px; margin: 0 auto 12px; padding: 0 16px; flex-wrap: wrap; }
  .feed-tag { background: rgba(255,255,255,0.04); border: 1px solid rgba(200,162,74,0.22); color: rgba(245,241,230,0.78); padding: 6px 12px; border-radius: 999px; font-size: 0.78rem; cursor: pointer; transition: all .15s; }
  .feed-tag:hover { color: #d8b34f; border-color: #d8b34f; }
  .feed-tag.is-on { background: rgba(216,179,79,0.15); color: #d8b34f; border-color: #d8b34f; font-weight: 600; }
  .video-feed { max-width: 480px; margin: 0 auto; padding: 16px 0 80px; display: flex; flex-direction: column; gap: 16px; }
  .video-card { position: relative; aspect-ratio: 9/16; max-height: calc(100vh - 96px); width: 100%; background: #111217; border: 1px solid rgba(200,162,74,0.18); border-radius: 8px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.4); cursor: pointer; }
  .video-el { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; background: #0a0b10; }
  .play-icon { position: absolute; inset: 0; display: none; align-items: center; justify-content: center; pointer-events: none; }
  .play-icon svg { width: 88px; height: 88px; fill: rgba(255,255,255,0.92); filter: drop-shadow(0 4px 16px rgba(0,0,0,0.5)); }
  .video-card.is-paused .play-icon { display: flex; }
  .video-card.is-buffering::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(255,255,255,0.12), transparent 60%); pointer-events: none; }
  .video-tag { position: absolute; top: 14px; left: 14px; background: rgba(0,0,0,0.55); border: 1px solid rgba(200,162,74,0.4); color: #d8b34f; padding: 4px 10px; border-radius: 2px; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; backdrop-filter: blur(6px); z-index: 5; }
  .video-duration { position: absolute; top: 14px; right: 14px; background: rgba(0,0,0,0.65); color: #fff; padding: 3px 8px; border-radius: 2px; font-size: 11px; font-family: ui-monospace, monospace; backdrop-filter: blur(6px); z-index: 5; }
  .video-views { position: absolute; bottom: 16px; left: 16px; right: 70px; pointer-events: none; color: rgba(245,241,230,0.6); font-size: 0.72rem; letter-spacing: 0.06em; text-shadow: 0 2px 8px rgba(0,0,0,0.7); margin-bottom: 6px; }
  .video-overlay { position: absolute; left: 16px; right: 70px; bottom: 32px; pointer-events: none; text-shadow: 0 2px 8px rgba(0,0,0,0.8); }
  .video-creator { font-weight: 700; font-size: 1rem; color: #f5f1e6; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; pointer-events: auto; }
  .video-creator a { color: inherit; text-decoration: none; }
  .video-creator a:hover { color: #d8b34f; }
  .video-follow { background: transparent; border: 1px solid #d8b34f; color: #d8b34f; padding: 2px 10px; border-radius: 999px; font-size: 0.7rem; font-weight: 600; cursor: pointer; transition: all .15s; font-family: inherit; }
  .video-follow.is-following { background: #d8b34f; color: #000; }
  .video-caption { font-size: 0.88rem; color: rgba(245,241,230,0.94); line-height: 1.4; margin-bottom: 6px; }
  .video-hashtags { font-size: 0.78rem; color: rgba(216,179,79,0.85); pointer-events: auto; }
  .video-hashtags span { margin-right: 8px; cursor: pointer; }
  .video-hashtags span:hover { color: #fff; }
  .video-actions { position: absolute; right: 12px; bottom: 24px; display: flex; flex-direction: column; gap: 14px; align-items: center; z-index: 6; }
  .vid-btn { width: 46px; height: 46px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(200,162,74,0.25); color: #f5f1e6; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; backdrop-filter: blur(8px); transition: all .15s; font-family: inherit; font-weight: 600; padding: 0; }
  .vid-btn:hover, .vid-btn:active { border-color: var(--gold, #d8b34f); transform: scale(1.06); }
  .vid-btn.is-on { background: rgba(216,179,79,0.22); border-color: var(--gold, #d8b34f); color: #d8b34f; }
  .vid-btn-count { font-size: 0.7rem; color: rgba(245,241,230,0.85); margin-top: -8px; text-shadow: 0 1px 4px rgba(0,0,0,0.7); pointer-events: none; }
  .video-progress { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(0,0,0,0.4); z-index: 4; }
  .video-progress span { display: block; height: 100%; width: 0; background: var(--gold, #d8b34f); transition: width .1s linear; }
  .video-empty { padding: 60px 24px; text-align: center; color: rgba(245,241,230,0.55); border: 1px dashed rgba(200,162,74,0.2); border-radius: 8px; font-size: 0.88rem; }
  .video-empty a { color: var(--gold, #d8b34f); text-decoration: none; font-weight: 600; }

  /* Desktop arrow nav */
  .nav-arrow { position: fixed; right: 32px; width: 48px; height: 48px; border-radius: 50%; background: rgba(17,18,23,0.85); border: 1px solid rgba(200,162,74,0.32); color: #d8b34f; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; z-index: 70; backdrop-filter: blur(8px); transition: all .15s; font-family: inherit; }
  .nav-arrow:hover { background: rgba(216,179,79,0.18); }
  .nav-arrow.up { top: 50%; margin-top: -84px; }
  .nav-arrow.down { top: 50%; margin-top: 36px; }
  @media (max-width: 768px) { .nav-arrow { display: none; } }

  /* Comments drawer */
  .drawer { position: fixed; right: 0; top: 0; bottom: 0; width: min(420px, 96vw); background: #0a0b10; border-left: 1px solid rgba(200,162,74,0.2); transform: translateX(100%); transition: transform .25s ease; z-index: 100; display: flex; flex-direction: column; }
  .drawer.is-open { transform: translateX(0); }
  .drawer-head { padding: 18px 20px; border-bottom: 1px solid rgba(200,162,74,0.18); display: flex; justify-content: space-between; align-items: center; }
  .drawer-head h3 { font-family: Georgia, serif; font-size: 1.25rem; font-weight: 500; margin: 0; }
  .drawer-close { background: transparent; border: 0; color: rgba(245,241,230,0.7); font-size: 1.4rem; cursor: pointer; }
  .drawer-body { flex: 1; overflow-y: auto; padding: 16px 20px; }
  .comment-item { padding: 12px 0; border-bottom: 1px solid rgba(200,162,74,0.1); }
  .comment-author { font-size: 0.85rem; font-weight: 600; color: #f5f1e6; }
  .comment-time { font-size: 0.72rem; color: rgba(245,241,230,0.5); margin-left: 8px; }
  .comment-body { font-size: 0.88rem; color: rgba(245,241,230,0.85); margin-top: 4px; line-height: 1.45; }
  .drawer-foot { padding: 14px 20px; border-top: 1px solid rgba(200,162,74,0.18); display: flex; gap: 8px; }
  .drawer-foot input { flex: 1; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(200,162,74,0.2); color: #f5f1e6; border-radius: 999px; font-size: 0.9rem; font-family: inherit; }
  .drawer-foot button { padding: 0 18px; background: linear-gradient(135deg, #fff0a6, #d8b34f 44%, #8a5a13); color: #000; border: 0; border-radius: 999px; font-weight: 600; cursor: pointer; font-family: inherit; }

  /* Share modal */
  .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 90; display: none; align-items: flex-end; justify-content: center; backdrop-filter: blur(4px); }
  .modal-bg.is-open { display: flex; }
  .modal { background: #0a0b10; border-top: 1px solid rgba(200,162,74,0.2); border-left: 1px solid rgba(200,162,74,0.2); border-right: 1px solid rgba(200,162,74,0.2); border-top-left-radius: 16px; border-top-right-radius: 16px; padding: 24px 20px; width: min(480px, 100%); }
  .modal h3 { font-family: Georgia, serif; font-weight: 500; margin: 0 0 14px; font-size: 1.2rem; }
  .share-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .share-btn { padding: 14px 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(200,162,74,0.18); color: #f5f1e6; border-radius: 6px; font-size: 0.78rem; cursor: pointer; text-align: center; text-decoration: none; transition: all .15s; font-family: inherit; }
  .share-btn:hover { border-color: #d8b34f; color: #d8b34f; }
  .share-link { margin-top: 14px; display: flex; gap: 6px; }
  .share-link input { flex: 1; padding: 10px 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(200,162,74,0.2); color: #f5f1e6; border-radius: 4px; font-size: 0.82rem; font-family: ui-monospace, monospace; }
  .share-link button { padding: 0 14px; background: #d8b34f; color: #000; border: 0; border-radius: 4px; font-weight: 600; cursor: pointer; font-family: inherit; }

  /* Hashtag pill toast */
  .toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); background: #d8b34f; color: #000; padding: 10px 18px; border-radius: 999px; font-size: 0.85rem; font-weight: 600; z-index: 200; opacity: 0; transition: opacity .2s; }
  .toast.is-on { opacity: 1; }

  @media (max-width: 480px) { .video-feed { padding: 8px 0 60px; gap: 0; scroll-snap-type: y mandatory; height: calc(100vh - 64px); overflow-y: auto; } .video-card { border-radius: 0; max-height: calc(100vh - 64px); height: calc(100vh - 64px); scroll-snap-align: start; flex-shrink: 0; } .video-page-head { display: none; } .video-shell { padding-top: 56px; } .feed-tags { display: none; } }
`;

function buildCardsHtml(clips) {
  return clips.map((c, i) => `
      <article class="video-card is-paused" data-idx="${i}" data-tags="${(c.tags||[]).join(',')}" data-creator="${c.creator}">
        <video class="video-el" src="${c.src}" muted loop playsinline preload="metadata"></video>
        <div class="play-icon"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
        <div class="video-tag">${c.tag}</div>
        <div class="video-duration" data-duration></div>
        <div class="video-views">${(c.views||0).toLocaleString()} views</div>
        <div class="video-overlay">
          <div class="video-creator"><a href="#" data-creator-link="${c.creator}">@${c.creator}</a><button class="video-follow" data-action="follow">Follow</button></div>
          <div class="video-caption">${c.caption}</div>
          <div class="video-hashtags">${(c.tags||[]).map(t => `<span data-tag="${t.replace('#','')}">${t}</span>`).join('')}</div>
        </div>
        <div class="video-actions">
          <button class="vid-btn" data-action="like" aria-label="Like">+</button>
          <div class="vid-btn-count" data-count="like">${(c.likes||0).toLocaleString()}</div>
          <button class="vid-btn" data-action="comment" aria-label="Comments">~</button>
          <div class="vid-btn-count" data-count="comment">${(c.comments||0).toLocaleString()}</div>
          <button class="vid-btn" data-action="save" aria-label="Save">·</button>
          <button class="vid-btn" data-action="share" aria-label="Share">→</button>
          <button class="vid-btn" data-action="mute" aria-label="Toggle audio">M</button>
        </div>
        <div class="video-progress" aria-hidden="true"><span></span></div>
      </article>`).join('\n');
}

const FEED_SCRIPT = `
<script>
  (function () {
    var clips = ${JSON.stringify(CLIPS)};
    var feed = document.getElementById('videoFeed');
    if (!feed) return;
    var cards = Array.prototype.slice.call(feed.querySelectorAll('.video-card'));
    var videos = cards.map(function (c) { return c.querySelector('video'); });
    var unmuted = false;
    var current = 0;

    function fmt(n) { try { return n.toLocaleString(); } catch(e) { return n; } }
    function pad(n) { n = Math.floor(n); return (n<10?'0':'')+n; }
    function dur(s) { if(!isFinite(s))return ''; var m=Math.floor(s/60); return m+':'+pad(s%60); }

    function setMuted(v) {
      unmuted = !v;
      videos.forEach(function (vv, i) {
        vv.muted = v;
        var b = cards[i].querySelector('[data-action="mute"]');
        if (b) { b.classList.toggle('is-on', !v); b.title = v ? 'Tap to unmute' : 'Tap to mute'; }
      });
    }

    function toast(msg) {
      var t = document.getElementById('vidToast');
      if (!t) return;
      t.textContent = msg;
      t.classList.add('is-on');
      clearTimeout(t._timer);
      t._timer = setTimeout(function(){ t.classList.remove('is-on'); }, 1400);
    }

    cards.forEach(function (card, i) {
      var v = videos[i];
      var progressBar = card.querySelector('.video-progress span');
      var likeBtn = card.querySelector('[data-action="like"]');
      var commentBtn = card.querySelector('[data-action="comment"]');
      var saveBtn = card.querySelector('[data-action="save"]');
      var shareBtn = card.querySelector('[data-action="share"]');
      var muteBtn = card.querySelector('[data-action="mute"]');
      var followBtn = card.querySelector('[data-action="follow"]');
      var likeCount = card.querySelector('[data-count="like"]');
      var commentCount = card.querySelector('[data-count="comment"]');
      var durEl = card.querySelector('[data-duration]');

      v.addEventListener('loadedmetadata', function () { durEl.textContent = dur(v.duration); });
      v.addEventListener('waiting', function(){ card.classList.add('is-buffering'); });
      v.addEventListener('playing', function(){ card.classList.remove('is-buffering'); card.classList.remove('is-paused'); });
      v.addEventListener('pause', function(){ card.classList.add('is-paused'); });
      v.addEventListener('timeupdate', function () { if(!v.duration) return; progressBar.style.width = ((v.currentTime/v.duration)*100)+'%'; });

      // Tap zones: left third = -10s, right third = +10s, center = play/pause
      card.addEventListener('click', function (e) {
        if (e.target.closest('.vid-btn') || e.target.closest('.video-creator a') || e.target.closest('[data-tag]') || e.target.closest('.video-follow')) return;
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var third = rect.width / 3;
        if (x < third) { v.currentTime = Math.max(0, v.currentTime - 10); toast('-10s'); return; }
        if (x > third * 2) { v.currentTime = Math.min(v.duration||0, v.currentTime + 10); toast('+10s'); return; }
        if (v.paused) v.play().catch(function(){}); else v.pause();
      });

      // Like
      var likes = JSON.parse(localStorage.getItem('sophia.videoLikes') || '{}');
      if (likes[i]) likeBtn.classList.add('is-on');
      var origLikes = clips[i].likes;
      likeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        likes[i] = !likes[i];
        localStorage.setItem('sophia.videoLikes', JSON.stringify(likes));
        likeBtn.classList.toggle('is-on', !!likes[i]);
        likeCount.textContent = fmt(origLikes + (likes[i] ? 1 : 0));
        // Save to "saved" if liked
        var saved = JSON.parse(localStorage.getItem('sophia.savedVideos') || '[]');
        if (likes[i] && !saved.find(function(s){return s.idx===i;})) {
          saved.push({ idx:i, src: clips[i].src, creator: clips[i].creator, creatorName: clips[i].creatorName, caption: clips[i].caption, tag: clips[i].tag, savedAt: Date.now() });
          localStorage.setItem('sophia.savedVideos', JSON.stringify(saved));
        } else if (!likes[i]) {
          saved = saved.filter(function(s){return s.idx!==i;});
          localStorage.setItem('sophia.savedVideos', JSON.stringify(saved));
        }
      });
      likeCount.textContent = fmt(origLikes + (likes[i] ? 1 : 0));

      // Save (separate from like)
      var saves = JSON.parse(localStorage.getItem('sophia.savedVideos') || '[]');
      if (saves.find(function(s){return s.idx===i;})) saveBtn.classList.add('is-on');
      saveBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var s = JSON.parse(localStorage.getItem('sophia.savedVideos') || '[]');
        var has = s.find(function(x){return x.idx===i;});
        if (has) {
          s = s.filter(function(x){return x.idx!==i;});
          saveBtn.classList.remove('is-on');
          toast('Removed from Saved');
        } else {
          s.push({ idx:i, src: clips[i].src, creator: clips[i].creator, creatorName: clips[i].creatorName, caption: clips[i].caption, tag: clips[i].tag, savedAt: Date.now() });
          saveBtn.classList.add('is-on');
          toast('Saved');
        }
        localStorage.setItem('sophia.savedVideos', JSON.stringify(s));
      });

      // Mute (global)
      muteBtn.addEventListener('click', function (e) { e.stopPropagation(); setMuted(unmuted); });

      // Comment drawer
      commentBtn.addEventListener('click', function (e) { e.stopPropagation(); openDrawer(i); });

      // Share modal
      shareBtn.addEventListener('click', function (e) { e.stopPropagation(); openShare(i); });

      // Follow
      var follows = JSON.parse(localStorage.getItem('sophia.followedCreators') || '[]');
      if (follows.includes(clips[i].creator)) { followBtn.textContent = 'Following'; followBtn.classList.add('is-following'); }
      followBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var f = JSON.parse(localStorage.getItem('sophia.followedCreators') || '[]');
        if (f.includes(clips[i].creator)) {
          f = f.filter(function(c){return c!==clips[i].creator;});
          followBtn.textContent = 'Follow'; followBtn.classList.remove('is-following');
          toast('Unfollowed @'+clips[i].creator);
        } else {
          f.push(clips[i].creator);
          followBtn.textContent = 'Following'; followBtn.classList.add('is-following');
          toast('Followed @'+clips[i].creator);
        }
        localStorage.setItem('sophia.followedCreators', JSON.stringify(f));
      });

      // Hashtag chips
      card.querySelectorAll('[data-tag]').forEach(function (chip) {
        chip.addEventListener('click', function (e) { e.stopPropagation(); filterByTag(chip.getAttribute('data-tag')); });
      });
    });

    setMuted(true);

    // IntersectionObserver: only the most-visible card plays
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var card = e.target;
        var idx = parseInt(card.getAttribute('data-idx'), 10);
        var v = videos[idx];
        if (!v) return;
        if (e.isIntersecting && e.intersectionRatio > 0.55) {
          current = idx;
          v.play().catch(function(){});
          // Bump view count locally
          var vc = card.querySelector('.video-views');
          var seen = JSON.parse(localStorage.getItem('sophia.viewedVideos') || '{}');
          if (!seen[idx]) {
            seen[idx] = true;
            localStorage.setItem('sophia.viewedVideos', JSON.stringify(seen));
            clips[idx].views += 1;
            vc.textContent = fmt(clips[idx].views) + ' views';
          }
        } else { v.pause(); }
      });
    }, { threshold: [0, 0.25, 0.55, 0.85, 1] });
    cards.forEach(function (c) { io.observe(c); });

    // Filter by tag
    var feedTagsEl = document.getElementById('feedTags');
    var allTags = Array.from(new Set(clips.flatMap(function(c){return (c.tags||[]).map(function(t){return t.replace('#','');});})));
    if (feedTagsEl) {
      var html = '<button class="feed-tag is-on" data-filter="">All</button>';
      allTags.forEach(function (t) { html += '<button class="feed-tag" data-filter="'+t+'">#'+t+'</button>'; });
      feedTagsEl.innerHTML = html;
      feedTagsEl.querySelectorAll('.feed-tag').forEach(function (b) {
        b.addEventListener('click', function () { filterByTag(b.getAttribute('data-filter')); });
      });
    }
    function filterByTag(t) {
      var nodes = document.querySelectorAll('.feed-tag');
      nodes.forEach(function (n) { n.classList.toggle('is-on', n.getAttribute('data-filter') === t); });
      cards.forEach(function (c) {
        var tags = (c.getAttribute('data-tags')||'').split(',').map(function(x){return x.replace('#','');});
        c.style.display = (!t || tags.indexOf(t) > -1) ? '' : 'none';
      });
    }

    // Keyboard nav
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowDown' || e.key === 'j') { e.preventDefault(); scrollToCard(current+1); }
      else if (e.key === 'ArrowUp' || e.key === 'k') { e.preventDefault(); scrollToCard(current-1); }
      else if (e.key === ' ') { e.preventDefault(); var v = videos[current]; if (v.paused) v.play().catch(function(){}); else v.pause(); }
      else if (e.key.toLowerCase() === 'm') { setMuted(unmuted); }
      else if (e.key.toLowerCase() === 'l') { var b = cards[current].querySelector('[data-action="like"]'); if (b) b.click(); }
    });
    function scrollToCard(idx) {
      idx = Math.max(0, Math.min(cards.length-1, idx));
      cards[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Desktop arrow nav
    var upBtn = document.getElementById('navUp');
    var dnBtn = document.getElementById('navDown');
    if (upBtn) upBtn.addEventListener('click', function(){ scrollToCard(current-1); });
    if (dnBtn) dnBtn.addEventListener('click', function(){ scrollToCard(current+1); });

    // Deep link: ?clip=N
    var qs = new URLSearchParams(location.search);
    if (qs.has('clip')) {
      var n = parseInt(qs.get('clip'), 10);
      if (n>=0 && n<cards.length) setTimeout(function(){ scrollToCard(n); }, 300);
    }

    // Comments drawer
    function openDrawer(idx) {
      var d = document.getElementById('commentsDrawer');
      d.classList.add('is-open');
      var body = document.getElementById('drawerBody');
      var key = 'sophia.videoComments.'+idx;
      var existing = JSON.parse(localStorage.getItem(key) || '[]');
      // Seed a couple of placeholder comments per clip
      if (!existing._seeded) {
        existing.unshift({ a:'@operator_kim', t:'5h', b:'Useful — sharing with my Lagos team.' });
        existing.unshift({ a:'@global_buyer', t:'2h', b:'Where do I sign up for the dashboard?' });
        existing._seeded = true;
        localStorage.setItem(key, JSON.stringify(existing));
      }
      function render() {
        var items = JSON.parse(localStorage.getItem(key) || '[]').filter(function(x){return x.a;});
        body.innerHTML = items.length ? items.map(function (c) {
          return '<div class="comment-item"><div><span class="comment-author">'+c.a+'</span><span class="comment-time">'+c.t+'</span></div><div class="comment-body">'+(c.b||'').replace(/[<>]/g,'')+'</div></div>';
        }).join('') : '<div class="video-empty">Be the first to comment.</div>';
      }
      render();
      var input = document.getElementById('drawerInput');
      var post = document.getElementById('drawerPost');
      post.onclick = function () {
        var v = input.value.trim(); if (!v) return;
        var items = JSON.parse(localStorage.getItem(key) || '[]');
        items.unshift({ a:'@you', t:'now', b:v });
        localStorage.setItem(key, JSON.stringify(items));
        input.value = '';
        render();
        // bump count
        clips[idx].comments += 1;
        var cc = cards[idx].querySelector('[data-count="comment"]');
        if (cc) cc.textContent = fmt(clips[idx].comments);
      };
      input.onkeydown = function (e) { if (e.key === 'Enter') post.onclick(); };
    }
    document.getElementById('drawerClose').addEventListener('click', function () {
      document.getElementById('commentsDrawer').classList.remove('is-open');
    });

    // Share modal
    function openShare(idx) {
      var url = location.origin + '/video?clip=' + idx;
      var text = encodeURIComponent(clips[idx].caption + ' — via SophiaTV');
      document.getElementById('shareLinkInput').value = url;
      var grid = document.getElementById('shareGrid');
      grid.innerHTML = [
        '<a class="share-btn" href="https://x.com/intent/tweet?text='+text+'&url='+encodeURIComponent(url)+'" target="_blank" rel="noopener">X / Twitter</a>',
        '<a class="share-btn" href="https://wa.me/?text='+text+'%20'+encodeURIComponent(url)+'" target="_blank" rel="noopener">WhatsApp</a>',
        '<a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)+'" target="_blank" rel="noopener">Facebook</a>',
        '<a class="share-btn" href="mailto:?subject=SophiaTV%20clip&body='+text+'%20'+encodeURIComponent(url)+'">Email</a>',
        '<a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(url)+'" target="_blank" rel="noopener">LinkedIn</a>',
        '<a class="share-btn" href="https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+text+'" target="_blank" rel="noopener">Telegram</a>',
        '<a class="share-btn" href="sms:?body='+text+'%20'+encodeURIComponent(url)+'">SMS</a>',
        '<a class="share-btn" href="/dashboard">Save</a>'
      ].join('');
      document.getElementById('shareModal').classList.add('is-open');
    }
    document.getElementById('shareCloseBg').addEventListener('click', function (e) {
      if (e.target.id === 'shareModal') e.currentTarget.classList.remove('is-open');
    });
    document.getElementById('shareCopyBtn').addEventListener('click', function () {
      var v = document.getElementById('shareLinkInput').value;
      navigator.clipboard && navigator.clipboard.writeText(v).then(function(){ toast('Link copied'); });
    });

    // Creator link
    document.querySelectorAll('[data-creator-link]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); toast('Creator pages coming soon'); });
    });
  })();
</script>
`;

const head = (title, desc, canonical) => `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<link rel="canonical" href="${canonical}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${canonical}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="stylesheet" href="/assets/css/sovereign.css" />
<link rel="stylesheet" href="/style.css" />
<link rel="stylesheet" href="/future.css" />
<link rel="icon" href="/assets/brand/sophia-logo-premium.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://test-videos.co.uk" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
<style>${SHARED_CSS}</style>
</head><body>
<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="logo">
      <img src="/assets/brand/sophia-logo-premium.png" alt="" class="logo-img logo-premium-img" width="32" height="32" />
      <span class="logo-text">Sophia<em>TV</em></span>
    </a>
${NAV_LINKS}
  </div>
</nav>`;

const FEED_BODY = `
<div class="video-shell">
  <header class="video-page-head">
    <h1>Video</h1>
    <p>Vertical scroll · operator updates, market signals, creator drops. ↑↓ to navigate · Space to play · M to mute · L to like · ←→ tap zones to seek.</p>
  </header>
  <div class="feed-tags" id="feedTags"></div>
  <main class="video-feed" id="videoFeed" aria-label="Vertical video feed">
${buildCardsHtml(CLIPS)}
    <div class="video-empty">More clips coming. Follow creators on <a href="/social">Social</a> · <a href="/video/saved/">View saved clips</a></div>
  </main>
</div>

<button class="nav-arrow up" id="navUp" aria-label="Previous clip" title="Previous (↑)">^</button>
<button class="nav-arrow down" id="navDown" aria-label="Next clip" title="Next (↓)">v</button>

<aside class="drawer" id="commentsDrawer" aria-label="Comments">
  <div class="drawer-head"><h3>Comments</h3><button class="drawer-close" id="drawerClose" aria-label="Close">×</button></div>
  <div class="drawer-body" id="drawerBody"></div>
  <div class="drawer-foot">
    <input id="drawerInput" type="text" placeholder="Add a comment..." />
    <button id="drawerPost">Post</button>
  </div>
</aside>

<div class="modal-bg" id="shareModal"><div class="modal" id="shareCloseBg" onclick="event.stopPropagation()">
  <h3>Share this clip</h3>
  <div class="share-grid" id="shareGrid"></div>
  <div class="share-link">
    <input id="shareLinkInput" readonly />
    <button id="shareCopyBtn">Copy</button>
  </div>
</div></div>

<div class="toast" id="vidToast"></div>
${FEED_SCRIPT}
</body></html>`;

fs.writeFileSync(path.join(ROOT, 'video.html'), head('Video — SophiaTV', 'Vertical video feed on SophiaTV — TikTok-style scroll. Operator updates, market signals, creator content.', 'https://sophiatv.vercel.app/video.html') + FEED_BODY);
console.log('updated: video.html (TikTok+YouTube wiring)');

// /video/saved/index.html
const SAVED_BODY = `
<div class="video-shell">
  <header class="video-page-head">
    <h1>Saved</h1>
    <p>Your liked and bookmarked clips, stored locally.</p>
  </header>
  <main class="video-feed" id="savedFeed" aria-label="Saved clips"></main>
</div>
<div class="toast" id="vidToast"></div>
<script>
  var saved = JSON.parse(localStorage.getItem('sophia.savedVideos') || '[]');
  var feed = document.getElementById('savedFeed');
  if (!saved.length) {
    feed.innerHTML = '<div class="video-empty">No saved clips yet. <a href="/video">Browse the feed</a> and tap the · button to save.</div>';
  } else {
    feed.innerHTML = saved.map(function (c, i) {
      return '<article class="video-card is-paused" data-idx="'+i+'"><video class="video-el" src="'+c.src+'" muted loop playsinline preload="metadata"></video><div class="play-icon"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div><div class="video-tag">'+c.tag+'</div><div class="video-overlay"><div class="video-creator">@'+c.creator+'</div><div class="video-caption">'+c.caption+'</div></div><div class="video-actions"><a class="vid-btn" href="/video?clip='+c.idx+'" title="Open in feed">→</a><button class="vid-btn" data-remove="'+c.idx+'" title="Remove from saved">×</button></div><div class="video-progress"><span></span></div></article>';
    }).join('');
    feed.querySelectorAll('[data-remove]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var idx = parseInt(b.getAttribute('data-remove'), 10);
        var s = JSON.parse(localStorage.getItem('sophia.savedVideos') || '[]').filter(function (x) { return x.idx !== idx; });
        localStorage.setItem('sophia.savedVideos', JSON.stringify(s));
        location.reload();
      });
    });
    // Autoplay-on-scroll
    var cards = Array.prototype.slice.call(feed.querySelectorAll('.video-card'));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target.querySelector('video');
        if (e.isIntersecting && e.intersectionRatio > 0.55) v.play().catch(function(){}); else v.pause();
      });
    }, { threshold: [0, 0.55, 1] });
    cards.forEach(function (c) { io.observe(c); c.addEventListener('click', function(e){ if (e.target.closest('.vid-btn')) return; var v = c.querySelector('video'); if (v.paused) v.play().catch(function(){}); else v.pause(); }); });
  }
</script>
</body></html>`;

const savedHead = head('Saved — SophiaTV Video', 'Your saved video clips on SophiaTV.', 'https://sophiatv.vercel.app/video/saved/').replace(NAV_LINKS, NAV_LINKS_SAVED);
fs.mkdirSync(path.join(ROOT, 'video', 'saved'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'video', 'saved', 'index.html'), savedHead + SAVED_BODY);
console.log('created: video/saved/index.html');

console.log('\nDone.');
