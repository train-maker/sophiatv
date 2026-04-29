(() => {
  const isTypingTarget = (el) => {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  };

  function addScrollRail() {
    if (document.getElementById('futureScrollRail')) return;
    const rail = document.createElement('div');
    rail.id = 'futureScrollRail';
    rail.innerHTML = '<span></span>';
    document.body.appendChild(rail);
    const fill = rail.querySelector('span');
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      fill.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    update();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
  }

  function addCursorSpotlight() {
    if (matchMedia('(pointer: coarse)').matches || document.getElementById('futureCursor')) return;
    const cursor = document.createElement('div');
    cursor.id = 'futureCursor';
    document.body.appendChild(cursor);
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    addEventListener('pointermove', (event) => {
      x = event.clientX;
      y = event.clientY;
      cursor.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

  function addCommandPalette() {
    if (document.getElementById('futureCommand')) return;

    const actions = [
      { label: 'Go Home', meta: 'SophiaMarket', href: '/' },
      { label: 'Global Signals', meta: 'Section', href: '/#live' },
      { label: 'Latest Feed', meta: 'Section', href: '/#feed' },
      { label: 'Sophia Social', meta: 'Live signal feed', href: '/social.html' },
      { label: 'Everyday Tools', meta: 'Daily utilities', href: '/everyday-tools.html' },
      { label: 'Natural Wellness', meta: 'Remedy library', href: '/natural-cures.html' },
      { label: 'Creators', meta: 'Section', href: '/#creators' },
      { label: 'Universal Translator', meta: 'Speech and captions', href: '/#translate' },
      { label: 'Private Sessions', meta: 'Section', href: '/#sessions' },
      { label: 'Browse Market', meta: 'Directory', href: '/market.html' },
      { label: 'List Your Business', meta: 'Submit', href: '/market-submit.html' },
      { label: 'Control Center', meta: 'Operator dashboard', href: '/control-center.html' },
      { label: 'Settings', meta: 'Account preferences', href: '/settings.html' },
      { label: 'Listing Guidelines', meta: 'Market rules', href: '/listing-guidelines.html' },
      { label: 'Pricing Plans', meta: 'Subscriptions', href: '/pricing.html' },
      { label: 'Sign Up', meta: 'Account', href: '/signup.html' },
      { label: 'Log In', meta: 'Account', href: '/login.html' },
      { label: 'Dashboard', meta: 'Account', href: '/dashboard.html' },
    ];

    const wrap = document.createElement('div');
    wrap.id = 'futureCommand';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = `
      <div class="future-command-backdrop"></div>
      <div class="future-command-panel" role="dialog" aria-modal="true" aria-label="Sophia command center">
        <div class="future-command-kicker">Sophia command center</div>
        <label class="future-command-input">
          <span>⌘K</span>
          <input type="search" placeholder="Search pages, sections, and actions..." autocomplete="off" />
        </label>
        <div class="future-command-results"></div>
        <div class="future-command-foot">Enter to launch · Esc to close · / to search</div>
      </div>
    `;
    document.body.appendChild(wrap);

    const input = wrap.querySelector('input');
    const results = wrap.querySelector('.future-command-results');
    let filtered = actions;
    let active = 0;

    const render = () => {
      const q = input.value.trim().toLowerCase();
      filtered = actions.filter((item) => `${item.label} ${item.meta}`.toLowerCase().includes(q));
      active = Math.min(active, Math.max(filtered.length - 1, 0));
      results.innerHTML = filtered.length
        ? filtered.map((item, i) => `
          <button class="future-command-row${i === active ? ' active' : ''}" data-i="${i}">
            <strong>${item.label}</strong>
            <span>${item.meta}</span>
          </button>
        `).join('')
        : '<div class="future-command-empty">No matching signal found.</div>';
    };

    const open = () => {
      wrap.classList.add('open');
      wrap.setAttribute('aria-hidden', 'false');
      input.value = '';
      active = 0;
      render();
      input.focus();
    };

    const close = () => {
      wrap.classList.remove('open');
      wrap.setAttribute('aria-hidden', 'true');
    };

    const launch = () => {
      if (!filtered[active]) return;
      window.location.href = filtered[active].href;
    };

    input.addEventListener('input', render);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        active = Math.min(active + 1, filtered.length - 1);
        render();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        active = Math.max(active - 1, 0);
        render();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        launch();
      } else if (event.key === 'Escape') {
        close();
      }
    });

    results.addEventListener('click', (event) => {
      const row = event.target.closest('.future-command-row');
      if (!row) return;
      active = Number(row.dataset.i) || 0;
      launch();
    });

    wrap.querySelector('.future-command-backdrop').addEventListener('click', close);
    document.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        open();
      } else if (event.key === '/' && !isTypingTarget(document.activeElement)) {
        event.preventDefault();
        open();
      } else if (event.key === 'Escape' && wrap.classList.contains('open')) {
        close();
      }
    });

    document.querySelectorAll('.search-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        open();
      });
    });
  }

  function animateCounters() {
    // Keep launch metrics exact. Animated count-ups looked slick but briefly
    // displayed false numbers during first paint and screenshots.
    return;
    const targets = [...document.querySelectorAll('.stat-num, .trust-num')];
    if (!targets.length || !('IntersectionObserver' in window)) return;

    const parse = (text) => {
      const match = text.trim().match(/^(\d+(?:\.\d+)?)([Kk+%]*)$/);
      if (!match) return null;
      return { value: Number(match[1]), suffix: match[2] || '' };
    };

    const format = (value, suffix) => `${Math.round(value)}${suffix}`;
    const seen = new WeakSet();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        const data = parse(entry.target.textContent);
        if (!data) return;
        seen.add(entry.target);
        const start = performance.now();
        const duration = 900;
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          entry.target.textContent = format(data.value * eased, data.suffix);
          if (t < 1) requestAnimationFrame(tick);
          else entry.target.textContent = format(data.value, data.suffix);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.45 });
    targets.forEach((el) => io.observe(el));
  }

  function addHudClock() {
    if (document.getElementById('futureHud')) return;
    const hud = document.createElement('div');
    hud.id = 'futureHud';
    hud.innerHTML = '<span class="future-hud-dot"></span><span>Sophia Grid</span><strong></strong>';
    document.body.appendChild(hud);
    const time = hud.querySelector('strong');
    const update = () => {
      time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    update();
    setInterval(update, 30000);
  }

  function addToastSystem() {
    if (window.showSophiaToast) return;
    window.showSophiaToast = (message, type = 'info') => {
      let tray = document.getElementById('sophiaToastTray');
      if (!tray) {
        tray = document.createElement('div');
        tray.id = 'sophiaToastTray';
        document.body.appendChild(tray);
      }
      const toast = document.createElement('div');
      toast.className = `sophia-toast ${type}`;
      toast.textContent = message;
      tray.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 220);
      }, 3200);
    };
  }

  function addMotionLayer() {
    if (document.documentElement.dataset.sophiaMotion === 'ready') return;
    document.documentElement.dataset.sophiaMotion = 'ready';
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.classList.add(reduce ? 'sophia-motion-reduced' : 'sophia-motion-ready');
    if (reduce) return;

    const revealSelectors = [
      '.hero-left',
      '.hero-right',
      '.section-header',
      '.vcard',
      '.feed-card',
      '.creator-card',
      '.session-card',
      '.translator-card',
      '.social-hero',
      '.social-panel',
      '.social-trends',
      '.control-card',
      '.module-tile',
      '.pricing-card',
      '.listing-card',
      '.country-card',
      '.blog-wrap',
      '.blog-index',
      '.not-found-panel',
    ];

    const revealItems = [...document.querySelectorAll(revealSelectors.join(','))]
      .filter((el) => !el.closest('#futureCommand'));
    revealItems.forEach((el, i) => {
      el.classList.add('sophia-reveal');
      el.style.setProperty('--reveal-delay', `${Math.min(i % 8, 7) * 55}ms`);
    });

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
      revealItems.forEach((el) => io.observe(el));
    } else {
      revealItems.forEach((el) => el.classList.add('is-visible'));
    }

    const tiltItems = [...document.querySelectorAll('.control-card, .module-tile, .pricing-card, .feed-card, .vcard, .translator-card, .social-panel')]
      .filter((el) => matchMedia('(pointer: fine)').matches);
    tiltItems.forEach((el) => {
      el.classList.add('sophia-tilt');
      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty('--tilt-x', `${(-py * 5).toFixed(2)}deg`);
        el.style.setProperty('--tilt-y', `${(px * 6).toFixed(2)}deg`);
        el.style.setProperty('--shine-x', `${((px + 0.5) * 100).toFixed(1)}%`);
        el.style.setProperty('--shine-y', `${((py + 0.5) * 100).toFixed(1)}%`);
      }, { passive: true });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
        el.style.setProperty('--shine-x', '50%');
        el.style.setProperty('--shine-y', '50%');
      }, { passive: true });
    });

    const circuitTargets = document.querySelectorAll('.control-hero, .hero, .market-hero, .translator-section, .social-hero');
    circuitTargets.forEach((target) => {
      if (target.querySelector(':scope > .sophia-circuit')) return;
      const circuit = document.createElement('div');
      circuit.className = 'sophia-circuit';
      circuit.setAttribute('aria-hidden', 'true');
      target.appendChild(circuit);
    });
  }

  function addPlasmaCanvas() {
    if (document.getElementById('sophiaPlasma') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'sophiaPlasma';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let points = [];
    let pointer = { x: 0.5, y: 0.28 };
    let frame = 0;
    const colors = ['#00f5ff', '#25ffb3', '#ff3df2', '#ffd84d'];

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.75);
      width = innerWidth;
      height = innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(18, Math.min(42, Math.floor(width / 42)));
      points = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1.2 + Math.random() * 2.2,
        c: colors[i % colors.length],
      }));
    };

    const draw = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';

      const pulseX = pointer.x * width;
      const pulseY = pointer.y * height;
      const glow = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, Math.max(width, height) * 0.42);
      glow.addColorStop(0, 'rgba(0,245,255,0.16)');
      glow.addColorStop(0.34, 'rgba(255,61,242,0.07)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      points.forEach((p, i) => {
        p.x += p.vx + Math.sin((frame + i * 17) * 0.006) * 0.09;
        p.y += p.vy + Math.cos((frame + i * 13) * 0.005) * 0.08;
        if (p.x < -40) p.x = width + 40;
        if (p.x > width + 40) p.x = -40;
        if (p.y < -40) p.y = height + 40;
        if (p.y > height + 40) p.y = -40;
      });

      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 148) continue;
          ctx.strokeStyle = `rgba(0,245,255,${0.13 * (1 - dist / 148)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      points.forEach((p) => {
        ctx.fillStyle = p.c;
        ctx.shadowColor = p.c;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(draw);
    };

    addEventListener('pointermove', (event) => {
      pointer = { x: event.clientX / width, y: event.clientY / height };
    }, { passive: true });
    addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
  }

  function addCyberStage() {
    if (document.getElementById('sophiaCyberStage')) return;
    const stage = document.createElement('div');
    stage.id = 'sophiaCyberStage';
    stage.setAttribute('aria-hidden', 'true');
    stage.innerHTML = `
      <div class="cyber-beam beam-a"></div>
      <div class="cyber-beam beam-b"></div>
      <div class="cyber-ring"></div>
      <div class="cyber-grid-floor"></div>
    `;
    document.body.prepend(stage);
  }

  function addNeuralBursts() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(pointer: coarse)').matches) return;
    let last = 0;
    document.addEventListener('pointerdown', (event) => {
      const now = performance.now();
      if (now - last < 180) return;
      last = now;
      const burst = document.createElement('span');
      burst.className = 'sophia-neural-burst';
      burst.style.left = `${event.clientX}px`;
      burst.style.top = `${event.clientY}px`;
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 720);
    }, { passive: true });
  }

  function addGsapEnhancements() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.gsapTried) return;
    document.documentElement.dataset.gsapTried = 'true';

    const run = () => {
      if (!window.gsap) return;
      document.documentElement.classList.add('sophia-gsap-enhanced');
      const gsap = window.gsap;
      gsap.defaults({ ease: 'power3.out' });
      const nav = document.querySelector('.nav');
      if (nav) gsap.fromTo(nav, { y: -28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 });
      const stageTargets = document.querySelectorAll('.control-orbit, .mission-radar, .hero-right, .featured-player');
      if (stageTargets.length) {
        gsap.fromTo(stageTargets,
          { rotateX: 8, scale: 0.96, opacity: 0 },
          { rotateX: 0, scale: 1, opacity: 1, duration: 1.05, stagger: 0.08 });
      }
      const glowTargets = document.querySelectorAll('.orbit-node, .radar-sweep');
      if (glowTargets.length) {
        gsap.to(glowTargets, {
          filter: 'drop-shadow(0 0 18px rgba(0,245,255,0.85))',
          duration: 1.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
      const rotationTargets = document.querySelectorAll('.logo-mark, .orbit-core');
      if (rotationTargets.length) {
        gsap.to(rotationTargets, {
          rotate: 360,
          duration: 28,
          repeat: -1,
          ease: 'none',
        });
      }
    };

    if (window.gsap) {
      run();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
    script.defer = true;
    script.onload = run;
    script.onerror = () => document.documentElement.classList.add('sophia-gsap-fallback');
    document.head.appendChild(script);
  }

  function addSophiaCinemaPlayer() {
    const player = document.querySelector('[data-sophia-player]');
    if (!player || player.dataset.ready === 'true') return;
    player.dataset.ready = 'true';

    const mini = player.querySelector('[data-mini-player]');
    const miniToggle = player.querySelector('[data-mini-toggle]');
    const miniClose = player.querySelector('[data-mini-close]');
    const captionToggle = player.querySelector('[data-caption-toggle]');

    miniToggle?.addEventListener('click', () => {
      mini?.classList.add('is-visible');
      window.showSophiaToast?.('Mini-player ready', 'info');
    });

    miniClose?.addEventListener('click', () => {
      mini?.classList.remove('is-visible');
    });

    captionToggle?.addEventListener('click', () => {
      const isMuted = player.classList.toggle('captions-muted');
      captionToggle.setAttribute('aria-pressed', String(!isMuted));
      captionToggle.textContent = isMuted ? 'Captions off' : 'Captions on';
    });

    document.addEventListener('keydown', (event) => {
      if (!event.altKey || event.key.toLowerCase() !== 'm') return;
      event.preventDefault();
      mini?.classList.toggle('is-visible');
    });
  }

  function boot() {
    addCommandPalette();
    addToastSystem();
    addSophiaCinemaPlayer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
