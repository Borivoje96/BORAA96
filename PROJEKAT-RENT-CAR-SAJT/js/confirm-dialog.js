/**
 * Jednostavan sistem za dijaloge za potvrdu
 */

// Funkcija za prikazivanje dijaloga za potvrdu
function showConfirmDialog(message, onConfirm, onCancel) {
    // Kreiranje elementa za dijalog
    const dialogOverlay = document.createElement('div');
    dialogOverlay.className = 'confirm-dialog-overlay';
    
    const dialogElement = document.createElement('div');
    dialogElement.className = 'confirm-dialog';
    
    // Kreiranje sadržaja dijaloga
    dialogElement.innerHTML = `
        <div class="confirm-dialog-content">
            <div class="confirm-dialog-message">${message}</div>
            <div class="confirm-dialog-buttons">
                <button class="btn btn-secondary confirm-dialog-cancel">Odustani</button>
                <button class="btn btn-primary confirm-dialog-confirm">Potvrdi</button>
            </div>
        </div>
    `;
    
    // Dodavanje dijaloga u dokument
    dialogOverlay.appendChild(dialogElement);
    document.body.appendChild(dialogOverlay);
    
    // Dodavanje event listenera za dugmad
    const confirmButton = dialogElement.querySelector('.confirm-dialog-confirm');
    const cancelButton = dialogElement.querySelector('.confirm-dialog-cancel');
    
    // Funkcija za zatvaranje dijaloga
    const closeDialog = () => {
        document.body.removeChild(dialogOverlay);
    };
    
    // Event listener za potvrdu
    confirmButton.addEventListener('click', () => {
        closeDialog();
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    });
    
    // Event listener za odustajanje
    cancelButton.addEventListener('click', () => {
        closeDialog();
        if (typeof onCancel === 'function') {
            onCancel();
        }
    });
    
    // Event listener za klik izvan dijaloga
    dialogOverlay.addEventListener('click', (e) => {
        if (e.target === dialogOverlay) {
            closeDialog();
            if (typeof onCancel === 'function') {
                onCancel();
            }
        }
    });
    
    // Fokusiranje na dugme za potvrdu
    confirmButton.focus();
}
