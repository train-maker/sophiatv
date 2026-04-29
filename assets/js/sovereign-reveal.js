(function () {
  'use strict';

  var SELECTORS = '.cartouche, .anchor-cartouche, .country-cell, .price-card, .valuation-pillar';

  function revealAll() {
    document.querySelectorAll(SELECTORS).forEach(function (el) {
      el.classList.add('sv-revealed');
    });
  }

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealAll();
    return;
  }

  if (!('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  document.documentElement.classList.add('sv-reveal-ready');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var siblings = Array.prototype.slice.call(el.parentElement.children).filter(function (node) {
        return node.matches && node.matches(SELECTORS);
      });
      var idx = Math.min(Math.max(siblings.indexOf(el), 0), 12);
      el.style.setProperty('--sv-stagger-i', String(idx));
      el.classList.add('sv-revealed');
      observer.unobserve(el);
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.12,
  });

  function observeAll() {
    document.querySelectorAll(SELECTORS).forEach(function (el) {
      if (!el.classList.contains('sv-revealed')) observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeAll, { once: true });
  } else {
    observeAll();
  }

  window.SOVEREIGN_REVEAL_REOBSERVE = observeAll;
})();
