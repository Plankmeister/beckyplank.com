/* ============================================
   Becky Plank — Website Interactions
   ============================================ */

(function () {
  'use strict';

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        navToggle.focus();
      }
    });
  }

  // --- Header scroll shadow ---
  var header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --- Active nav link highlighting ---
  var sections = document.querySelectorAll('section[id]');
  var navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(function (item) {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + id) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // --- Scroll reveal animations ---
  var fadeTargets = document.querySelectorAll(
    '.pillar, .timeline-item, .credential-card, .about-text, .about-illustration, .advocacy-text, .contact-centered, .section-heading'
  );

  fadeTargets.forEach(function (el) {
    el.classList.add('fade-in');
  });

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeTargets.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Pillar card 3D tilt effect ---
  if (!prefersReducedMotion) {
    document.querySelectorAll('.pillar').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -5;
        var rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // --- Parallax floating shapes in hero ---
  if (!prefersReducedMotion) {
    var hero = document.querySelector('.hero');
    var shapeCircle = document.querySelector('.shape-circle');
    var shapeDots = document.querySelector('.shape-dots');

    if (hero && shapeCircle && shapeDots) {
      window.addEventListener('scroll', function () {
        var scrolled = window.scrollY;
        var heroHeight = hero.offsetHeight;
        if (scrolled < heroHeight) {
          var ratio = scrolled / heroHeight;
          shapeCircle.style.transform = 'translateY(' + (ratio * -40) + 'px)';
          shapeDots.style.transform = 'translateY(' + (ratio * -25) + 'px)';
        }
      }, { passive: true });
    }
  }

  // --- Counter animation for timeline years ---
  if (!prefersReducedMotion) {
    var yearBadges = document.querySelectorAll('.timeline-year');
    var yearObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
          yearObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    yearBadges.forEach(function (badge) {
      badge.style.opacity = '0';
      badge.style.transform = 'scale(0.8)';
      yearObserver.observe(badge);
    });

    // Inject the popIn keyframes
    var style = document.createElement('style');
    style.textContent = '@keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }';
    document.head.appendChild(style);
  }

  // --- Smooth scroll for all anchor links (fallback for older browsers) ---
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

})();
