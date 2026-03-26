/**
 * DIREKTNO REŠENJE ZA REGISTRACIJU
 * Jednostavna implementacija koja će sigurno raditi
 */

// Sačekaj da se DOM učita
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicijalizacija direktnog rešenja za registraciju');
    
    // Konstante za localStorage
    const STORAGE_USERS_KEY = 'rent_car_users';
    const STORAGE_CURRENT_USER_KEY = 'rent_car_current_user';
    
    // Pronađi formu za registraciju
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        console.log('Forma za registraciju pronađena, dodajem event listener');
        
        // Dodaj event listener za submit forme
        registerForm.addEventListener('submit', function(e) {
            // Sprečavanje podrazumevanog ponašanja forme
            e.preventDefault();
            
            console.log('Forma za registraciju je poslata');
            
            // Direktno prikupljanje vrednosti iz polja
            const nameField = document.getElementById('registerName');
            const emailField = document.getElementById('registerEmail');
            const passwordField = document.getElementById('registerPassword');
            const confirmPasswordField = document.getElementById('registerPasswordConfirm');
            
            // Provera da li su svi elementi pronađeni
            if (!nameField || !emailField || !passwordField || !confirmPasswordField) {
                console.error('Neki od elemenata forme nije pronađen!');
                if (window.authAlerts) {
                    window.authAlerts.error('Došlo je do greške pri obradi forme', 'Greška sistema');
                } else {
                    alert('Došlo je do greške pri obradi forme');
                }
                return;
            }
            
            // Prikupljanje vrednosti
            const name = nameField.value.trim();
            const email = emailField.value.trim();
            const password = passwordField.value;
            const confirmPassword = confirmPasswordField.value;
            
            // Logovanje vrednosti za debugging (bez lozinke)
            console.log('Podaci forme:', { 
                name, 
                email, 
                passwordLength: password ? password.length : 0,
                confirmPasswordLength: confirmPassword ? confirmPassword.length : 0
            });
            
            // Validacija podataka
            if (!name) {
                showError('Molimo unesite vaše ime i prezime');
                return;
            }
            
            if (!email) {
                showError('Molimo unesite vašu email adresu');
                return;
            }
            
            if (!password) {
                showError('Molimo unesite lozinku');
                return;
            }
            
            if (!confirmPassword) {
                showError('Molimo potvrdite vašu lozinku');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Lozinke se ne podudaraju');
                return;
            }
            
            if (password.length < 6) {
                showError('Lozinka mora imati najmanje 6 karaktera');
                return;
            }
            
            // Provera da li korisnik već postoji
            const users = getUsers();
            if (users.some(u => u.email === email)) {
                showError('Korisnik sa ovom email adresom već postoji');
                return;
            }
            
            // Kreiraj novog korisnika
            const newUser = {
                id: Date.now().toString(),
                name: name,
                email: email,
                password: password,
                reservations: [],
                isAdmin: false
            };
            
            // Dodaj korisnika u listu
            users.push(newUser);
            localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
            
            // Automatski prijavi korisnika
            localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(newUser));
            
            // Zatvori modal
            if (window.hideAllModals) {
                window.hideAllModals();
            }
            
            // Prikaži poruku o uspešnoj registraciji
            showSuccess('Uspešno ste se registrovali');
            
            // Ažuriraj UI
            if (typeof updateUI === 'function') {
                updateUI();
            } else if (typeof window.updateUI === 'function') {
                window.updateUI();
            } else {
                // Ako funkcija updateUI nije dostupna, ažuriraj UI direktno
                const authButtons = document.querySelector('.auth-buttons');
                const userProfile = document.querySelector('.user-profile');
                
                if (authButtons) authButtons.style.display = 'none';
                if (userProfile) {
                    userProfile.style.display = 'flex';
                    const userNameElement = userProfile.querySelector('.user-name');
                    if (userNameElement) {
                        userNameElement.textContent = newUser.name;
                    }
                }
            }
        });
    } else {
        console.error('Forma za registraciju nije pronađena!');
    }
    
    // Pomoćna funkcija za prikazivanje greške
    function showError(message) {
        console.error('Greška pri registraciji:', message);
        if (window.authAlerts) {
            window.authAlerts.error(message, 'Greška pri registraciji');
        } else {
            alert('Greška: ' + message);
        }
    }
    
    // Pomoćna funkcija za prikazivanje uspešne poruke
    function showSuccess(message) {
        console.log('Uspeh:', message);
        if (window.authAlerts) {
            window.authAlerts.success(message, 'Uspešna registracija');
        } else {
            alert('Uspeh: ' + message);
        }
    }
    
    // Pomoćna funkcija za dobijanje liste korisnika
    function getUsers() {
        const usersData = localStorage.getItem(STORAGE_USERS_KEY);
        return usersData ? JSON.parse(usersData) : [];
    }
});
