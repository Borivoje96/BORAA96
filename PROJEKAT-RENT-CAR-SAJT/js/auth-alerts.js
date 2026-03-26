/**
 * Sistem za stilizovane poruke pri autentifikaciji
 * Koristi se za prikazivanje poruka o greškama i uspešnim akcijama pri registraciji i prijavi
 */

// Globalni objekat za upravljanje porukama
window.authAlerts = (function() {
    // Privatne varijable
    let container = null;
    let activeAlerts = [];
    const maxAlerts = 3; // Maksimalan broj poruka koje se mogu prikazati istovremeno
    
    // Kreiranje kontejnera za poruke
    function createContainer() {
        if (container) return container;
        
        container = document.createElement('div');
        container.className = 'auth-alerts-container';
        document.body.appendChild(container);
        return container;
    }
    
    // Funkcija za prikazivanje poruke
    function showAlert(message, type = 'info', title = '') {
        const alertContainer = createContainer();
        
        // Podrazumevani naslovi za različite tipove poruka
        if (!title) {
            switch (type) {
                case 'success': title = 'Uspešno!'; break;
                case 'error': title = 'Greška!'; break;
                case 'warning': title = 'Upozorenje!'; break;
                case 'info': title = 'Informacija'; break;
            }
        }
        
        // Ikone za različite tipove poruka
        let icon = '';
        switch (type) {
            case 'success': icon = '<i class="fas fa-check-circle"></i>'; break;
            case 'error': icon = '<i class="fas fa-times-circle"></i>'; break;
            case 'warning': icon = '<i class="fas fa-exclamation-triangle"></i>'; break;
            case 'info': icon = '<i class="fas fa-info-circle"></i>'; break;
        }
        
        // Kreiranje elementa za poruku
        const alertElement = document.createElement('div');
        alertElement.className = `auth-alert auth-alert-${type}`;
        alertElement.innerHTML = `
            <div class="auth-alert-icon">${icon}</div>
            <div class="auth-alert-content">
                <div class="auth-alert-title">${title}</div>
                <div class="auth-alert-message">${message}</div>
            </div>
            <button class="auth-alert-close">&times;</button>
        `;
        
        // Dodavanje u kontejner
        alertContainer.appendChild(alertElement);
        
        // Ograničavanje broja poruka
        activeAlerts.push(alertElement);
        if (activeAlerts.length > maxAlerts) {
            removeAlert(activeAlerts[0]);
        }
        
        // Dodavanje event listenera za zatvaranje
        const closeButton = alertElement.querySelector('.auth-alert-close');
        closeButton.addEventListener('click', function() {
            removeAlert(alertElement);
        });
        
        // Automatsko zatvaranje nakon 5 sekundi
        const timeout = setTimeout(function() {
            removeAlert(alertElement);
        }, 5000);
        
        // Čuvanje reference na timeout
        alertElement.timeout = timeout;
        
        return alertElement;
    }
    
    // Funkcija za uklanjanje poruke
    function removeAlert(alertElement) {
        if (!alertElement || !alertElement.parentNode) return;
        
        // Zaustavljanje timera
        if (alertElement.timeout) {
            clearTimeout(alertElement.timeout);
        }
        
        // Animacija zatvaranja
        alertElement.classList.add('closing');
        
        // Uklanjanje nakon završetka animacije
        setTimeout(function() {
            if (alertElement.parentNode) {
                alertElement.parentNode.removeChild(alertElement);
            }
            
            // Uklanjanje iz liste aktivnih poruka
            const index = activeAlerts.indexOf(alertElement);
            if (index !== -1) {
                activeAlerts.splice(index, 1);
            }
        }, 300);
    }
    
    // Funkcija za uklanjanje svih poruka
    function clearAll() {
        if (!container) return;
        
        // Kopiranje niza da bismo izbegli probleme pri iteraciji
        const alerts = [...activeAlerts];
        alerts.forEach(removeAlert);
    }
    
    // Javni API
    return {
        success: function(message, title) {
            return showAlert(message, 'success', title);
        },
        error: function(message, title) {
            return showAlert(message, 'error', title);
        },
        warning: function(message, title) {
            return showAlert(message, 'warning', title);
        },
        info: function(message, title) {
            return showAlert(message, 'info', title);
        },
        clear: clearAll
    };
})();

// Inicijalizacija kada se DOM učita
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth Alerts sistem inicijalizovan');
});
