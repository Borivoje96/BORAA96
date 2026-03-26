/**
 * Funkcije za upravljanje korisničkim profilom
 */

// Funkcija za inicijalizaciju korisničkog profila
function initUserProfile() {
    console.log('Inicijalizacija korisničkog profila');
    
    // Provera da li je korisnik prijavljen
    // Koristimo updateUI iz auth.js umesto lokalne implementacije
    if (typeof updateUI === 'function') {
        updateUI();
    }
    
    // Pronađi dugmad za odjavu
    const logoutButtons = document.querySelectorAll('[data-action="logout"]');
    console.log('Pronađena dugmad za odjavu:', logoutButtons.length);
    
    // Onemogućeno zbog nove implementacije
    /*
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Kliknuto na dugme za odjavu');
            
            // Koristimo logout iz auth.js
            if (typeof logout === 'function') {
                logout();
            } else {
                console.error('Funkcija logout nije dostupna!');
            }
        });
    });
    */
    console.log('Event listeneri za odjavu su onemogućeni u user-profile.js');
    
    // Dodavanje event listenera za toggle korisničkog menija
    const userInfoToggle = document.querySelector('.user-info');
    console.log('Pronađen element za toggle menija:', userInfoToggle);
    if (userInfoToggle) {
        userInfoToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Kliknuto na korisničko ime - toggle menija');
            // Koristimo toggleUserMenu iz auth.js ili lokalnu implementaciju
            if (typeof window.toggleUserMenu === 'function') {
                window.toggleUserMenu();
            } else {
                toggleUserMenuLocal();
            }
        });
    }
    
    // Zatvaranje korisničkog menija klikom van njega
    document.addEventListener('click', function(e) {
        const userMenu = document.querySelector('.user-menu');
        const userInfo = document.querySelector('.user-info');
        
        if (userMenu && userMenu.classList.contains('show') && 
            !userMenu.contains(e.target) && !userInfo.contains(e.target)) {
            console.log('Kliknuto van menija - zatvaranje menija');
            userMenu.classList.remove('show');
        }
    });
}

// Lokalna funkcija za toggle korisničkog menija (koristi se samo ako nije dostupna globalna)
function toggleUserMenuLocal() {
    console.log('Pozivanje lokalne toggleUserMenu funkcije');
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        console.log('Pronađen korisnički meni, trenutno stanje:', userMenu.classList.contains('show'));
        userMenu.classList.toggle('show');
        console.log('Novo stanje menija:', userMenu.classList.contains('show'));
    } else {
        console.log('Korisnički meni nije pronađen!');
    }
}

// Inicijalizacija kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM učitan - inicijalizacija korisničkog profila');
    initUserProfile();
});
