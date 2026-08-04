/* ==========================================================================
   PRISTINE MOBILE DETAILING 636
   script.js — Vanilla JS, no dependencies
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Utilities
     ------------------------------------------------------------------------ */

  function debounce(fn, wait) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    };
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     Navbar scroll effect
     ------------------------------------------------------------------------ */

  function initNavbarScroll() {
    var header = document.querySelector('.header');
    if (!header) return;

    var THRESHOLD = 40;

    function update() {
      if (window.scrollY > THRESHOLD) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    update();
    window.addEventListener('scroll', debounce(update, 10), { passive: true });
  }

  /* ------------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------------ */

  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;

    var overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    var links = menu.querySelectorAll('a');

    function openMenu() {
      menu.classList.add('active');
      overlay.classList.add('active');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
    }

    function closeMenu() {
      menu.classList.remove('active');
      overlay.classList.remove('active');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }

    function toggleMenu() {
      if (menu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    links.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        closeMenu();
      }
    });

    document.addEventListener('click', function (e) {
      if (
        menu.classList.contains('active') &&
        !menu.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ------------------------------------------------------------------------
     Smooth scroll for in-page anchor links (header-offset aware)
     ------------------------------------------------------------------------ */

  function initSmoothScroll() {
    var header = document.querySelector('.header');
    var anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var hash = anchor.getAttribute('href');
        if (!hash || hash === '#') return;

        var target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();

        var offset = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset + 1;

        window.scrollTo({
          top: top,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     Back to top button
     ------------------------------------------------------------------------ */

  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    var THRESHOLD = 480;

    function update() {
      if (window.scrollY > THRESHOLD) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    btn.setAttribute('aria-label', 'Back to top');
    update();
    window.addEventListener('scroll', debounce(update, 10), { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     Scroll-reveal animations (Intersection Observer)
     Classes are applied here in JS so the HTML stays untouched.
     ------------------------------------------------------------------------ */

  function initRevealAnimations() {
    if (prefersReducedMotion) return;

    var groups = [
      { selector: '.section-title', effect: 'fade-up', stagger: 0 },
      { selector: '.feature-card', effect: 'fade-up', stagger: 100 },
      { selector: '.service-card', effect: 'fade-up', stagger: 100 },
      { selector: '.price-card', effect: 'scale-in', stagger: 120 },
      { selector: '.gallery-item', effect: 'scale-in', stagger: 80 },
      { selector: '.about-text', effect: 'fade-right', stagger: 0 },
      { selector: '.about-image', effect: 'fade-left', stagger: 0 },
      { selector: '.cities > div', effect: 'fade-up', stagger: 60 },
      { selector: '.contact-card', effect: 'fade-up', stagger: 100 },
      { selector: '.cta-content', effect: 'fade-up', stagger: 0 }
    ];

    var elements = [];

    groups.forEach(function (group) {
      var nodes = document.querySelectorAll(group.selector);
      nodes.forEach(function (node, index) {
        node.classList.add('reveal', group.effect);
        if (group.stagger) {
          node.style.transitionDelay = (index % 6) * group.stagger + 'ms';
        }
        elements.push(node);
      });
    });

    if (!('IntersectionObserver' in window) || elements.length === 0) {
      elements.forEach(function (el) {
        el.classList.add('in-view');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     Init
     ------------------------------------------------------------------------ */

  function init() {
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initRevealAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
