/**
 * POTPUNO NOVO REŠENJE ZA REGISTRACIJU
 * Radi samo sa novom formom sa ID-om "newRegisterForm"
 */

// Odmah se izvršava kada se skripta učita
(function() {
    console.log('Inicijalizacija potpuno novog rešenja za registraciju');
    
    // Konstante za localStorage
    // Usklađeno sa auth.js: koristi iste ključeve za localStorage
    const STORAGE_USERS_KEY = 'users';
    const STORAGE_CURRENT_USER_KEY = 'currentUser';
    
    // Jedinstveni ID za kontejner obaveštenja
    const ALERTS_CONTAINER_ID = 'newRegisterAlertsContainer';
    
    // Funkcija koja se izvršava kada se DOM učita
    function init() {
        console.log('DOM učitan, inicijalizacija nove registracije');
        
        // Pronađi novu formu za registraciju
        const newRegisterForm = document.getElementById('newRegisterForm');
        
        if (newRegisterForm) {
            console.log('Nova forma za registraciju pronađena');
            
            // Dodaj event listener za submit forme
            newRegisterForm.addEventListener('submit', handleRegistration);
        } else {
            console.error('Nova forma za registraciju nije pronađena!');
        }
        
        // Inicijalizacija forme za prijavu
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('Forma za prijavu pronađena');
            
            // Uklanjanje svih postojećih event listenera
            const newLoginForm = loginForm.cloneNode(true);
            loginForm.parentNode.replaceChild(newLoginForm, loginForm);
            
            // Dodaj event listener za submit forme
            newLoginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Forma za prijavu je poslata');
                
                // Ukloni sva postojeća obaveštenja
                removeAllAlerts();
                
                // Direktno prikupljanje vrednosti iz polja
                const emailField = document.getElementById('loginEmail');
                const passwordField = document.getElementById('loginPassword');
                
                // Provera da li su svi elementi pronađeni
                if (!emailField || !passwordField) {
                    console.error('Neki od elemenata forme za prijavu nije pronađen!');
                    showAlert('Došlo je do greške pri obradi forme', 'error');
                    return;
                }
                
                // Prikupljanje vrednosti
                const email = emailField.value.trim();
                const password = passwordField.value;
                
                // Validacija podataka
                if (!email) {
                    showAlert('Molimo unesite vašu email adresu', 'error');
                    return;
                }
                
                if (!password) {
                    showAlert('Molimo unesite lozinku', 'error');
                    return;
                }
                
                // Pozivanje funkcije za prijavu
                handleLogin(email, password);
            });
        }
        
        // Inicijalizacija dugmeta za odjavu
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            console.log('Dugme za odjavu pronađeno');
            
            // Uklanjanje svih postojećih event listenera
            const newLogoutButton = logoutButton.cloneNode(true);
            logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);
            
            // Dodaj event listener za klik
            newLogoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Dugme za odjavu je kliknuto');
                
                // Ukloni sva postojeća obaveštenja
                removeAllAlerts();
                
                // Pozivanje funkcije za odjavu
                handleLogout();
            });
        }
    }
    
    // Funkcija za obradu registracije
    function handleRegistration(e) {
        // Sprečavanje podrazumevanog ponašanja forme
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Nova forma za registraciju je poslata');
        
        // Ukloni sva postojeća obaveštenja
        removeAllAlerts();
        
        // Direktno prikupljanje vrednosti iz polja
        const nameField = document.getElementById('newRegisterName');
        const emailField = document.getElementById('newRegisterEmail');
        const passwordField = document.getElementById('newRegisterPassword');
        const confirmPasswordField = document.getElementById('newRegisterPasswordConfirm');
        
        // Provera da li su svi elementi pronađeni
        if (!nameField || !emailField || !passwordField || !confirmPasswordField) {
            console.error('Neki od elemenata nove forme nije pronađen!');
            showAlert('Došlo je do greške pri obradi forme', 'error');
            return;
        }
        
        // Prikupljanje vrednosti
        const name = nameField.value.trim();
        const email = emailField.value.trim();
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;
        
        // Logovanje vrednosti za debugging (bez lozinke)
        console.log('Podaci nove forme:', { 
            name, 
            email, 
            passwordLength: password ? password.length : 0,
            confirmPasswordLength: confirmPassword ? confirmPassword.length : 0
        });
        
        // Validacija podataka
        if (!name) {
            showAlert('Molimo unesite vaše ime i prezime', 'error');
            return;
        }
        
        if (!email) {
            showAlert('Molimo unesite vašu email adresu', 'error');
            return;
        }
        
        if (!password) {
            showAlert('Molimo unesite lozinku', 'error');
            return;
        }
        
        if (!confirmPassword) {
            showAlert('Molimo potvrdite vašu lozinku', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showAlert('Lozinke se ne podudaraju', 'error');
            return;
        }
        
        if (password.length < 6) {
            showAlert('Lozinka mora imati najmanje 6 karaktera', 'error');
            return;
        }
        
        // Provera da li korisnik već postoji
        const users = getUsers();
        console.log('Provera postojećeg korisnika. Broj korisnika u bazi:', users.length);
        
        // Detaljnija provera za postojeći email
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            console.error('Korisnik sa email adresom', email, 'već postoji!');
            showAlert('Korisnik sa ovom email adresom već postoji', 'error');
            return;
        }
        
        // Koristi centralizovanu register funkciju iz auth.js za upis i automatsku prijavu
        if (window.register) {
            window.register(name, email, password, confirmPassword);
        } else {
            showAlert('Greška: Nije moguće registrovati korisnika. Probajte ponovo.', 'error');
        }
        return;
    }
    
    // Funkcija za prikazivanje obaveštenja
    function showAlert(message, type) {
        console.log('Prikazujem obaveštenje:', message, type);
        
        // Ukloni sva postojeća obaveštenja
        removeAllAlerts();
        
        // Kreiranje kontejnera za obaveštenja ako ne postoji
        let alertsContainer = document.getElementById(ALERTS_CONTAINER_ID);
        if (!alertsContainer) {
            alertsContainer = document.createElement('div');
            alertsContainer.id = ALERTS_CONTAINER_ID;
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
    
    // Funkcija za uklanjanje svih obaveštenja
    function removeAllAlerts() {
        const alertsContainer = document.getElementById(ALERTS_CONTAINER_ID);
        if (alertsContainer) {
            while (alertsContainer.firstChild) {
                alertsContainer.removeChild(alertsContainer.firstChild);
            }
        }
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
        } else {
            // Alternativni način za sakrivanje modala
            const modals = document.querySelectorAll('.modal');
            modals.forEach(function(modal) {
                modal.style.display = 'none';
            });
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
    
    // Funkcija za obradu prijave
    function handleLogin(email, password) {
        console.log('Pokušaj prijave za:', email);
        
        // Provera da li korisnik postoji
        const users = getUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            // Poruka o nepostojećem korisniku se prikazuje ISKLJUČIVO iz auth.js login funkcije (window.authAlerts.error)
            // Ovdje ne prikazujemo alert da ne bi bilo dupliranja!
            return;
        }
        
        // Provera lozinke
        if (user.password !== password) {
            // Poruka o pogrešnoj lozinci se prikazuje ISKLJUČIVO iz auth.js login funkcije (window.authAlerts.error)
            // Ovdje ne prikazujemo alert da ne bi bilo dupliranja!
            return;
        }
        
        // Uspešna prijava
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
        
        // Zatvori modal
        hideModal();
        
        // Poruka o uspešnoj prijavi se prikazuje ISKLJUČIVO iz auth.js login funkcije (window.authAlerts.success)
        // Ovdje ne prikazujemo alert da ne bi bilo dupliranja!
        
        // Ažuriraj UI
        updateUIAfterLogin(user);
    }
    
    // Funkcija za odjavu
    function handleLogout() {
        console.log('Odjava korisnika');
        
        // Ukloni sva postojeća obaveštenja
        removeAllAlerts();
        
        // Ukloni korisnika iz localStorage-a
        localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
        
        // Prikaži poruku o uspešnoj odjavi
        showAlert('Uspešno ste se odjavili', 'success');
        
        // Ažuriraj UI
        updateUIAfterLogout();
    }
    
    // Funkcija za ažuriranje UI-a nakon odjave
    function updateUIAfterLogout() {
        const authButtons = document.querySelector('.auth-buttons');
        const userProfile = document.querySelector('.user-profile');
        
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
        
        // Ako postoji funkcija za ažuriranje UI-a, pozovi je
        if (typeof window.updateUI === 'function') {
            window.updateUI();
        }
    }
    
    // Pomoćna funkcija za dobijanje liste korisnika
    function getUsers() {
        const usersData = localStorage.getItem(STORAGE_USERS_KEY);
        console.log('Čitanje korisnika iz localStorage:', STORAGE_USERS_KEY);
        
        if (!usersData) {
            console.log('Nema korisnika u localStorage, vraćam praznu listu');
            return [];
        }
        
        try {
            const users = JSON.parse(usersData);
            console.log('Uspešno parsiranje korisnika, broj korisnika:', users.length);
            
            // Logovanje email adresa za debugging (bez lozinki)
            if (users.length > 0) {
                console.log('Email adrese postojećih korisnika:');
                users.forEach((user, index) => {
                    console.log(`${index + 1}. ${user.email}`);
                });
            }
            
            return users;
        } catch (error) {
            console.error('Greška pri parsiranju korisnika:', error);
            return [];
        }
    }
    
    // Inicijalizacija kada se DOM učita
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
