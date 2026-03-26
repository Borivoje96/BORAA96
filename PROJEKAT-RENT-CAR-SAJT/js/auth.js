/**
 * Jednostavan sistem za autentifikaciju korisnika
 * Koristi localStorage za čuvanje podataka o korisnicima
 */

// Globalne promenljive i konstante
const STORAGE_USERS_KEY = 'users';
const STORAGE_CURRENT_USER_KEY = 'currentUser';
const ADMIN_EMAIL = 'admin@rentcar.com';
const ADMIN_PASSWORD = 'admin123';

// Funkcija za prijavu korisnika
function login(email, password) {
    console.log('Pokušaj prijave za:', email);
    
    // Uklanjanje svih postojećih obaveštenja pre prikazivanja novog
    if (window.authAlerts && window.authAlerts.clear) {
        window.authAlerts.clear();
    }
    
    // Validacija unosa
    if (!email || !password) {
        window.authAlerts.error('Molimo unesite email i lozinku', 'Nepotpuni podaci');
        return false;
    }
    
    // Provera admin kredencijala
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
            id: 'admin',
            email: email,
            name: 'Administrator',
            isAdmin: true
        };
        
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(adminUser));
        updateUI();
        
        // Zatvaranje modala
        window.hideAllModals();
        
        window.authAlerts.success('Uspešno ste se prijavili kao administrator', 'Dobrodošli!');
        
        // Provera da li postoji sačuvani ID vozila za rezervaciju
        // Pozivamo sa odlaganjem da bi se izbeglo preklapanje poruka
        setTimeout(() => {
            checkPendingReservation();
        }, 300);
        
        return true;
    }
    
    // Provera da li korisnik postoji
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Sačuvaj korisnika u localStorage
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
        
        // Ažuriraj UI
        updateUI();
        
        // Zatvori modal
        window.hideAllModals();
        
        // Prikaži poruku o uspešnoj prijavi
        window.authAlerts.success('Uspešno ste se prijavili', 'Dobrodošli nazad!');
        
        // Provera da li postoji sačuvani ID vozila za rezervaciju
        // Pozivamo sa odlaganjem da bi se izbeglo preklapanje poruka
        setTimeout(() => {
            checkPendingReservation();
        }, 300);
        
        return true;
    } else {
        window.authAlerts.error('Pogrešan email ili lozinka', 'Neuspešna prijava');
        return false;
    }
}

// Funkcija za registraciju korisnika
function register(name, email, password, confirmPassword) {
    console.log('Pokušaj registracije za:', email);
    
    // Uklanjanje svih postojećih obaveštenja pre prikazivanja novog
    if (window.authAlerts && window.authAlerts.clear) {
        window.authAlerts.clear();
    }
    
    // Detaljnija validacija unosa
    if (!name || name.trim() === '') {
        window.authAlerts.error('Molimo unesite vaše ime i prezime', 'Nepotpuni podaci');
        return false;
    }
    
    if (!email || email.trim() === '') {
        window.authAlerts.error('Molimo unesite vašu email adresu', 'Nepotpuni podaci');
        return false;
    }
    
    if (!password) {
        window.authAlerts.error('Molimo unesite lozinku', 'Nepotpuni podaci');
        return false;
    }
    
    if (!confirmPassword) {
        window.authAlerts.error('Molimo potvrdite vašu lozinku', 'Nepotpuni podaci');
        return false;
    }
    
    if (password !== confirmPassword) {
        window.authAlerts.error('Lozinke se ne podudaraju', 'Greška pri unosu');
        return false;
    }
    
    // Provera dužine lozinke
    if (password.length < 6) {
        window.authAlerts.error('Lozinka mora imati najmanje 6 karaktera', 'Slaba lozinka');
        return false;
    }
    
    // Provera da li korisnik već postoji
    const users = getUsers();
    if (users.some(u => u.email === email)) {
        window.authAlerts.error('Korisnik sa ovom email adresom već postoji', 'Nalog već postoji');
        return false;
    }
    
    // Kreiraj novog korisnika
    const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
        password: password,
        reservations: [],
        isAdmin: false
    };
    
    // Dodaj korisnika u listu
    users.push(newUser);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    
    // Automatski prijavi korisnika
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(newUser));
    updateUI();
    
    // Zatvori modal
    window.hideAllModals();
    
    // Prikaži poruku o uspešnoj registraciji
    window.authAlerts.success('Uspešno ste se registrovali', 'Dobrodošli!');
    return true;
}

// Funkcija za odjavu korisnika
function logout() {
    // Uklanjanje svih postojećih obaveštenja pre prikazivanja novog
    if (window.authAlerts && window.authAlerts.clear) {
        window.authAlerts.clear();
    }
    
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    updateUI();
    window.authAlerts.success('Uspešno ste se odjavili', 'Dovidjenja!');
    
    // Preusmeravanje sa admin stranice ako je korisnik na njoj
    if (window.location.href.includes('admin.html')) {
        window.location.href = 'index.html';
    }
}

// Funkcija za prikazivanje rezervacija korisnika
function showMyReservations() {
    console.log('Prikazivanje rezervacija korisnika');
    
    if (!isUserLoggedIn()) {
        if (window.authAlerts) {
            window.authAlerts.error('Morate biti prijavljeni da biste videli rezervacije', 'Niste prijavljeni');
        } else {
            alert('Morate biti prijavljeni da biste videli rezervacije');
        }
        return;
    }
    
    // Prikazivanje rezervacija korisnika
    if (typeof displayUserReservations === 'function') {
        displayUserReservations();
    } else {
        console.error('Funkcija displayUserReservations nije dostupna');
    }
    
    // Otvaranje modalnog prozora za rezervacije
    // Pokušaj sa svim poznatim funkcijama za otvaranje modalnih prozora
    if (typeof window.openSimpleModal === 'function') {
        window.openSimpleModal('userReservationsModal-1');
    } else if (typeof window.showModal === 'function') {
        window.showModal('userReservationsModal-1');
    } else if (typeof window.openModal === 'function') {
        window.openModal('userReservationsModal-1');
    } else {
        // Direktna manipulacija DOM-a ako nijedna funkcija nije dostupna
        const modal = document.getElementById('userReservationsModal-1');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Modalni prozor za rezervacije nije pronađen');
        }
    }
}

// Pomoćna funkcija za dobijanje liste korisnika
function getUsers() {
    const usersData = localStorage.getItem(STORAGE_USERS_KEY);
    return usersData ? JSON.parse(usersData) : [];
}

// Funkcija za proveru da li je korisnik prijavljen
function isUserLoggedIn() {
    return localStorage.getItem(STORAGE_CURRENT_USER_KEY) !== null;
}

// Funkcija za ažuriranje UI-a na osnovu statusa prijave
function updateUI() {
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_CURRENT_USER_KEY));
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.querySelector('.user-profile');
    
    if (currentUser) {
        // Korisnik je prijavljen
        if (authButtons) authButtons.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'flex';
            const userNameElement = userProfile.querySelector('.user-name');
            if (userNameElement) {
                userNameElement.textContent = currentUser.name;
            }
        }
    } else {
        // Korisnik nije prijavljen
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
    }
}

// Funkcija za prikazivanje obaveštenja - ONEMOGUĆENA da bi se sprečilo dupliranje
function showAlert(message, type) {
    console.log('Stara showAlert funkcija je onemogućena da bi se sprečilo dupliranje poruka');
    // Ne radimo ništa, koristimo samo window.authAlerts
}

// Funkcija za prikazivanje/sakrivanje korisničkog menija
function toggleUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.classList.toggle('active');
    }
}

// Funkcija za proveru i otvaranje rezervacije nakon prijave
function checkPendingReservation() {
    // Funkcija je onemogućena jer korisnik ne želi automatsko otvaranje prozora
    console.log('Automatsko otvaranje prozora za rezervaciju je onemogućeno po zahtevu korisnika');
    
    // Obriši sačuvani ID ako postoji
    if (sessionStorage.getItem('pendingReservationCarId')) {
        sessionStorage.removeItem('pendingReservationCarId');
    }
}

// Funkcija za zatvaranje modalnih prozora
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Globalne funkcije za pristup iz HTML-a
window.updateUI = updateUI;
window.login = login;
window.register = register;

// Inicijalizacija pri učitavanju stranice
document.addEventListener('DOMContentLoaded', () => {
    // Provera statusa prijave i ažuriranje UI-a
    updateUI();
    
    // Event listener za prijavu
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            login(email, password);
        });
    }
    
    // Event listener za registraciju
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            register(name, email, password, confirmPassword);
        });
    }
    
    // Event listener za odjavu
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Event listener za prikaz rezervacija
    const myReservationsBtn = document.querySelector('[data-action="my-reservations"]');
    if (myReservationsBtn) {
        myReservationsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showMyReservations();
        });
    }
    
    // Event listener za toggle korisničkog menija
    const userInfoToggle = document.querySelector('[data-action="toggle-menu"]');
    if (userInfoToggle) {
        userInfoToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleUserMenu();
        });
    }
    
    // Globalni event listener za odjavu
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-action="logout"]');
        if (target) {
            e.preventDefault();
            logout();
        }
    });
});
