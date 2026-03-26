/**
 * SAMOSTALNO REŠENJE ZA REGISTRACIJU
 * Potpuno nezavisna implementacija koja će sigurno raditi
 */

// Odmah se izvršava kada se skripta učita
(function() {
    console.log('Inicijalizacija samostalnog rešenja za registraciju');
    
    // Konstante za localStorage
    const STORAGE_USERS_KEY = 'rent_car_users';
    const STORAGE_CURRENT_USER_KEY = 'rent_car_current_user';
    
    // Funkcija koja se izvršava kada se DOM učita
    function init() {
        console.log('DOM učitan, inicijalizacija registracije');
        
        // Pronađi formu za registraciju
        const registerForm = document.getElementById('registerForm');
        
        if (registerForm) {
            console.log('Forma za registraciju pronađena, uklanjam postojeće listenere');
            
            // Uklanjanje svih postojećih event listenera
            const newForm = registerForm.cloneNode(true);
            registerForm.parentNode.replaceChild(newForm, registerForm);
            
            console.log('Dodajem novi event listener');
            
            // Dodaj novi event listener
            newForm.addEventListener('submit', handleRegistration);
        } else {
            console.error('Forma za registraciju nije pronađena!');
        }
    }
    
    // Funkcija za obradu registracije
    function handleRegistration(e) {
        // Sprečavanje podrazumevanog ponašanja forme
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Forma za registraciju je poslata');
        
        // Direktno prikupljanje vrednosti iz polja
        const nameField = document.getElementById('registerName');
        const emailField = document.getElementById('registerEmail');
        const passwordField = document.getElementById('registerPassword');
        const confirmPasswordField = document.getElementById('registerPasswordConfirm');
        
        // Provera da li su svi elementi pronađeni
        if (!nameField || !emailField || !passwordField || !confirmPasswordField) {
            console.error('Neki od elemenata forme nije pronađen!');
            showStandaloneAlert('Došlo je do greške pri obradi forme', 'error');
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
            showStandaloneAlert('Molimo unesite vaše ime i prezime', 'error');
            return;
        }
        
        if (!email) {
            showStandaloneAlert('Molimo unesite vašu email adresu', 'error');
            return;
        }
        
        if (!password) {
            showStandaloneAlert('Molimo unesite lozinku', 'error');
            return;
        }
        
        if (!confirmPassword) {
            showStandaloneAlert('Molimo potvrdite vašu lozinku', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showStandaloneAlert('Lozinke se ne podudaraju', 'error');
            return;
        }
        
        if (password.length < 6) {
            showStandaloneAlert('Lozinka mora imati najmanje 6 karaktera', 'error');
            return;
        }
        
        // Provera da li korisnik već postoji
        const users = getUsers();
        if (users.some(u => u.email === email)) {
            showStandaloneAlert('Korisnik sa ovom email adresom već postoji', 'error');
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
        hideModal();
        
        // Prikaži poruku o uspešnoj registraciji
        showStandaloneAlert('Uspešno ste se registrovali', 'success');
        
        // Ažuriraj UI
        updateUIAfterLogin(newUser);
    }
    
    // Funkcija za prikazivanje samostalnog obaveštenja
    function showStandaloneAlert(message, type) {
        console.log('Prikazujem samostalno obaveštenje:', message, type);
        
        // Kreiranje kontejnera za obaveštenja ako ne postoji
        let alertsContainer = document.getElementById('standaloneAlertsContainer');
        if (!alertsContainer) {
            alertsContainer = document.createElement('div');
            alertsContainer.id = 'standaloneAlertsContainer';
            alertsContainer.style.position = 'fixed';
            alertsContainer.style.top = '20px';
            alertsContainer.style.right = '20px';
            alertsContainer.style.zIndex = '10000';
            alertsContainer.style.display = 'flex';
            alertsContainer.style.flexDirection = 'column';
            alertsContainer.style.gap = '10px';
            document.body.appendChild(alertsContainer);
        }
        
        // Kreiranje obaveštenja
        const alert = document.createElement('div');
        alert.style.backgroundColor = type === 'success' ? '#10B981' : '#EF4444';
        alert.style.color = 'white';
        alert.style.padding = '15px 20px';
        alert.style.borderRadius = '8px';
        alert.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        alert.style.display = 'flex';
        alert.style.alignItems = 'center';
        alert.style.justifyContent = 'space-between';
        alert.style.minWidth = '300px';
        alert.style.maxWidth = '400px';
        alert.style.borderLeft = type === 'success' ? '5px solid #059669' : '5px solid #B91C1C';
        
        // Sadržaj obaveštenja
        alert.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 24px;">${type === 'success' ? '✅' : '❌'}</div>
                <div>
                    <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${type === 'success' ? 'Uspešno!' : 'Greška!'}</div>
                    <div style="font-size: 14px; opacity: 0.9;">${message}</div>
                </div>
            </div>
            <button style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; opacity: 0.7;">&times;</button>
        `;
        
        // Dodavanje u kontejner
        alertsContainer.appendChild(alert);
        
        // Dugme za zatvaranje
        const closeButton = alert.querySelector('button');
        closeButton.addEventListener('click', function() {
            alert.remove();
        });
        
        // Automatsko zatvaranje nakon 5 sekundi
        setTimeout(function() {
            if (alert.parentNode) {
                alert.style.opacity = '0';
                alert.style.transform = 'translateX(30px)';
                alert.style.transition = 'all 0.3s ease';
                
                setTimeout(function() {
                    if (alert.parentNode) {
                        alert.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Funkcija za sakrivanje modala
    function hideModal() {
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Ako postoji funkcija za sakrivanje svih modala, pozovi je
        if (typeof window.hideAllModals === 'function') {
            window.hideAllModals();
        }
    }
    
    // Funkcija za ažuriranje UI-a nakon prijave
    function updateUIAfterLogin(user) {
        const authButtons = document.querySelector('.auth-buttons');
        const userProfile = document.querySelector('.user-profile');
        
        if (authButtons) authButtons.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'flex';
            const userNameElement = userProfile.querySelector('.user-name');
            if (userNameElement) {
                userNameElement.textContent = user.name;
            }
        }
        
        // Ako postoji funkcija za ažuriranje UI-a, pozovi je
        if (typeof window.updateUI === 'function') {
            window.updateUI();
        }
    }
    
    // Pomoćna funkcija za dobijanje liste korisnika
    function getUsers() {
        const usersData = localStorage.getItem(STORAGE_USERS_KEY);
        return usersData ? JSON.parse(usersData) : [];
    }
    
    // Inicijalizacija kada se DOM učita
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
