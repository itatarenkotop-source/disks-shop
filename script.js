/* ============================================================
   TEREK — script.js (очищенная версия без дублей)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== 1. АКТИВНЫЙ ПУНКТ МЕНЮ ===== */
  const navLinks = document.querySelectorAll('.nav a');
  const sections = document.querySelectorAll('section[id]');

  if (sections.length) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(l =>
            l.classList.toggle('active', l.getAttribute('href') === '#' + id)
          );
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(s => navIO.observe(s));
  }


  /* ===== 2. ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ (единая система) ===== */
  const revealEls = document.querySelectorAll(
    '.section-head, .feature, .card, .about__content, .about__media, ' +
    '.contact__lead, .contact__card, .lead__form'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  // поочерёдная задержка для карточек каталога
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


  /* ===== 3. ФОРМА ЗАЯВКИ ===== */
  (function leadFormInit() {
    const form = document.getElementById('leadForm');
    if (!form) return;

    const success = document.getElementById('leadSuccess');
    const phone = document.getElementById('phone');

    /* маска телефона */
    if (phone) {
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
    }

    function showError(name, msg) {
      const input = form.querySelector('#' + name);
      if (!input) return;
      const field = input.closest('.field');
      const err = form.querySelector('.err[data-for="' + name + '"]');
      if (field) field.classList.add('invalid');
      if (err) err.textContent = msg;
    }
    function clearError(name) {
      const input = form.querySelector('#' + name);
      if (!input) return;
      const field = input.closest('.field');
      const err = form.querySelector('.err[data-for="' + name + '"]');
      if (field) field.classList.remove('invalid');
      if (err) err.textContent = '';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let ok = true;

      const name = form.name.value.trim();
      if (name.length < 2) { showError('name', 'Введите имя'); ok = false; }
      else clearError('name');

      const digits = phone ? phone.value.replace(/\D/g, '') : '';
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
      if (success) success.classList.add('show');
    });
  })();


  /* ===== 4. АНИМАЦИЯ ЦИФР (счётчики) ===== */
  (function animateCounters() {
    const nums = document.querySelectorAll('.feature__num');
    if (!nums.length) return;

    const run = (el) => {
      const raw = el.textContent.trim();
      const target = parseFloat(raw.replace(/[^\d.]/g, ''));
      const suffix = raw.replace(/[\d.\s]/g, ''); // +, %, лет и т.д.
      if (isNaN(target)) return;

      const hasSpace = /\s/.test(raw); // например "10 лет"
      const dur = 1600;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        const cur = target * eased;
        const val = (target % 1 === 0) ? Math.round(cur) : cur.toFixed(1);
        el.textContent = val + (hasSpace ? ' ' : '') + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else {
          el.textContent = (target % 1 === 0 ? target : target.toFixed(1)) +
                           (hasSpace ? ' ' : '') + suffix;
          el.classList.add('counted'); // пульс
        }
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


  /* ===== 5. РАЗБИВКА ЗАГОЛОВКА HERO ПО БУКВАМ ===== */
  (function splitHeroTitle() {
    const title = document.querySelector('.hero__title');
    if (!title || title.dataset.split) return;
    title.dataset.split = '1';

    const words = title.textContent.trim().split(/\s+/);
    title.innerHTML = '';
    let charIndex = 0;

    words.forEach((word, w) => {
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

      // видимый пробел между словами
      if (w < words.length - 1) {
        const space = document.createElement('span');
        space.className = 'space';
        title.appendChild(space);
      }
    });
  })();


  /* ===== 6. MASK-REVEAL + DRAW-LINE ===== */
  (function scrollReveals() {
    document.querySelectorAll('.about__media, .contact__inner')
      .forEach(el => el.classList.add('mask-reveal'));

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


  /* ===== 7. ЧАСТИЦЫ В HERO ===== */
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


  /* ===== 8. МАГНИТНОЕ СВЕЧЕНИЕ В КАТАЛОГЕ ===== */
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


  /* ===== 9. ПАРАЛЛАКС ТЕКСТА HERO ЗА МЫШКОЙ ===== */
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


  /* ===== 10. MAGNETIC-КНОПКИ ===== */
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


  /* ===== 11. 3D-НАКЛОН КАРТОЧЕК + SPOTLIGHT (один раз!) ===== */
  (function tiltCards() {
    if (window.innerWidth < 768) return;
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rotY = (px - 0.5) * 10;
        const rotX = (0.5 - py) * 10;
        card.style.transform =
          `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  })();


  /* ===== 12. СТРЕЛКА "ЛИСТАЙ ВНИЗ" ===== */
  (function scrollHint() {
    const heroBlock = document.querySelector('.hero');
    if (!heroBlock || document.querySelector('.scroll-hint')) return;

    const hint = document.createElement('div');
    hint.className = 'scroll-hint';
    hint.innerHTML = '⌄';
    heroBlock.appendChild(hint);

    hint.addEventListener('click', () => {
      const next = heroBlock.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
  })();


  /* ===== 13. RIPPLE НА КНОПКАХ ===== */
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


  /* ===== 14. ПРОГРЕСС-БАР ЧТЕНИЯ + КНОПКА "НАВЕРХ" ===== */
  (function progressAndTopBtn() {
    const bar = document.createElement('div');
    bar.className = 'read-progress';
    document.body.appendChild(bar);

    const toTop = document.createElement('button');
    toTop.className = 'to-top';
    toTop.setAttribute('aria-label', 'Наверх');
    toTop.innerHTML = '↑';
    document.body.appendChild(toTop);

    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = percent + '%';

        if (scrollTop > 400) toTop.classList.add('show');
        else toTop.classList.remove('show');

        ticking = false;
      });
    });
  })();


  /* ===== 15. КАСТОМНЫЙ КУРСОР (точка + догоняющее кольцо) ===== */
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

    (function animate() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animate);
    })();

    document.querySelectorAll('a, button, .btn, .card, .fc').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('grow'));
      el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
    });
  })();

}); // DOMContentLoaded


/* ===== 16. ПРЕЛОАДЕР (вне DOMContentLoaded — стартует сразу) ===== */
(function preloader() {
  document.body.classList.add('loading');

  const pre = document.createElement('div');
  pre.className = 'preloader';
  pre.innerHTML = `
    <div class="preloader__logo">TEREK</div>
    <div class="preloader__bar"><span></span></div>
    <div class="preloader__num">0%</div>
  `;
  document.body.appendChild(pre);

  const num = pre.querySelector('.preloader__num');
  let p = 0;
  const counter = setInterval(() => {
    p += Math.floor(Math.random() * 12) + 4;
    if (p >= 100) { p = 100; clearInterval(counter); }
    num.textContent = p + '%';
  }, 130);

  window.addEventListener('load', () => {
    setTimeout(() => {
      pre.classList.add('hide');
      document.body.classList.remove('loading');
      setTimeout(() => pre.remove(), 800);
    }, 1900);
  });
})();
