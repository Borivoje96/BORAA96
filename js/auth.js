/* ===================== AUTH & RESERVATIONS ===================== */

// Inicijalizacija localStorage
if (!localStorage.getItem('prc_users')) localStorage.setItem('prc_users', JSON.stringify([]));
if (!localStorage.getItem('prc_reservations')) localStorage.setItem('prc_reservations', JSON.stringify([]));

let currentUser = JSON.parse(localStorage.getItem('prc_currentUser')) || null;

// Ažuriranje navigacije zavisno od toga da li je korisnik ulogovan
function updateNavAuth() {
    const authNavItem = document.getElementById('authNavItem');
    if (!authNavItem) return;

    if (currentUser) {
        authNavItem.innerHTML = `<a href="javascript:void(0)" onclick="openAccountModal()"><i class="fas fa-user-circle"></i> Moj Nalog</a>`;
    } else {
        authNavItem.innerHTML = `<a href="javascript:void(0)" onclick="openAuthModal()"><i class="fas fa-sign-in-alt"></i> Prijava</a>`;
    }
}

// Otvaranje modala za prijavu/registraciju
function openAuthModal() {
    toggleAuthForm('login');
    document.getElementById('authModal').classList.add('open');
}

// Promena između Prijava i Registracija
function toggleAuthForm(type) {
    document.getElementById('loginFormWrap').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('registerFormWrap').style.display = type === 'register' ? 'block' : 'none';
}

function registerUser(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    
    if(!name || !email || !pass) {
        showNotification('error', 'Greška', 'Molimo popunite sva polja!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('prc_users'));
    if (users.find(u => u.email === email)) {
        showNotification('error', 'Greška', 'Korisnik sa ovim emailom već postoji!');
        return;
    }

    const newUser = { id: Date.now().toString(), name, email, pass };
    users.push(newUser);
    localStorage.setItem('prc_users', JSON.stringify(users));
    
    showNotification('success', 'Uspešno', 'Registracija uspešna. Sada se možete prijaviti.');
    toggleAuthForm('login');
    document.getElementById('loginEmail').value = email;
}

function loginUser(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value;

    const users = JSON.parse(localStorage.getItem('prc_users'));
    const user = users.find(u => u.email === email && u.pass === pass);

    if (user) {
        currentUser = { id: user.id, name: user.name, email: user.email };
        localStorage.setItem('prc_currentUser', JSON.stringify(currentUser));
        closeModal('authModal');
        updateNavAuth();
        showNotification('success', 'Dobrodošli', `Prijavljeni ste kao ${user.name}`);
    } else {
        showNotification('error', 'Greška', 'Pogrešan email ili lozinka.');
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    // toggle icon class
    const icon = document.querySelector(`.toggle-pass[data-target='${inputId}']`);
    if (icon) {
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('prc_currentUser');
    closeModal('accountModal');
    updateNavAuth();
    showNotification('success', 'Odjava', 'Uspešno ste se odjavili.');
}

// Provera pre rezervacije
function checkAuthBeforeReservation() {
    if (!currentUser) {
        openAuthModal();
        showNotification('error', 'Prijava obavezna', 'Morate biti prijavljeni da biste rezervisali vozilo.');
        return false;
    }
    return true;
}

// Čuvanje rezervacije
function saveReservation(resData) {
    const reservations = JSON.parse(localStorage.getItem('prc_reservations'));
    resData.id = Date.now().toString();
    resData.userId = currentUser.id;
    resData.createdAt = new Date().toISOString();
    reservations.push(resData);
    localStorage.setItem('prc_reservations', JSON.stringify(reservations));
}

// Prikaz modala za nalog
function openAccountModal() {
    document.getElementById('accUserName').textContent = currentUser.name;
    document.getElementById('accUserEmail').textContent = currentUser.email;
    
    renderUserReservations();
    document.getElementById('accountModal').classList.add('open');
}

function renderUserReservations() {
    const resList = document.getElementById('userReservationsList');
    const allRes = JSON.parse(localStorage.getItem('prc_reservations'));
    const myRes = allRes.filter(r => r.userId === currentUser.id).reverse(); // Najnovije prve
    
    if (myRes.length === 0) {
        resList.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 20px;">Nemate nijednu rezervaciju.</p>';
        return;
    }
    
    resList.innerHTML = '';
    myRes.forEach(r => {
        const item = document.createElement('div');
        item.className = 'res-item';
        item.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 10px; display:flex; align-items:center; gap: 15px;';
        
        let statusColor = '#10b981'; // Default success green
        let statusBg = 'rgba(16, 185, 129, 0.1)';
        
        if (r.status === 'Otkazana') {
            statusColor = '#ef4444'; // Red
            statusBg = 'rgba(239, 68, 68, 0.1)';
        } else if (r.status === 'Završena') {
            statusColor = '#3b82f6'; // Blue
            statusBg = 'rgba(59, 130, 246, 0.1)';
        } else if (r.status === 'Na čekanju') {
            statusColor = '#f59e0b'; // Orange
            statusBg = 'rgba(245, 158, 11, 0.1)';
        }

        const currentStatus = r.status || 'Aktivna';
        
        // Hide cancel button if already cancelled or finished
        const cancelBtnHtml = (currentStatus === 'Aktivna' || currentStatus === 'Na čekanju') ? 
            `<button onclick="deleteReservation('${r.id}')" style="background: none; border: none; color: #ff5555; cursor: pointer; display: block; width: 100%; text-align: right; font-size: 0.85rem; padding: 0; margin-top: 5px; transition: color 0.3s;" onmouseover="this.style.color='#ff2222'" onmouseout="this.style.color='#ff5555'">
                <i class="fas fa-times-circle"></i> Otkaži
            </button>` : '';

        item.innerHTML = `
            <img src="${r.carImage}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 5px;" alt="Car" onerror="this.src='https://via.placeholder.com/80x60?text=Auto'">
            <div style="flex:1;">
                <h4 style="margin:0 0 5px 0;">${r.carName}</h4>
                <p style="margin:0; font-size: 0.85rem; color:var(--text-muted);"><i class="fas fa-calendar-alt"></i> ${r.dateFrom} do ${r.dateTo} (${r.days} dana)</p>
                <p style="margin:5px 0 0 0; font-size: 0.85rem; color:var(--text-muted);"><i class="fas fa-map-marker-alt"></i> ${r.location}</p>
            </div>
            <div style="text-align: right;">
                <div style="color:var(--gold); font-weight:bold; font-size:1.1rem;">${r.totalPrice}€</div>
                <div style="font-size: 0.8rem; background: ${statusBg}; color: ${statusColor}; padding: 3px 8px; border-radius: 10px; margin-top:5px; margin-bottom:5px; display:inline-block; font-weight: 600;">${currentStatus}</div>
                ${cancelBtnHtml}
            </div>
        `;
        resList.appendChild(item);
    });
}

let reservationToDelete = null;

function deleteReservation(id) {
    reservationToDelete = id;
    document.getElementById('confirmModal').classList.add('open');
}

function confirmDeleteReservation() {
    if (!reservationToDelete) return;
    
    let allRes = JSON.parse(localStorage.getItem('prc_reservations'));
    allRes = allRes.filter(r => r.id !== reservationToDelete);
    localStorage.setItem('prc_reservations', JSON.stringify(allRes));
    
    reservationToDelete = null;
    closeModal('confirmModal');
    
    if (typeof showNotification === 'function') {
        showNotification('success', 'Otkazano', 'Rezervacija je uspešno otkazana.');
    }
    
    renderUserReservations(); // Osvježi listu
}

document.addEventListener('DOMContentLoaded', updateNavAuth);

// Sinhronizacija između Admin i Korisničkog taba u realnom vremenu
window.addEventListener('storage', (e) => {
    if (e.key === 'prc_reservations') {
        const modal = document.getElementById('accountModal');
        if (modal && modal.classList.contains('open')) {
            renderUserReservations();
        }
    }
});
