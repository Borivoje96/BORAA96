/**
 * Sistem za prikazivanje notifikacija
 */

// Funkcija za prikazivanje notifikacije
function showNotification(message, type = 'info', duration = 3000) {
    // Kreiranje elementa za notifikaciju
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification notification-${type}`;
    notificationElement.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon fas ${getNotificationIcon(type)}"></i>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Dodavanje notifikacije u dokument
    const notificationsContainer = document.getElementById('notificationsContainer') || createNotificationsContainer();
    notificationsContainer.appendChild(notificationElement);
    
    // Dodavanje event listenera za zatvaranje notifikacije
    const closeButton = notificationElement.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notificationElement.remove();
    });
    
    // Automatsko zatvaranje notifikacije nakon određenog vremena
    if (duration > 0) {
        setTimeout(function() {
            if (notificationElement.parentNode) {
                notificationElement.remove();
            }
        }, duration);
    }
    
    return notificationElement;
}

// Funkcija za dobijanje ikone za notifikaciju
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'error':
            return 'fa-times-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        case 'info':
        default:
            return 'fa-info-circle';
    }
}

// Funkcija za kreiranje kontejnera za notifikacije
function createNotificationsContainer() {
    const container = document.createElement('div');
    container.id = 'notificationsContainer';
    container.className = 'notifications-container';
    document.body.appendChild(container);
    return container;
}

// Funkcije za različite tipove notifikacija
function showSuccessNotification(message, duration = 3000) {
    return showNotification(message, 'success', duration);
}

function showErrorNotification(message, duration = 3000) {
    return showNotification(message, 'error', duration);
}

function showWarningNotification(message, duration = 3000) {
    return showNotification(message, 'warning', duration);
}

function showInfoNotification(message, duration = 3000) {
    return showNotification(message, 'info', duration);
}
