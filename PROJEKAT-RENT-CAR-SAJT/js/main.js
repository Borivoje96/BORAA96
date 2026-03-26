/**
 * Glavna skripta koja inicijalizuje aplikaciju
 */

// Inicijalizacija kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicijalizacija aplikacije');
    
    // Inicijalizacija AOS biblioteke za animacije
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
    
    // Postavljanje trenutne godine u footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Inicijalizacija navigacije
    initNavigation();
    
    // Provera da li je korisnik prijavljen
    checkUserLoggedIn();
    
    // Inicijalizacija event listenera
    initEventListeners();
    
    console.log('Aplikacija je uspešno inicijalizovana');
});

// Inicijalizacija navigacije
function initNavigation() {
    // Smooth scroll za navigacione linkove
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Oduzimamo visinu navigacije
                    behavior: 'smooth'
                });
            } else if (targetId === '#hero' || targetId === '#home') {
                // Fallback: ako ne postoji sekcija, skroluj na vrh
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Provera da li je korisnik prijavljen
function checkUserLoggedIn() {
    // Proveravamo da li postoji korisnik u localStorage
    const user = localStorage.getItem('currentUser');
    
    if (user) {
        // Korisnik je prijavljen
        try {
            const userData = JSON.parse(user);
            updateUIForLoggedInUser(userData);
        } catch (error) {
            console.error('Greška pri parsiranju korisničkih podataka:', error);
            localStorage.removeItem('currentUser');
        }
    } else {
        // Korisnik nije prijavljen
        updateUIForLoggedOutUser();
    }
}

// Ažuriranje UI-a za prijavljenog korisnika
function updateUIForLoggedInUser(userData) {
    // Sakrivanje dugmadi za prijavu i registraciju
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.style.display = 'none';
    }
    
    // Prikazivanje korisničkog profila
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.style.display = 'flex';
        
        // Postavljanje korisničkog imena/emaila
        const userEmail = userProfile.querySelector('.user-email');
        if (userEmail) {
            userEmail.textContent = userData.email;
        }
    }
}

// Ažuriranje UI-a za odjavljenog korisnika
function updateUIForLoggedOutUser() {
    // Prikazivanje dugmadi za prijavu i registraciju
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.style.display = 'flex';
    }
    
    // Sakrivanje korisničkog profila
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.style.display = 'none';
    }
}

// Inicijalizacija event listenera
function initEventListeners() {
    // Event listener za login formu
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Pozivanje funkcije za prijavu iz auth.js
            if (typeof login === 'function') {
                login(email, password);
            } else {
                console.error('Funkcija login nije definisana');
            }
        });
    }
    
    // Event listener za register formu
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
            
            // Provera da li se lozinke poklapaju
            if (password !== passwordConfirm) {
                showErrorAlert('Lozinke se ne poklapaju');
                return;
            }
            
            // Pozivanje funkcije za registraciju iz auth.js
            if (typeof register === 'function') {
                register(name, email, password);
            } else {
                console.error('Funkcija register nije definisana');
            }
        });
    }
    
    // Event listener za korisnički meni
    const userInfoToggle = document.querySelector('.user-info[data-action="toggle-menu"]');
    if (userInfoToggle) {
        userInfoToggle.addEventListener('click', function() {
            console.log('Klik na korisnički meni');
            if (typeof window.toggleUserMenu === 'function') {
                window.toggleUserMenu();
            }
        });
    }
    
    // Event listeneri za akcije u korisničkom meniju
    document.addEventListener('click', function(e) {
        // Provera za dugme za odjavu
        if (e.target.closest('.menu-item[data-action="logout"]') || 
            e.target.closest('.logout-btn[data-action="logout"]')) {
            console.log('Klik na dugme za odjavu');
            if (typeof logout === 'function') {
                logout();
            }
        }
        
        // Provera za dugme za moje rezervacije
        if (e.target.closest('.menu-item[data-action="my-reservations"]')) {
            console.log('Klik na dugme za moje rezervacije');
            if (typeof showMyReservations === 'function') {
                showMyReservations();
            }
        }
    });
}
