/* ═══════════════════════════════════════════
   PIX3LHAZE — Portfolio JavaScript
   ═══════════════════════════════════════════ */

"use strict";

/* ── DOM Elements ── */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
const pageLoader     = document.getElementById('pageLoader');
const loaderBar      = document.getElementById('loaderBar');
const navbar         = document.getElementById('navbar');
const hamburger      = document.getElementById('hamburger');
const navLinks       = document.getElementById('navLinks');
const backToTop      = document.getElementById('backToTop');
const lightbox       = document.getElementById('lightbox');

/* ══════════════════════════════════
   1. PAGE LOADER
══════════════════════════════════ */
let progress = 0;
document.body.classList.add('loading');

const loadingInterval = setInterval(() => {
  progress += Math.random() * 18 + 5;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadingInterval);
    loaderBar.style.width = '100%';
    setTimeout(() => {
      pageLoader.classList.add('hidden');
      document.body.classList.remove('loading');
      animateStats();
      initScrollAnimations();
    }, 500);
  }
  loaderBar.style.width = progress + '%';
}, 120);

/* ══════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════ */
let mouseX = -100, mouseY = -100, followerX = -100, followerY = -100;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
}, { passive: true });

function animateCursorFollower() {
  followerX += (mouseX - followerX) * 0.18;
  followerY += (mouseY - followerY) * 0.18;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateCursorFollower);
}
animateCursorFollower();

document.addEventListener('mouseover', (e) => {
  if (e.target.closest('a, button, input, textarea, select, .portfolio-card, .service-card, .testimonial-card, .filter-btn, .card-view-btn')) {
    cursor.style.width = '18px';
    cursor.style.height = '18px';
    cursorFollower.style.width = '56px';
    cursorFollower.style.height = '56px';
    cursorFollower.style.borderColor = 'rgba(212,160,23,0.9)';
    cursorFollower.style.backgroundColor = 'rgba(212,160,23,0.06)';
  }
}, { passive: true });

document.addEventListener('mouseout', (e) => {
  if (e.target.closest('a, button, input, textarea, select, .portfolio-card, .service-card, .testimonial-card, .filter-btn, .card-view-btn')) {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursorFollower.style.width = '36px';
    cursorFollower.style.height = '36px';
    cursorFollower.style.borderColor = 'rgba(212,160,23,0.6)';
    cursorFollower.style.backgroundColor = 'transparent';
  }
}, { passive: true });

/* ══════════════════════════════════
   3. NAVBAR & SCROLL PERFORMANCE
══════════════════════════════════ */
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
      backToTop.classList.toggle('visible', window.scrollY > 350);
      updateActiveNavLink();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

function updateActiveNavLink() {
  const scrollY = window.scrollY + 100;
  document.querySelectorAll('section[id]').forEach(section => {
    const top  = section.offsetTop;
    const h    = section.offsetHeight;
    const id   = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (scrollY >= top && scrollY < top + h) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      if (link) link.classList.add('active');
    }
  });
}

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* ══════════════════════════════════
   4. HERO PARTICLES
══════════════════════════════════ */
function createHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const colors = ['#D4A017','#F5C842','#E8890C','rgba(212,160,23,0.5)'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none; opacity:0;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${1+Math.random()*3}px; height:${1+Math.random()*3}px;
      left:${Math.random()*100}%; top:${Math.random()*100}%;
      --tx:${(Math.random()-0.5)*150}px;
      animation: particleRise ${5+Math.random()*8}s linear ${Math.random()*5}s infinite;
    `;
    container.appendChild(p);
  }
}

/* ══════════════════════════════════
   5. STAT COUNTER
══════════════════════════════════ */
function animateStats() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    let current = 0;
    const inc = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + inc, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}

/* ══════════════════════════════════
   6. SCROLL ANIMATIONS
══════════════════════════════════ */
function initScrollAnimations() {
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) setTimeout(() => { fill.style.width = fill.getAttribute('data-width') + '%'; }, 200);
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-item').forEach(el => skillObs.observe(el));

  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-aos-delay') || 0);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) translateX(0)';
        }, delay);
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-aos]').forEach(el => {
    el.style.opacity = '0';
    const type = el.getAttribute('data-aos');
    if (type === 'fade-up')    el.style.transform = 'translateY(40px)';
    if (type === 'fade-right') el.style.transform = 'translateX(-40px)';
    if (type === 'fade-left')  el.style.transform = 'translateX(40px)';
    el.style.transition = 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
    fadeObs.observe(el);
  });
}

/* ══════════════════════════════════
   7. PORTFOLIO FILTER & DYNAMIC LOADER
══════════════════════════════════ */
function bindPortfolioFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.portfolio-card').forEach(card => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = 'fadeSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both';
        }
      });
    };
  });
}
bindPortfolioFilters();

// ── Dynamic Portfolio Loader from Backend ──
async function loadDynamicPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;
  try {
    const res = await fetch('https://pix3lhaze-backend-production.up.railway.app/api/portfolio');
    const data = await res.json();
    if (data.success && data.data && data.data.length > 0) {
      grid.innerHTML = data.data.map((p, idx) => {
        const isWide = p.isWide ? 'wide-card' : '';
        const delay = (idx % 4) * 100;
        let typeIcon = 'fa-cut';
        let typeLabel = 'Video Edit';
        let actionLabel = 'Watch Video';
        let actionIcon = 'fa-play';

        if (p.category === 'cine') {
          typeIcon = 'fa-video';
          typeLabel = 'Cinematography';
        } else if (p.category === 'photo') {
          typeIcon = 'fa-camera';
          typeLabel = 'Photography';
          actionLabel = 'View Photo';
          actionIcon = 'fa-eye';
        } else if (p.category === 'web') {
          typeIcon = 'fa-code';
          typeLabel = 'Web Development';
          actionLabel = 'View Project';
          actionIcon = 'fa-external-link-alt';
        }

        const thumbSrc = p.thumbnail || 'videos/thumb1.jpg';
        const tagsHtml = (p.tags && p.tags.length) ? p.tags.map(t => `<span>${escHtml(t)}</span>`).join('') : `<span>${typeLabel}</span>`;
        const escapedTitle = escHtml(p.title);
        const escapedDesc = escHtml(p.description || '');
        const mediaParam = p.mediaUrl.replace(/'/g, "\\'");

        return `
        <div class="portfolio-card ${isWide}" data-category="${p.category}" data-aos="fade-up" data-aos-delay="${delay}">
          <div class="card-media">
            <img src="${thumbSrc}" alt="${escapedTitle}" class="card-thumb-img" onerror="this.src='videos/thumb1.jpg'" />
            <div class="card-overlay">
              <div class="card-overlay-content">
                <span class="card-type"><i class="fas ${typeIcon}"></i> ${typeLabel}</span>
                <h4>${escapedTitle}</h4>
                <p>${escapedDesc}</p>
                <button class="card-view-btn" onclick="openLightbox('${escapedTitle.replace(/'/g, "\\'")}','${escapedDesc.replace(/'/g, "\\'")}', '${mediaParam}', '${p.mediaType || 'video'}')"><i class="fas ${actionIcon}"></i> ${actionLabel}</button>
              </div>
            </div>
          </div>
          <div class="card-info">
            <h4>${escapedTitle}</h4>
            <div class="card-tags">${tagsHtml}</div>
          </div>
        </div>`;
      }).join('');

      bindPortfolioFilters();
      if (typeof AOS !== 'undefined') AOS.refresh();
    }
  } catch (err) {
    console.log('Using default static portfolio items:', err);
  }
}
loadDynamicPortfolio();

function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ══════════════════════════════════
   8. LIGHTBOX
══════════════════════════════════ */
window.openLightbox = (title, desc, src = 'videos/video1.mp4', type = 'video') => {
  const lightbox = document.getElementById('lightbox');
  const mediaContainer = document.querySelector('.lightbox-media');
  document.getElementById('lightboxTitle').textContent = title;
  document.getElementById('lightboxDesc').textContent  = desc;

  // Render media
  if (!mediaContainer) return;
  mediaContainer.innerHTML = '';

  if (type === 'youtube') {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${src}?autoplay=1&rel=0`;
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    mediaContainer.appendChild(iframe);
  } else if (type === 'instagram') {
    const iframe = document.createElement('iframe');
    const postId = src.includes('instagram.com') ? (src.split('/p/')[1] || src.split('/reel/')[1]).split('/')[0] : src;
    iframe.src = `https://www.instagram.com/p/${postId}/embed/`;
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.background = '#000';
    mediaContainer.appendChild(iframe);
  } else if (type === 'image') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = title;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.maxHeight = '70vh';
    img.style.objectFit = 'contain';
    mediaContainer.appendChild(img);
  } else {
    // Local MP4 video player (default)
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'contain';
    video.innerHTML = '<p style="color:#888;padding:20px;text-align:center">Add your video file to <code>videos/video1.mp4</code> or pass your YouTube/Vimeo link.</p>';
    mediaContainer.appendChild(video);
  }

  const instaBtn = document.querySelector('.lightbox-actions a');
  if (instaBtn) {
    if (type === 'instagram') {
      const postId = src.includes('instagram.com') ? (src.split('/p/')[1] || src.split('/reel/')[1]).split('/')[0] : src;
      instaBtn.href = `https://www.instagram.com/p/${postId}/`;
    } else {
      instaBtn.href = 'https://www.instagram.com/pix3lhaze';
    }
  }

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = () => {
  const lightbox = document.getElementById('lightbox');
  const mediaContainer = document.querySelector('.lightbox-media');
  if (mediaContainer) mediaContainer.innerHTML = ''; // Stop video audio
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeLightbox(); });


/* ══════════════════════════════════
   9. VIDEO TESTIMONIALS MODAL
══════════════════════════════════ */
(function initVideoTestimonials() {
  const modal       = document.getElementById('videoModal');
  const modalPlayer = document.getElementById('videoModalPlayer');
  const modalName   = document.getElementById('videoModalName');
  const modalRole   = document.getElementById('videoModalRole');
  const modalAv     = document.getElementById('videoModalAv');
  if (!modal) return;

  window.openVideoModal = function(card) {
    const videoSrc  = card.getAttribute('data-video');
    const videoType = card.getAttribute('data-type');   // 'local' | 'youtube'
    const name      = card.getAttribute('data-name')  || '';
    const role      = card.getAttribute('data-role')  || '';
    const color     = card.getAttribute('data-color') || '#D4A017';

    // Populate header
    modalName.textContent = name;
    modalRole.textContent = role;
    // Initials avatar
    const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    modalAv.textContent = initials;
    modalAv.style.background = `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 50%, #000))`;

    // Build player
    modalPlayer.innerHTML = '';
    if (videoType === 'youtube') {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoSrc}?autoplay=1&rel=0&modestbranding=1`;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      modalPlayer.appendChild(iframe);
    } else {
      // Local MP4
      const video = document.createElement('video');
      video.src = videoSrc;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      // Fallback message if file missing
      video.innerHTML = '<p style="color:#888;padding:20px;text-align:center">Video not found. Add your .mp4 file to the videos/ folder.</p>';
      modalPlayer.appendChild(video);
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeVideoModal = function(e) {
    // Only close if clicking backdrop (not inner content)
    if (e && e.target !== modal) return;
    _doClose();
  };

  function _doClose() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Stop video/audio on close
    setTimeout(() => { modalPlayer.innerHTML = ''; }, 420);
  }

  // Close button (no event arg — always close)
  document.querySelector('.video-modal-close') &&
    document.querySelector('.video-modal-close').addEventListener('click', _doClose);

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) _doClose();
  });
})();

/* ══════════════════════════════════
   10. CONTACT FORM — EmailJS
══════════════════════════════════ */

// EmailJS credentials
const EMAILJS_SERVICE_ID  = 'service_sxvrwj6';
const EMAILJS_TEMPLATE_ID = 'template_jqujmll';
const EMAILJS_PUBLIC_KEY  = '5ipBI6nAKDHFqSDGo';

// Init EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

window.handleFormSubmit = async (e) => {
  e.preventDefault();

  const btn  = document.getElementById('submitBtn');
  const txt  = document.getElementById('submitText');
  const ico  = document.getElementById('submitIcon');
  const form = document.getElementById('contactForm');

  // ── Loading state ──
  btn.disabled      = true;
  txt.textContent   = 'Sending...';
  ico.className     = 'fas fa-spinner fa-spin';
  btn.style.opacity = '0.8';

  // ── Collect form data ──
  const templateParams = {
    from_name:  document.getElementById('contactName').value.trim(),
    from_email: document.getElementById('contactEmail').value.trim(),
    service:    document.getElementById('contactService').value || 'Not specified',
    budget:     document.getElementById('contactBudget').value  || 'Not specified',
    message:    document.getElementById('contactMessage').value.trim()
  };

  try {
    await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, EMAILJS_PUBLIC_KEY);
    showFormState('success', btn, txt, ico, 'Message Sent! ✓');
    form.reset();
    setTimeout(() => resetFormState(btn, txt, ico), 4500);
  } catch (err) {
    console.error('EmailJS error:', err);
    showFormState('error', btn, txt, ico, 'Failed to send. Please try again!');
    setTimeout(() => resetFormState(btn, txt, ico), 4000);
  }
};

function showFormState(type, btn, txt, ico, message) {
  btn.disabled      = true;
  btn.style.opacity = '1';
  txt.textContent   = message;

  if (type === 'success') {
    ico.className        = 'fas fa-check';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    btn.style.boxShadow  = '0 0 30px rgba(34,197,94,0.35)';
  } else {
    ico.className        = 'fas fa-triangle-exclamation';
    btn.style.background = 'linear-gradient(135deg,#ef4444,#b91c1c)';
    btn.style.boxShadow  = '0 0 30px rgba(239,68,68,0.35)';
  }
}

function resetFormState(btn, txt, ico) {
  btn.disabled         = false;
  txt.textContent      = 'Send Message';
  ico.className        = 'fas fa-paper-plane';
  btn.style.background = '';
  btn.style.boxShadow  = '';
  btn.style.opacity    = '1';
}

/* ══════════════════════════════════
   11. SMOOTH SCROLL
══════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

/* ══════════════════════════════════
   12. INIT
══════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  createHeroParticles();
});

console.log('%c pix3lhaze Portfolio', 'font-size:24px; font-weight:900; color:#D4A017; background:#040404; padding:8px 16px;');
console.log('%c Himanshu Raj | @pix3lhaze — Video Editor · Cinematographer · Photographer', 'font-size:12px; color:#888;');
