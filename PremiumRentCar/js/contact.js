/* ===================== OBAVEŠTENJA (NOTIFICATIONS) ===================== */

// ===================== FUNKCIJA ZA PRIKAZ OBAVEŠTENJA =====================
// Ova funkcija prikazuje notifikaciju (toast) sa ikonicom i porukom
// Parametri:
//    - type: 'success' ili 'error' (određuje boju i ikonicu)
//    - title: naslov notifikacije
//    - msg: glavna poruka notifikacije
// Redosled izvršavanja: 1. Kreiraj element -> 2. Postavi sadržaj -> 3. Dodaj u DOM -> 4. Animiraj -> 5. Obriši nakon vremena
// Gde se koristi? U svim delovima aplikacije za prikaz success/error poruka

function showNotification(type, title, msg) {
    // ===================== MAPIRANJE IKONICA =====================
    
    // icons objekat mapira tip notifikacije na Font Awesome ikonicu
    // success -> fa-check-circle (zelena kvačica)
    // error -> fa-times-circle (crveni X)
    const icons = {success:'fa-check-circle',error:'fa-times-circle'};
    
    // ===================== KREIRANJE NOTIFIKACIJE =====================
    
    // Kreiramo div element za notifikaciju
    const notif = document.createElement('div');
    
    // Postavljamo CSS klase za stilizovanje
    // 'notification' je osnovna klasa
    // type je 'success' ili 'error' (za boju)
    notif.className = `notification ${type}`;
    
    // ===================== HTML SADRŽAJ =====================
    
    // Template literal za HTML sadržaj notifikacije
    notif.innerHTML = `
        <!-- Ikonica notifikacije -->
        <i class="fas ${icons[type]} notif-icon"></i>
        
        <!-- Tekstualni sadržaj -->
        <div class="notif-text">
            <p>${title}</p>
            <p>${msg}</p>
        </div>`;
    
    // ===================== DODAVANJE U DOM =====================
    
    // Dodajemo notifikaciju na kraj body elementa
    // document.body je referenca na <body> element
    document.body.appendChild(notif);
    
    // ===================== ANIMACIJA PRIKAZA =====================
    
    // requestAnimationFrame() zakazuje animaciju pre sledećeg frame-a
    // Dupli requestAnimationFrame osigurava da element bude u DOM-u pre dodavanja klase
    // Ovo je standardna tehnika za CSS animacije koje se trigger-uju klasom
    requestAnimationFrame(() => { 
        requestAnimationFrame(() => { 
            // Dodajemo 'show' klasu koja trigger-uje CSS animaciju (fade-in)
            notif.classList.add('show'); 
        }); 
    });
    
    // ===================== AUTO-REMOVE NAKON VREMENA =====================
    
    // setTimeout() odlaže izvršavanje nakon 4000ms (4 sekunde)
    setTimeout(() => {
        // Uklanjamo 'show' klasu - trigger-uje fade-out animaciju
        notif.classList.remove('show');
        
        // Drugi setTimeout() čeka da se završi fade-out animacija (400ms)
        // Zatim potpuno uklanjamo element iz DOM-a
        setTimeout(() => notif.remove(), 400);
    }, 4000);
}

/* ===================== KONTAKT FORMA ===================== */

// ===================== SLANJE KONTAKT PORUKE =====================
// Ova funkcija obrađuje slanje poruke kroz kontakt formu
// Redosled izvršavanja: 1. Uzmi podatke -> 2. Validiraj -> 3. Sačuvaj -> 4. Prikaži poruku -> 5. Očisti formu
// Gde se koristi? Submit-ovanjem kontakt forme

function sendContact() {
    // ===================== UZIMANJE PODATAKA IZ FORME =====================
    
    // Uzimamo vrednosti iz input polja
    // getElementById() pronalazi element po ID-u
    // .value vraća trenutnu vrednost
    // .trim() uklanja whitespace sa početka i kraja
    const n=document.getElementById('cName').value.trim();      // Ime
    const e=document.getElementById('cEmail').value.trim();    // Email
    const p=document.getElementById('cPhone').value.trim();    // Telefon (opciono)
    const m=document.getElementById('cMsg').value.trim();      // Poruka
    
    // ===================== VALIDACIJA =====================
    
    // Proveravamo da li su obavezna polja popunjena
    // !n || !e || !m - ako ime, email ILI poruka nisu popunjeni
    if(!n||!e||!m) { 
        // Prikazujemo notifikaciju o grešci
        showNotification('error','Greška','Molimo popunite obavezna polja!'); 
        return; // Prekidamo izvršavanje
    }
    
    // ===================== ČUVANJE PORUKE =====================
    
    // Učitavamo postojeće poruke iz localStorage
    // || '[]' je fallback - ako nema poruka, koristimo prazan niz
    const messages = JSON.parse(localStorage.getItem('prc_messages') || '[]');
    
    // Kreiramo novu poruku i dodajemo je u niz
    messages.push({
        // Jedinstveni ID - trenutno vreme u milisekundama kao string
        id: Date.now().toString(),
        
        // Podaci iz forme
        name: n,        // Ime
        email: e,       // Email
        phone: p,       // Telefon (može biti prazan)
        message: m,     // Poruka
        
        // ===================== DATUM I STATUS =====================
        
        // Formatirani datum i vreme
        // 'sr-RS' - srpski locale
        // day: '2-digit' - dan sa vodećom nulom (01-31)
        // month: '2-digit' - mesec sa vodećom nulom (01-12)
        // year: 'numeric' - puna godina (2026)
        // hour: '2-digit' - sat sa vodećom nulom (00-23)
        // minute: '2-digit' - minute sa vodećom nulom (00-59)
        // Rezultat: "04.05.2026. 12:30"
        date: new Date().toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' }),
        
        // Status poruke - false znači da nije pročitana
        // Admin će videti nepročitane poruke u svom panelu
        read: false
    });
    
    // Sačuvamo ažurirani niz poruka u localStorage
    localStorage.setItem('prc_messages', JSON.stringify(messages));
    
    // ===================== POTVRDA I ČIŠĆENJE =====================
    
    // Prikazujemo success notifikaciju korisniku
    showNotification('success','Poruka Poslata!','Odgovorićemo Vam u roku od 24h. Hvala!');
    
    // Čistimo sva polja forme nakon slanja
    // ='' postavlja praznu vrednost
    document.getElementById('cName').value='';
    document.getElementById('cEmail').value='';
    document.getElementById('cPhone').value='';
    document.getElementById('cMsg').value='';
}
