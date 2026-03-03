function initModals() {
  const privacyModal = document.getElementById('privacyModal');
  const termsModal = document.getElementById('termsModal');
  const openPrivacy = document.getElementById('openPrivacy');
  const openTerms = document.getElementById('openTerms');
  const closePrivacy = document.getElementById('closePrivacy');
  const closeTerms = document.getElementById('closeTerms');

  function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openPrivacy) openPrivacy.addEventListener('click', () => openModal(privacyModal));
  if (openTerms) openTerms.addEventListener('click', () => openModal(termsModal));
  if (closePrivacy) closePrivacy.addEventListener('click', () => closeModal(privacyModal));
  if (closeTerms) closeTerms.addEventListener('click', () => closeModal(termsModal));

  [privacyModal, termsModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [privacyModal, termsModal].forEach(modal => {
        if (modal && modal.classList.contains('active')) closeModal(modal);
      });
    }
  });
}

function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });
  }
}

function initHamburger() {
  const hamburger = document.querySelector('.nav-hamburger');
  const navRight = document.querySelector('.nav-right');
  if (hamburger && navRight) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navRight.classList.toggle('mobile-open');
    });
  }
}

function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.mv-card, .prefieren-item, .empresa-about-text p').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ${i * 0.08}s var(--ease), transform 0.6s ${i * 0.08}s var(--ease)`;
    observer.observe(el);
  });
}

function init() {
  initModals();
  initScrollTop();
  initHamburger();
  initAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
