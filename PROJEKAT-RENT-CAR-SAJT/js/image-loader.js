/**
 * Funkcije za učitavanje slika
 */

// Funkcija za odloženo učitavanje slika
function initLazyLoading() {
    console.log('Inicijalizacija odloženog učitavanja slika');
    
    // Pronalaženje svih slika sa data-src atributom
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    // Ako nema slika za odloženo učitavanje, prekidamo
    if (lazyImages.length === 0) {
        return;
    }
    
    // Kreiranje IntersectionObserver-a
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.removeAttribute('data-src');
                    imageObserver.unobserve(image);
                }
            });
        });
        
        // Posmatranje svake slike
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    } else {
        // Fallback za pregledače koji ne podržavaju IntersectionObserver
        lazyImages.forEach(image => {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
        });
    }
}

// Funkcija za postavljanje placeholder-a za slike koje nisu učitane
function handleImageErrors() {
    console.log('Inicijalizacija rukovanja greškama pri učitavanju slika');
    
    // Pronalaženje svih slika
    const images = document.querySelectorAll('img');
    
    // Dodavanje event listenera za greške pri učitavanju
    images.forEach(image => {
        image.addEventListener('error', function() {
            // Postavljanje placeholder slike
            if (!this.src.includes('placeholder')) {
                this.src = 'img/placeholder.jpg';
            }
        });
    });
}

// Inicijalizacija kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    handleImageErrors();
});
