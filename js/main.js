/* ========================================================================
   AYUSH ANCHAL — IGLOO × BASEMENT STUDIO PORTFOLIO
   Interactions, Animations & Effects
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Loader ----------
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => loader.remove(), 600);
    }, 800);
  });

  // Fallback: hide loader after 3s max
  setTimeout(() => {
    if (loader && !loader.classList.contains('hide')) {
      loader.classList.add('hide');
      setTimeout(() => loader.remove(), 600);
    }
  }, 3000);

  // ---------- Navigation: scroll-based styling ----------
  const nav = document.getElementById('main-nav');
  let lastScroll = 0;

  const updateNav = () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.style.background = 'rgba(15, 15, 26, 0.85)';
      nav.style.backdropFilter = 'blur(16px)';
      nav.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
    } else {
      nav.style.background = 'transparent';
      nav.style.backdropFilter = 'none';
      nav.style.borderBottom = '1px solid transparent';
    }
    lastScroll = scrollY;
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ---------- Mobile menu ----------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  window.closeMobileMenu = () => {
    if (mobileMenu) mobileMenu.classList.add('hidden');
  };

  // ---------- Scroll Reveal (IntersectionObserver) ----------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ---------- 3D Tilt Effect ----------
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });

  // ---------- 24-Hour Timer ----------
  const timerDisplay = document.getElementById('timer-display');
  const timerRing = document.getElementById('timer-ring');
  const challengeBtn = document.getElementById('challenge-btn');
  const totalSeconds = 24 * 60 * 60;
  const circumference = 2 * Math.PI * 90; // radius = 90
  let timerInterval = null;
  let remainingSeconds = totalSeconds;
  let timerRunning = false;

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const updateTimerRing = (remaining) => {
    const progress = remaining / totalSeconds;
    const offset = circumference * (1 - progress);
    timerRing.style.strokeDashoffset = offset;
  };

  if (challengeBtn) {
    challengeBtn.addEventListener('click', () => {
      if (!timerRunning) {
        // Start countdown
        timerRunning = true;
        challengeBtn.textContent = '⏱ Timer Running...';
        challengeBtn.style.pointerEvents = 'none';
        challengeBtn.style.opacity = '0.7';

        timerInterval = setInterval(() => {
          remainingSeconds--;
          if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = '00:00:00';
            updateTimerRing(0);
            challengeBtn.textContent = 'Done! 🎉';
            return;
          }
          timerDisplay.textContent = formatTime(remainingSeconds);
          updateTimerRing(remainingSeconds);
        }, 1000);

        // Open email after a short delay
        setTimeout(() => {
          window.open('mailto:abhardwaj8507@gmail.com?subject=24h%20Challenge%20-%20Project%20Idea&body=Hey%20Ayush!%20I%20have%20a%20project%20idea%20for%20your%2024h%20challenge...', '_blank');
        }, 1500);
      }
    });
  }

  // ---------- Copy to Clipboard ----------
  const copyBtns = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');

  const showToast = (message) => {
    toast.textContent = message || 'Copied to clipboard!';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  };

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard! ✓');
      } catch {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied! ✓');
      }
    });
  });

  // ---------- Ice Particles (Hero background) ----------
  const particlesContainer = document.getElementById('particles-container');

  if (particlesContainer) {
    const createParticle = () => {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 1;
      const startX = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;

      Object.assign(particle.style, {
        position: 'absolute',
        width: size + 'px',
        height: size + 'px',
        borderRadius: '50%',
        background: `rgba(14, 165, 233, ${Math.random() * 0.3 + 0.1})`,
        left: startX + '%',
        bottom: '-10px',
        animation: `particleFloat ${duration}s ${delay}s linear infinite`,
        pointerEvents: 'none',
        boxShadow: `0 0 ${size * 2}px rgba(14, 165, 233, 0.2)`,
      });

      particlesContainer.appendChild(particle);
    };

    // Create particle float keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleFloat {
        0% {
          transform: translateY(0) translateX(0) scale(1);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 0.6;
        }
        100% {
          transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100}px) scale(0.3);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Create 25 particles
    for (let i = 0; i < 25; i++) {
      createParticle();
    }
  }

  // ---------- Igloo Panel Parallax ----------
  const iglooPanel = document.querySelectorAll('.igloo-panel');

  if (iglooPanel.length > 0) {
    let ticking = false;

    const handleParallax = () => {
      const scrollY = window.scrollY;

      iglooPanel.forEach((panel, i) => {
        const rect = panel.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const offset = (centerY - viewCenter) * 0.03 * (i % 2 === 0 ? 1 : -1);

        panel.style.transform = `translateY(${offset}px)`;
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(handleParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ---------- Spray Paint Effect on Project Hover ----------
  const projectItems = document.querySelectorAll('.project-item');

  projectItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const name = item.getAttribute('data-name');
      if (!name) return;

      // Create spray paint canvas effect
      const spray = document.createElement('div');
      spray.className = 'spray-effect-overlay';
      const color = getComputedStyle(item).getPropertyValue('--project-color').trim() || '#00f0ff';

      Object.assign(spray.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: "'Permanent Marker', cursive",
        fontSize: '4rem',
        color: color,
        opacity: '0',
        filter: 'blur(8px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'none',
        zIndex: '0',
        whiteSpace: 'nowrap',
        textShadow: `0 0 20px ${color}, 0 0 60px ${color}`,
      });

      spray.textContent = name;
      item.appendChild(spray);

      // Animate in
      requestAnimationFrame(() => {
        spray.style.opacity = '0.12';
        spray.style.filter = 'blur(2px)';
      });
    });

    item.addEventListener('mouseleave', () => {
      const sprays = item.querySelectorAll('.spray-effect-overlay');
      sprays.forEach(s => {
        s.style.opacity = '0';
        s.style.filter = 'blur(12px)';
        setTimeout(() => s.remove(), 500);
      });
    });
  });

  // ---------- Active Nav Link Highlight ----------
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveNav = () => {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--ice-100)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ---------- Sticky Note "tape" strip generation ----------
  const stickyNotes = document.querySelectorAll('.sticky-note');
  stickyNotes.forEach(note => {
    // Stop orbit animation propagation on hover
    note.addEventListener('mouseenter', (e) => {
      const parent = note.closest('.orbit-item');
      if (parent) {
        parent.style.animationPlayState = 'paused';
      }
    });
    note.addEventListener('mouseleave', (e) => {
      const parent = note.closest('.orbit-item');
      if (parent) {
        parent.style.animationPlayState = 'running';
      }
    });
  });

  // ---------- Keyboard Accessibility: Escape closes mobile menu ----------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // ---------- Prevent FOUC: ensure all animated elements are ready ----------
  document.body.style.opacity = '1';

  console.log('%c🧊 Igloo × Basement Studio', 'font-size: 20px; color: #0ea5e9; font-weight: bold;');
  console.log('%cBuilt by Ayush Anchal in < 24h', 'font-size: 12px; color: #7dd3fc;');
});
