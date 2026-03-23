/**
 * Portfolio — script.js
 * Author: Alex Chen (placeholder)
 *
 * Features:
 *  - Typed text effect (hero tagline)
 *  - Scroll-triggered reveal animations
 *  - Navbar scroll state
 *  - Skill bar animations (IntersectionObserver)
 *  - Project filter
 *  - Dark / Light theme toggle
 *  - Mobile menu toggle
 *  - Contact form handler (mock)
 *  - Scroll-to-top button
 *  - Smooth active nav link highlighting
 */

'use strict';

/* ============================================================
   1. DOM READY
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypedText();
  initNavbar();
  initMobileMenu();
  initRevealObserver();
  initSkillBars();
  initProjectFilter();
  initContactForm();
  initScrollTop();
  initFooterYear();
  initActiveNav();
});

/* ============================================================
   2. THEME TOGGLE
============================================================ */
function initTheme() {
  const toggle    = document.getElementById('themeToggle');
  const icon      = document.getElementById('themeIcon');
  const html      = document.documentElement;

  // Load saved preference or default to dark
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateThemeIcon(saved, icon);

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next, icon);
  });
}

function updateThemeIcon(theme, icon) {
  // Show sun when in dark mode (click to switch to light), moon when in light
  icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

/* ============================================================
   3. TYPED TEXT EFFECT
============================================================ */
function initTypedText() {
  const el      = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Computer Science Student',
    'Aspiring Software Engineer',
    'Full-Stack Developer',
    'Open Source Enthusiast',
    'Problem Solver',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let deleting    = false;
  let paused      = false;

  const TYPE_SPEED   = 70;   // ms per character when typing
  const DELETE_SPEED = 35;   // ms per character when deleting
  const PAUSE_AFTER  = 1800; // ms to pause at full phrase

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting && charIndex <= current.length) {
      el.textContent = current.slice(0, charIndex);
      charIndex++;

      if (charIndex > current.length) {
        // Full phrase typed — pause before deleting
        paused = true;
        setTimeout(() => {
          paused = false;
          deleting = true;
          tick();
        }, PAUSE_AFTER);
        return;
      }
    } else if (deleting && charIndex >= 0) {
      el.textContent = current.slice(0, charIndex);
      charIndex--;

      if (charIndex < 0) {
        // Fully deleted — next phrase
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
      }
    }

    setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  // Small initial delay so page feels settled
  setTimeout(tick, 800);
}

/* ============================================================
   4. NAVBAR SCROLL STATE
============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ============================================================
   5. MOBILE MENU
============================================================ */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  const open = () => {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? close() : open();
  });

  // Close when a link is clicked
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      close();
    }
  });
}

/* ============================================================
   6. SCROLL-TRIGGERED REVEAL
============================================================ */
function initRevealObserver() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ============================================================
   7. SKILL BAR ANIMATIONS
============================================================ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.getAttribute('data-width') || '0';
        // Small delay so the element is fully visible first
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 100);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(el => observer.observe(el));
}

/* ============================================================
   8. PROJECT FILTER
============================================================ */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const tags = card.getAttribute('data-tags') || '';
          card.classList.toggle('hidden', !tags.includes(filter));
        }
      });
    });
  });
}

/* ============================================================
   9. CONTACT FORM — Formspree integration
   Setup:
     1. Go to https://formspree.io and create a free account
     2. Create a new form — you'll get an endpoint like:
        https://formspree.io/f/xyzabcde
     3. Paste that full URL as the value of FORMSPREE_ENDPOINT below
     4. Formspree will email you every submission. Done.
============================================================ */

// ⚠️  REPLACE THIS with your real Formspree endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xreynzjw';

function initContactForm() {
  const form      = document.getElementById('contactForm');
  const status    = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !status || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ---- Client-side validation ----
    const name    = form.querySelector('#fname').value.trim();
    const email   = form.querySelector('#femail').value.trim();
    const message = form.querySelector('#fmessage').value.trim();

    if (!name || !email || !message) {
      showStatus(status, '⚠️ Please fill in all required fields.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showStatus(status, '⚠️ Please enter a valid email address.', 'error');
      return;
    }

    // ---- Check endpoint is configured ----
    if (FORMSPREE_ENDPOINT.includes('YOUR_FORMSPREE_ID')) {
      showStatus(status, '⚠️ Contact form not configured yet. See script.js for setup instructions.', 'error');
      return;
    }

    // ---- Disable button & show loading ----
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name:    name,
          email:   email,
          subject: form.querySelector('#fsubject').value.trim() || '(no subject)',
          message: message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success — Formspree accepted the submission
        showStatus(status, '✅ Message sent! I\'ll get back to you soon.', 'success');
        form.reset();
      } else {
        // Formspree returned an error (e.g. form not activated yet)
        const errMsg = data?.errors?.map(e => e.message).join(', ') || 'Submission failed.';
        showStatus(status, `❌ ${errMsg}`, 'error');
      }
    } catch (err) {
      // Network error
      showStatus(status, '❌ Network error — please try emailing me directly.', 'error');
      console.error('Form submission error:', err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
    }
  });
}

function showStatus(el, msg, type) {
  el.textContent = msg;
  el.className   = 'form-status ' + (type === 'error' ? 'error' : '');
  setTimeout(() => { el.textContent = ''; el.className = 'form-status'; }, 5000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================================
   10. SCROLL-TO-TOP BUTTON
============================================================ */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   11. FOOTER YEAR
============================================================ */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   12. ACTIVE NAV LINK (SCROLLSPY)
============================================================ */
function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color     = isActive ? 'var(--accent)' : '';
          link.style.background = isActive ? 'var(--accent-glow)' : '';
        });
      }
    });
  }, {
    threshold: 0.4,
    rootMargin: `-${64}px 0px -40% 0px`
  });

  sections.forEach(sec => observer.observe(sec));
}
