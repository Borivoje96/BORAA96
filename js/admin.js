/* ===================== ADMIN PANEL PRO ===================== */

const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

let adminFilters = { status: 'all', search: '' };
let revenueChartInstance = null;

// --- AUTH ---
function adminLogin(e) {
    e.preventDefault();
    const u = document.getElementById('adminUser').value.trim();
    const p = document.getElementById('adminPass').value;

    if ((u === ADMIN_CREDENTIALS.username || u === 'admin@premiumrc.rs') && p === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('prc_admin', '1');
        showAdminPanel();
    } else {
        const err = document.getElementById('loginError');
        err.style.display = 'flex';
        err.querySelector('span').textContent = 'Pogrešni kredencijali. Pokušajte ponovo.';
    }
}

function adminLogout() {
    sessionStorage.removeItem('prc_admin');
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminLoginScreen').style.display = 'flex';
}

function showAdminPanel() {
    document.getElementById('adminLoginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    updateDateTime();
    loadDashboard();
    initChart();
}

function updateDateTime() {
    const el = document.getElementById('currentDateTime');
    if(el) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' };
        el.textContent = now.toLocaleDateString('sr-RS', options);
    }
}
setInterval(updateDateTime, 60000);

// --- DASHBOARD ---
function loadDashboard() {
    const reservations = JSON.parse(localStorage.getItem('prc_reservations') || '[]');
    const users = JSON.parse(localStorage.getItem('prc_users') || '[]');

    const totalRevenue = reservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    const activeRes = reservations.filter(r => r.status === 'Aktivna').length;

    document.getElementById('statTotalRes').textContent = reservations.length;
    document.getElementById('statActiveRes').textContent = activeRes;
    document.getElementById('statUsers').textContent = users.length;
    document.getElementById('statRevenue').textContent = totalRevenue.toLocaleString('sr-RS') + '€';
    
    // Update nav badge
    const badge = document.getElementById('navResCount');
    if(badge) badge.textContent = reservations.length;

    renderReservations();
    renderMessages();
}

// --- RESERVATIONS TABLE ---
function renderReservations() {
    const reservations = JSON.parse(localStorage.getItem('prc_reservations') || '[]');
    const users = JSON.parse(localStorage.getItem('prc_users') || '[]');

    let filtered = [...reservations].reverse();

    if (adminFilters.status !== 'all') {
        filtered = filtered.filter(r => r.status === adminFilters.status);
    }

    if (adminFilters.search) {
        const q = adminFilters.search.toLowerCase();
        filtered = filtered.filter(r =>
            r.carName.toLowerCase().includes(q) ||
            getUserName(users, r.userId).toLowerCase().includes(q)
        );
    }

    const tbody = document.getElementById('reservationsBody');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:60px 20px; color:var(--text-muted);">
            <div style="background:rgba(255,255,255,0.02); width:80px; height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px;">
                <i class="fas fa-inbox" style="font-size:2.5rem; opacity:0.5;"></i>
            </div>
            <p style="font-weight:600; font-size:1.1rem; color:var(--text-main);">Nema rezervacija</p>
            <p style="font-size:0.9rem; margin-top:5px;">Trenutno nema rezervacija koje odgovaraju filterima.</p>
        </td></tr>`;
        return;
    }

    filtered.forEach(r => {
        const userName = getUserName(users, r.userId);
        const userEmail = getUserEmail(users, r.userId);
        const statusClass = r.status === 'Aktivna' ? 'status-active' : r.status === 'Otkazana' ? 'status-cancelled' : 'status-done';
        const userInitial = userName.charAt(0).toUpperCase();

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="user-cell">
                    <div class="user-avatar">${userInitial}</div>
                    <div class="user-info">
                        <strong>${userName}</strong>
                        <span>${userEmail}</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="car-cell">
                    <img src="${r.carImage || 'https://via.placeholder.com/80x50?text=Auto'}" class="car-img" onerror="this.src='https://via.placeholder.com/80x50?text=Auto'">
                    <div class="car-info">
                        <strong>${r.carName}</strong>
                    </div>
                </div>
            </td>
            <td>
                <div style="font-size:0.9rem; font-weight:500;">
                    <div style="color:var(--text-main); margin-bottom:4px;"><i class="fas fa-calendar-alt" style="color:var(--text-muted); width:16px;"></i> ${r.dateFrom}</div>
                    <div style="color:var(--text-muted);"><i class="fas fa-arrow-right" style="color:var(--text-muted); width:16px;"></i> ${r.dateTo}</div>
                </div>
            </td>
            <td class="price-cell">${r.totalPrice.toLocaleString('sr-RS')}€</td>
            <td><span class="status-badge ${statusClass}">${r.status}</span></td>
            <td>
                <div class="action-menu">
                    ${r.status !== 'Aktivna' ? `<button onclick="changeStatus('${r.id}', 'Aktivna')" title="Aktiviraj" class="action-btn"><i class="fas fa-check"></i></button>` : ''}
                    ${r.status !== 'Završena' ? `<button onclick="changeStatus('${r.id}', 'Završena')" title="Završi" class="action-btn"><i class="fas fa-flag-checkered"></i></button>` : ''}
                    ${r.status !== 'Otkazana' ? `<button onclick="changeStatus('${r.id}', 'Otkazana')" title="Otkaži" class="action-btn"><i class="fas fa-ban"></i></button>` : ''}
                    <button onclick="deleteAdminReservation('${r.id}')" title="Obriši" class="action-btn delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- MESSAGES TABLE ---
function renderMessages() {
    const messages = JSON.parse(localStorage.getItem('prc_messages') || '[]');
    const tbody = document.getElementById('messagesBody');
    const badge = document.getElementById('navMsgCount');
    const notifDot = document.querySelector('.header-actions .icon-btn:nth-child(2) .notification-dot') || document.querySelector('.notification-dot'); // using the first dot assuming it's for messages
    
    if(!tbody) return;
    tbody.innerHTML = '';

    const unreadCount = messages.filter(m => !m.read).length;

    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }
    
    if (notifDot) {
        notifDot.style.display = unreadCount > 0 ? 'block' : 'none';
    }

    if (messages.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:60px 20px; color:var(--text-muted);">
            <div style="background:rgba(255,255,255,0.02); width:80px; height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px;">
                <i class="fas fa-envelope-open" style="font-size:2.5rem; opacity:0.5;"></i>
            </div>
            <p style="font-weight:600; font-size:1.1rem; color:var(--text-main);">Sanduče je prazno</p>
            <p style="font-size:0.9rem; margin-top:5px;">Trenutno nema poruka od korisnika.</p>
        </td></tr>`;
        return;
    }

    [...messages].reverse().forEach(m => {
        const isRead = m.read;
        const statusHtml = isRead ? 
            `<span style="color:var(--text-muted); font-size:0.8rem;"><i class="fas fa-envelope-open"></i> Pročitano</span>` : 
            `<span style="color:var(--gold); font-size:0.8rem; font-weight:bold;"><i class="fas fa-envelope"></i> Novo</span>`;
            
        const tr = document.createElement('tr');
        tr.style.background = isRead ? 'transparent' : 'rgba(212, 175, 55, 0.05)';
        
        tr.innerHTML = `
            <td>${statusHtml}</td>
            <td><strong>${m.name}</strong></td>
            <td><div style="font-size:0.85rem;">${m.email}<br><span style="color:var(--text-muted);">${m.phone || '-'}</span></div></td>
            <td style="max-width:300px; font-size:0.9rem; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${m.message}">${m.message}</td>
            <td style="font-size:0.85rem; color:var(--text-muted);">${m.date}</td>
            <td>
                <div class="action-menu">
                    ${!isRead ? `<button onclick="markMessageRead('${m.id}')" title="Označi kao pročitano" class="action-btn"><i class="fas fa-check-double"></i></button>` : ''}
                    <button onclick="deleteMessage('${m.id}')" title="Obriši poruku" class="action-btn delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function markMessageRead(id) {
    let all = JSON.parse(localStorage.getItem('prc_messages') || '[]');
    all = all.map(m => m.id === id ? { ...m, read: true } : m);
    localStorage.setItem('prc_messages', JSON.stringify(all));
    renderMessages();
}

function deleteMessage(id) {
    itemToDelete = id;
    deleteType = 'message';
    document.querySelector('#deleteConfirmModal p').textContent = 'Da li ste sigurni da želite da trajno obrišete ovu poruku? Ova akcija se ne može poništiti.';
    document.getElementById('deleteConfirmModal').classList.add('open');
}

function getUserName(users, userId) {
    const u = users.find(u => u.id === userId);
    return u ? u.name : 'Gost Korisnik';
}

function getUserEmail(users, userId) {
    const u = users.find(u => u.id === userId);
    return u ? u.email : 'nepoznato@email.com';
}

function changeStatus(id, status) {
    let all = JSON.parse(localStorage.getItem('prc_reservations') || '[]');
    all = all.map(r => r.id === id ? { ...r, status } : r);
    localStorage.setItem('prc_reservations', JSON.stringify(all));
    loadDashboard();
}

let itemToDelete = null;
let deleteType = null;

function deleteAdminReservation(id) {
    itemToDelete = id;
    deleteType = 'reservation';
    document.querySelector('#deleteConfirmModal p').textContent = 'Da li ste sigurni da želite da trajno obrišete ovu rezervaciju? Ova akcija se ne može poništiti i ukloniće sve podatke.';
    document.getElementById('deleteConfirmModal').classList.add('open');
}

function closeDeleteModal() {
    itemToDelete = null;
    deleteType = null;
    document.getElementById('deleteConfirmModal').classList.remove('open');
}

function filterByStatus(status) {
    adminFilters.status = status;
    document.querySelectorAll('.filter-btn').forEach(t => t.classList.remove('active'));
    document.querySelector(`.filter-btn[data-status="${status}"]`).classList.add('active');
    renderReservations();
}

function searchReservations() {
    adminFilters.search = document.getElementById('searchInput').value;
    renderReservations();
}

function toggleAdminPass() {
    const inp = document.getElementById('adminPass');
    inp.type = inp.type === 'password' ? 'text' : 'password';
    const icon = document.querySelector('.toggle-admin-pass');
    if (icon) { icon.classList.toggle('fa-eye'); icon.classList.toggle('fa-eye-slash'); }
}

// --- CHART.JS INIT ---
function initChart() {
    const ctx = document.getElementById('revenueChart');
    if(!ctx) return;
    
    if(revenueChartInstance) {
        revenueChartInstance.destroy();
    }
    
    // Dummy data for visual presentation
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];
    const data = [1200, 1900, 1500, 2200, 2800, 3500, 4200, 4000, 3100, 2400, 1800, 2000];
    
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
    gradient.addColorStop(1, 'rgba(212, 175, 55, 0.0)');
    
    revenueChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Prihod (€)',
                data: data,
                borderColor: '#d4af37', // gold
                backgroundColor: gradient,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#0f172a',
                pointBorderColor: '#d4af37',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#d4af37',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
                    bodyFont: { family: 'Plus Jakarta Sans', size: 14, weight: 'bold' },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
                    ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', weight: '500' }, padding: 10 }
                },
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', weight: '500' }, padding: 10 }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        }
    });
}

// --- NAVIGATION ---
function switchSection(sectionId, element) {
    if (element) {
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    }
    
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('active');
    });
    
    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10);
    }
    
    // Auto-close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').style.transform = 'translateX(-100%)';
    }
}

// Mobile sidebar toggle
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle-sidebar');
    if (btn) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar.style.transform === 'translateX(0px)') {
            sidebar.style.transform = 'translateX(-100%)';
        } else {
            sidebar.style.transform = 'translateX(0px)';
        }
    }
});

// On load
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('prc_admin') === '1') {
        showAdminPanel();
    }
    
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (itemToDelete && deleteType === 'reservation') {
                let all = JSON.parse(localStorage.getItem('prc_reservations') || '[]');
                all = all.filter(r => r.id !== itemToDelete);
                localStorage.setItem('prc_reservations', JSON.stringify(all));
                loadDashboard();
                closeDeleteModal();
            } else if (itemToDelete && deleteType === 'message') {
                let all = JSON.parse(localStorage.getItem('prc_messages') || '[]');
                all = all.filter(m => m.id !== itemToDelete);
                localStorage.setItem('prc_messages', JSON.stringify(all));
                renderMessages();
                closeDeleteModal();
            }
        });
    }
});

// Sync user actions from another tab
window.addEventListener('storage', (e) => {
    if (e.key === 'prc_reservations' || e.key === 'prc_messages') {
        if (document.getElementById('adminPanel') && document.getElementById('adminPanel').style.display === 'block') {
            loadDashboard();
        }
    }
});
