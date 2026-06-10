/* ===== ПРЕЛОАДЕР ===== */
const pre = document.querySelector('.preloader');
const counter = document.querySelector('[data-count]');
let c = 0;
const ci = setInterval(() => {
  c += Math.floor(Math.random() * 8) + 2;
  if (c >= 100) {
    c = 100;
    clearInterval(ci);
    setTimeout(() => {
      pre.classList.add('done');
      revealHero();
    }, 400);
  }
  counter.textContent = c < 10 ? '0' + c : c;
}, 120);

/* ===== РАЗБИВКА ТЕКСТА НА СЛОВА (для about) ===== */
document.querySelectorAll('[data-reveal-words]').forEach(el => {
  const words = el.textContent.trim().split(' ');
  el.innerHTML = words
    .map(w => `<span class="word"><i>${w}</i></span>`)
    .join(' ');
});

/* ===== ИНЕРЦИОННЫЙ СКРОЛЛ ===== */
const content = document.getElementById('scroll-content');
let current = 0, target = 0;
const ease = 0.08;
const isMobile = window.matchMedia('(max-width:768px)').matches;

function setHeight() {
  document.body.style.height = content.getBoundingClientRect().height + 'px';
}
window.addEventListener('load', setHeight);
window.addEventListener('resize', setHeight);

function smooth() {
  if (!isMobile) {
    target = window.scrollY;
    current += (target - current) * ease;
    content.style.transform = `translateY(${-current}px)`;
  } else {
    current = window.scrollY;
    content.style.transform = 'none';
  }

  /* ПАРАЛЛАКС */
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-parallax'));
    const rect = el.getBoundingClientRect();
    const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
    el.style.transform = `translateY(${offset}px) scale(1.1)`;
  });

  requestAnimationFrame(smooth);
}
requestAnimationFrame(smooth);

/* ===== REVEAL ПО СКРОЛЛУ (Intersection Observer) ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // запускаем дочерние [data-reveal]
      entry.target.querySelectorAll('[data-reveal]').forEach((el, i) => {
        el.style.transitionDelay = (i * 0.08) + 's';
        el.classList.add('in-view');
      });
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(
  '.section-head, .about__text, .footer__cta, .card, [data-reveal-words]'
).forEach(el => io.observe(el));

/* раскрытие слов в about */
const ioWords = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.word i').forEach((w, i) => {
        w.style.transitionDelay = (i * 0.03) + 's';
      });
      e.target.classList.add('in-view');
      ioWords.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('[data-reveal-words]').forEach(el => ioWords.observe(el));

/* ===== HERO REVEAL (после прелоадера) ===== */
function revealHero() {
  document.querySelectorAll('.hero [data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.1 + 0.2) + 's';
    el.classList.add('in-view');
  });
}

/* ===== КАСТОМНЫЙ КУРСОР ===== */
const cursor = document.querySelector('.cursor');
const dot = document.querySelector('.cursor-dot');
let mx = 0, my = 0, cx = 0, cy = 0;

if (!isMobile) {
  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function cursorLoop() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy +
