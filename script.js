const products = [
    { id:1, name:"Vossen CV3", type:"Литые", diameter:18, price:24900, img:"disk1.jpg" },
    { id:2, name:"BBS LM", type:"Кованые", diameter:17, price:38900, img:"disk2.jpg" },
    { id:3, name:"Enkei RPF1", type:"Литые", diameter:16, price:15900, img:"disk3.jpg" },
    { id:4, name:"Work Emotion", type:"Кованые", diameter:18, price:42900, img:"disk4.jpg" },
    { id:5, name:"Replica Toyota", type:"Штампованные", diameter:15, price:8900, img:"disk5.jpg" },
    { id:6, name:"Rays TE37", type:"Кованые", diameter:17, price:35900, img:"disk6.jpg" },
];

let cart = [];

function renderProducts(list) {
    const container = document.getElementById('products');
    container.innerHTML = '';
    if (list.length === 0) {
        container.innerHTML = '<p style="color:#9a9a9a;text-align:center;grid-column:1/-1;padding:60px 0;">Ничего не найдено</p>';
        return;
    }
    list.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="img-wrap">
                <img src="${p.img}" alt="${p.name}" loading="lazy"
                     onerror="this.onerror=null;this.src='https://placehold.co/600x400/1a1a1a/c9a96a?text=${encodeURIComponent(p.name)}';">
            </div>
            <div class="product-info">
                <span class="product-tag">${p.type}</span>
                <h3>${p.name}</h3>
                <div class="product-specs">Диаметр R${p.diameter}</div>
                <div class="product-bottom">
                    <div class="product-price">${p.price.toLocaleString()} ₽</div>
                    <button class="add-btn" onclick="addToCart(${p.id})">+</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    initTilt();
}

function filterProducts() {
    const d = document.getElementById('filter-diameter').value;
    const t = document.getElementById('filter-type').value;
    const filtered = products.filter(p =>
        (d === 'all' || p.diameter == d) &&
        (t === 'all' || p.type === t)
    );
    renderProducts(filtered);
}

function addToCart(id) {
    cart.push(products.find(p => p.id === id));
    updateCart();
    openCart();
}
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}
function updateCart() {
    document.getElementById('cart-count').textContent = cart.length;
    const box = document.getElementById('cart-items');
    box.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        box.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
    } else {
        cart.forEach((item, i) => {
            total += item.price;
            box.innerHTML += `
                <div class="cart-item">
                    <div>
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-specs">${item.type} · R${item.diameter}</div>
                    </div>
                    <div class="cart-item-price">
                        ${item.price.toLocaleString()} ₽
                        <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
                    </div>
                </div>`;
        });
    }
    document.getElementById('cart-total').textContent = total.toLocaleString() + ' ₽';
}
function openCart() {
    document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
}
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('open');
}
function checkout() {
    if (cart.length === 0) {
        alert('Корзина пуста');
        return;
    }
    const total = cart.reduce((s, p) => s + p.price, 0);
    alert(`Спасибо за заказ!\nСумма: ${total.toLocaleString()} ₽\nНаш эксперт свяжется с вами в течение 15 минут.`);
    cart = [];
    updateCart();
    toggleCart();
}

function submitForm(e) {
    e.preventDefault();
    alert('Заявка отправлена! Эксперт перезвонит вам в течение 15 минут.');
    e.target.reset();
}

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const panelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, { threshold: 0.12 });

function observePanels() {
    document.querySelectorAll('.panel').forEach(el => panelObserver.observe(el));
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

function observeReveals() {
    document.querySelectorAll('.reveal:not(.active)').forEach(el => revealObserver.observe(el));
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'));
            let current = 0;
            const step = Math.max(1, Math.floor(target / 60));
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current.toLocaleString();
            }, 25);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

function observeStats() {
    document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));
}

/* ===== 3D-НАКЛОН КАРТОЧЕК ПРИ НАВЕДЕНИИ ===== */
function initTilt() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -6;
            const rotY = ((x - cx) / cx) * 6;
            card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* ===== ПЕЧАТАЮЩИЙСЯ ТЕКСТ В HERO ===== */
function typeText(el, text, speed, callback) {
    let i = 0;
    function step() {
        if (i <= text.length) {
            el.textContent = text.slice(0, i);
            i++;
            setTimeout(step, speed);
        } else if (callback) {
            callback();
        }
    }
    step();
}

function startTyping() {
    const line1 = document.getElementById('typed-1');
    const line2 = document.getElementById('typed-2');
    if (!line1 || !line2) return;

    // мигающий курсор на второй строке
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    cursor.innerHTML = '&nbsp;';

    line1.parentElement.appendChild(cursor);

    typeText(line1, 'ИСКУССТВО', 80, () => {
        // переносим курсор на вторую строку
        line2.parentElement.appendChild(cursor);
        typeText(line2, 'В КАЖДОЙ ДЕТАЛИ', 80, () => {
            setTimeout(() => cursor.remove(), 600);
        });
    });
}

/* ===== КАСТОМНЫЙ КУРСОР ===== */
function initCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    // плавное "догоняющее" движение кольца
    function animateRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // увеличение при наведении на кликабельное
    const hoverTargets = 'a, button, select, input, .product-card, .add-btn';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
            ring.classList.add('hover');
            dot.classList.add('hover');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
            ring.classList.remove('hover');
            dot.classList.remove('hover');
        }
    });
}

/* ===== СКРЫТИЕ ЗАГРУЗОЧНОГО ЭКРАНА ===== */
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    setTimeout(() => {
        preloader.classList.add('hide');
        startTyping(); // печать стартует после ухода загрузки
    }, 2000);
}

/* ===== ЗАПУСК ===== */
renderProducts(products);
observePanels();
observeReveals();
observeStats();
updateCart();
initCursor();
window.addEventListener('load', hidePreloader);
