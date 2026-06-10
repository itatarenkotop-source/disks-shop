/* Активный пункт меню */
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

/* Плавное появление при скролле */
document.querySelectorAll('.section-head, .feature, .card, .about__content, .about__media, .contact__lead, .contact__card, .lead__form')
  .forEach(el => el.classList.add('reveal'));

const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (entry.target.dataset.delay || 0) + 's';
      entry.target.classList.add('in');
      revealIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

/* ===== ФОРМА ЗАЯВКИ (заглушка) ===== */
(function () {
  const form = document.getElementById('leadForm');
  if (!form) return;

  const success = document.getElementById('leadSuccess');
  const phone = document.getElementById('phone');

  /* маска телефона */
  phone.addEventListener('input', () => {
    let v = phone.value.replace(/\D/g, '');
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (v.startsWith('7')) v = v.slice(1);
    v = v.slice(0, 10);
    let out = '+7';
    if (v.length > 0) out += ' (' + v.slice(0, 3);
    if (v.length >= 4) out += ') ' + v.slice(3, 6);
    if (v.length >= 7) out += '-' + v.slice(6, 8);
    if (v.length >= 9) out += '-' + v.slice(8, 10);
    phone.value = out;
  });

  function showError(name, msg) {
    const field = form.querySelector('#' + name).closest('.field');
    const err = form.querySelector('.err[data-for="' + name + '"]');
    field.classList.add('invalid');
    if (err) err.textContent = msg;
  }
  function clearError(name) {
    const field = form.querySelector('#' + name).closest('.field');
    const err = form.querySelector('.err[data-for="' + name + '"]');
    field.classList.remove('invalid');
    if (err) err.textContent = '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let ok = true;

    const name = form.name.value.trim();
    if (name.length < 2) { showError('name', 'Введите имя'); ok = false; }
    else clearError('name');

    const digits = phone.value.replace(/\D/g, '');
    if (digits.length < 11) { showError('phone', 'Введите телефон полностью'); ok = false; }
    else clearError('phone');

    if (!ok) return;

    /* ЗАГЛУШКА: реальной отправки пока нет */
    console.log('Заявка (заглушка):', {
      name: form.name.value,
      phone: form.phone.value,
      interest: form.interest.value,
      comment: form.comment.value
    });

    form.style.display = 'none';
    success.classList.add('show');
  });
})();
/* ===== ВАУ-ЭФФЕКТЫ ===== */

// --- 1. Появление блоков при скролле ---
const revealEls = document.querySelectorAll(
  '.feature, .card, .section-head, .about__media, .about__content, .contact__lead, .contact__card'
);
revealEls.forEach(el => el.classList.add('reveal'));

// поочерёдная задержка для карточек
document.querySelectorAll('.grid .card').forEach((card, i) => {
  card.style.setProperty('--d', (i * 0.12) + 's');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));


// --- 2. Анимация цифр (накрутка от нуля) ---
function animateNumber(el) {
  const raw = el.textContent.trim();
  // вытаскиваем число и "хвост" (+, %, ' лет' и т.п.)
  const match = raw.match(/^(\d+)(.*)$/s);
  if (!match) return;

  const target = parseInt(match[1], 10);
  const suffix = match[2];
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    // плавное замедление
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

const numObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateNumber(entry.target);
      numObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.feature__num').forEach(el => numObserver.observe(el));
/* ===== ПАРАЛЛАКС HERO (плавный, для мобильных тоже) ===== */
const hero = document.querySelector('.hero');

// background-attachment: fixed не всегда работает на мобильных,
// поэтому делаем мягкий параллакс через JS
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (hero && y < window.innerHeight) {
        hero.style.backgroundPosition = `center ${y * 0.4}px`;
      }
      ticking = false;
    });
    ticking = true;
  }
});
/* ===== ЭФФЕКТЫ v3 ===== */

// --- Прогресс-бар прокрутки ---
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

// --- Кнопка "наверх" ---
const toTop = document.createElement('button');
toTop.className = 'to-top';
toTop.setAttribute('aria-label', 'Наверх');
toTop.innerHTML = '↑';
document.body.appendChild(toTop);

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = (scrollTop / docHeight) * 100;
  progressBar.style.width = percent + '%';

  if (scrollTop > 400) toTop.classList.add('show');
  else toTop.classList.remove('show');
});


// --- Кастомный курсор (только для десктопа) ---
if (window.matchMedia('(min-width: 769px)').matches) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor-dot';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // увеличение на интерактивных элементах
  document.querySelectorAll('a, button, .card, .fc').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}


// --- 3D-наклон карточек (эффект "tilt") ---
if (window.matchMedia('(min-width: 769px)').matches) {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;  // наклон по вертикали
      const rotateY = ((x - cx) / cx) * 6;   // наклон по горизонтали
      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
/* ===== СТРЕЛКА "ЛИСТАЙ ВНИЗ" ===== */
const heroBlock = document.querySelector('.hero');
if (heroBlock && !document.querySelector('.scroll-hint')) {
  const hint = document.createElement('div');
  hint.className = 'scroll-hint';
  hint.innerHTML = '⌄';
  heroBlock.appendChild(hint);

  hint.addEventListener('click', () => {
    const next = heroBlock.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  });
}
/* ===== ЖИВЫЕ ЭФФЕКТЫ v5 ===== */

// 1. Золотые частицы в Hero
(function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const layer = document.createElement('div');
  layer.className = 'hero__particles';

  const count = window.innerWidth < 600 ? 14 : 28;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    const size = Math.random() * 3 + 2;
    p.style.left = Math.random() * 100 + '%';
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.animationDuration = (Math.random() * 12 + 10) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    layer.appendChild(p);
  }
  hero.insertBefore(layer, hero.firstChild);
})();

// 2. Магнитное свечение в каталоге
(function catalogGlow() {
  const catalog = document.querySelector('.catalog');
  if (!catalog || window.innerWidth < 768) return;

  const glow = document.createElement('div');
  glow.className = 'catalog__glow';
  catalog.appendChild(glow);

  catalog.addEventListener('mousemove', (e) => {
    const rect = catalog.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top = (e.clientY - rect.top) + 'px';
    glow.style.opacity = '1';
  });
  catalog.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
})();

// 3. Параллакс текста Hero за мышкой
(function heroParallax() {
  const hero = document.querySelector('.hero');
  const inner = document.querySelector('.hero__inner');
  if (!hero || !inner || window.innerWidth < 768) return;

  hero.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 14;
    inner.style.transform = `translate(${x}px, ${y}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    inner.style.transform = '';
  });
})();
/* ===== ТОП-ЭФФЕКТЫ v6 ===== */

// 1. MAGNETIC-кнопки (тянутся к курсору)
(function magneticBtns() {
  if (window.innerWidth < 768) return;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.45}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

// 2. 3D-наклон карточек + spotlight за курсором
(function tiltCards() {
  if (window.innerWidth < 768) return;
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rotY = (px - 0.5) * 10;   // наклон по X
      const rotX = (0.5 - py) * 10;   // наклон по Y
      card.style.transform =
        `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      // spotlight
      card.style.setProperty('--mx', (px * 100) + '%');
      card.style.setProperty('--my', (py * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// 3. Заголовок Hero — буквы анимируются, но слова НЕ разрываются
(function splitHeroTitle() {
  const title = document.querySelector('.hero__title');
  if (!title || title.dataset.split) return;
  title.dataset.split = '1';

  const words = title.textContent.trim().split(' ');
  title.innerHTML = '';
  let charIndex = 0;

  words.forEach((word, w) => {
    // обёртка слова — неразрывная
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';

    [...word].forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      span.style.animationDelay = (0.4 + charIndex * 0.03) + 's';
      wordSpan.appendChild(span);
      charIndex++;
    });

    title.appendChild(wordSpan);

    // пробел между словами (обычный, для переноса между словами)
    if (w < words.length - 1) {
      title.appendChild(document.createTextNode(' '));
    }
  });
})();
// 4. Mask-reveal + draw-line через IntersectionObserver
(function scrollReveals() {
  // навешиваем классы автоматически
  document.querySelectorAll('.about__media, .contact__inner')
    .forEach(el => el.classList.add('mask-reveal'));

  // линии между секциями
  document.querySelectorAll('.features, .catalog, .about, .lead, .contact')
    .forEach(sec => {
      const line = document.createElement('div');
      line.className = 'draw-line';
      sec.parentNode.insertBefore(line, sec);
    });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('played');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.mask-reveal, .draw-line')
    .forEach(el => io.observe(el));
})();

// 5. АНИМАЦИЯ СЧЁТЧИКОВ (цифры накручиваются от 0)
(function animateCounters() {
  const nums = document.querySelectorAll('.feature__num');
  if (!nums.length) return;

  const run = (el) => {
    const raw = el.textContent.trim();
    const target = parseFloat(raw.replace(/[^\d.]/g, ''));
    const suffix = raw.replace(/[\d.\s]/g, ''); // +, лет, % и т.д.
    if (isNaN(target)) return;

    let cur = 0;
    const dur = 1600;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      cur = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(cur) : cur.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        run(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });

  nums.forEach(n => io.observe(n));
})();
/* ===== ПРЕЛОАДЕР v7 ===== */
(function preloader() {
  // создаём прелоадер сразу
  document.body.classList.add('loading');

  const pre = document.createElement('div');
  pre.className = 'preloader';
  pre.innerHTML = `
    <div class="preloader__logo">VELARI</div>
    <div class="preloader__bar"><span></span></div>
    <div class="preloader__num">0%</div>
  `;
  document.body.appendChild(pre);

  // счётчик процентов
  const num = pre.querySelector('.preloader__num');
  let p = 0;
  const counter = setInterval(() => {
    p += Math.floor(Math.random() * 12) + 4;
    if (p >= 100) { p = 100; clearInterval(counter); }
    num.textContent = p + '%';
  }, 130);

  // прячем после загрузки
  window.addEventListener('load', () => {
    setTimeout(() => {
      pre.classList.add('hide');
      document.body.classList.remove('loading');
      setTimeout(() => pre.remove(), 800);
    }, 1900);
  });
})();
/* ===== МИКРО-ОТКЛИК v7 ===== */

// 1. Ripple-волна на кнопках при клике
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const r = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(r.width, r.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// 2. Пульс цифр после накрутки (дополняет счётчики из v6)
(function pulseCounters() {
  const nums = document.querySelectorAll('.feature__num');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('counted'), 1600);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  nums.forEach(n => io.observe(n));
})();
/* ===== СКВОЗНАЯ НИТЬ v8 ===== */

// 1. Прогресс-бар чтения
(function readProgress() {
  const bar = document.createElement('div');
  bar.className = 'read-progress';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / h) * 100;
    bar.style.width = scrolled + '%';
  });
})();
// 2. Кастомный курсор
(function customCursor() {
  if (window.innerWidth < 768 || 'ontouchstart' in window) return;

  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let rx = 0, ry = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  // плавное "догоняющее" кольцо
  (function animate() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animate);
  })();

  // увеличение над кликабельным
  document.querySelectorAll('a, button, .btn, .card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('grow'));
    el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
  });
})();
