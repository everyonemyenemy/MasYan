/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader')?.classList.add('hidden'), 900);
});

/* ===== CURSOR ===== */
const isTouch = window.matchMedia('(hover: none)').matches;
if (!isTouch) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function loop() {
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        if (dot) dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, [data-cursor], input, select').forEach(el => {
        el.addEventListener('mouseenter', () => ring?.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring?.classList.remove('hover'));
    });
}

/* ===== AGE MODAL ===== */
function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}
function unlockScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
}

const ageModal = document.getElementById('ageModal');
if (ageModal) {
    if (!localStorage.getItem('ageVerified')) {
        ageModal.classList.add('active');
        lockScroll();
    }
    document.getElementById('ageYes')?.addEventListener('click', () => {
        localStorage.setItem('ageVerified', 'true');
        ageModal.classList.remove('active');
        unlockScroll();
    });
    document.getElementById('ageNo')?.addEventListener('click', () => {
        window.location.href = 'https://ya.ru';
    });
}

/* ===== HEADER SCROLL ===== */
const header = document.getElementById('header');
const progressBar = document.getElementById('progressBar');
const toTop = document.getElementById('toTop');

function onScroll() {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 40);
    if (progressBar) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (y / h) * 100 + '%';
    }
    toTop?.classList.toggle('visible', y > 700);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ===== PARALLAX ===== */
const parallaxEls = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    parallaxEls.forEach(el => {
        el.style.transform = `translateY(${y * parseFloat(el.dataset.parallax)}px)`;
    });
}, { passive: true });

/* ===== REVEAL ===== */
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => io.observe(el));

/* ===== FAQ ===== */
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

/* ===== MOBILE MENU ===== */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger?.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu?.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});
mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        burger?.classList.remove('active');
        mobileMenu?.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

/* ===== TO TOP ===== */
toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== TELEGRAM FORM ===== */
// 🔧 ЗАМЕНИ ЭТИ ДВЕ СТРОЧКИ НА СВОИ ДАННЫЕ 🔧
const TELEGRAM_BOT_TOKEN = '8628000505:AAFfkwEd0fQqjl6ZkplkPbI13x7IJGEGAMk';
const TELEGRAM_CHAT_ID = '8242474734';

const form = document.getElementById('callbackForm');
const messageDiv = document.getElementById('formMessage');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = form.querySelector('input[type="text"]').value.trim();
        const phone = form.querySelector('input[type="tel"]').value.trim();
        const service = form.querySelector('select')?.value || '';

        if (!name || !phone) {
            messageDiv.textContent = 'Заполните имя и телефон';
            messageDiv.className = 'form-message error';
            return;
        }

        const text = `🆕 НОВАЯ ЗАЯВКА\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n💆 ${service}`;

        if (TELEGRAM_BOT_TOKEN === 'ВАШ_ТОКЕН_БОТА') {
            messageDiv.textContent = 'Демо-режим: укажите токен бота в script.js';
            messageDiv.className = 'form-message warning';
            form.reset();
            return;
        }

        try {
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(text)}`;
            const response = await fetch(url);
            const result = await response.json();
            if (result.ok) {
                messageDiv.textContent = 'Заявка отправлена. Свяжемся с вами.';
                messageDiv.className = 'form-message success';
                form.reset();
            } else throw new Error();
        } catch {
            messageDiv.textContent = 'Ошибка. Позвоните или напишите в Telegram.';
            messageDiv.className = 'form-message error';
        }
    });
}

/* ==========================================================
   GIRL MODAL — листание фото девушек
   ========================================================== */
const girlsData = [
    {
        name: 'Юля',
        params: ['23 года', '50кг', 'грудь 3'],
        photos: ['girl1.jpg', 'girl1-2.jpg', 'girl1-3.jpg']
    },
    {
        name: 'Соня',
        params: ['25 лет', '52 кг', 'грудь 2'],
        photos: ['girl2.jpg', 'girl2-2.jpg']
    },
    {
        name: 'Рита',
        params: ['18 лет', '55 кг', 'грудь 2'],
        photos: ['girl3.jpg', 'girl3-2.jpg', 'girl3-3.jpg']
    },
    {
        name: 'Ангелина',
        params: ['22 года', '58кг', 'грудь 3'],
        photos: ['girl4.jpg', 'girl4-2.jpg', 'girl4-3.jpg']
    },
    {
        name: 'Василина',
        params: ['24 года', '50 кг', 'грудь 2'],
        photos: ['girl5.jpg', 'girl5-2.jpg']
    },
];

const girlModal = document.getElementById('girlModal');
const girlModalImg = document.getElementById('girlModalImg');
const girlModalName = document.getElementById('girlModalName');
const girlModalParams = document.getElementById('girlModalParams');
const girlModalCounter = document.getElementById('girlModalCounter');
const girlModalPrev = document.getElementById('girlModalPrev');
const girlModalNext = document.getElementById('girlModalNext');
const girlModalClose = document.getElementById('girlModalClose');

let currentGirl = 0;
let currentPhoto = 0;

function openGirlModal(index) {
    currentGirl = index;
    currentPhoto = 0;
    renderGirlPhoto();
    girlModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeGirlModal() {
    girlModal.classList.remove('active');
    document.body.style.overflow = '';
}

function renderGirlPhoto() {
    const girl = girlsData[currentGirl];
    const total = girl.photos.length;

    girlModalImg.src = girl.photos[currentPhoto];
    girlModalName.textContent = girl.name;
    girlModalParams.innerHTML = girl.params.map(p => `<span>${p}</span>`).join('');
    girlModalCounter.textContent = `${currentPhoto + 1} / ${total}`;

    girlModalPrev.disabled = total <= 1;
    girlModalNext.disabled = total <= 1;
}

document.querySelectorAll('[data-girl]').forEach(card => {
    card.addEventListener('click', () => {
        openGirlModal(parseInt(card.dataset.girl));
    });
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openGirlModal(parseInt(card.dataset.girl));
        }
    });
});

girlModalPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    const total = girlsData[currentGirl].photos.length;
    currentPhoto = (currentPhoto - 1 + total) % total;
    renderGirlPhoto();
});

girlModalNext.addEventListener('click', (e) => {
    e.stopPropagation();
    const total = girlsData[currentGirl].photos.length;
    currentPhoto = (currentPhoto + 1) % total;
    renderGirlPhoto();
});

girlModalClose.addEventListener('click', closeGirlModal);

girlModal.addEventListener('click', (e) => {
    if (e.target === girlModal) closeGirlModal();
});

document.addEventListener('keydown', (e) => {
    if (!girlModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeGirlModal();
});