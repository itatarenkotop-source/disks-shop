/* ===== ПРЕЛОАДЕР ===== */
const pre = document.querySelector('.preloader');
const counter = document.querySelector('[data-count]');
let c = 0;
const ci = setInterval(() => {
  c += Math.floor(Math.random() * 8) + 2;
  if (c >= 100) {
    c = 100;
    clearInterval(ci);
    setTimeout(() => { pre.classList.add('done'); revealHero(); }, 400);
  }
  counter.textContent = c < 10 ? '0' + c : c;
}, 80);

/* подстраховка: показать всё через 4 сек, если завис */
setTimeout(() => {
  if (pre && !pre.classList.contains('done')) {
    pre.classList.add('done');
    revealHero();
  }
}, 4000);

/* ===== РАЗБИВКА ТЕКСТА НА СЛОВА (about) ===== */
document.querySelectorAll('[data-reveal-words]').forEach(el => {
  const words = el.textContent.trim().split(' ');
  el.innerHTML = words.map(w => `<span class="word"><i>${w}</i></span>`).join(' ');
});

const isMobile = window.matchMedia('(max-width:768px)').matches;

/* ===== ПАРАЛЛАКС ТОЛЬКО ДЛЯ HERO ===== */
const heroBg = document.querySelector('.hero__bg');
function parallaxLoop() {
  if (heroBg && !isMobile) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.3}px) scale(1.15)`;
  }
  requestAnimationFrame(parallaxLoop);
}
requestAnimationFrame(parallaxLoop);

/* ===== HERO REVEAL ===== */
function revealHero() {
  document.querySelectorAll('.hero [data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.1 + 0.2) + 's';
    el.classList.add('in-view');
  });
}

/* ===== REVEAL ПО СКРОЛЛУ ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      entry.target.querySelectorAll('[data-reveal]').forEach((el, i) => {
        el.style.transitionDelay = (i * 0.08) + 's';
        el.classList.add('in-view');
      });
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section-head, .about__text, .footer__cta, .card')
  .forEach(el => io.observe(el));

/* ===== СЛОВА В ABOUT ===== */
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
}, { threshold: 0.2 });
document.querySelectorAll('[data-reveal-words]').forEach(el => ioWords.observe(el));

/* ===== КАСТОМНЫЙ КУРСОР ===== */
const cursor = document.querySelector('.cursor');
const dot = document.querySelector('.cursor-dot');
let mx = 0, my = 0, cx = 0, cy = 0;

if (!isMobile && cursor && dot) {
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });
  function cursorLoop() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  document.querySelectorAll('a, button, .card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

/* ===== ЯКОРНЫЕ ССЫЛКИ ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const targetEl = document.querySelector(id);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ===== АКТИВНЫЙ ПУНКТ МЕНЮ ===== */
const navLinks = document.querySelectorAll('.nav a');
const sections = document.querySelectorAll('section[id]');
const navIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => navIO.observe(s));
