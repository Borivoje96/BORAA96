/**
 * Funkcije za kontakt formu
 */

// Funkcija za inicijalizaciju kontakt forme
function initContactForm() {
    console.log('Inicijalizacija kontakt forme');
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Dobijanje vrednosti iz forme
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Validacija forme
            if (!name || !email || !message) {
                showContactAlert('Molimo popunite sva obavezna polja', 'error');
                return;
            }
            
            // Simulacija slanja poruke
            console.log('Slanje poruke:', { name, email, phone, message });
            
            // Resetovanje forme
            contactForm.reset();
            
            // Prikazivanje poruke o uspešnom slanju
            showContactAlert('Vaša poruka je uspešno poslata. Odgovorićemo vam u najkraćem mogućem roku.', 'success');
        });
    }
}

// Funkcija za prikazivanje stilizovanih obaveštenja
function showContactAlert(message, type = 'success') {
    // Provera da li već postoji kontejner za obaveštenja
    let notificationsContainer = document.querySelector('.notifications-container');
    
    // Ako ne postoji, kreiraj ga
    if (!notificationsContainer) {
        notificationsContainer = document.createElement('div');
        notificationsContainer.className = 'notifications-container';
        document.body.appendChild(notificationsContainer);
    }
    
    // Kreiranje novog obaveštenja
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Dodavanje sadržaja obaveštenja
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    // Dodavanje ikone u zavisnosti od tipa obaveštenja
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.innerHTML = type === 'success' 
        ? '<i class="fas fa-check-circle"></i>' 
        : '<i class="fas fa-exclamation-circle"></i>';
    
    // Dodavanje poruke
    const messageElement = document.createElement('span');
    messageElement.className = 'notification-message';
    messageElement.textContent = message;
    
    // Dodavanje dugmeta za zatvaranje
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function() {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    };
    
    // Sastavljanje obaveštenja
    content.appendChild(icon);
    content.appendChild(messageElement);
    notification.appendChild(content);
    notification.appendChild(closeButton);
    
    // Dodavanje obaveštenja u kontejner
    notificationsContainer.appendChild(notification);
    
    // Animacija prikazivanja
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Automatsko uklanjanje nakon 5 sekundi
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Inicijalizacija kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});
