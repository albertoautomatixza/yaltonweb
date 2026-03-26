export function initHeroSlideshow() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  const slides = heroBg.querySelectorAll('img.hero-slide');
  if (slides.length < 2) return;

  let current = 0;
  const interval = 5000;

  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, interval);
}
