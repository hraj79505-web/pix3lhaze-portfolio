/* ================================================
   pix3lhaze — script.js
   noth.in inspired animations + interactions
   ================================================ */

'use strict';
gsap.registerPlugin(ScrollTrigger);

/* ── 1. PRELOADER ── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const numEl  = document.getElementById('loaderNum');
  const bar    = document.getElementById('loaderBar');
  if (!loader) return;

  // Check if already played this session
  if (sessionStorage.getItem('pix3l:loader-played') === '1') {
    loader.style.display = 'none';
    initSite();
    return;
  }

  let count = 0;
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 4) + 1;
    if (count >= 100) count = 100;
    numEl.textContent = String(count).padStart(3, '0');
    if (bar) bar.style.width = count + '%';
    if (count >= 100) {
      clearInterval(interval);
      setTimeout(revealSite, 300);
    }
  }, 20);

  function revealSite() {
    sessionStorage.setItem('pix3l:loader-played', '1');
    gsap.to(loader, {
      yPercent: -100, duration: 1, ease: 'power3.inOut',
      onComplete: () => { loader.style.display = 'none'; initSite(); }
    });
  }
})();

/* ── 2. SITE INIT (runs after loader) ── */
function initSite() {
  animateHero();
  initScrollReveals();
  initWorksLetters();
  initCustomCursor();
  initMenu();
  initWorkItems();
  initLightbox();
  initContactForm();
  fitHeroBrand();
  window.addEventListener('resize', fitHeroBrand);
}

/* ── 3. HERO ANIMATION ── */
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Nav
  tl.from('#nav', { y: -20, opacity: 0, duration: 0.8 }, 0);

  // Hero brand text
  tl.to('#heroBrand', { y: 0, opacity: 1, duration: 1.2 }, 0.1);

  // Tag lines (inside reveal-wrap, translateY reset)
  tl.to('.hero-tag-line', { y: '0%', duration: 1, stagger: 0.12 }, 0.3);

  // CTA button
  tl.to('.btn-hero', { y: '0%', duration: 0.9 }, 0.55);

  // Bottom row
  tl.to('.hero-location, .hero-socials', { y: '0%', duration: 0.8, stagger: 0.1 }, 0.5);
}

/* ── 4. FIT HERO BRAND TEXT ── */
function fitHeroBrand() {
  const el = document.getElementById('heroBrand');
  if (!el) return;
  el.style.fontSize = '19vw';
  const vw = window.innerWidth;
  const pad = parseFloat(getComputedStyle(el.parentElement).paddingLeft) * 2;
  const target = vw - pad;
  let size = (target / el.scrollWidth) * parseFloat(getComputedStyle(el).fontSize);
  el.style.fontSize = size + 'px';
}

/* ── 5. SCROLL REVEALS ── */
function initScrollReveals() {
  const els = document.querySelectorAll('[data-reveal]');
  els.forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => el.classList.add('is-visible')
    });
  });
}

/* ── 6. WORKS LETTERS ANIMATION ── */
function initWorksLetters() {
  const letters = document.querySelectorAll('.wl-inner');
  ScrollTrigger.create({
    trigger: '.works-word-row', start: 'top 80%', once: true,
    onEnter: () => {
      gsap.to(letters, {
        y: '0%', duration: 1, ease: 'power3.out', stagger: 0.06
      });
    }
  });
}

/* ── 7. CUSTOM CURSOR ── */
function initCustomCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  });

  document.querySelectorAll('a, button, .work-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
  });
}

/* ── 8. MENU OVERLAY ── */
function initMenu() {
  const trigger = document.getElementById('menuTrigger');
  const overlay = document.getElementById('menuOverlay');
  const close   = document.getElementById('menuClose');
  if (!trigger || !overlay) return;

  trigger.addEventListener('click', openMenu);
  close.addEventListener('click', closeMenu);

  document.querySelectorAll('[data-menu-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      closeMenu();
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 420);
    });
  });

  function openMenu() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    gsap.from('.menu-nav-link', { y: 40, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.1 });
  }
  function closeMenu() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

/* ── 9. WORK ITEMS ── */
function initWorkItems() {
  document.querySelectorAll('.work-item[data-video]').forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(item.dataset.video);
    });
  });
}

/* ── 10. LIGHTBOX ── */
function initLightbox() {
  const lb    = document.getElementById('lightbox');
  const video = document.getElementById('lightboxVideo');
  const close = document.getElementById('lightboxClose');
  if (!lb) return;

  close.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

function openLightbox(src) {
  const lb    = document.getElementById('lightbox');
  const video = document.getElementById('lightboxVideo');
  video.src = src;
  video.play();
  lb.classList.add('is-open');
  document.body.classList.add('has-lightbox');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb    = document.getElementById('lightbox');
  const video = document.getElementById('lightboxVideo');
  lb.classList.remove('is-open');
  document.body.classList.remove('has-lightbox');
  document.body.style.overflow = '';
  video.pause();
  video.src = '';
}

/* ── 11. CONTACT FORM (EmailJS) ── */
const EMAILJS_SERVICE_ID  = 'service_sxvrwj6';
const EMAILJS_TEMPLATE_ID = 'template_jqujmll';
const EMAILJS_PUBLIC_KEY  = '5ipBI6nAKDHFqSDGo';

emailjs.init(EMAILJS_PUBLIC_KEY);

window.handleFormSubmit = async (e) => {
  e.preventDefault();
  const btn  = document.getElementById('submitBtn');
  const txt  = document.getElementById('submitText');
  const ico  = document.getElementById('submitIcon');
  const form = document.getElementById('contactForm');

  btn.disabled = true;
  txt.textContent = 'Sending...';
  ico.className = 'fas fa-spinner fa-spin';

  try {
    await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, EMAILJS_PUBLIC_KEY);
    txt.textContent = 'Sent!';
    ico.className = 'fas fa-check';
    btn.style.background = 'var(--text)';
    btn.style.color = 'var(--bg)';
    form.reset();
    setTimeout(() => {
      btn.disabled = false;
      txt.textContent = 'Send Message';
      ico.className = 'fas fa-paper-plane';
      btn.style.background = '';
      btn.style.color = '';
    }, 4000);
  } catch (err) {
    console.error('EmailJS error:', err);
    txt.textContent = 'Failed — try again';
    ico.className = 'fas fa-triangle-exclamation';
    setTimeout(() => {
      btn.disabled = false;
      txt.textContent = 'Send Message';
      ico.className = 'fas fa-paper-plane';
    }, 4000);
  }
};

/* ── 12. SMOOTH SCROLL (for btn-hero) ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
