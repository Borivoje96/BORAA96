/**
 * Funkcije za filtriranje vozila
 */

// Funkcija za inicijalizaciju filtera
function initFilters() {
    console.log('Inicijalizacija filtera');
    
    // Dodavanje event listenera za filtere
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Uklanjanje aktivne klase sa svih dugmadi
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // Dodavanje aktivne klase na kliknuto dugme
            this.classList.add('active');
            
            // Filtriranje vozila
            const filter = this.getAttribute('data-filter');
            if (typeof filterCars === 'function') {
                filterCars(filter);
            } else {
                console.error('Funkcija filterCars nije definisana');
            }
        });
    });
}

// Inicijalizacija kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    initFilters();
});
