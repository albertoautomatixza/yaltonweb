function initTextRotator() {
  const texts = document.querySelectorAll('.hero-rotating-text');
  if (texts.length < 2) return;

  let current = 0;
  const interval = 4500;

  setInterval(() => {
    const prev = current;
    current = (current + 1) % texts.length;

    texts[prev].classList.add('exiting');
    texts[prev].classList.remove('active');

    setTimeout(() => {
      texts[prev].classList.remove('exiting');
    }, 600);

    setTimeout(() => {
      texts[current].classList.add('active');
    }, 300);
  }, interval);
}

export { initTextRotator };
