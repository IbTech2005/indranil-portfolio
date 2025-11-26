// script.js — lightweight helpers for your portfolio
// Features:
// 1. auto year update
// 2. smooth scrolling for hash links
// 3. mobile nav toggle (injected button)
// 4. reveal-on-scroll animations (no extra CSS required)

// ----------- 1) Auto year update -----------
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

// ----------- 2) Smooth scrolling for anchors -----------
(function smoothScroll() {
  // delegate click on document for any internal links
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#' || href === '') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // update the URL hash without jumping
    history.pushState(null, '', href);
  });
})();

// ----------- 3) Mobile nav toggle (injected) -----------
(function mobileNavToggle() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  // create hamburger button
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mobile-nav-toggle';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Open menu');
  btn.innerHTML = '☰'; // simple glyph — swap if you want an SVG

  // basic inline styling so it works without extra CSS
  Object.assign(btn.style, {
    fontSize: '20px',
    background: 'transparent',
    color: 'var(--text)',
    border: '0',
    cursor: 'pointer',
    padding: '6px 10px',
  });

  // insert the button before the nav (inside header)
  const header = document.querySelector('.site-header') || document.querySelector('header');
  if (header) header.appendChild(btn);

  function openNav() {
    nav.style.display = 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.right = '28px';
    nav.style.top = '68px';
    nav.style.background = 'var(--card)';
    nav.style.padding = '12px';
    nav.style.borderRadius = '10px';
    nav.style.boxShadow = '0 8px 30px rgba(0,0,0,0.5)';
    btn.setAttribute('aria-expanded', 'true');
    btn.innerHTML = '✕';
    // focus first link for accessibility
    const firstLink = nav.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    nav.style.display = '';
    nav.style.flexDirection = '';
    nav.style.position = '';
    nav.style.right = '';
    nav.style.top = '';
    nav.style.background = '';
    nav.style.padding = '';
    nav.style.borderRadius = '';
    nav.style.boxShadow = '';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '☰';
    btn.focus();
  }

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    if (expanded) closeNav(); else openNav();
  });

  // close nav when clicking outside (mobile)
  document.addEventListener('click', (e) => {
    if (btn.contains(e.target)) return;
    if (!nav.contains(e.target) && btn.getAttribute('aria-expanded') === 'true') {
      closeNav();
    }
  });

  // ensure nav resets on resize -> desktop view
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 520) {
        // remove any inline styles from our mobile toggle
        nav.style.display = '';
        nav.style.flexDirection = '';
        nav.style.position = '';
        nav.style.right = '';
        nav.style.top = '';
        nav.style.background = '';
        nav.style.padding = '';
        nav.style.borderRadius = '';
        nav.style.boxShadow = '';
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '☰';
      }
    }, 150);
  });
})();

// ----------- 4) Reveal-on-scroll animations (subtle) -----------
(function revealOnScroll() {
  const toReveal = Array.from(document.querySelectorAll(
    'section, .tech-grid article, .edu-item, .cert-grid > div, .contact-card, .hero-left, .hero-right'
  ));

  // initial styles for elements we will animate
  toReveal.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 560ms ease-out, transform 560ms ease-out';
    el.style.willChange = 'opacity, transform';
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          obs.unobserve(el);
        }
      });
    }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    toReveal.forEach(el => io.observe(el));
  } else {
    // fallback: reveal all
    toReveal.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }
})();

// small UX nicety: prefers-reduced-motion respect
(function respectMotionPreference() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('*').forEach(el => {
      el.style.transition = 'none';
    });
  }
})();
