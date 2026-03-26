/**
 * Jednostavan kod za modalne prozore
 * Bez konflikta sa main.js
 */

// Globalne funkcije za otvaranje i zatvaranje modalnih prozora
// Ove funkcije će biti dostupne i iz drugih skripti
window.showLoginModal = function() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

window.showRegisterModal = function() {
    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
};

window.closeAllModals = function() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = '';
};

// Funkcija za otvaranje bilo kojeg modalnog prozora po ID-u
window.openSimpleModal = function(modalId) {
    // Zatvaranje svih modalnih prozora pre otvaranja novog
    window.closeAllModals();
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Modal sa ID-om', modalId, 'nije pronađen');
    }
};

// Inicijalizacija kada se dokument učita
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicijalizacija sistema za modalne prozore');
    
    // Dugmad za otvaranje modalnih prozora
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    
    // Dugmad za zatvaranje modalnih prozora
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Event listeneri za otvaranje modalnih prozora
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.showLoginModal();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.showRegisterModal();
        });
    }
    
    // Event listeneri za zatvaranje modalnih prozora
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = this.closest('.modal');
            if (modal) {
                window.closeModal(modal.id);
            }
        });
    });
    
    // Zatvaranje modalnih prozora klikom izvan sadržaja
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                window.closeModal(this.id);
            }
        });
    });
    
    // Zatvaranje modalnih prozora pritiskom na ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closeAllModals();
        }
    });
    
    // Sprečavanje propagacije klika unutar modalnog sadržaja
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation(); // Sprečava zatvaranje modala klikom na sadržaj
        });
    });
});
