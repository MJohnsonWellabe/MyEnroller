/* nav.js — shared UI behavior for all pages */
(function () {
  'use strict';

  function init() {
    /* ── Hamburger ── */
    var ham = document.getElementById('navHam');
    var mob = document.getElementById('mobileNav');
    var hdr = document.querySelector('.site-header');
    if (ham && mob) {
      ham.addEventListener('click', function () { mob.classList.toggle('open'); });
      document.addEventListener('click', function (e) {
        if (hdr && !hdr.contains(e.target) && !mob.contains(e.target)) {
          mob.classList.remove('open');
        }
      });
      mob.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { mob.classList.remove('open'); });
      });
    }

    /* ── Nav scroll shadow ── */
    window.addEventListener('scroll', function () {
      if (hdr) hdr.style.boxShadow = window.scrollY > 40 ? '0 4px 24px rgba(0,0,0,.5)' : '';
    });

    /* ── Hero slideshow ── */
    var slides = document.querySelectorAll('.hero-slide');
    var dots   = document.querySelectorAll('.hero-dot');
    var cur    = 0;
    if (slides.length > 1) {
      function goSlide(n) {
        slides[cur].classList.remove('active');
        dots[cur] && dots[cur].classList.remove('active');
        cur = n;
        slides[cur].classList.add('active');
        dots[cur] && dots[cur].classList.add('active');
      }
      dots.forEach(function (d) {
        d.addEventListener('click', function () { goSlide(+d.dataset.s); });
      });
      setInterval(function () { goSlide((cur + 1) % slides.length); }, 5000);
    }

    /* ── FAQ accordion ── */
    window.toggleFaq = function (id) {
      var card  = document.getElementById(id);
      var body  = card && card.querySelector('.faq-card-body');
      var inner = body && body.querySelector('p');
      if (!card || !body || !inner) return;
      var isOpen = card.classList.contains('open');
      document.querySelectorAll('.faq-card.open').forEach(function (c) {
        c.classList.remove('open');
        c.querySelector('.faq-card-body').style.maxHeight = '0';
      });
      if (!isOpen) {
        card.classList.add('open');
        body.style.maxHeight = (inner.scrollHeight + 32) + 'px';
      }
    };

    /* ── Product/feature tabs ── */
    window.showTab = function (id, btn) {
      document.querySelectorAll('.pa-panel').forEach(function (p) { p.classList.remove('active'); });
      document.querySelectorAll('.pa-tab').forEach(function (t) { t.classList.remove('active'); });
      var panel = document.getElementById('tab-' + id);
      if (panel) panel.classList.add('active');
      if (btn)   btn.classList.add('active');
    };

    /* ── Contact form submit ── */
    window.submitForm = function () {
      var first = document.getElementById('f-first');
      var email = document.getElementById('f-email');
      if (!first || !email) return;
      if (!first.value.trim()) { first.style.borderColor = 'rgba(200,60,60,.6)'; first.focus(); return; }
      if (!email.value.trim()) { email.style.borderColor = 'rgba(200,60,60,.6)'; email.focus(); return; }
      var form = document.getElementById('contactForm');
      var ok   = document.getElementById('formSuccess');
      if (form) form.style.display = 'none';
      if (ok)   ok.style.display   = 'block';
    };

    /* ── Scroll reveal ── */
    var targets = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && targets.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      targets.forEach(function (t) { io.observe(t); });
    } else {
      targets.forEach(function (t) { t.classList.add('revealed'); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
