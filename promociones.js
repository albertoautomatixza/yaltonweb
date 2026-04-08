import { initI18n } from './i18n.js';

const SHEET_ID = '1Z29gEKGOh5dKmW0kxDWm9KTFJybt1tsoOf7qsTaT_KQ';
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
const WHATSAPP_NUMBER = '524493112811';
const PLACEHOLDER_IMAGE = 'https://images.pexels.com/photos/4614227/pexels-photo-4614227.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop';

function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const products = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const product = {};
    headers.forEach((header, index) => {
      product[header] = values[index] || '';
    });
    products.push(product);
  }

  return products;
}

async function fetchProducts() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) throw new Error('Error fetching data');
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

function createProductCard(product) {
  const titulo = product.titulo || 'Producto disponible';
  const imagen = product.imagen_url || PLACEHOLDER_IMAGE;
  const caracteristicas = product.caracteristicas || 'Información no disponible';
  const whatsappMessage = encodeURIComponent(`Estoy interesado en una promoción de la página web: ${titulo}`);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  const card = document.createElement('div');
  card.className = 'oport-card';
  card.innerHTML = `
    <div class="oport-card-border"></div>
    <div class="oport-card-inner">
      <div class="oport-card-img">
        <img src="${imagen}" alt="${titulo}" onerror="this.src='${PLACEHOLDER_IMAGE}'">
      </div>
      <div class="oport-card-body">
        <h3>${titulo}</h3>
        <div class="oport-card-actions">
          <button class="oport-btn oport-btn-features" data-caracteristicas="${caracteristicas.replace(/"/g, '&quot;')}">Características</button>
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="oport-btn oport-btn-buy">Comprar</a>
        </div>
      </div>
    </div>
  `;

  return card;
}

function createTooltip() {
  const tooltip = document.createElement('div');
  tooltip.className = 'oport-tooltip';
  tooltip.id = 'featuresTooltp';
  document.body.appendChild(tooltip);
  return tooltip;
}

function initTooltips(grid) {
  const tooltip = document.getElementById('featuresTooltp') || createTooltip();

  grid.addEventListener('mouseover', (e) => {
    const btn = e.target.closest('.oport-btn-features');
    if (!btn) return;

    const caracteristicas = btn.dataset.caracteristicas;
    tooltip.textContent = caracteristicas;
    tooltip.classList.add('visible');

    const rect = btn.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 10;

    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) {
      top = rect.bottom + 10;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  });

  grid.addEventListener('mouseout', (e) => {
    const btn = e.target.closest('.oport-btn-features');
    if (!btn) return;
    tooltip.classList.remove('visible');
  });
}

async function initProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const products = await fetchProducts();
  const activeProducts = products
    .filter(p => p.activo && p.activo.toLowerCase() === 'true')
    .slice(0, 12);

  grid.innerHTML = '';

  if (activeProducts.length === 0) {
    grid.innerHTML = '<p class="oport-no-products">No hay productos disponibles en este momento.</p>';
    return;
  }

  activeProducts.forEach(product => {
    const card = createProductCard(product);
    grid.appendChild(card);
  });

  initTooltips(grid);
  initCardAnimations();
}

function initSlider() {
  const slides = document.querySelectorAll('.oport-slide');
  const dots = document.querySelectorAll('.oport-dot');
  const prevBtn = document.querySelector('.oport-slider-prev');
  const nextBtn = document.querySelector('.oport-slider-next');
  let current = 0;
  let interval;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    goTo(current + 1);
  }

  function startAutoplay() {
    interval = setInterval(next, 5000);
  }

  function resetAutoplay() {
    clearInterval(interval);
    startAutoplay();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goTo(current - 1);
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goTo(current + 1);
      resetAutoplay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.slide));
      resetAutoplay();
    });
  });

  if (slides.length > 0) {
    startAutoplay();
  }
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

function initCardAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.oport-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ${i * 0.06}s var(--ease), transform 0.5s ${i * 0.06}s var(--ease)`;
    observer.observe(el);
  });
}

function init() {
  initSlider();
  initModals();
  initScrollTop();
  initHamburger();
  initProducts();
  initI18n();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
