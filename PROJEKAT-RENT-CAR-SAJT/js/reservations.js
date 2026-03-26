/**
 * Funkcije za upravljanje rezervacijama
 */

// Funkcija za inicijalizaciju prikaza rezervacija
function initReservations() {
    console.log('Inicijalizacija prikaza rezervacija');
    
    // Dodavanje event listenera za dugme "Moje rezervacije"
    const myReservationsButtons = document.querySelectorAll('[data-action="show-my-reservations"]');
    myReservationsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Provera da li je korisnik prijavljen
            if (!isUserLoggedIn()) {
                showAlert('Morate biti prijavljeni da biste videli rezervacije', 'error');
                openSimpleModal('loginModal');
                return;
            }
            
            // Prikazivanje rezervacija
            displayUserReservations();
            
            // Otvaranje modala za rezervacije
            openSimpleModal('userReservationsModal-1');
        });
    });
    
    // Dodavanje event listenera za otkazivanje rezervacije
    document.addEventListener('click', function(e) {
        if (e.target && e.target.closest('[data-action="cancel-reservation"]')) {
            const button = e.target.closest('[data-action="cancel-reservation"]');
            const reservationId = button.getAttribute('data-reservation-id');
            
            if (reservationId) {
                // Potvrda otkazivanja
                if (confirm('Da li ste sigurni da želite da otkažete ovu rezervaciju?')) {
                    // Otkazivanje rezervacije
                    const success = cancelReservation(reservationId);
                    
                    if (success) {
                        // Ažuriranje prikaza rezervacija
                        displayUserReservations();
                        
                        // Prikazivanje poruke o uspešnom otkazivanju
                        showAlert('Vaša rezervacija je uspešno otkazana', 'success');
                    }
                }
            }
        }
    });
}

// Inicijalizacija kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    initReservations();
});
