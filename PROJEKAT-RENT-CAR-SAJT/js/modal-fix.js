/**
 * POTPUNO NOVO REŠENJE ZA MODALNE PROZORE
 * Ovo je jedini JavaScript fajl koji treba da kontroliše modalne prozore
 */

// Globalne funkcije za modalne prozore
window.showModal = function(modalId) {
    console.log('Otvaranje modala:', modalId);
    
    // Prvo zatvorimo sve modalne prozore
    hideAllModals();
    
    // Zatim otvorimo željeni modal
    const modal = document.getElementById(modalId);
    if (modal) {
        // Postavimo display: flex direktno bez tranzicija
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

window.hideModal = function(modalId) {
    console.log('Zatvaranje modala:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        // Direktno sakrijemo modal bez tranzicija
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
};

window.hideAllModals = function() {
    console.log('Zatvaranje svih modala');
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        // Direktno sakrijemo sve modale bez tranzicija
        modal.style.display = 'none';
    });
    document.body.style.overflow = '';
};

// Inicijalizacija kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicijalizacija modalnih prozora');
    
    // Zatvaranje modalnih prozora klikom izvan sadržaja
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                hideModal(this.id);
            }
        });
    });
    
    // Zatvaranje modalnih prozora pritiskom na ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideAllModals();
        }
    });
    
    // Sprečavanje propagacije klika unutar modalnog sadržaja
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
    
    // Event listeneri za dugmad za prijavu i registraciju
    const openLoginBtn = document.getElementById('openLoginBtn');
    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showModal('loginModal');
        });
    }
    
    const openRegisterBtn = document.getElementById('openRegisterBtn');
    if (openRegisterBtn) {
        openRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showModal('registerModal');
        });
    }
    
    // Event listeneri za dugmad za zatvaranje modalnih prozora
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = this.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });
});
