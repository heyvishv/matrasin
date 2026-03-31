/* ══════════════════════════════════════════
   MĀTRĀŚIN — main.js
   Premium Animations & Interactions
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Page Loader ──────────────────────────────────────
  const loader = document.getElementById('page-loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('loaded'), 1600);
  });

  // ── Custom Cursor ────────────────────────────────────
  const cursorDot  = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left  = mouseX + 'px';
    cursorDot.style.top   = mouseY + 'px';
  });

  // Smooth ring follow
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover states
  const hoverEls = document.querySelectorAll('a, button, .program-card, .blog-card, .pricing-card, .result-card, .why-card, .pillar-card, .sanskrit-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });

  // ── Navbar ───────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Active link highlight
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  // ── Mobile Menu ──────────────────────────────────────
  window.toggleMenu = function () {
    const menu = document.getElementById('mobileMenu');
    const ham  = document.querySelector('.hamburger');
    const open = menu.classList.toggle('open');
    ham.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  // ── Scroll Reveal ────────────────────────────────────
  const reveals = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay * 1000);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // Auto-assign delays to children of grid/list parents
  document.querySelectorAll('.why-grid, .programs-grid, .pricing-grid, .results-grid, .blog-grid, .philosophy-pillars, .credentials-grid').forEach(parent => {
    const kids = parent.querySelectorAll('[data-reveal]');
    kids.forEach((kid, i) => {
      if (!kid.dataset.delay) kid.dataset.delay = (i * 0.09).toFixed(2);
    });
  });

  // ── Counter Animation ────────────────────────────────
  function animateCounter(el, end, duration = 1800) {
    const start = 0;
    const startTime = performance.now();
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const val = Math.floor(start + (end - start) * ease);
      el.textContent = prefix + val + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.count), 1800);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));

  // ── Magnetic Button Effect ───────────────────────────
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      this.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    el.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.2s ease';
    });
  });

  // ── Text Scramble on Section Entry ──────────────────
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = 'abcdefghijklmnopqrstuvwxyz';
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const old = this.el.innerText;
      const len = newText.length;
      const promise = new Promise(res => this.resolve = res);
      this.queue = [];
      for (let i = 0; i < len; i++) {
        const from = old[i] || '';
        const to = newText[i];
        const start = Math.floor(Math.random() * 12);
        const end = start + Math.floor(Math.random() * 12);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    update() {
      let output = '', complete = 0;
      for (let i = 0; i < this.queue.length; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) { complete++; output += to; }
        else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.queue[i].char = char;
          }
          output += `<span style="color:var(--gold);opacity:0.6">${char}</span>`;
        } else { output += from; }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) { this.resolve(); }
      else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
  }

  // Apply scramble to section labels when they enter view
  const scrambleEls = document.querySelectorAll('.scramble-text');
  const scrambleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fx = new TextScramble(entry.target);
        fx.setText(entry.target.dataset.text || entry.target.textContent);
        scrambleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });
  scrambleEls.forEach(el => scrambleObserver.observe(el));

  // ── Smooth Parallax on Hero Right ───────────────────
  const heroOrbs = document.querySelectorAll('.hero-bg-orb');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    heroOrbs.forEach((orb, i) => {
      const speed = 0.08 + i * 0.04;
      orb.style.transform = `translateY(${sy * speed}px)`;
    });
  }, { passive: true });

  // ── Parallax for about bg circles ───────────────────
  const aboutCircles = document.querySelectorAll('.about-bg-circle');
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    window.addEventListener('scroll', () => {
      const rect = aboutSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = -rect.top / (aboutSection.offsetHeight + window.innerHeight);
        aboutCircles.forEach((c, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          c.style.transform = `translateY(${progress * 80 * dir}px)`;
        });
      }
    }, { passive: true });
  }

  // ── Hover tilt for cards ─────────────────────────────
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      this.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.1s ease';
    });
  });

  // ── Pricing card number count up ─────────────────────
  const pricingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.pricing-price').forEach(p => {
          const text = p.textContent;
          const num = parseInt(text.replace(/[^0-9]/g, ''));
          if (!num) return;
          const sup = p.querySelector('sup');
          const supHTML = sup ? sup.outerHTML : '';
          const endVal = num;
          let frame = 0;
          const total = 50;
          const tick = () => {
            frame++;
            const progress = frame / total;
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(ease * endVal);
            p.innerHTML = supHTML + current.toLocaleString('en-IN');
            if (frame < total) requestAnimationFrame(tick);
          };
          tick();
        });
        pricingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.pricing-card').forEach(c => pricingObserver.observe(c));

  // ── Form submit ──────────────────────────────────────
  window.handleSubmit = function(btn) {
    btn.classList.add('success');
    btn.innerHTML = '<span>✓ &nbsp;Message received! We\'ll reach out soon.</span>';
    btn.disabled = true;
    setTimeout(() => {
      btn.classList.remove('success');
      btn.innerHTML = '<span>Book Your Consultation →</span>';
      btn.disabled = false;
    }, 4500);
  };

  // ── Smooth hover arrow bounce ─────────────────────────
  document.querySelectorAll('.btn-primary, .btn-cta-white').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const arrow = btn.querySelector('.arrow') || btn;
    });
  });

  // ── Section divider lines animate on scroll ──────────
  document.querySelectorAll('.divider').forEach(d => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.animation = 'dividerGrow 0.8s var(--ease-out-expo) forwards';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 1 });
    d.style.width = '0';
    obs.observe(d);
  });

  // Add divider keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes dividerGrow {
      from { width: 0; opacity: 0; }
      to   { width: 48px; opacity: 1; }
    }
    .nav-links a.active { color: var(--charcoal); }
    .nav-links a.active::after { transform: scaleX(1); }
  `;
  document.head.appendChild(style);

  // ── Stats number animation with +/k formatting ────────
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const end  = parseInt(el.dataset.count);
        const suf  = el.dataset.suffix || '';
        let frame  = 0, total = 60;
        const run  = () => {
          frame++;
          const p = frame / total;
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(e * end) + suf;
          if (frame < total) requestAnimationFrame(run);
          else el.textContent = end + suf;
        };
        requestAnimationFrame(run);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.7 });
  document.querySelectorAll('[data-count]').forEach(el => statsObserver.observe(el));

  // ── Marquee pause on hover ───────────────────────────
  const marqueeWrap = document.querySelector('.marquee-wrap');
  if (marqueeWrap) {
    marqueeWrap.addEventListener('mouseenter', () => {
      document.querySelectorAll('.marquee').forEach(m => m.style.animationPlayState = 'paused');
    });
    marqueeWrap.addEventListener('mouseleave', () => {
      document.querySelectorAll('.marquee').forEach(m => m.style.animationPlayState = 'running');
    });
  }

  // ── Smooth page scroll with offset ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  // ── Hero section entrance animation for circles ───────
  setTimeout(() => {
    document.querySelectorAll('.hero-deco-circle').forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transition = `opacity 1s ease ${0.8 + i * 0.2}s`;
      setTimeout(() => c.style.opacity = '0.4', 100);
    });
  }, 400);

  console.log('%cMātrāśin ✦ Science-based nutrition for women', 'color:#C9A84C; font-family:Georgia,serif; font-size:14px; padding:8px;');
});
