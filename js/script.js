/* ============================================================
   WHO'S DOING IT LIKE THIS  --  script.js
   Behavior only. All copy lives in index.html.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- 1. Sticky-nav scroll state ----
     Add .scrolled to <header> after 80px of scroll. */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- 2. Mobile menu toggle ----
     Hamburger opens a full-screen overlay. Tapping any link closes it.
     Esc also closes. aria-expanded is kept in sync. */
  const navToggle  = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

  const setMenu = (open) => {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      setMenu(!mobileMenu.classList.contains('open'));
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', () => setMenu(false));
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        setMenu(false);
        navToggle.focus();
      }
    });
  }

  /* ---- 3. Reveal-on-scroll ----
     Adds .visible to .reveal elements as they enter the viewport.
     Honors prefers-reduced-motion: skip the observer and just show. */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.12 });

    revealEls.forEach((el) => io.observe(el));
  }

  /* ---- 4. Kitchen carousel ----
     Single-slide gallery: prev/next buttons, dots, keyboard arrows.
     Whenever the active slide changes, we pause any video that was
     playing and reset its time so only one ever plays at a time. */
  const carousel = document.getElementById('kitchenCarousel');
  if (carousel) {
    const track    = document.getElementById('kitchenTrack');
    const slides   = Array.from(track.querySelectorAll('.carousel-slide'));
    const prevBtn  = document.getElementById('carouselPrev');
    const nextBtn  = document.getElementById('carouselNext');
    const dotsWrap = document.getElementById('carouselDots');
    let index = 0;

    /* Build dot indicators */
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function pauseAllVideos() {
      track.querySelectorAll('video').forEach((v) => {
        if (!v.paused) {
          v.pause();
        }
      });
    }

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;

      slides.forEach((s, i) => {
        s.setAttribute('aria-hidden', String(i !== index));
      });
      dots.forEach((d, i) => {
        d.setAttribute('aria-selected', String(i === index));
        d.tabIndex = i === index ? 0 : -1;
      });

      prevBtn.disabled = (index === 0);
      nextBtn.disabled = (index === slides.length - 1);
    }

    function goTo(i) {
      const next = Math.max(0, Math.min(slides.length - 1, i));
      if (next === index) return;
      pauseAllVideos();
      index = next;
      update();
    }

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    /* Keyboard arrows when the carousel (or anything inside it) has focus */
    carousel.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'VIDEO') return; /* let video keep its own keys */
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    });

    /* Touch / swipe support */
    let touchX = null;
    carousel.addEventListener('touchstart', (e) => {
      touchX = e.changedTouches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) {
        goTo(index + (dx < 0 ? 1 : -1));
      }
      touchX = null;
    });

    /* If the user starts playing a video, pause any others (defensive --
       under normal flow only the current slide's video is reachable) */
    track.querySelectorAll('video').forEach((v) => {
      v.addEventListener('play', () => {
        track.querySelectorAll('video').forEach((other) => {
          if (other !== v && !other.paused) other.pause();
        });
      });
    });

    update();
  }

  /* ---- 5. Dynamic copyright year ---- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

});
