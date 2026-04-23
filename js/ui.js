/* ===================== NAVBAR ===================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.add('open');
});
function closeMobile() {
    document.getElementById('mobileMenu').classList.remove('open');
}
document.getElementById('mobileClose').addEventListener('click', closeMobile);

/* ===================== SCROLL REVEAL ===================== */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));

/* ===================== COUNTER ANIMATION ===================== */
const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if(e.isIntersecting) {
            e.target.querySelectorAll('[data-target]').forEach(el => {
                const target = +el.dataset.target;
                const suffix = target >= 1000 ? '+' : '+';
                let current = 0;
                const step = target / 60;
                const timer = setInterval(() => {
                    current = Math.min(current+step, target);
                    el.textContent = Math.floor(current) + suffix;
                    if(current >= target) clearInterval(timer);
                }, 20);
            });
            statsObs.unobserve(e.target);
        }
    });
}, { threshold: 0.4 });
document.querySelector('.stats-container') && statsObs.observe(document.querySelector('.stats-container'));

/* ===================== FOOTER YEAR ===================== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===================== SMOOTH SCROLL ===================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
});
