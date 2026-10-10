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