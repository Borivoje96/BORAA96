/* ===================== NOTIFICATIONS ===================== */
function showNotification(type, title, msg) {
    const icons = {success:'fa-check-circle',error:'fa-times-circle'};
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.innerHTML = `
        <i class="fas ${icons[type]} notif-icon"></i>
        <div class="notif-text">
            <p>${title}</p>
            <p>${msg}</p>
        </div>`;
    document.body.appendChild(notif);
    requestAnimationFrame(() => { requestAnimationFrame(() => { notif.classList.add('show'); }); });
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 400);
    }, 4000);
}

/* ===================== CONTACT ===================== */
function sendContact() {
    const n=document.getElementById('cName').value.trim();
    const e=document.getElementById('cEmail').value.trim();
    const p=document.getElementById('cPhone').value.trim();
    const m=document.getElementById('cMsg').value.trim();
    if(!n||!e||!m) { showNotification('error','Greška','Molimo popunite obavezna polja!'); return; }
    
    const messages = JSON.parse(localStorage.getItem('prc_messages') || '[]');
    messages.push({
        id: Date.now().toString(),
        name: n,
        email: e,
        phone: p,
        message: m,
        date: new Date().toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' }),
        read: false
    });
    localStorage.setItem('prc_messages', JSON.stringify(messages));
    
    showNotification('success','Poruka Poslata!','Odgovorićemo Vam u roku od 24h. Hvala!');
    document.getElementById('cName').value='';
    document.getElementById('cEmail').value='';
    document.getElementById('cPhone').value='';
    document.getElementById('cMsg').value='';
}
