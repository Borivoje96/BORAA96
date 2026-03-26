/**
 * Jednostavne animacije za sajt
 * Napomena: Koristimo minimalne animacije da izbegnemo probleme
 */

// Funkcija za inicijalizaciju animacija
function initAnimations() {
    console.log('Inicijalizacija animacija');
    
    // Smooth scroll za navigacione linkove - UKLONJENO radi konflikta
    
    // Animacija za brojače (statistike)
    const statsElements = document.querySelectorAll('.stat-value');
    if (statsElements.length > 0) {
        animateStats(statsElements);
    }
}

// Funkcija za animaciju brojača
function animateStats(elements) {
    elements.forEach(element => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // 2 sekunde
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Inicijalizacija kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
});
