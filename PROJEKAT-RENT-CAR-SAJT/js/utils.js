/**
 * Utility funkcije za sajt
 */

// Funkcija za formatiranje datuma
function formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}.${month}.${year}.`;
}

// Funkcija za formatiranje cene
function formatPrice(price) {
    if (!price) return '0 €';
    
    return `${price} €`;
}

// Funkcija za dobijanje trenutne godine
function getCurrentYear() {
    return new Date().getFullYear();
}

// Postavljanje trenutne godine u footer
document.addEventListener('DOMContentLoaded', function() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = getCurrentYear();
    }
});
