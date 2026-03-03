import { initI18n } from './i18n.js';
import { initTextRotator } from './text-rotator.js';
import { initGridRoom } from './grid-room.js';

function onScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    if (scrollTop > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }
}

function initApp() {
  window.addEventListener('scroll', onScroll);
  initI18n();
  initTextRotator();
  initGridRoom();
  initModals();
}

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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const techItems = document.querySelectorAll('[data-tech-item]');
if (techItems.length) {
  const techObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        techObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  techItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.15}s`;
    techObserver.observe(item);
  });

  const techSection = document.getElementById('tecnologia');
  const barDelays = [0.0, 0.12, 0.28];
  const barRanges = [0.6, 0.55, 0.5];
  const minFontSize = 1.2;
  const maxFontSize = 3.5;
  function updateTechLines() {
    if (techSection) {
      const sectionRect = techSection.getBoundingClientRect();
      const windowH = window.innerHeight;
      const rawProgress = (windowH - sectionRect.top) / (windowH + sectionRect.height * 0.5);
      const sectionProgress = Math.min(Math.max(rawProgress, 0), 1);

      techItems.forEach((item, index) => {
        const lineFill = item.querySelector('.tech-item-line-fill');
        const percentEl = item.querySelector('.tech-item-percent');
        if (!lineFill) return;
        const delay = barDelays[index];
        const range = barRanges[index];
        const itemProgress = Math.min(Math.max((sectionProgress - delay) / range, 0), 1);
        const pct = Math.round(itemProgress * 100);
        lineFill.style.width = `${pct}%`;
        if (percentEl) {
          percentEl.textContent = `${pct}%`;
          const fontSize = minFontSize + (maxFontSize - minFontSize) * itemProgress;
          percentEl.style.fontSize = `${fontSize}rem`;
        }
      });
    }
    requestAnimationFrame(updateTechLines);
  }
  updateTechLines();
}



document.querySelectorAll('.service-card[data-hover-img]').forEach(card => {
  const bg = card.querySelector('.service-card-bg');
  if (bg) {
    bg.style.backgroundImage = `url(${card.dataset.hoverImg})`;
  }
});

const carouselTrack = document.querySelector('.clients-carousel-track');
if (carouselTrack) {
  const cards = Array.from(carouselTrack.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    carouselTrack.appendChild(clone);
  });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
