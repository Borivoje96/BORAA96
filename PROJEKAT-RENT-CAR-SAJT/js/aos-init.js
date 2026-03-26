/**
 * Inicijalizacija AOS (Animate On Scroll) biblioteke
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicijalizacija AOS biblioteke
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    } else {
        console.warn('AOS biblioteka nije učitana');
    }
});
