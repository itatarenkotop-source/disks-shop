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
