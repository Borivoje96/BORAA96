/* ===================== AUTENTIFIKACIJA I REZERVACIJE ===================== */

// ===================== INICIJALIZACIJA LOCALSTORAGE-A =====================
// localStorage je Web Storage API koje čuva podatke trajno (čak i nakon zatvaranja browser-a)
// Podaci se čuvaju kao ključ-vrednost parovi (string-string)
// Zašto localStorage? Podaci o korisnicima i rezervacijama moraju da ostanu nakon refresh-a

// Proveravamo da li postoje ključevi 'prc_users' i 'prc_reservations'
// !localStorage.getItem('prc_users') - ako ključ ne postoji (vrati null)
// JSON.stringify([]) - konvertuje prazan niz u JSON string
// Zašto prazan niz? Ako nema korisnika, kreiramo prazan niz kao početno stanje
if (!localStorage.getItem('prc_users')) localStorage.setItem('prc_users', JSON.stringify([]));
if (!localStorage.getItem('prc_reservations')) localStorage.setItem('prc_reservations', JSON.stringify([]));

// currentUser je globalna promenljiva koja čuva informacije o trenutno prijavljenom korisniku
// JSON.parse() konvertuje JSON string u JavaScript objekat
// || null je fallback - ako nema prijavljenog korisnika, postavljamo na null
// Zašto globalna? Da bi bio dostupan svim funkcijama u ovom fajlu
let currentUser = JSON.parse(localStorage.getItem('prc_currentUser')) || null;

// ===================== AŽURIRANJE NAVIGACIJE =====================
// Ova funkcija ažurira navigaciju zavisno od toga da li je korisnik prijavljen
// Redosled izvršavanja: 1. Proveri da li postoji element -> 2. Proveri da li je korisnik prijavljen -> 3. Postavi odgovarajući HTML
// Gde se koristi? Pri učitavanju stranice, prijavi, odjavi

function updateNavAuth() {
    // Pronalazimo element u navigaciji gde se prikazuje link za prijavu/moj nalog
    // getElementById() pronalazi element po ID-u - brži od querySelector
    const authNavItem = document.getElementById('authNavItem');
    
    // Guard clause - ako element ne postoji, izađi iz funkcije
    // Zašto? Da ne bi bilo greške ako se funkcija pozove pre nego što se DOM učita
    if (!authNavItem) return;

    // Proveravamo da li postoji trenutno prijavljeni korisnik
    if (currentUser) {
        // Korisnik je prijavljen - prikaži "Moj Nalog" link
        // onclick="openAccountModal()" - poziva funkciju za otvaranje modala sa nalogom
        // Font Awesome ikona fa-user-circle za korisnika
        authNavItem.innerHTML = `<a href="javascript:void(0)" onclick="openAccountModal()"><i class="fas fa-user-circle"></i> Moj Nalog</a>`;
    } else {
        // Korisnik nije prijavljen - prikaži "Prijava" link
        // onclick="openAuthModal()" - poziva funkciju za otvaranje prijava/registracija modala
        // Font Awesome ikona fa-sign-in-alt za prijavu
        authNavItem.innerHTML = `<a href="javascript:void(0)" onclick="openAuthModal()"><i class="fas fa-sign-in-alt"></i> Prijava</a>`;
    }
}

// ===================== OTVARANJE AUTH MODALA =====================
// Ova funkcija otvara modal za prijavu/registraciju
// Redosled izvršavanja: 1. Postavi formu na prijavu -> 2. Dodaj 'open' klasu na modal
// Gde se koristi? Klikom na "Prijava" link u navigaciji

function openAuthModal() {
    // Pozivamo funkciju koja menja vidljivost forme (prijava/registracija)
    // 'login' parametar znači da želimo da prikažemo login formu
    toggleAuthForm('login');
    
    // Pronalazimo modal element i dodajemo mu 'open' CSS klasu
    // 'open' klasa čini modal vidljivim (npr. display: block ili opacity: 1)
    // classList.add() je bezbedniji od direktnog menjanja stila
    document.getElementById('authModal').classList.add('open');
}

// ===================== TOGGLE AUTH FORME =====================
// Ova funkcija menja vidljivost između login i register forme
// Parametar: type - 'login' ili 'register'
// Redosled izvršavanja: 1. Sakrij obe forme -> 2. Prikaži samo odabranu formu
// Gde se koristi? U openAuthModal() i klikom na tab-ove u modal-u

function toggleAuthForm(type) {
    // Pronalazimo wrapper element za login formu
    // Ternarni operator: type === 'login' ? 'block' : 'none'
    //    - Ako je type 'login', postavi display na 'block' (vidljivo)
    //    - Inače, postavi display na 'none' (nevidljivo)
    document.getElementById('loginFormWrap').style.display = type === 'login' ? 'block' : 'none';
    
    // Pronalazimo wrapper element za register formu
    // Suprotna logika: prikaži samo ako je type 'register'
    document.getElementById('registerFormWrap').style.display = type === 'register' ? 'block' : 'none';
}

// ===================== REGISTRACIJA KORISNIKA =====================
// Ova funkcija obradjuje registraciju novog korisnika
// Parametar: e - event object (submit forme)
// Redosled izvršavanja: 1. Spreči default submit -> 2. Uzmi podatke -> 3. Validiraj -> 4. Proveri duplikat -> 5. Sačuvaj -> 6. Prikaži poruku
// Gde se koristi? Submit-ovanjem registracione forme

function registerUser(e) {
    // Sprečavamo default ponašanje forme (refresh stranice)
    // Zašto? Obradjujemo formu na klijentskoj strani, ne šaljemo na server
    e.preventDefault();
    
    // ===================== UZIMANJE PODATAKA IZ FORME =====================
    
    // Uzimamo vrednosti iz input polja
    // getElementById() pronalazi element po ID-u
    // .value vraća trenutnu vrednost input-a
    // .trim() uklanja whitespace sa početka i kraja string-a
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value; // Lozinka se ne trim-uje
    
    // ===================== VALIDACIJA POLJA =====================
    
    // Proveravamo da li su sva obavezna polja popunjena
    // !name || !email || !pass - ako bilo koje polje nije popunjeno (falsy)
    if(!name || !email || !pass) {
        // Prikazujemo notifikaciju o grešci
        // showNotification() je funkcija iz contact.js
        showNotification('error', 'Greška', 'Molimo popunite sva polja!');
        return; // Prekidamo izvršavanje funkcije
    }

    // ===================== PROVERA DUPLIKATA EMAIL-A =====================
    
    // Učitavamo postojeće korisnike iz localStorage
    const users = JSON.parse(localStorage.getItem('prc_users'));
    
    // find() pronalazi PRVI element koji zadovoljava uslov
    // u.email === email - proverava da li postoji korisnik sa istim email-om
    if (users.find(u => u.email === email)) {
        // Prikazujemo grešku ako email već postoji
        showNotification('error', 'Greška', 'Korisnik sa ovim emailom već postoji!');
        return; // Prekidamo izvršavanje
    }

    // ===================== KREIRANJE NOVOG KORISNIKA =====================
    
    // Kreiramo novi korisnički objekat
    // Date.now().toString() - trenutno vreme u milisekundama kao string (koristi se kao ID)
    // ES6 shorthand: {name, email, pass} je isto kao {name: name, email: email, pass: pass}
    const newUser = { id: Date.now().toString(), name, email, pass };
    
    // Dodajemo novog korisnika u niz postojećih korisnika
    users.push(newUser);
    
    // ===================== ČUVANJE U LOCALSTORAGE =====================
    
    // Čuvamo ažurirani niz korisnika u localStorage
    // JSON.stringify() konvertuje JavaScript niz u JSON string
    // localStorage čuva samo stringove, zato je potrebna konverzija
    localStorage.setItem('prc_users', JSON.stringify(users));
    
    // ===================== POVRAĆNA KORISNIČKA AKCIJA =====================
    
    // Prikazujemo success notifikaciju
    showNotification('success', 'Uspešno', 'Registracija uspešna. Sada se možete prijaviti.');
    
    // Prebacujemo se na login formu
    toggleAuthForm('login');
    
    // Popunjavamo email polje u login formi sa email-om koji je korisnik uneo
    // Korisniku olakšavamo prijavu - ne mora ponovo da kuca email
    document.getElementById('loginEmail').value = email;
}

// ===================== PRIJAVA KORISNIKA =====================
// Ova funkcija obradjuje prijavu postojećeg korisnika
// Parametar: e - event object (submit forme)
// Redosled izvršavanja: 1. Spreči submit -> 2. Uzmi podatke -> 3. Proveri kredencijale -> 4. Postavi sesiju -> 5. Ažuriraj UI
// Gde se koristi? Submit-ovanjem login forme

function loginUser(e) {
    // Sprečavamo default ponašanje forme (refresh stranice)
    e.preventDefault();
    
    // Uzimamo podatke iz login forme
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value;

    // Učitavamo sve korisnike iz localStorage
    const users = JSON.parse(localStorage.getItem('prc_users'));
    
    // Pronalazimo korisnika sa zadatim email-om i lozinkom
    // find() vraća prvi element koji zadovoljava oba uslova
    // u.email === email && u.pass === pass - email I lozinka moraju da se poklapaju
    const user = users.find(u => u.email === email && u.pass === pass);

    // ===================== PROVERA KREDENCIJALA =====================
    
    if (user) {
        // ===================== POSTAVLJANJE SESIJE =====================
        
        // Kreiramo objekat sa podacima o trenutnom korisniku
        // NE čuvamo lozinku u currentUser iz bezbednosnih razloga
        currentUser = { id: user.id, name: user.name, email: user.email };
        
        // Čuvamo podatke o trenutnom korisniku u localStorage
        // 'prc_currentUser' je ključ za čuvanje sesije
        localStorage.setItem('prc_currentUser', JSON.stringify(currentUser));
        
        // ===================== AŽURIRANJE UI-A =====================
        
        // Zatvaramo auth modal
        // closeModal() je funkcija iz modal.js
        closeModal('authModal');
        
        // Ažuriramo navigaciju da prikaže "Moj Nalog" umesto "Prijava"
        updateNavAuth();
        
        // Prikazujemo welcome notifikaciju
        // Template literal (`) omogućava ubacivanje varijable u string
        showNotification('success', 'Dobrodošli', `Prijavljeni ste kao ${user.name}`);
    } else {
        // ===================== NEUSPEŠNA PRIJAVA =====================
        
        // Prikazujemo grešku ako kredencijali nisu ispravni
        showNotification('error', 'Greška', 'Pogrešan email ili lozinka.');
    }
}

// ===================== PRIKAZ/SKRIVANJE LOZINKE =====================
// Ova funkcija menja vidljivost lozinke (password/text)
// Parametar: inputId - ID input elementa za lozinku
// Redosled izvršavanja: 1. Pronađi input -> 2. Promeni type -> 3. Promeni ikonicu
// Gde se koristi? Klikom na eye ikonicu pored input polja za lozinku

function togglePassword(inputId) {
    // Pronalazimo input element po ID-u
    const input = document.getElementById(inputId);
    
    // Guard clause - ako element ne postoji, izađi
    if (!input) return;
    
    // ===================== MENJANJE TYPE-A INPUT-A =====================
    
    // HTML input type određuje kako se prikazuje unos
    // type='password' - sakriva karaktere (••••••)
    // type='text' - prikazuje karaktere u vidljivom formatu
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    
    // ===================== MENJANJE IKONICE =====================
    
    // Pronalazimo ikonicu pored input-a
    // CSS selektor: .toggle-pass sa data-target atributom jednakim inputId
    const icon = document.querySelector(`.toggle-pass[data-target='${inputId}']`);
    
    if (icon) {
        // classList.toggle() dodaje ili uklanja CSS klasu
        // fa-eye - ikonica za vidljivu lozinku
        // fa-eye-slash - ikonica za sakrivenu lozinku
        // Ovo omogućava smooth promenu između dve ikonice
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }
}

// ===================== ODJAVA KORISNIKA =====================
// Ova funkcija odjavljuje trenutno prijavljenog korisnika
// Redosled izvršavanja: 1. Obriši sesiju -> 2. Zatvori modal -> 3. Ažuriraj nav -> 4. Prikaži poruku
// Gde se koristi? Klikom na "Odjavi se" dugme u account modal-u

function logoutUser() {
    // Resetujemo globalnu promenljivu currentUser
    // Postavljamo na null - nema više prijavljenog korisnika
    currentUser = null;
    
    // Brišemo sesiju iz localStorage
    // removeItem() briše par ključ-vrednost iz localStorage
    // 'prc_currentUser' je ključ za sesiju
    localStorage.removeItem('prc_currentUser');
    
    // Zatvaramo account modal (ako je otvoren)
    closeModal('accountModal');
    
    // Ažuriramo navigaciju da prikaže "Prijava" umesto "Moj Nalog"
    updateNavAuth();
    
    // Prikazujemo success notifikaciju o odjavi
    showNotification('success', 'Odjava', 'Uspešno ste se odjavili.');
}

// ===================== PROVERA AUTENTIFIKACIJE PRE REZERVACIJE =====================
// Ova funkcija proverava da li je korisnik prijavljen pre nego što dozvoli rezervaciju
// Vraća: true ako je korisnik prijavljen, false ako nije
// Redosled izvršavanja: 1. Proveri da li postoji currentUser -> 2. Ako ne, otvori auth modal -> 3. Vrati rezultat
// Gde se koristi? U modal.js pre otvaranja rezervacionog modala

function checkAuthBeforeReservation() {
    // Proveravamo da li postoji prijavljeni korisnik
    if (!currentUser) {
        // Korisnik nije prijavljen - otvori auth modal
        openAuthModal();
        
        // Prikazujemo obaveštenje da je prijava obavezna
        showNotification('error', 'Prijava obavezna', 'Morate biti prijavljeni da biste rezervisali vozilo.');
        
        // Vraćamo false - rezervacija nije dozvoljena
        return false;
    }
    
    // Korisnik je prijavljen - vraćamo true, rezervacija je dozvoljena
    return true;
}

// ===================== ČUVANJE REZERVACIJE =====================
// Ova funkcija čuva novu rezervaciju u localStorage
// Parametar: resData - objekat sa podacima o rezervaciji
// Redosled izvršavanja: 1. Uzmi postojeće rezervacije -> 2. Dodaj metapodatke -> 3. Sačuvaj
// Gde se koristi? U modal.js nakon potvrde rezervacije

function saveReservation(resData) {
    // Učitavamo postojeće rezervacije iz localStorage
    const reservations = JSON.parse(localStorage.getItem('prc_reservations'));
    
    // ===================== DODAVANJE METAPODATAKA =====================
    
    // Dodajemo jedinstveni ID rezervaciji
    // Date.now().toString() - trenutno vreme kao string (koristi se kao ID)
    resData.id = Date.now().toString();
    
    // Dodajemo ID korisnika koji je napravio rezervaciju
    // currentUser.id je ID trenutno prijavljenog korisnika
    resData.userId = currentUser.id;
    
    // Dodajemo vreme kreiranja rezervacije
    // new Date().toISOString() - trenutno vreme u ISO formatu (npr. "2026-05-04T10:30:00.000Z")
    resData.createdAt = new Date().toISOString();
    
    // ===================== ČUVANJE =====================
    
    // Dodajemo novu rezervaciju u niz postojećih
    reservations.push(resData);
    
    // Čuvamo ažurirani niz u localStorage
    localStorage.setItem('prc_reservations', JSON.stringify(reservations));
}

// ===================== OTVARANJE ACCOUNT MODALA =====================
// Ova funkcija otvara modal sa informacijama o korisničkom nalogu
// Redosled izvršavanja: 1. Popuni podatke -> 2. Učitaj rezervacije -> 3. Prikaži modal
// Gde se koristi? Klikom na "Moj Nalog" u navigaciji

function openAccountModal() {
    // ===================== POPUNJAVANJE KORISNIČKIH PODATAKA =====================
    
    // Postavljamo ime korisnika u modal-u
    // textContent postavlja tekstualni sadržaj elementa
    document.getElementById('accUserName').textContent = currentUser.name;
    
    // Postavljamo email korisnika u modal-u
    document.getElementById('accUserEmail').textContent = currentUser.email;
    
    // ===================== UČITAVANJE REZERVACIJA =====================
    
    // Pozivamo funkciju koja renderuje sve rezervacije ovog korisnika
    renderUserReservations();
    
    // ===================== PRIKAZ MODALA =====================
    
    // Dodajemo 'open' klasu na account modal da bi bio vidljiv
    document.getElementById('accountModal').classList.add('open');
}

// ===================== RENDEROVANJE KORISNIČKIH REZERVACIJA =====================
// Ova funkcija prikazuje sve rezervacije trenutno prijavljenog korisnika
// Redosled izvršavanja: 1. Uzmi sve rezervacije -> 2. Filtriraj po userId -> 3. Obrni redosled -> 4. Renderuj
// Gde se koristi? U openAccountModal() i storage event handler-u

function renderUserReservations() {
    // Pronalazimo kontejner za listu rezervacija
    const resList = document.getElementById('userReservationsList');
    
    // Učitavamo sve rezervacije iz localStorage
    const allRes = JSON.parse(localStorage.getItem('prc_reservations'));
    
    // Filtriramo samo rezervacije trenutnog korisnika
    // r.userId === currentUser.id - samo rezervacije sa ID-jem trenutnog korisnika
    // .reverse() - obrni redosled tako da najnovije budu prve
    const myRes = allRes.filter(r => r.userId === currentUser.id).reverse();
    
    // ===================== EMPTY STATE =====================
    
    // Proveravamo da li korisnik ima rezervacija
    if (myRes.length === 0) {
        // Ako nema rezervacija, prikazujemo poruku
        resList.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 20px;">Nemate nijednu rezervaciju.</p>';
        return; // Prekidamo izvršavanje
    }
    
    // ===================== ČIŠĆENJE I RENDEROVANJE =====================
    
    // Čistimo listu pre dodavanja novih elemenata
    resList.innerHTML = '';
    
    // forEach() iterira kroz svaku rezervaciju korisnika
    myRes.forEach(r => {
        // ===================== KREIRANJE ELEMENTA REZERVACIJE =====================
        
        // Kreiramo div element za svaku rezervaciju
        const item = document.createElement('div');
        
        // Postavljamo CSS klasu i inline stilove
        item.className = 'res-item';
        item.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 10px; display:flex; align-items:center; gap: 15px;';
        
        // ===================== ODREĐIVANJE BOJA STATUSA =====================
        
        // Default boje za status 'Aktivna'
        let statusColor = '#10b981'; // Zelena
        let statusBg = 'rgba(16, 185, 129, 0.1)'; // Svetlo zelena pozadina
        
        // Menjamo boje zavisno od statusa
        if (r.status === 'Otkazana') {
            statusColor = '#ef4444'; // Crvena
            statusBg = 'rgba(239, 68, 68, 0.1)';
        } else if (r.status === 'Završena') {
            statusColor = '#3b82f6'; // Plava
            statusBg = 'rgba(59, 130, 246, 0.1)';
        } else if (r.status === 'Na čekanju') {
            statusColor = '#f59e0b'; // Narandžasta
            statusBg = 'rgba(245, 158, 11, 0.1)';
        }

        // Trenutni status - ako nije definisan, koristi 'Aktivna'
        const currentStatus = r.status || 'Aktivna';
        
        // ===================== LOGIKA DUGMETA ZA OTKAZIVANJE =====================
        
        // Dugme za otkazivanje se prikazuje samo za 'Aktivna' i 'Na čekanju' statuse
        // Ako je rezervacija već otkazana ili završena, dugme se ne prikazuje
        const cancelBtnHtml = (currentStatus === 'Aktivna' || currentStatus === 'Na čekanju') ? 
            `<button onclick="deleteReservation('${r.id}')" style="background: none; border: none; color: #ff5555; cursor: pointer; display: block; width: 100%; text-align: right; font-size: 0.85rem; padding: 0; margin-top: 5px; transition: color 0.3s;" onmouseover="this.style.color='#ff2222'" onmouseout="this.style.color='#ff5555'">
                <i class="fas fa-times-circle"></i> Otkaži
            </button>` : '';

        // ===================== HTML SADRŽAJ REZERVACIJE =====================
        
        // Template literal za HTML sadržaj rezervacije
        item.innerHTML = `
            <!-- Slika vozila sa fallback-om -->
            <img src="${r.carImage}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 5px;" alt="Car" onerror="this.src='https://via.placeholder.com/80x60?text=Auto'">
            
            <!-- Informacije o vozilu i rezervaciji -->
            <div style="flex:1;">
                <h4 style="margin:0 0 5px 0;">${r.carName}</h4>
                <p style="margin:0; font-size: 0.85rem; color:var(--text-muted);"><i class="fas fa-calendar-alt"></i> ${r.dateFrom} do ${r.dateTo} (${r.days} dana)</p>
                <p style="margin:5px 0 0 0; font-size: 0.85rem; color:var(--text-muted);"><i class="fas fa-map-marker-alt"></i> ${r.location}</p>
            </div>
            
            <!-- Cena, status i dugme za otkazivanje -->
            <div style="text-align: right;">
                <div style="color:var(--gold); font-weight:bold; font-size:1.1rem;">${r.totalPrice}€</div>
                <div style="font-size: 0.8rem; background: ${statusBg}; color: ${statusColor}; padding: 3px 8px; border-radius: 10px; margin-top:5px; margin-bottom:5px; display:inline-block; font-weight: 600;">${currentStatus}</div>
                ${cancelBtnHtml}
            </div>
        `;
        
        // Dodajemo element u listu
        resList.appendChild(item);
    });
}

// ===================== GLOBALNE PROMENLJIVE ZA BRISANJE =====================

// reservationToDelete čuva ID rezervacije koja se briše
// Globalna jer se koristi u dve funkcije: deleteReservation() i confirmDeleteReservation()
let reservationToDelete = null;

// ===================== OTVARANJE CONFIRM MODALA =====================
// Ova funkcija prikazuje confirm modal pre brisanja rezervacije
// Parametar: id - ID rezervacije koju želimo da obrišemo
// Redosled izvršavanja: 1. Sačuvaj ID -> 2. Prikaži modal
// Gde se koristi? Klikom na "Otkaži" dugme u rezervaciji

function deleteReservation(id) {
    // Sačuvaj ID rezervacije u globalnoj promenljivoj
    // Biće korišćen kada korisnik potvrdi brisanje
    reservationToDelete = id;
    
    // Prikaži confirm modal
    // 'open' klasa čini modal vidljivim
    document.getElementById('confirmModal').classList.add('open');
}

// ===================== POTVRDA BRISANJA REZERVACIJE =====================
// Ova funkcija briše rezervaciju nakon potvrde u modal-u
// Redosled izvršavanja: 1. Proveri ID -> 2. Ukloni rezervaciju -> 3. Sačuvaj -> 4. Zatvori modal -> 5. Osvježi UI
// Gde se koristi? Klikom na "Potvrdi" dugme u confirm modal-u

function confirmDeleteReservation() {
    // Guard clause - ako nema ID za brisanje, izađi
    if (!reservationToDelete) return;
    
    // ===================== BRISANJE REZERVACIJE =====================
    
    // Učitavamo sve rezervacije iz localStorage
    let allRes = JSON.parse(localStorage.getItem('prc_reservations'));
    
    // filter() kreira novi niz bez rezervacije koju brišemo
    // r.id !== reservationToDelete - zadrži sve rezervacije čiji ID NIJE jednak reservationToDelete
    allRes = allRes.filter(r => r.id !== reservationToDelete);
    
    // Sačuvamo ažurirani niz u localStorage
    localStorage.setItem('prc_reservations', JSON.stringify(allRes));
    
    // ===================== ČIŠĆENJE I ZATVARANJE =====================
    
    // Resetujemo globalnu promenljivu
    reservationToDelete = null;
    
    // Zatvaramo confirm modal
    closeModal('confirmModal');
    
    // ===================== OBAVEŠTENJE I OSVEŽAVANJE =====================
    
    // Proveravamo da li funkcija postoji pre nego što je pozovemo
    // Ovo je defensive programming - funkcija može biti učitana u drugom redosledu
    if (typeof showNotification === 'function') {
        showNotification('success', 'Otkazano', 'Rezervacija je uspešno otkazana.');
    }
    
    // Ponovo renderujemo listu rezervacija da bi se izmene prikazale
    renderUserReservations();
}

// ===================== INICIJALIZACIJA NAKON UČITAVANJA DOM-A =====================

// DOMContentLoaded event se trigger-uje kada se HTML dokument učita i parsira
// updateNavAuth() ažurira navigaciju zavisno od toga da li postoji sesija
document.addEventListener('DOMContentLoaded', updateNavAuth);

// ===================== SINHRONIZACIJA IZMEĐU TAB-OVA =====================
// Ovaj event listener omogućava real-time sinhronizaciju između različitih tab-ova
// Redosled: 1. Promena u jednom tab-u -> 2. Storage event u drugim tab-ovima -> 3. Ažuriranje UI
// Zašto? Da bi admin i korisnik videli promene u realnom vremenu

// window.addEventListener('storage', callback) - sluša promene localStorage-a
// e.key - ključ koji se promenio
window.addEventListener('storage', (e) => {
    // Proveravamo da li se promenio 'prc_reservations' ključ
    if (e.key === 'prc_reservations') {
        // Proveravamo da li je account modal otvoren
        const modal = document.getElementById('accountModal');
        
        // Ako modal postoji i ima 'open' klasu, osveži listu rezervacija
        if (modal && modal.classList.contains('open')) {
            renderUserReservations();
        }
    }
});
