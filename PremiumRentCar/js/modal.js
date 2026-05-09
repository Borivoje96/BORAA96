/* ===================== MODALNI PROZORI ===================== */

// ===================== GLOBALNE PROMENLJIVE =====================

// currentCar čuva podatke o vozilu koje se rezerviše
// Globalna jer se koristi u više funkcija (openReservation, calcPrice, confirmReservation)
let currentCar = null;

// ===================== OTVARANJE REZERVACIONOG MODALA =====================
// Ova funkcija otvara modal za rezervaciju vozila
// Parametar: id - ID vozila koje se rezerviše
// Redosled izvršavanja: 1. Nađi vozilo -> 2. Proveri autentifikaciju -> 3. Popuni modal -> 4. Prikaži modal
// Gde se koristi? Klikom na "Rezerviši" dugme na kartici vozila

function openReservation(id) {
    // ===================== PRONALAŽENJE VOZILA =====================
    
    // Pronalazimo vozilo sa datim ID-jem u globalnom nizu cars
    // String(c.id)===String(id) - pretvaramo u stringove za sigurnosko poređenje
    // find() vraća prvi element koji zadovoljava uslov ili undefined
    currentCar = cars.find(c=>String(c.id)===String(id));
    
    // Guard clause - ako vozilo nije pronađeno, izađi iz funkcije
    if(!currentCar) return;
    
    // ===================== PROVERA AUTENTIFIKACIJE =====================
    
    // Proveravamo da li je korisnik prijavljen pre nego što dozvolimo rezervaciju
    // typeof checkAuthBeforeReservation === 'function' - proverava da li funkcija postoji
    // !checkAuthBeforeReservation() - poziva funkciju i proverava da li vrati false
    if (typeof checkAuthBeforeReservation === 'function' && !checkAuthBeforeReservation()) {
        return; // auth.js će otvoriti modal za prijavu
    }

    // ===================== POPUNJAVANJE MODALA =====================
    
    // Postavljamo ime vozila i godinu u modal-u
    // Template literal (`) omogućava kombinaciju teksta i varijabli
    document.getElementById('modalCarName').textContent = `${currentCar.name} • ${currentCar.year}`;
    
    // Postavljamo cenu po danu
    document.getElementById('modalCarPrice').textContent = `${currentCar.pricePerDay}€ po danu`;
    
    // ===================== RESETOVANJE FORME =====================
    
    // Čistimo sva input polja
    document.getElementById('resDateFrom').value='';
    document.getElementById('resDateTo').value='';
    document.getElementById('resLocation').value='';
    
    // Sakrivamo sekciju sa cenom dok korisnik ne unese datume
    document.getElementById('priceSummary').style.display='none';
    
    // ===================== PRIKAZ MODALA =====================
    
    // Dodajemo 'open' klasu na modal da bi bio vidljiv
    document.getElementById('reservationModal').classList.add('open');
    
    // ===================== POSTAVLJANJE MIN DATUMA =====================
    
    // Postavljamo minimalni datum za izbor (danas ili budućnost)
    // new Date().toISOString() - trenutno vreme u ISO formatu (npr. "2026-05-04T10:30:00.000Z")
    // .split('T')[0] - uzimamo samo datumski deo ("2026-05-04")
    const today = new Date().toISOString().split('T')[0];
    
    // Postavljamo min atribut na input polja za datume
    // Ovo sprečava korisnika da izabere prošli datum
    document.getElementById('resDateFrom').min = today;
    document.getElementById('resDateTo').min = today;
}

// ===================== ZATVARANJE MODALA =====================
// Ova funkcija zatvara bilo koji modal prozor
// Parametar: id - ID modal elementa koji se zatvara
// Redosled izvršavanja: Ukloni 'open' klasu iz modal elementa
// Gde se koristi? U svim delovima aplikacije za zatvaranje modala

function closeModal(id) {
    // Pronalazimo modal element po ID-u i uklanjamo 'open' klasu
    // 'open' klasa čini modal vidljivim, njenim uklanjanjem modal postaje nevidljiv
    // classList.remove() je bezbedniji od direktnog menjanja stila
    document.getElementById(id).classList.remove('open');
}

// ===================== IZRAČUNAVANJE CENE REZERVACIJE =====================
// Ova funkcija izračunava cenu rezervacije na osnovu datuma
// Redosled izvršavanja: 1. Uzmi datume -> 2. Validiraj -> 3. Izračunaj dane -> 4. Prikaži cenu
// Gde se koristi? Oninput event na datum poljima

function calcPrice() {
    // ===================== UZIMANJE DATUMA =====================
    
    // Pronalazimo input elemente za datume
    const fromInput = document.getElementById('resDateFrom');
    const toInput = document.getElementById('resDateTo');
    
    // Uzimamo vrednosti iz input polja
    const from = fromInput.value;  // Datum preuzimanja
    const to = toInput.value;      // Datum povratka
    
    // ===================== VALIDACIJA DATUMA POVRAĆKA =====================
    
    // Sprečavamo da datum povratka bude pre datuma preuzimanja
    if (from) {
        // Postavljamo min datum za povratak na datum preuzimanja
        // Browser automatski sprečava izbor ranijeg datuma
        toInput.min = from;
        
        // Proveravamo da li je datum povratka pre datuma preuzimanja
        if (to && new Date(to) < new Date(from)) {
            // Resetujemo datum povratka i sakrivamo cenu
            toInput.value = '';
            document.getElementById('priceSummary').style.display='none';
            return; // Prekidamo izvršavanje
        }
    }

    // ===================== PROVERA POTREBNIH PODATAKA =====================
    
    // Proveravamo da li su svi podaci dostupni za izračunavanje
    // !from || !to || !currentCar - ako bilo šta nedostaje, izađi
    if(!from || !to || !currentCar) return;
    
    // ===================== IZRAČUNAVANJE BROJA DANA =====================
    
    // Izračunavamo razliku između datuma u milisekundama
    // new Date(to) - new Date(from) - razlika u milisekundama
    // /(1000 * 60 * 60 * 24) - konverzija milisekundi u dane
    // Math.round() - zaokruživanje na najbliži ceo broj
    let days = Math.round((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24));
    
    // Ako se vraća istog dana, tretiramo kao 1 dan (minimum)
    if (days === 0) days = 1; 
    
    // Dodatna provera za negativne vrednosti (za svaki slučaj)
    if (days < 0) return;

    // ===================== PRIKAZ CENE =====================
    
    // Prikažemo sekciju sa cenom
    document.getElementById('priceSummary').style.display='block';
    
    // Prikazujemo broj dana sa gramatički korektnim nastavkom
    // Template literal sa ternarnim operatorom za gramatiku
    // days > 1 ? 'a' : '' - ako je više od 1 dana, dodaj 'a' ("dana"), inače nema nastavka ("dan")
    document.getElementById('sumDays').textContent = `${days} dan${days > 1 ? 'a' : ''}`;
    
    // Prikazujemo cenu po danu
    document.getElementById('sumPerDay').textContent = `${currentCar.pricePerDay}€`;
    
    // Izračunavamo i prikazujemo ukupnu cenu
    // days * currentCar.pricePerDay - broj dana puta cena po danu
    document.getElementById('sumTotal').textContent = `${days * currentCar.pricePerDay}€`;
}

// ===================== POTVRDA REZERVACIJE =====================
// Ova funkcija obrađuje potvrdu rezervacije
// Redosled izvršavanja: 1. Validiraj polja -> 2. Izračunaj cenu -> 3. Sačuvaj rezervaciju -> 4. Zatvori modal -> 5. Prikaži poruku
// Gde se koristi? Klikom na "Potvrdi rezervaciju" dugme

function confirmReservation() {
    // ===================== UZIMANJE PODATAKA IZ FORME =====================
    
    // Uzimamo vrednosti iz svih input polja
    const from = document.getElementById('resDateFrom').value;  // Datum preuzimanja
    const to = document.getElementById('resDateTo').value;      // Datum povratka
    const loc = document.getElementById('resLocation').value;    // Lokacija
    
    // ===================== VALIDACIJA POLJA =====================
    
    // Proveravamo da li su sva obavezna polja popunjena
    if(!from||!to||!loc) {
        showNotification('error','Greška','Molimo popunite sva polja!');
        return; // Prekidamo izvršavanje
    }
    
    // ===================== IZRAČUNAVANJE BROJA DANA I CENE =====================
    
    // Ponovo izračunavamo broj dana (isto kao u calcPrice)
    let days = Math.round((new Date(to)-new Date(from))/(1000*60*60*24));
    if (days === 0) days = 1; // Minimum 1 dan
    
    // Izračunavamo ukupnu cenu
    const totalPrice = days * currentCar.pricePerDay;

    // ===================== ČUVANJE REZERVACIJE =====================
    
    // Proveravamo da li funkcija saveReservation postoji (iz auth.js)
    if (typeof saveReservation === 'function') {
        // Pozivamo funkciju koja čuva rezervaciju u localStorage
        // Prosleđujemo objekat sa svim podacima o rezervaciji
        saveReservation({
            carId: currentCar.id,        // ID vozila
            carName: currentCar.name,      // Naziv vozila
            carImage: currentCar.image,    // Slika vozila
            dateFrom: from,               // Datum preuzimanja
            dateTo: to,                 // Datum povratka
            location: loc,               // Lokacija preuzimanja
            days: days,                 // Broj dana
            totalPrice: totalPrice,      // Ukupna cena
            status: 'Aktivna'            // Početni status rezervacije
        });
    }

    // ===================== ZATVARANJE I POTVRDA =====================
    
    // Zatvaramo rezervacioni modal
    closeModal('reservationModal');
    
    // Prikazujemo success notifikaciju korisniku
    // Template literal sa imenom vozila
    showNotification('success','Rezervacija Uspešna!',`${currentCar.name} je rezervisan. Možete videti detalje na Vašem nalogu.`);
}

// ===================== ZATVARANJE MODALA NA KLIK IZVAN =====================
// Ovaj event listener omogućava zatvaranje modala kada korisnik klikne izvan njega
// Redosled: 1. Korisnik klikne na modal backdrop -> 2. Proveri da li je klik na backdrop -> 3. Zatvori modal
// Zašto? Standard UX pattern - korisnici očekuju da se modal zatvori klikom van

document.getElementById('reservationModal').addEventListener('click', function(e) {
    // e.target je element na koji je korisnik stvarno kliknuo
    // this je modal element (reservationModal)
    // Proveravamo da li je korisnik kliknuo direktno na modal (ne na sadržaj unutar njega)
    if(e.target === this) {
        // Ako je klik na backdrop, zatvori modal
        closeModal('reservationModal');
    }
});
