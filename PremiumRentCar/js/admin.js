/* ===================== ADMIN PANEL PRO ===================== */

// ===================== KONSTANTE I GLOBALNE PROMENLJIVE =====================
// Ove promenljive su definisane na globalnom nivou (izvan svih funkcija) jer se koriste u više funkcija.
// Global scope znači da su dostupne svuda u ovom fajlu.
// U JavaScript-u, promenljive definisane van funkcija su globalne.

// Admin kredencijali - za DEMO verziju (u produkciji bi bili na serveru, ne u klijentskom kodu)
// Zašto const? const znači "constant" - vrednost se ne može reassign-ovati (promeniti)
// Ovo je bezbednost - ne želimo da neko slučajno promeni kredencijale tokom izvršavanja
// Napomena: U realnoj aplikaciji, ovo bi bilo na backend-u sa hash-ovanim lozinkama!
const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

// Filteri za tabelu rezervacija - čuvaju trenutno stanje filtera (status i pretraga)
// Zašto let? let znači da se vrednost MOGU reassign-ovati (promeniti)
// Ovo je potrebno jer korisnik menja filtere dok koristi aplikaciju
// Objekat sa dva property-ja: status (trenutni status filter) i search (tekst za pretragu)
let adminFilters = { status: 'all', search: '' };

// Instance Chart.js grafa - čuvamo referencu da bismo mogli da je unistimo pre ponovnog kreiranja
// Zašto? Chart.js biblioteka zahteva destroy() metodu pre ponovnog inicijaliziranja istog canvas elementa
// Ako ne unistimo staru instancu, desiće se memory leak i graf neće raditi ispravno
// Početna vrednost je null (znači da graf još nije kreiran)
let revenueChartInstance = null;

// ===================== AUTENTIFIKACIJA =====================

// ===================== FUNKCIJA ZA ADMIN PRIJAVU =====================
// Ova funkcija se poziva kada korisnik submit-uje login formu
// Redosled izvršavanja: 1. Korisnik unosi podatke -> 2. Klikne "Prijavi se" -> 3. Browser submit-uje formu -> 4. Poziva se ova funkcija

// Parametar 'e' je event object - sadrži informacije o događaju koji se desio (submit forme)
function adminLogin(e) {
    // preventDefault() je metoda event objekta koja sprečava default ponašanje browser-a
    // Default ponašanje forme je: submit -> refresh stranice -> pošalji podatke na server (action URL)
    // Mi sprečavamo ovo jer:
    // 1. Ne želimo refresh stranice (izgubili bismo stanje)
    // 2. Obradjujemo login na klijentskoj strani (JavaScript), ne na serveru
    // 3. Želimo da ostane na istoj stranici i prikažemo admin panel
    e.preventDefault();
    
    // Uzimamo vrednosti iz input polja iz DOM-a (Document Object Model)
    // document.getElementById() pronalazi element po ID-u - vrati null ako ne postoji
    // .value vraća trenutnu vrednost input elementa (ono što je korisnik uneo)
    // trim() uklanja whitespace (razmake, tabove, newline) sa POČETKA i KRAJA string-a
    // Zašto trim? Korisnik može slučajno pritisnuti space pre ili posle unosa - to ne bi trebalo uticati na login
    const u = document.getElementById('adminUser').value.trim();
    const p = document.getElementById('adminPass').value; // Lozinka se ne trim-uje (razmak može biti deo lozinke)

    // Proveravamo da li kredencijali odgovaraju onima u ADMIN_CREDENTIALS konstanti
    // Koristimo logički AND (&&) - oba uslova moraju biti true da bi ceo if bio true
    // Prvi uslov: (u === ADMIN_CREDENTIALS.username || u === 'admin@premiumrc.rs')
    //    - Koristimo OR (||) da bismo dozvolili dva različita username-a (fleksibilnost)
    //    - 'admin' ili 'admin@premiumrc.rs' - oba su validna
    // Drugi uslov: p === ADMIN_CREDENTIALS.password
    //    - Lozinka mora tačno odgovarati
    // U PRODUKCIJI ovo NIKADA ne bi bilo ovako - lozinke bi bile hash-ovane na serveru!
    if ((u === ADMIN_CREDENTIALS.username || u === 'admin@premiumrc.rs') && p === ADMIN_CREDENTIALS.password) {
        // sessionStorage je Web Storage API koji čuva podatke KLJUČ-VREDNOST
        // Ključ: 'prc_admin', Vrednost: '1' (string, ne broj!)
        // sessionStorage čuva podatke SAMO dok je tab/browser otvoren
        // Na close tab-a, podaci se brišu
        // Zašto sessionStorage a ne localStorage? 
        //    - Sigurnost: admin sesija traje samo dok je tab aktivan
        //    - localStorage traje čak i nakon zatvaranja browser-a (nije sigurno za sesije)
        //    - sessionStorage je per-session - idealno za login sesije
        sessionStorage.setItem('prc_admin', '1');
        
        // Pozivamo funkciju koja prikazuje admin panel
        // Ovo je funkcija koja je definisana ispod u ovom fajlu
        // Poziv funkcije preuzima kontrolu - izvršava se kod te funkcije
        showAdminPanel();
    } else {
        // Ako kredencijali nisu validni, prikažemo grešku korisniku
        // Pronalazimo element za prikaz greške po ID-u
        const err = document.getElementById('loginError');
        // style.display = 'flex' čini element vidljivim (CSS display property)
        // Flexbox layout za centriranje sadržaja unutar elementa
        err.style.display = 'flex'; 
        // querySelector() pronalazi prvi element koji odgovara CSS selektoru
        // Ovde tražimo <span> element unutar error elementa
        // textContent postavlja tekstualni sadržaj elementa (bez HTML-a, bezbednije od innerHTML)
        err.querySelector('span').textContent = 'Pogrešni kredencijali. Pokušajte ponovo.';
    }
}

// ===================== FUNKCIJA ZA ADMIN ODJAVU =====================
// Ova funkcija se poziva kada admin klikne dugme za odjavu
// Redosled izvršavanja: 1. Admin klikne "Odjava" -> 2. Poziva se ova funkcija -> 3. Sesiija se briše -> 4. Vraća se na login screen

function adminLogout() {
    // removeItem() briše par ključ-vrednost iz sessionStorage
    // Ključ 'prc_admin' se briše - to znači da admin više nije prijavljen
    // Zašto? Da bismo poništili login i zahtevali ponovnu prijavu pri sledećem poseti
    // Bez ovoga, admin bi ostao prijavljen čak i nakon klika na odjavu
    sessionStorage.removeItem('prc_admin');
    
    // Sakrijemo admin panel menjajući CSS display property
    // 'none' znači da element nije vidljiv i ne zauzima prostor u layout-u
    // getElementById pronalazi element sa ID-om 'adminPanel' u DOM-u
    document.getElementById('adminPanel').style.display = 'none';
    
    // Prikažemo login screen (on je bio sakriven)
    // 'flex' koristi flexbox layout - centriranje sadržaja
    // getElementById pronalazi element sa ID-om 'adminLoginScreen'
    document.getElementById('adminLoginScreen').style.display = 'flex';
}

// ===================== FUNKCIJA ZA PRIKAZ ADMIN PANELA =====================
// Ova funkcija se poziva nakon uspešne prijave ili ako je sesija već aktivna (npr. nakon refresh)
// Redosled izvršavanja: 1. Sakrije login screen -> 2. Prikaže admin panel -> 3. Ažurira vreme -> 4. Učitava podatke -> 5. Inicijalizuje chart

function showAdminPanel() {
    // Sakrijemo login screen menjajući CSS display property na 'none'
    // Element postaje nevidljiv i ne zauzima prostor u layout-u
    // Ovo je suprotno od onoga što radimo u adminLogout() gde sakrivamo panel i prikazujemo login
    document.getElementById('adminLoginScreen').style.display = 'none';
    
    // Prikažemo admin panel menjajući CSS display property na 'block'
    // 'block' je default display za div elemente - element zauzima punu širinu
    // Element postaje vidljiv i zauzima svoje mesto u layout-u
    document.getElementById('adminPanel').style.display = 'block';
    
    // Pozivamo funkciju koja ažurira datum i vreme u header-u admin panela
    // Ovo osigurava da je vreme ažurno kada se admin panel učita
    updateDateTime();
    
    // Pozivamo funkciju koja učitava sve potrebne podatke za dashboard
    // Ovo uključuje: statistiku, tabelu rezervacija, tabelu poruka, badge-ove
    // Ovo je ključna funkcija - bez nje bi bio prazan dashboard
    loadDashboard();
    
    // Pozivamo funkciju koja inicijalizuje Chart.js graf za prikaz prihoda
    // Chart.js je biblioteka za kreiranje interaktivnih grafova
    // Graf prikazuje mesečne prihode kroz godinu
    initChart();
}

// Funkcija za ažuriranje datuma i vremena u header-u
// Redosled: Poziva se svakog minuta automatski
function updateDateTime() {
    // Pronalazimo element u DOM-u gde će biti prikazano vreme
    // getElementById vraća element ili null ako ne postoji
    const el = document.getElementById('currentDateTime');
    
    // if(el) je guard clause - zaštita od grešaka
    // Zašto? Ako element ne postoji, el.textContent bi bacio grešku (Cannot read property 'textContent' of null)
    // Ovo je best practice - uvek proveravati da li element postoji pre manipulacije
    if(el) {
        // new Date() kreira novi Date objekat sa trenutnim datumom i vremenom
        // JavaScript Date objekat predstavlja trenutak u vremenu (milisekunde od 1. Jan 1970)
        const now = new Date();
        
        // options objekat definiše kako želimo da formatiramo datum
        // toLocaleDateString() koristi ove opcije za formatiranje
        // weekday: 'long' - pun naziv dana (npr. "ponedeljak")
        // year: 'numeric' - puna godina (npr. "2026")
        // month: 'long' - pun naziv meseca (npr. "maj")
        // day: 'numeric' - dan u mesecu (npr. "3")
        // hour: '2-digit' - sat sa vodećom nulom (npr. "23")
        // minute: '2-digit' - minute sa vodećom nulom (npr. "45")
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' };
        
        // toLocaleDateString() formatira Date objekat prema locale-u (jeziku i regionu)
        // 'sr-RS' je locale kod za srpski jezik u Srbiji
        // Ovo automatski koristi srpske nazive za dane i mesece, i srpski format datuma
        // Rezultat: "ponedeljak, 3. maj 2026. 23:45"
        el.textContent = now.toLocaleDateString('sr-RS', options);
    }
}

// setInterval() je Web API koji poziva funkciju periodično
// Prvi argument: funkcija koja se poziva (updateDateTime)
// Drugi argument: interval u milisekundama (60,000ms = 60 sekundi = 1 minuta)
// Zašto koristimo setInterval?
//    - Da bi se vreme osvežavalo automatski bez potrebe za refresh stranice
//    - Korisnik vidi uvek tačno vreme, čak ako ostane na stranici satima
//    - Bolje UX (user experience) - korisnik ne mora da refresh-uje
// Zašto 60,000ms?
//    - Dovoljno često za tačnost (minut je dovoljna preciznost za većinu aplikacija)
//    - Ne previše često za performanse (ne opterećuje browser)
//    - Sekundno osvežavanje bi bilo nepotrebno i opterećivalo sistem
setInterval(updateDateTime, 60000);

// ===================== DASHBOARD - UČITAVANJE PODATAKA =====================

// Ova je ključna funkcija za dashboard - učitava sve potrebne podatke i ažurira UI
// Redosled izvršavanja: 1. Uzmi podatke iz localStorage -> 2. Izračunaj statistiku -> 3. Ažuriraj UI elemente -> 4. Učitaj tabele

function loadDashboard() {
    // localStorage.getItem() uzima vrednost iz localStorage po ključu
    // 'prc_reservations' je ključ pod kojim čuvamo niz rezervacija
    // Vraća string ili null ako ključ ne postoji
    // || '[]' je logical OR operator - ako je leva strana falsy (null), koristi desnu stranu
    // Ovo je fallback mehanizam - ako nema podataka, koristi prazan niz kao string
    // JSON.parse() konvertuje JSON string u JavaScript objekat/niz
    // Zašto || '[]'? Da ne bi bilo greške ako localStorage nema podatke (JSON.parse(null) = null)
    const reservations = JSON.parse(localStorage.getItem('prc_reservations') || '[]');
    
    // Isto za korisnike - učitavamo niz korisnika iz localStorage
    // 'prc_users' je ključ za korisnike
    const users = JSON.parse(localStorage.getItem('prc_users') || '[]');

    // ===================== IZRAČUNAVANJE STATISTIKE =====================
    
    // reduce() je higher-order function za redukovanje niza na jednu vrednost
    // Prvi argument: callback funkcija koja se poziva za svaki element
    //    - sum: akumulator (čuva rezultat dosadašnjih iteracija)
    //    - r: trenutni element niza (rezervacija)
    // Drugi argument: početna vrednost akumulatora (0)
    // Callback vraća novu vrednost akumulatora (sum + cena)
    // r.totalPrice || 0 - ako rezervacija nema cene, koristi 0 (zašto? da ne bi bilo NaN)
    // NaN (Not a Number) se desi ako saberemo broj sa undefined
    // Zašto reduce? Efikasan, deklarativan način za sumiranje niza (bolje od for petlje)
    const totalRevenue = reservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    
    // filter() kreira novi niz sa elementima koji zadovoljavaju uslov
    // Uslov: r.status === 'Aktivna' - samo rezervacije sa statusom 'Aktivna'
    // .length vraća broj elemenata u filtriranom nizu
    // Zašto filter? Jednostavan, čitljiv način za filtriranje niza
    // Zašto .length? Hoćemo broj, ne niz aktivnih rezervacija
    const activeRes = reservations.filter(r => r.status === 'Aktivna').length;

    // ===================== AŽURIRANJE UI ELEMENTA =====================
    
    // getElementById pronalazi element u DOM-u po ID-u
    // textContent postavlja tekstualni sadržaj elementa (bez HTML-a, bezbednije od innerHTML)
    // reservations.length je broj svih rezervacija
    document.getElementById('statTotalRes').textContent = reservations.length;
    
    // Ažuriramo broj aktivnih rezervacija
    document.getElementById('statActiveRes').textContent = activeRes;
    
    // Ažuriramo broj registrovanih korisnika
    document.getElementById('statUsers').textContent = users.length;
    
    // toLocaleString('sr-RS') formatira broj prema srpskom locale-u
    // Dodaje razmake za hiljade (npr. 1234567 -> 1 234 567)
    // + '€' dodaje euro znak na kraju
    // Zašto toLocaleString? Bolje čitljivost brojeva (UX)
    document.getElementById('statRevenue').textContent = totalRevenue.toLocaleString('sr-RS') + '€';
    
    // Badge u navigaciji pokazuje broj rezervacija
    // if(badge) je guard clause - zaštita ako element ne postoji
    const badge = document.getElementById('navResCount');
    if(badge) badge.textContent = reservations.length;

    // ===================== UČITAVANJE TABELA =====================
    
    // Pozivamo funkciju koja renderuje tabelu rezervacija
    // Ova funkcija popunjava tbody element sa redovima tabele
    renderReservations();
    
    // Pozivamo funkciju koja renderuje tabelu poruka
    // Ova funkcija popunja tbody element sa porukama iz kontakt forme
    renderMessages();
}

// ===================== TABELA REZERVACIJA - RENDEROVANJE =====================

// Ova funkcija renderuje tabelu svih rezervacija sa mogućnošću filtriranja
// Redosled izvršavanja: 1. Uzmi podatke iz localStorage -> 2. Primeni filtere (status + pretraga) -> 3. Generiši HTML za svaki red -> 4. Umetni u DOM

function renderReservations() {
    // ===================== UČITAVANJE PODATAKA =====================
    
    // Učitavamo niz rezervacija iz localStorage
    // localStorage.getItem vraća JSON string ili null
    // || '[]' je fallback - ako nema podataka, koristimo prazan niz
    // JSON.parse() konvertuje JSON string u JavaScript niz objekata
    const reservations = JSON.parse(localStorage.getItem('prc_reservations') || '[]');
    
    // Učitavamo niz korisnika - potreban za dobavljanje imena i email-ova
    const users = JSON.parse(localStorage.getItem('prc_users') || '[]');

    // ===================== PRIPREMA PODATAKA ZA FILTRIRANJE =====================
    
    // [...] je spread operator - "širi" niz u individualne elemente
    // [...reservations] kreira NOVI niz koji je kopija originala
    // Zašto kopija? Da ne bismo menjali originalni niz (immutability principle)
    // .reverse() obrni redosled elemenata u nizu (poslednji postaje prvi)
    // Zašto reverse? Želimo da najnovije rezervacije budu na vrhu tabele (bolje UX)
    let filtered = [...reservations].reverse();

    // ===================== FILTRIRANJE PO STATUSU =====================
    
    // adminFilters.status je globalna promenljiva koja čuva trenutni status filter
    // 'all' znači da se prikazuju sve rezervacije (bez filtera)
    if (adminFilters.status !== 'all') {
        // filter() kreira novi niz sa elementima koji zadovoljavaju uslov
        // Uslov: r.status === adminFilters.status - samo rezervacije sa odabranim statusom
        // r je svaka rezervacija iz niza (element)
        filtered = filtered.filter(r => r.status === adminFilters.status);
    }

    // ===================== FILTRIRANJE PO PRETRAGI =====================
    
    // adminFilters.search čuva tekst koji korisnik ukuca u search polje
    // if(adminFilters.search) proverava da li postoji tekst za pretragu (truthy check)
    if (adminFilters.search) {
        // toLowerCase() konvertuje string u mala slova
        // Zašto? Case-insensitive pretraga - 'BMW' i 'bmw' treba da daju iste rezultate
        const q = adminFilters.search.toLowerCase();
        
        // filter() vraća rezervacije koje sadrže search tekst
        filtered = filtered.filter(r =>
            // || je logički OR - rezervacija se prikazuje ako zadovoljava BAR JEDAN uslov
            
            // Prvi uslov: pretraga po imenu vozila
            // r.carName je ime vozila (npr. "Mercedes-Benz S-Class")
            // .toLowerCase() pretvara u mala slova za poređenje
            // .includes(q) proverava da li string sadrži search tekst
            // Zašto includes a ne ===? Partial match - 'mer' će naći 'Mercedes'
            r.carName.toLowerCase().includes(q) ||
            
            // Drugi uslov: pretraga po imenu korisnika
            // getUserName() je helper funkcija koja vraća ime korisnika preko ID-ja
            // r.userId je ID korisnika koji je napravio rezervaciju
            getUserName(users, r.userId).toLowerCase().includes(q)
        );
    }

    // ===================== PRIKAZ U DOM-U =====================
    
    // getElementById pronalazi tbody element tabele po ID-u
    // tbody je <tbody> element koji sadrži redove tabele
    const tbody = document.getElementById('reservationsBody');
    
    // innerHTML = '' čisti sadržaj elementa (brisanje postojećih redova)
    // Zašto? Da bismo izbegli dupliranje redova pri svakom renderovanju
    tbody.innerHTML = '';

    // ===================== PRAZNA TABELA (EMPTY STATE) =====================
    
    // Proveravamo da li ima rezervacija nakon filtriranja
    if (filtered.length === 0) {
        // Ako nema rezervacija, prikazujemo "empty state" poruku
        // colspan="6" znači da ćelija se prostire preko 6 kolona (cele širine tabele)
        // style atributi za inline CSS stiliziranje
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:60px 20px; color:var(--text-muted);">
            <div style="background:rgba(255,255,255,0.02); width:80px; height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px;">
                <i class="fas fa-inbox" style="font-size:2.5rem; opacity:0.5;"></i>
            </div>
            <p style="font-weight:600; font-size:1.1rem; color:var(--text-main);">Nema rezervacija</p>
            <p style="font-size:0.9rem; margin-top:5px;">Trenutno nema rezervacija koje odgovaraju filterima.</p>
        </td></tr>`;
        
        // return prekida izvršavanje funkcije (early return)
        // Zašto? Nema potrebe za daljom obradom ako nema podataka
        return;
    }

    // ===================== GENERISANJE REDOVA TABELE =====================
    
    // forEach() je higher-order function koja poziva callback za svaki element niza
    // r je trenutna rezervacija (element niza)
    // Zašto forEach umesto for petlje?
    //    - Čitljiviji i deklarativniji kod
    //    - Manje šanse za greške (nema indeksiranja)
    //    - Moderniji JavaScript pattern
    filtered.forEach(r => {
        // ===================== DOBAVLJANJE KORISNIČKIH PODATAKA =====================
        
        // Pozivamo helper funkciju koja vraća ime korisnika preko ID-ja
        // users je niz svih korisnika, r.userId je ID korisnika koji je napravio rezervaciju
        const userName = getUserName(users, r.userId);
        
        // Pozivamo helper funkciju koja vraća email korisnika preko ID-ja
        const userEmail = getUserEmail(users, r.userId);
        
        // ===================== ODREĐIVANJE STATUS KLASE =====================
        
        // Ternarni operator (condition ? valueIfTrue : valueIfFalse)
        // Ovo je ugniježđeni ternarni - prvi proverava 'Aktivna', zatim 'Otkazana', inače 'status-done'
        // Zašto ternarni? Kompaktniji način za if-else logiku u jednom redu
        // r.status je trenutni status rezervacije
        // statusClass se koristi za CSS stilizaciju badge-a (boja)
        const statusClass = r.status === 'Aktivna' ? 'status-active' : r.status === 'Otkazana' ? 'status-cancelled' : 'status-done';
        
        // ===================== KREIRANJE AVATARA =====================
        
        // charAt(0) vraća karakter na poziciji 0 (prvo slovo)
        // toUpperCase() konvertuje u veliko slovo
        // Zašto? Prvo slovo imena za avatar (npr. "Marko" -> "M")
        const userInitial = userName.charAt(0).toUpperCase();

        // ===================== KREIRANJE TABLE ROW ELEMENTA =====================
        
        // createElement() kreira novi DOM element
        // 'tr' znači table row (red tabele)
        // Zašto createElement umesto innerHTML?
        //    - Bezbednije (XSS zaštita)
        //    - Bolje performanse (browser ne mora da parsira HTML)
        //    - Možemo kasnije dodati event listenere
        const tr = document.createElement('tr');
        
        // ===================== POPUNJAVANJE REDA SA HTML-OM =====================
        
        // Template literals (backticks `) omogućavaju ubacivanje varijabli u string
        // ${variable} je placeholder za varijablu
        // innerHTML postavlja HTML sadržaj elementa
        // Ovde koristimo innerHTML jer je statički HTML bez event handlera
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
                    <!-- Fallback slika ako original ne uspe da učita -->
                    <!-- r.carImage || '...' - ako nema slike, koristi placeholder -->
                    <!-- onerror je event handler koji se poziva ako slika ne uspe da učita -->
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
                    <!-- Dinamički prikaz dugmadi na osnovu trenutnog statusa -->
                    ${r.status !== 'Aktivna' ? `<button onclick="changeStatus('${r.id}', 'Aktivna')" title="Aktiviraj" class="action-btn"><i class="fas fa-check"></i></button>` : ''}
                    ${r.status !== 'Završena' ? `<button onclick="changeStatus('${r.id}', 'Završena')" title="Završi" class="action-btn"><i class="fas fa-flag-checkered"></i></button>` : ''}
                    ${r.status !== 'Otkazana' ? `<button onclick="changeStatus('${r.id}', 'Otkazana')" title="Otkaži" class="action-btn"><i class="fas fa-ban"></i></button>` : ''}
                    <button onclick="deleteAdminReservation('${r.id}')" title="Obriši" class="action-btn delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        
        // Dodaj red u tbody
        tbody.appendChild(tr);
    });
}

// ===================== TABELA PORUKA - RENDEROVANJE =====================

// Funkcija za renderovanje tabele poruka sa brojačem nepročitanih
// Redosled: 1. Uzmi poruke -> 2. Izbroji nepročitane -> 3. Ažuriraj badge-ove -> 4. Generiši tabelu
function renderMessages() {
    // Učitaj poruke iz localStorage
    const messages = JSON.parse(localStorage.getItem('prc_messages') || '[]');
    
    // Referenca na tbody element
    const tbody = document.getElementById('messagesBody');
    
    // Badge u navigaciji (broj nepročitanih)
    const badge = document.getElementById('navMsgCount');
    
    // Notifikaciona tačka na ikonici
    // querySelector trazi prvi matching element (fallback ako prvi ne postoji)
    const notifDot = document.querySelector('.header-actions .icon-btn:nth-child(2) .notification-dot') || document.querySelector('.notification-dot');
    
    // Early return ako tbody ne postoji (zašto? da ne bi bilo grešaka)
    if(!tbody) return;
    tbody.innerHTML = ''; // Očisti tabelu

    // Izbroji nepročitane poruke (read: false)
    const unreadCount = messages.filter(m => !m.read).length;

    // Ažuriraj badge u navigaciji
    if (badge) {
        badge.textContent = unreadCount;
        // Prikaži samo ako ima nepročitanih
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

    // Obrni redosled (najnovije prve) i renderuj svaku poruku
    [...messages].reverse().forEach(m => {
        const isRead = m.read; // Da li je pročitana
        
        // HTML za status badge (pročitano / novo)
        // Zašto različite boje? Da bi se istaknule nepročitane poruke
        const statusHtml = isRead ? 
            `<span style="color:var(--text-muted); font-size:0.8rem;"><i class="fas fa-envelope-open"></i> Pročitano</span>` : 
            `<span style="color:var(--gold); font-size:0.8rem; font-weight:bold;"><i class="fas fa-envelope"></i> Novo</span>`;
            
        const tr = document.createElement('tr');
        // Istakni nepročitane poruke sa pozadinskom bojom
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
// ===================== MARK MESSAGE AS READ =====================

// Ova funkcija označava poruku kao pročitanu
// Redosled izvršavanja: 1. Uzmi sve poruke iz localStorage -> 2. Pronađi i ažuriraj određenu poruku -> 3. Sačuvaj -> 4. Ponovo renderuj tabelu
function markMessageRead(id) {
    // ===================== UČITAVANJE PORUKA =====================
    
    // localStorage.getItem() uzima JSON string iz localStorage
    // 'prc_messages' je ključ za čuvanje poruka
    // || '[]' je fallback - ako nema podataka, koristi prazan niz kao string
    // JSON.parse() konvertuje JSON string u JavaScript niz objekata
    // let umesto const jer ćemo reassign-ovati promenljivu all
    let all = JSON.parse(localStorage.getItem('prc_messages') || '[]');
    
    // ===================== AŽURIRANJE PORUKE =====================
    
    // map() je higher-order function koja kreira NOVI niz transformišući svaki element
    // Zašto map umesto direktnog menjanja?
    //    - Immutability principle: ne menjamo originalni niz
    //    - Funkcionalno programiranje: čisti, predvidljivi kod
    //    - Sprečava nuspojave (side effects)
    // 
    // Callback funkcija: m => m.id === id ? { ...m, read: true } : m
    //    - m je trenutna poruka iz niza
    //    - Ternarni operator proverava: da li je ID poruke jednak traženom ID-ju?
    //    - Ako da: kreiraj NOVI objekat sa svim postojećim svojstvima (...m) i setuj read: true
    //    - Ako ne: vrati nepromenjenu poruku (m)
    //
    // ...m (spread operator) "širi" sva svojstva objekta m u novi objekat
    //    - { ...m, read: true } znači: kopiraj sve iz m, i dodaj/overriduj read sa true
    //    - Ovo je object spread - ES6 feature
    //
    // Zašto kreiramo novi objekat umesto direktnog menjanja m.read?
    //    - Immutability: originalni podaci ostaju nepromenjeni
    //    - Olakšava debugging i testiranje
    //    - Sprečava neočekivane nuspojave
    all = all.map(m => m.id === id ? { ...m, read: true } : m);
    
    // ===================== ČUVANJE U LOCALSTORAGE =====================
    
    // localStorage.setItem() čuva par ključ-vrednost u localStorage
    // Prvi argument: ključ ('prc_messages')
    // Drugi argument: vrednost (mora biti string!)
    // JSON.stringify() konvertuje JavaScript objekat/niz u JSON string
    // Zašto stringify? localStorage čuva samo stringove, ne objekte
    localStorage.setItem('prc_messages', JSON.stringify(all));
    
    // ===================== OSVEŽAVANJE UI-A =====================
    
    // Pozivamo renderMessages() da bi se ažurirao UI
    // Ovo će:
    //    - Ponovo učitati poruke iz localStorage
    //    - Izračunati novi broj nepročitanih poruka
    //    - Ažurirati badge-ove
    //    - Ponovo renderovati tabelu
    // Zašto? Da bi korisnik video da je poruka sada označena kao pročitana
    renderMessages();
}

// ===================== DELETE MESSAGE (SHOW CONFIRM MODAL) =====================

// Ova funkcija prikazuje confirm modal pre brisanja poruke
// Redosled izvršavanja: 1. Sačuvaj ID u globalnoj promenljivoj -> 2. Postavi tip brisanja -> 3. Ažuriraj modal tekst -> 4. Prikaži modal
// Zašto confirm modal? Da bi se sprečilo slučajno brisanje (UX best practice)

function deleteMessage(id) {
    // ===================== ČUVANJE ID-A ZA KASNIJE BRISANJE =====================
    
    // itemToDelete je GLOBALNA promenljiva definisana van funkcija
    // Zašto globalna? Jer se koristi u drugoj funkciji (confirmDeleteBtn click handler)
    // Ovo je pattern za dva-step akcije: 1. sačuvaj ID, 2. potvrdi i obriši
    // id je ID poruke koju želimo da obrišemo
    itemToDelete = id;
    
    // ===================== POSTAVLJANJE TIPA BRISANJA =====================
    
    // deleteType je takođe GLOBALNA promenljiva
    // Čuva informaciju o tome šta se briše: 'message' ili 'reservation'
    // Zašto? Confirm funkcija mora da zna šta briše da bi koristio odgovarajući ključ localStorage-a
    deleteType = 'message';
    
    // ===================== AŽURIRANJE TEKSTA MODALA =====================
    
    // querySelector() pronalazi prvi element koji odgovara CSS selektoru
    // '#deleteConfirmModal p' pronalazi <p> element unutar elementa sa ID 'deleteConfirmModal'
    // # je ID selektor, p je tag selektor
    // textContent postavlja tekstualni sadržaj elementa (bez HTML-a, bezbednije od innerHTML)
    // Zašto dinamički tekst? Različite poruke za brisanje različitih stvari
    document.querySelector('#deleteConfirmModal p').textContent = 'Da li ste sigurni da želite da trajno obrišete ovu poruku? Ova akcija se ne može poništiti.';
    
    // ===================== PRIKAZ MODALA =====================
    
    // getElementById() pronalazi element po ID-u
    // classList.add() dodaje CSS klasu elementu
    // 'open' je CSS klasa koja čini modal vidljivim (npr. display: block ili opacity: 1)
    // Zašto classList.add umesto style.display? Čistije razdvajanje HTML/CSS/JS
    document.getElementById('deleteConfirmModal').classList.add('open');
}

// ===================== HELPER FUNKCIJE =====================

// Ova sekcija sadrži pomoćne funkcije koje se koriste više puta u kodu
// Helper funkcije su best practice za DRY (Don't Repeat Yourself) princip

// ===================== GET USER NAME =====================

// Pomoćna funkcija za dobavljanje imena korisnika preko ID-ja
// Parametri:
//    - users: niz svih korisnika
//    - userId: ID korisnika čije ime tražimo
// Vraća: Ime korisnika ili fallback vrednost
// Zašto ova funkcija? Da ne bismo ponavljali ovaj kod više puta (DRY principle)
// Gde se koristi? U renderReservations() za prikaz imena korisnika u tabeli

function getUserName(users, userId) {
    // ===================== PRONALAŽENJE KORISNIKA =====================
    
    // find() je array method koji vraća PRVI element koji zadovoljava uslov
    // Ako ne pronađe element, vraća undefined
    // Callback: u => u.id === userId
    //    - u je trenutni korisnik iz niza
    //    - u.id === userId je uslov: da li je ID korisnika jednak traženom ID-ju?
    // === je strict equality operator (proverava tip i vrednost)
    // Zašto find umesto filter? find vraća samo jedan element, filter vraća niz
    const u = users.find(u => u.id === userId);
    
    // ===================== VRACANJE REZULTATA =====================
    
    // Ternarni operator: u ? u.name : 'Gost Korisnik'
    //    - u je truthy ako korisnik postoji (nije undefined/null)
    //    - Ako korisnik postoji: vrati u.name (ime korisnika)
    //    - Ako korisnik ne postoji: vrati 'Gost Korisnik' (fallback vrednost)
    // Zašto fallback? Da ne bi bilo grešaka ako korisnik ne postoji (defensive programming)
    // 'Gost Korisnik' je placeholder za nepoznate korisnike
    return u ? u.name : 'Gost Korisnik';
}

// ===================== GET USER EMAIL =====================

// Pomoćna funkcija za dobavljanje email-a korisnika preko ID-ja
// Parametri:
//    - users: niz svih korisnika
//    - userId: ID korisnika čiji email tražimo
// Vraća: Email korisnika ili fallback vrednost
// Zašto ova funkcija? Isto kao getUserName - DRY principle
// Gde se koristi? U renderReservations() za prikaz email-a korisnika u tabeli

function getUserEmail(users, userId) {
    // Pronalazimo korisnika sa datim ID-jem
    // Isti princip kao u getUserName()
    const u = users.find(u => u.id === userId);
    
    // Vraćamo email ili fallback
    // 'nepoznato@email.com' je placeholder za nepoznate email-ove
    // Zašto placeholder? Da ne bi bilo undefined/null u UI-u (defensive programming)
    return u ? u.email : 'nepoznato@email.com';
}

// ===================== CHANGE RESERVATION STATUS =====================

// Ova funkcija menja status rezervacije (Aktivna/Završena/Otkazana)
// Parametri:
//    - id: ID rezervacije kojoj menjamo status
//    - status: novi status (npr. 'Aktivna', 'Završena', 'Otkazana')
// Redosled izvršavanja: 1. Uzmi rezervacije iz localStorage -> 2. Pronađi i ažuriraj status -> 3. Sačuvaj -> 4. Ponovo učitaj dashboard
// Gde se koristi? Klikom na dugmad u tabeli rezervacija

function changeStatus(id, status) {
    // ===================== UČITAVANJE REZERVACIJA =====================
    
    // Učitavamo niz svih rezervacija iz localStorage
    // 'prc_reservations' je ključ za čuvanje rezervacija
    // let umesto const jer ćemo reassign-ovati promenljivu all
    let all = JSON.parse(localStorage.getItem('prc_reservations') || '[]');
    
    // ===================== AŽURIRANJE STATUSA =====================
    
    // map() kreira novi niz transformišući svaki element
    // Callback: r => r.id === id ? { ...r, status } : r
    //    - r je trenutna rezervacija
    //    - Ternarni operator: da li je ID rezervacije jednak traženom ID-ju?
    //    - Ako da: kreiraj NOVI objekat sa svim svojstvima iz r i novim statusom
    //    - Ako ne: vrati nepromenjenu rezervaciju
    //
    // { ...r, status } je shorthand za { ...r, status: status }
    //    - ...r kopira sva postojeća svojstva (id, carName, userId, dateFrom, dateTo, totalPrice, itd.)
    //    - status overriduje status property sa novom vrednošću
    //    - Ovo je ES6 object spread shorthand
    //
    // status je parametar funkcije koji se prosleđuje prilikom poziva
    //    - Npr. changeStatus('123', 'Aktivna') - status će biti 'Aktivna'
    //
    // Zašto map i novi objekat? Immutability principle (kao u markMessageRead)
    all = all.map(r => r.id === id ? { ...r, status } : r);
    
    // ===================== ČUVANJE U LOCALSTORAGE =====================
    
    // Sačuvavamo ažurirane rezervacije u localStorage
    // JSON.stringify() konvertuje niz u JSON string
    localStorage.setItem('prc_reservations', JSON.stringify(all));
    
    // ===================== OSVEŽAVANJE DASHBOARD-A =====================
    
    // Pozivamo loadDashboard() da bi se ažurirao ceo dashboard
    // Ovo će:
    //    - Ponovo izračunati statistiku (ukupan prihod, broj aktivnih rezervacija)
    //    - Ažurirati brojce na dashboard-u
    //    - Ponovo renderovati tabelu rezervacija
    // Zašto loadDashboard umesto samo renderReservations?
    //    - Status promena utiče na statistiku (npr. broj aktivnih rezervacija)
    //    - Potrebno je ažurirati sve UI elemente koji zavise od statusa
    loadDashboard();
}

// ===================== GLOBALNE PROMENLJIVE ZA BRISANJE =====================

// Ove promenljive se koriste za praćenje stavke koja se briše kroz confirm modal
// Zašto globalne? Jer se koriste u različitim funkcijama:
//    - deleteMessage() ili deleteAdminReservation() postavljaju vrednosti
//    - confirmDeleteBtn click handler koristi vrednosti za brisanje
// Ovo je pattern za dva-step akcije: 1. klik na obriši (sačuvaj ID), 2. potvrda (obriši)

// itemToDelete čuva ID stavke koja se briše
// null znači da trenutno ništa nije označeno za brisanje
let itemToDelete = null;

// deleteType čuva tip stavke: 'message' ili 'reservation'
// Potrebno je jer confirm funkcija mora da zna iz kojeg localStorage ključa briše
let deleteType = null;

// ===================== DELETE RESERVATION (SHOW CONFIRM MODAL) =====================

// Ova funkcija prikazuje confirm modal pre brisanja rezervacije
// Parametar: id - ID rezervacije koju želimo da obrišemo
// Redosled izvršavanja: 1. Sačuvaj ID u globalnoj promenljivoj -> 2. Postavi tip brisanja -> 3. Ažuriraj modal tekst -> 4. Prikaži modal
// Zašto confirm modal? Da bi se sprečilo slučajno brisanje (UX best practice)
// Gde se koristi? Klikom na dugme za brisanje u tabeli rezervacija

function deleteAdminReservation(id) {
    // ===================== ČUVANJE ID-A ZA KASNIJE BRISANJE =====================
    
    // Sačuvaj ID rezervacije u globalnoj promenljivoj itemToDelete
    // Ovaj ID će se koristiti kada korisnik potvrdi brisanje u modal-u
    itemToDelete = id;
    
    // ===================== POSTAVLJANJE TIPA BRISANJA =====================
    
    // Postavi tip brisanja na 'reservation'
    // Confirm funkcija će koristiti ovu vrednost da zna da briše iz 'prc_reservations'
    deleteType = 'reservation';
    
    // ===================== AŽURIRANJE TEKSTA MODALA =====================
    
    // querySelector pronalazi <p> element unutar deleteConfirmModal
    // textContent postavlja tekst poruke u modal-u
    // Zašto drugačiji tekst nego za poruke? Različiti konteksti brisanja
    document.querySelector('#deleteConfirmModal p').textContent = 'Da li ste sigurni da želite da trajno obrišete ovu rezervaciju? Ova akcija se ne može poništiti i ukloniće sve podatke.';
    
    // ===================== PRIKAZ MODALA =====================
    
    // classList.add('open') dodaje CSS klasu 'open' elementu
    // CSS klasa 'open' čini modal vidljivim (npr. display: block ili opacity: 1)
    document.getElementById('deleteConfirmModal').classList.add('open');
}

// ===================== CLOSE DELETE MODAL =====================

// Ova funkcija zatvara delete confirm modal bez brisanja
// Redosled izvršavanja: 1. Resetuj globalne promenljive -> 2. Sakrij modal
// Gde se koristi? Klikom na "Otkaži" ili "X" dugme u modal-u

function closeDeleteModal() {
    // ===================== RESETOVANJE GLOBALNIH PROMENLJIVIH =====================
    
    // Resetuj itemToDelete na null
    // Zašto? Da se ne bi slučajno obrisala stavka ako se modal ponovo otvori
    // Ovo je sigurnosna mera (defensive programming)
    itemToDelete = null;
    
    // Resetuj deleteType na null
    // Isto razlog kao za itemToDelete
    deleteType = null;
    
    // ===================== SAKRIVANJE MODALA =====================
    
    // classList.remove('open') uklanja CSS klasu 'open' iz elementa
    // Modal postaje nevidljiv (npr. display: none ili opacity: 0)
    document.getElementById('deleteConfirmModal').classList.remove('open');
}

// ===================== FILTER RESERVATIONS BY STATUS =====================

// Ova funkcija filtrira rezervacije po statusu (Sve/Aktivne/Završene/Otkazane)
// Parametar: status - status po kojem filtriramo ('all', 'Aktivna', 'Završena', 'Otkazana')
// Redosled izvršavanja: 1. Ažuriraj filter state (globalna promenljiva) -> 2. Ažuriraj UI (active klasa na dugmetu) -> 3. Ponovo renderuj tabelu
// Gde se koristi? Klikom na filter dugmad iznad tabele rezervacija

function filterByStatus(status) {
    // ===================== AŽURIRANJE FILTER STATE-A =====================
    
    // adminFilters je globalni objekat koji čuva trenutno stanje filtera
    // adminFilters.status se ažurira sa novim statusom
    // Ova vrednost se koristi u renderReservations() za filtriranje
    // Zašto globalna promenljiva? Da bi filter stanje bilo očuvano između renderovanja
    adminFilters.status = status;
    
    // ===================== AŽURIRANJE UI-A (ACTIVE KLASA) =====================
    
    // querySelectorAll() pronalazi SVE elemente koji odgovaraju CSS selektoru
    // '.filter-btn' je CSS selektor za sva filter dugmad
    // Vraća NodeList (niz-like objekat) sa svim pronađenim elementima
    // Zašto querySelectorAll umesto querySelector? querySelector vraća samo prvi element
    document.querySelectorAll('.filter-btn').forEach(t => t.classList.remove('active'));
    
    // forEach() iterira kroz svaki element NodeList-a
    // t je trenutno filter dugme
    // classList.remove('active') uklanja CSS klasu 'active' iz elementa
    // Zašto uklanjamo sa svih? Da bismo osigurali da samo jedno dugme bude active
    // 
    // Ovaj pattern je:
    //    1. Ukloni active klasu sa svih dugmadi
    //    2. Dodaj active klasu na kliknuto dugme (sledeći korak)
    // Ovo osigurava da uvek samo jedno dugme bude označeno kao active
    
    // ===================== DODAVANJE ACTIVE KLASE NA KLIKNUTO DUGME =====================
    
    // Template literal (backticks) omogućava ubacivanje varijable u string
    // `.filter-btn[data-status="${status}"]` je CSS selektor:
    //    - .filter-btn: element sa klasom filter-btn
    //    - [data-status="..."]: element sa data-status atributom jednakim status
    // Na primer, ako je status 'Aktivna', selektor je .filter-btn[data-status="Aktivna"]
    // querySelector pronalazi PRVI element koji odgovara selektoru
    // classList.add('active') dodaje CSS klasu 'active' elementu
    // Active klasa vizuelno ističe kliknuto dugme (npr. druga boja)
    document.querySelector(`.filter-btn[data-status="${status}"]`).classList.add('active');
    
    // ===================== PONOVNO RENDEROVANJE TABELE =====================
    
    // Pozivamo renderReservations() da bi se tabela ažurirala sa novim filterom
    // renderReservations() će:
    //    - Učitati sve rezervacije iz localStorage
    //    - Primeniti filter (adminFilters.status)
    //    - Primeniti pretragu (adminFilters.search)
    //    - Renderovati samo filtrirane rezervacije
    // Zašto ponovno renderovanje? Tabela se dinamički ažurira na osnovu filtera
    renderReservations();
}

// ===================== SEARCH RESERVATIONS =====================

// Ova funkcija pretražuje rezervacije po imenu vozila ili imenu korisnika
// Redosled izvršavanja: 1. Uzmi vrednost iz search input polja -> 2. Sačuvaj u filter state -> 3. Ponovo renderuj tabelu
// Gde se koristi? Kada korisnik kuca u search polje (oninput event)
// Zašto se poziva na svaki unos? Real-time pretraga (bolje UX)

function searchReservations() {
    // ===================== UZIMANJE SEARCH TEKSTA =====================
    
    // getElementById pronalazi input element sa ID 'searchInput'
    // .value vraća trenutnu vrednost input polja (ono što je korisnik uneo)
    // Sačuvavamo u adminFilters.search da bi renderReservations() mogao da koristi
    // Zašto sačuvati u promenljivoj? Da bi filter stanje bilo očuvano između renderovanja
    adminFilters.search = document.getElementById('searchInput').value;
    
    // ===================== PONOVNO RENDEROVANJE TABELE =====================
    
    // Pozivamo renderReservations() da bi se tabela ažurirala sa novim search filterom
    // renderReservations() će primeniti pretragu koristeći adminFilters.search
    // Pretraga je case-insensitive i radi po imenu vozila ili imenu korisnika
    // Zašto real-time pretraga? Korisnik odmah vidi rezultate dok kuca (bolje UX)
    renderReservations();
}

// ===================== TOGGLE PASSWORD VISIBILITY =====================

// Ova funkcija menja vidljivost lozinke u login formi (password/text)
// Redosled izvršavanja: 1. Pronađi input element -> 2. Promeni type između password i text -> 3. Promeni ikonicu (eye/eye-slash)
// Gde se koristi? Klikom na eye ikonicu pored input polja za lozinku
// Zašto ova funkcija? Da bi korisnik mogao da proveri šta je uneo (UX best practice)

function toggleAdminPass() {
    // ===================== PRONALAŽENJE INPUT ELEMENTA =====================
    
    // getElementById pronalazi input element sa ID 'adminPass'
    // Ovo je input polje za unos lozinke u login formi
    const inp = document.getElementById('adminPass');
    
    // ===================== MENJANJE TYPE-A INPUT-A =====================
    
    // HTML input type atribut određuje kako se input prikazuje
    // type='password': sakriva karaktere (prikazuje ••••••)
    // type='text': prikazuje karaktere u vidljivom formatu
    //
    // Ternarni operator: inp.type === 'password' ? 'text' : 'password'
    //    - Proverava da li je trenutni type 'password'
    //    - Ako da: menja na 'text' (prikaži lozinku)
    //    - Ako ne: menja na 'password' (sakrij lozinku)
    //
    // Zašto toggle? Da bi korisnik mogao da vidi šta je uneo (provera grešaka)
    // Ovo je standard UX pattern za forme sa lozinkom
    inp.type = inp.type === 'password' ? 'text' : 'password';
    
    // ===================== MENJANJE IKONICE =====================
    
    // querySelector pronalazi element sa klasom 'toggle-admin-pass'
    // Ovo je eye ikonica pored input polja
    const icon = document.querySelector('.toggle-admin-pass');
    
    // if(icon) je guard clause - zaštita ako ikonica ne postoji
    if (icon) {
        // classList.toggle() dodaje ili uklanja CSS klasu
        // Ako klasa postoji, uklanja je. Ako ne postoji, dodaje je.
        //
        // fa-eye je Font Awesome klasa za "eye" ikonicu (vidljivo)
        // fa-eye-slash je Font Awesome klasa za "eye-slash" ikonicu (sakriveno)
        //
        // Ovaj pattern menja ikonicu:
        //    - Ako je fa-eye, uklanja fa-eye i dodaje fa-eye-slash
        //    - Ako je fa-eye-slash, uklanja fa-eye-slash i dodaje fa-eye
        //
        // Zašto dva toggle poziva? Font Awesome koristi zamenjive ikonice
        //    - Jedna ikonica je uvek prisutna, druga nije
        //    - Toggle obezbeđuje da se samo jedna prikazuje u svakom trenutku
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }
}

// ===================== CHART.JS INICIJALIZACIJA =====================

// Ova funkcija inicijalizuje Chart.js graf za prikaz mesečnih prihoda
// Chart.js je popularna JavaScript biblioteka za kreiranje interaktivnih grafova
// Redosled izvršavanja: 1. Proveri da li canvas postoji -> 2. Unisti postojeću instancu -> 3. Kreiraj gradient -> 4. Inicijalizuj Chart.js
// Gde se koristi? U showAdmin() nakon uspešne prijave admin-a
// Zašto Chart.js? Jednostavna biblioteka za kreiranje lepih, interaktivnih grafova

function initChart() {
    // ===================== PROVERA CANVAS ELEMENTA =====================
    
    // getElementById pronalazi <canvas> element sa ID 'revenueChart'
    // Canvas je HTML5 element za crtanje grafika putem JavaScript-a
    // Chart.js koristi canvas za crtanje grafova
    const ctx = document.getElementById('revenueChart');
    
    // if(!ctx) je guard clause - zaštita ako canvas ne postoji
    // Zašto early return? Da ne bi bilo grešaka ako element ne postoji (defensive programming)
    // return prekida izvršavanje funkcije
    if(!ctx) return;
    
    // ===================== UNIŠTAVANJE POSTOJEĆE INSTANCE =====================
    
    // revenueChartInstance je globalna promenljiva koja čuva referencu na Chart.js instancu
    // if(revenueChartInstance) proverava da li instanca već postoji
    if(revenueChartInstance) {
        // destroy() je Chart.js metoda koja uništava instancu grafa
        // Zašto destroy? Chart.js ne dozvoljava više instanci na istom canvas elementu
        // Ako ne uništimo staru instancu, desiće se memory leak i graf neće raditi ispravno
        // Ovo je važno kada se funkcija poziva više puta (npr. nakon refresh-a)
        revenueChartInstance.destroy();
    }
    
    // ===================== DUMMY PODACI =====================
    
    // labels su oznake za X-osu (meseci u godini)
    // U DEMO verziji koristimo fiksne podatke
    // U PRODUKCIJI ovi podaci bi dolazili iz baze ili localStorage-a
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];
    
    // data su vrednosti za Y-osu (prihodi po mesecima u evrima)
    // Ovo su dummy podaci za vizuelnu prezentaciju
    const data = [1200, 1900, 1500, 2200, 2800, 3500, 4200, 4000, 3100, 2400, 1800, 2000];
    
    // ===================== KREIRANJE GRADIENT-A =====================
    
    // ctx.getContext('2d') vraća 2D rendering context za canvas
    // Context je objekat koji omogućava crtanje na canvas-u
    // createLinearGradient(x0, y0, x1, y1) kreira linearni gradient
    //    - (0, 0) je početna tačka (gore levo)
    //    - (0, 400) je krajnja tačka (dole levo)
    //    - Gradient ide od vrha do dna
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    
    // addColorStop(position, color) dodaje boju na poziciji u gradient-u
    // position je između 0 (početak) i 1 (kraj)
    // rgba(212, 175, 55, 0.4) je zlatna boja sa 40% transparentnošću
    // Zašto gradient? Da bi graf izgledao modernije i profesionalnije
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.4)'); // Zlatna na vrhu
    
    // rgba(212, 175, 55, 0.0) je zlatna boja sa 0% transparentnošću (potpuno transparentna)
    // Zašto transparentna na dnu? Da bi se postepeno nestajala (fade-out efekat)
    gradient.addColorStop(1, 'rgba(212, 175, 55, 0.0)'); // Transparentna na dnu
    
    // ===================== KREIRANJE CHART.JS INSTANCE =====================
    
    // new Chart(ctx, config) kreira novu Chart.js instancu
    // ctx je canvas element (ili 2D context)
    // config je objekat sa konfiguracijom grafa
    revenueChartInstance = new Chart(ctx, {
        // ===================== TIP GRAFA =====================
        
        // type: 'line' znači da je linijski graf
        // Drugi mogući tipovi: 'bar', 'pie', 'doughnut', 'radar', itd.
        type: 'line',
        
        // ===================== PODACI GRAFA =====================
        
        data: {
            // labels su oznake na X-osi (meseci)
            labels: labels,
            
            // datasets je niz sa jednim ili više dataset-a (linija u grafu)
            datasets: [{
                label: 'Prihod (€)', // Naziv linije (koristi se u legendi i tooltip-u)
                data: data, // Vrednosti na Y-osi
                
                // ===================== STILOVANJE LINIJE =====================
                
                borderColor: '#d4af37', // Boja linije (zlatna - hex kod)
                backgroundColor: gradient, // Boja ispunja ispod linije (gradient)
                borderWidth: 3, // Debljina linije u pikselima
                
                // ===================== ZAKRIVLJENOST LINIJE =====================
                
                // tension određuje koliko je linija zakrivljena
                // 0 = potpuno prava linija (straight line)
                // 0.5 = umereno zakrivljena
                // 1 = vrlo zakrivljena (smooth curve)
                // Zašto 0.4? Balans između glatkosti i tačnosti
                tension: 0.4,
                
                // ===================== ISPUN ISPOD LINIJE =====================
                
                fill: true, // true = ispuniti prostor ispod linije sa backgroundColor
                
                // ===================== STILOVANJE TAČAKA =====================
                
                pointBackgroundColor: '#0f172a', // Boja unutrašnjosti svake tačke
                pointBorderColor: '#d4af37', // Boja ivice svake tačke
                pointBorderWidth: 2, // Debljina ivice tačke
                pointRadius: 4, // Veličina tačke u pikselima
                
                // ===================== HOVER STILOVI =====================
                
                pointHoverRadius: 6, // Veličina tačke kada je miš iznad nje
                pointHoverBackgroundColor: '#d4af37', // Boja unutrašnjosti na hover
                pointHoverBorderColor: '#fff', // Boja ivice na hover
                pointHoverBorderWidth: 2 // Debljina ivice na hover
            }]
        },
        
        // ===================== OPCIJE GRAFA =====================
        
        options: {
            // ===================== RESPONSIVNOST =====================
            
            responsive: true, // Graf se prilagođava veličini kontejnera
            maintainAspectRatio: false, // Dozvoli promenu aspect ratio-a (slobodno širenje)
            
            // ===================== PLUGIN-I =====================
            
            plugins: {
                // Legend je objašnjenje boja (npr. žuta linija = Prihod)
                legend: { display: false }, // Sakrij legendu (za čišći izgled)
                
                // Tooltip je mali prozor koji se prikazuje kada je miš iznad tačke
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', // Tamna pozadina sa 95% opacity
                    titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' }, // Font naslova
                    bodyFont: { family: 'Plus Jakarta Sans', size: 14, weight: 'bold' }, // Font tela
                    padding: 12, // Padding unutar tooltip-a
                    cornerRadius: 8, // Zaobljeni uglovi tooltip-a
                    displayColors: false, // Sakri boje u tooltip-u
                    borderColor: 'rgba(255,255,255,0.1)', // Boja ivice tooltip-a
                    borderWidth: 1 // Debljina ivice
                }
            },
            
            // ===================== OSE (X i Y) =====================
            
            scales: {
                // Y-osa (vertikalna - vrednosti)
                y: {
                    beginAtZero: true, // Y-osa počinje od 0 (ne od najmanje vrednosti)
                    grid: {
                        color: 'rgba(255,255,255,0.03)', // Boja horizontalnih grid linija
                        drawBorder: false // Ne crtaj ivicu oko osa
                    },
                    ticks: {
                        color: '#94a3b8', // Boja oznaka na Y-osi
                        font: { family: 'Plus Jakarta Sans', weight: '500' }, // Font oznaka
                        padding: 10 // Razmak između oznake i grid linije
                    }
                },
                // X-osa (horizontalna - meseci)
                x: {
                    grid: {
                        display: false, // Sakri vertikalne grid linije
                        drawBorder: false // Ne crtaj ivicu
                    },
                    ticks: {
                        color: '#94a3b8', // Boja oznaka na X-osi
                        font: { family: 'Plus Jakarta Sans', weight: '500' }, // Font oznaka
                        padding: 10 // Razmak između oznake i osa
                    }
                }
            },
            
            // ===================== INTERAKCIJA =====================
            
            interaction: {
                intersect: false, // Tooltip se prikazuje kada je miš blizu linije, ne samo na tački
                mode: 'index' // Prikaži sve vrednosti za dati indeks (korisno za više linija)
            }
        }
    });
}

// ===================== NAVIGACIJA IZMEĐU SEKCIJA =====================

// Ova funkcija menja trenutno prikazanu sekciju u admin panelu
// Parametri:
//    - sectionId: ID sekcije koju želimo da prikažemo (npr. 'dashboard', 'reservations', 'messages')
//    - element: referenca na kliknuti nav item (opciono - može biti null)
// Redosled izvršavanja: 1. Ažuriraj nav active klasu -> 2. Sakrij sve sekcije -> 3. Prikaži ciljnu sekciju -> 4. Zatvori sidebar na mobilnom
// Gde se koristi? Klikom na nav item-e u sidebar-u
// Zašto ova funkcija? Single Page Application (SPA) pattern - menjamo sadržaj bez reload-a stranice

function switchSection(sectionId, element) {
    // ===================== AŽURIRANJE NAV ACTIVE KLASE =====================
    
    // if (element) proverava da li je prosleđen element
    // Element je opciono jer se funkcija može pozvati i bez nav item-a (npr. programatski)
    if (element) {
        // ===================== UKLANJANJE ACTIVE KLASE SA SVIH NAV ITEM-A =====================
        
        // querySelectorAll pronalazi SVE elemente sa klasom '.nav-item'
        // Ovo su svi navigacioni linkovi u sidebar-u
        // Vraća NodeList (niz-like objekat)
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        
        // forEach() iterira kroz svaki nav item
        // el je trenutni nav item
        // classList.remove('active') uklanja CSS klasu 'active'
        // Zašto uklanjamo sa svih? Da bismo osigurali da samo jedan bude aktivan
        
        // ===================== DODAVANJE ACTIVE KLASE NA KLIKNUTI ITEM =====================
        
        // element je kliknuti nav item (prosleđen kao parametar)
        // classList.add('active') dodaje CSS klasu 'active'
        // Active klasa vizuelno ističe trenutno aktivnu sekciju (npr. druga boja)
        element.classList.add('active');
    }
    
    // ===================== SAKRIVANJE SVIH SEKCIJA =====================
    
    // querySelectorAll pronalazi SVE elemente sa klasom '.admin-section'
    // Ovo su sve sekcije admin panela (dashboard, reservations, messages, itd.)
    document.querySelectorAll('.admin-section').forEach(sec => {
        // sec je trenutna sekcija
        // style.display = 'none' čini element nevidljivim
        // Element ne zauzima prostor u layout-u kada je display: none
        sec.style.display = 'none';
        
        // classList.remove('active') uklanja CSS klasu 'active'
        // Active klasa se koristi za CSS animacije (fade-in efekat)
        sec.classList.remove('active');
    });
    
    // ===================== PRIKAZIVANJE CILJNE SEKCIJE =====================
    
    // getElementById pronalazi element sa ID sectionId
    // sectionId je ID sekcije koju želimo da prikažemo (npr. 'dashboard')
    const target = document.getElementById(sectionId);
    
    // if (target) je guard clause - zaštita ako sekcija ne postoji
    if (target) {
        // style.display = 'block' čini element vidljivim
        // 'block' je default display za div elemente
        // Element zauzima svoje mesto u layout-u
        target.style.display = 'block';
        
        // ===================== DELAY ZA CSS TRANSITION =====================
        
        // setTimeout() odlaže izvršavanje callback funkcije
        // Prvi argument: callback funkcija (arrow function)
        // Drugi argument: delay u milisekundama (10ms = 0.01 sekunde)
        //
        // Zašto delay?
        //    - CSS transition-e zahtevaju da element bude vidljiv (display: block) pre dodavanja klase
        //    - Bez delay-a, transition neće raditi jer browser ne stigne da renderuje element
        //    - 10ms je dovoljno kratko da korisnik ne primeti, ali dovoljno dugo za browser
        //
        // Callback funkcija dodaje 'active' klasu nakon delay-a
        // Active klasa trigger-uje CSS fade-in animaciju
        setTimeout(() => target.classList.add('active'), 10);
    }
    
    // ===================== ZATVARANJE SIDEBAR-A NA MOBILNIM UREĐAJIMA =====================
    
    // window.innerWidth vraća širinu prozora browser-a u pikselima
    // 768px je standard breakpoint za mobilne uređaje (tablet i manji)
    if (window.innerWidth <= 768) {
        // querySelector pronalazi element sa klasom '.sidebar'
        // Ovo je sidebar navigacija koja je vidljiva na desktop-u
        //
        // style.transform = 'translateX(-100%)' pomera element za 100% svoje širine ulevo
        // translateX je CSS transform funkcija za horizontalno pomeranje
        // -100% znači da se element pomera ulevo za punu širinu (potpuno izvan ekrana)
        // Ovo efekatno sakriva sidebar
        //
        // Zašto zatvaramo sidebar na mobilnim?
        //    - Na mobilnim uređajima sidebar zauzima ceo ekran
        //    - Nakon klika na nav item, korisnik želi da vidi sadržaj, ne sidebar
        //    - Bolje UX (user experience)
        document.querySelector('.sidebar').style.transform = 'translateX(-100%)';
    }
}

// ===================== MOBILNA NAVIGACIJA - TOGGLE SIDEBAR =====================

// Ovaj event listener omogućava otvaranje i zatvaranje sidebar-a na mobilnim uređajima
// Redosled izvršavanja: 1. Korisnik klikne hamburger ikonicu -> 2. Proveri da li je kliknut toggle button -> 3. Toggle sidebar (otvori/zatvori)
// Zašto document.addEventListener umesto addEventListener na button-u?
//    - Event delegation pattern
//    - Radi čak i ako se button dinamčki kreira ili zameni
//    - Manje event handler-a (bolje performanse)
//    - Uhvata klikove na ikonicu UNUTAR button-a (ne mora biti direktno na button-u)

// document.addEventListener() dodaje event listener na ceo dokument
// 'click' je tip event-a - klik miša ili tap na ekranu
// e je event object - sadrži informacije o kliku (koordinata, target element, itd.)
document.addEventListener('click', (e) => {
    // ===================== PROVERA DA LI JE KLIKNUT TOGGLE BUTTON =====================
    
    // e.target je element na koji je korisnik kliknuo
    // closest('.toggle-sidebar') pronalazi najbliži roditeljski element sa klasom 'toggle-sidebar'
    //    - Ako e.target već ima klasu 'toggle-sidebar', vraća e.target
    //    - Ako e.target je unutar elementa sa klasom 'toggle-sidebar', vraća taj roditeljski element
    //    - Ako ne postoji takav element, vraća null
    //
    // Zašto closest umesto direktnog proveravanja klase?
    //    - Korisnik može kliknuti na ikonicu (i tag) unutar button-a, ne na sam button
    //    - closest će naći button bez obzira na to šta je tačno kliknuto unutar njega
    //    - Ovo je robustnije rešenje
    const btn = e.target.closest('.toggle-sidebar');
    
    // if (btn) proverava da li je pronađen toggle button
    // Ako btn nije null, znači da je korisnik kliknuo na toggle sidebar button
    if (btn) {
        // ===================== PRONALAŽENJE SIDEBAR ELEMENTA =====================
        
        // querySelector pronalazi element sa klasom '.sidebar'
        // Ovo je sidebar navigacija koju treba da otvorimo/zatvorimo
        const sidebar = document.querySelector('.sidebar');
        
        // ===================== TOGGLE LOGIKA =====================
        
        // sidebar.style.transform čita trenutnu vrednost CSS transform property-ja
        // transform: translateX(0px) znači da je sidebar vidljiv (pomeren u početnu poziciju)
        // transform: translateX(-100%) znači da je sidebar sakriven (pomeren ulevo)
        //
        // Ternarni operator proverava trenutno stanje:
        //    - Ako je sidebar vidljiv (translateX(0px)): sakrij ga (postavi na translateX(-100%))
        //    - Ako je sidebar sakriven: prikaži ga (postavi na translateX(0px))
        //
        // Ovo je toggle pattern - menja stanje između dve vrednosti
        if (sidebar.style.transform === 'translateX(0px)') {
            // Sidebar je vidljiv -> zatvori ga
            // translateX(-100%) pomera sidebar ulevo za 100% širine
            sidebar.style.transform = 'translateX(-100%)';
        } else {
            // Sidebar je sakriven -> otvori ga
            // translateX(0px) vraća sidebar u početnu poziciju
            sidebar.style.transform = 'translateX(0px)';
        }
    }
});

// ===================== INICIJALIZACIJA - DOM CONTENT LOADED =====================

// Ovaj event listener se pokreće kada se HTML dokument kompletno učita i parsira
// Redosled izvršavanja: 1. Browser učita HTML -> 2. DOM se kreira -> 3. Event se trigger-uje -> 4. Izvršava se kod
//
// Zašto DOMContentLoaded umesto window.onload?
//    - DOMContentLoaded: kada se HTML učita (slike i resursi mogu još uvek da se učitavaju)
//    - window.onload: kada se SVE učita (slike, CSS, JS, itd.) - sporije
//    - DOMContentLoaded je brže i dovoljno za JavaScript inicijalizaciju
//
// Zašto koristimo ovaj event?
//    - Da bismo bili sigurni da su svi DOM elementi dostupni pre nego što pristupimo njima
//    - Ako pokušamo da pristupimo elementu pre nego što se učita, dobićemo null
//    - Ovo je best practice za inicijalizaciju JavaScript-a

document.addEventListener('DOMContentLoaded', () => {
    // ===================== PROVERA ADMIN SESIJE =====================
    
    // sessionStorage.getItem('prc_admin') uzima vrednost iz sessionStorage
    // sessionStorage čuva podatke dok je tab otvoren
    // 'prc_admin' je ključ pod kojim čuvamo admin sesiju
    // Vraća '1' ako je admin prijavljen, null ako nije
    //
    // === '1' proverava da li je vrednost tačno '1' (strict equality)
    //
    // Zašto ova provera?
    //    - Da bi se automatski prijavio ako je sesija aktivna
    //    - Korisno nakon refresh-a stranice - admin ostaje prijavljen
    //    - Bolje UX - korisnik ne mora da se ponovo prijavljuje
    if (sessionStorage.getItem('prc_admin') === '1') {
        // Pozivamo showAdminPanel() da bi prikazali admin panel
        // Ovo će sakriti login formu i prikazati dashboard
        showAdminPanel();
    }
    
    // ===================== POSTAVLJANJE CONFIRM DELETE HANDLER-A =====================
    
    // getElementById pronalazi confirm delete dugme u modal-u
    // Ovo je dugme koje korisnik klikne da potvrdi brisanje
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    // if (confirmBtn) je guard clause - zaštita ako dugme ne postoji
    if (confirmBtn) {
        // addEventListener('click', callback) dodaje click event handler
        // Callback se poziva kada korisnik klikne na dugme
        confirmBtn.addEventListener('click', () => {
            // ===================== BRISANJE REZERVACIJE =====================
            
            // itemToDelete je globalna promenljiva koja čuva ID stavke za brisanje
            // deleteType je globalna promenljiva koja čuva tip ('reservation' ili 'message')
            // 
            // && je logički AND - oba uslova moraju biti true
            // Proveravamo: da li postoji itemToDelete I da li je tip 'reservation'
            if (itemToDelete && deleteType === 'reservation') {
                // Učitavamo sve rezervacije iz localStorage
                let all = JSON.parse(localStorage.getItem('prc_reservations') || '[]');
                
                // filter() kreira novi niz bez elementa sa datim ID-jem
                // r.id !== itemToDelete - zadrži sve rezervacije čiji ID NIJE jednak itemToDelete
                // Ovo efektivno uklanja rezervaciju sa datim ID-jem
                all = all.filter(r => r.id !== itemToDelete);
                
                // Sačuvamo ažurirani niz u localStorage
                localStorage.setItem('prc_reservations', JSON.stringify(all));
                
                // Ponovo učitavamo dashboard da bi se ažurirala statistika i tabela
                loadDashboard();
                
                // Zatvaramo modal
                closeDeleteModal();
            } 
            // ===================== BRISANJE PORUKE =====================
            // else if proverava drugi uslov ako prvi nije zadovoljen
            else if (itemToDelete && deleteType === 'message') {
                // Učitavamo sve poruke iz localStorage
                let all = JSON.parse(localStorage.getItem('prc_messages') || '[]');
                
                // Uklanjamo poruku sa datim ID-jem
                all = all.filter(m => m.id !== itemToDelete);
                
                // Sačuvamo ažurirani niz
                localStorage.setItem('prc_messages', JSON.stringify(all));
                
                // Ponovo renderujemo tabelu poruka
                renderMessages();
                
                // Zatvaramo modal
                closeDeleteModal();
            }
        });
    }
});

// ===================== SINHRONIZACIJA IZMEĐU TAB-OVA - STORAGE EVENT =====================

// Ovaj event listener omogućava sinhronizaciju podataka između različitih tab-ova istog browser-a
// Redosled izvršavanja: 1. Korisnik napravi promenu u jednom tab-u -> 2. localStorage se ažurira -> 3. Ovaj event se trigger-uje u drugim tab-ovima -> 4. Ažuriraj UI
//
// Zašto ovo koristimo?
//    - Real-time sinhronizacija između tab-ova
//    - Na primer: admin ima otvoren admin panel u jednom tab-u, a korisnik napravi rezervaciju u drugom tab-u
//    - Admin panel se automatski ažurira da prikaže novu rezervaciju
//    - Bolje UX - admin ne mora da refresh-uje stranicu da bi video promene
//
// Napomena: storage event se NE trigger-uje u tab-u koji je napravio promenu
// Samo drugi tab-ovi dobijaju ovaj event

// window.addEventListener('storage', callback) dodaje listener za storage event
// e je event object - sadrži informacije o promeni (key, newValue, oldValue, url)
window.addEventListener('storage', (e) => {
    // ===================== PROVERA KLJUČA =====================
    
    // e.key je ključ localStorage-a koji se promenio
    // || je logički OR - uslov je true ako je bilo koji od dva uslova true
    //
    // Proveravamo da li se promenio:
    //    - 'prc_reservations' (niz rezervacija) ILI
    //    - 'prc_messages' (niz poruka)
    //
    // Zašto samo ova dva ključa?
    //    - Ovo su jedini podaci koji utiču na admin panel
    //    - Drugi localStorage podaci (npr. korisnici) se ne prikazuju u admin panel-u
    if (e.key === 'prc_reservations' || e.key === 'prc_messages') {
        
        // ===================== PROVERA DA LI JE ADMIN PANEL OTVOREN =====================
        
        // getElementById pronalazi admin panel element
        const adminPanel = document.getElementById('adminPanel');
        
        // Proveravamo dva uslova (oba moraju biti true):
        //    1. adminPanel postoji (nije null)
        //    2. adminPanel.style.display === 'block' (admin panel je vidljiv)
        //
        // Zašto ova provera?
        //    - Ne želimo da ažuriramo dashboard ako admin panel nije otvoren
        //    - Štedimo resurse - nema potrebe za ažuriranjem ako korisnik ne vidi sadržaj
        if (adminPanel && adminPanel.style.display === 'block') {
            
            // ===================== AŽURIRANJE DASHBOARD-A =====================
            
            // Pozivamo loadDashboard() da bi se ažurirao ceo admin panel
            // Ovo će:
            //    - Ponovo učitati podatke iz localStorage
            //    - Izračunati statistiku
            //    - Renderovati tabele
            //    - Ažurirati badge-ove
            //
            // Zašto loadDashboard umesto samo renderReservations()?
            //    - Promena može uticati na statistiku i badge-ove
            //    - Sigurnije je ažurirati sve nego samo jedan deo
            loadDashboard();
        }
    }
});
