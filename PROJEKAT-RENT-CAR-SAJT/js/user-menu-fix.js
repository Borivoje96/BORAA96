/**
 * DIREKTNO REŠENJE ZA KORISNIČKI MENI
 * Jednostavna implementacija koja će sigurno raditi
 */

// Sačekaj da se DOM učita
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicijalizacija korisničkog menija - direktno rešenje');
    
    // Funkcija za prikazivanje korisničkog menija
    function showUserMenu() {
        console.log('Prikazivanje korisničkog menija');
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.style.display = 'block';
            userMenu.style.zIndex = '9999';
            userMenu.style.position = 'absolute';
            userMenu.style.top = '100%';
            userMenu.style.right = '0';
            userMenu.style.width = '200px';
            userMenu.style.backgroundColor = '#1a2234';
            userMenu.style.borderRadius = '4px';
            userMenu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
            userMenu.style.marginTop = '10px';
        }
    }
    
    // Funkcija za sakrivanje korisničkog menija
    function hideUserMenu() {
        console.log('Sakrivanje korisničkog menija');
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.style.display = 'none';
        }
    }
    
    // Globalna funkcija za toggle korisničkog menija
    window.toggleUserMenuDirect = function() {
        console.log('Toggle korisničkog menija - direktno');
        const userMenu = document.querySelector('.user-menu');
        if (userMenu && userMenu.style.display === 'block') {
            hideUserMenu();
        } else {
            showUserMenu();
        }
    };
    
    // Dodavanje event listenera za klik na korisničko ime
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        console.log('Dodavanje event listenera za korisnički meni');
        userInfo.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.toggleUserMenuDirect();
        });
    }
    
    // Dodavanje event listenera za dugme za odjavu
    const logoutBtn = document.querySelector('[data-action="logout"]');
    if (logoutBtn) {
        // Onemogućeno zbog nove implementacije
        /*
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof logout === 'function') {
                logout();
            } else if (typeof window.logout === 'function') {
                window.logout();
            } else {
                console.error('Funkcija za odjavu nije pronađena!');
                localStorage.removeItem('rent_car_current_user');
                location.reload();
            }
        });
        */
        console.log('Event listener za odjavu je onemogućen u user-menu-fix.js');
    }
    
    // Zatvaranje korisničkog menija klikom van njega
    document.addEventListener('click', function(e) {
        const userMenu = document.querySelector('.user-menu');
        const userInfo = document.querySelector('.user-info');
        
        if (userMenu && 
            userMenu.style.display === 'block' && 
            !userMenu.contains(e.target) && 
            !userInfo.contains(e.target)) {
            hideUserMenu();
        }
    });
    
    // Inicijalno sakrivanje korisničkog menija
    hideUserMenu();
});
