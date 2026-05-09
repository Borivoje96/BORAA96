/* ===================== PODACI O VOZILIMA ===================== */

// cars je globalna promenljiva koja čuva niz svih vozila
// Učitava se iz JSON fajla i koristi za renderovanje i filtriranje
let cars = [];

// ===================== UČITAVANJE PODATAKA O VOZILIMA =====================
// Ova funkcija asinhrono učitava podatke o vozilima iz JSON fajla
// Redosled izvršavanja: 1. Pokušaj fetch -> 2. Proveri status -> 3. Parsiraj JSON -> 4. Renderuj
// Gde se koristi? Pri učitavanju stranice
// Zašto async? Fetch je asinhrona operacija - ne blokira UI dok čeka odgovor

async function loadCarsData() {
    try {
        // ===================== FETCH PODATAKA =====================
        
        // fetch() je Web API za HTTP zahteve
        // 'data/cars.json' - putanja do JSON fajla sa podacima o vozilima
        // ?v= + new Date().getTime() - cache busting tehnika
        //    - Dodaje timestamp kao query parametar
        //    - Sprečava browser da koristi keširani JSON fajl
        //    - Osigurava učitavanje najnovijih podataka
        const response = await fetch('data/cars.json?v=' + new Date().getTime());
        
        // Proveravamo HTTP status odgovora
        // response.ok je true za status 200-299 (uspešni zahtevi)
        if (!response.ok) throw new Error("HTTP " + response.status);
        
        // ===================== PARSIRANJE I RENDEROVANJE =====================
        
        // response.json() asinhrono parsira JSON string u JavaScript objekat/niz
        cars = await response.json();
        
        // Pozivamo funkciju koja renderuje sve automobile u grid-u
        renderCars();
        
    } catch (error) {
        // ===================== ERROR HANDLING =====================
        
        // Logujemo grešku u konzolu za debugging
        console.error("Greška pri učitavanju vozila iz JSON-a:", error);
        
        // Pronalazimo grid element gde se prikazuju automobili
        const grid = document.getElementById('carsGrid');
        
        if (grid) {
            // ===================== ERROR MESSAGE =====================
            
            // Prikazujemo korisnikom detaljnu poruku o grešci
            // Ovo je user-friendly error handling - objašnjava problem i rešenje
            grid.innerHTML = `<div style="grid-column: 1/-1; padding: 30px; background: rgba(255,50,50,0.1); border: 1px solid red; border-radius: 10px; color: white; text-align: center;">
                <h3 style="color: #ff5555; margin-bottom: 10px;">⚠️ Greška pri učitavanju podataka</h3>
                <p style="margin-bottom: 15px;">Automobili se ne prikazuju jer je sajt otvoren direktno iz foldera (<strong>file:///</strong>).</p>
                <p>Moderan web pregledač blokira učitavanje <strong>.json</strong> fajlova iz sigurnosnih razloga (CORS) kada nemate aktivan server.</p>
                <br/>
                <p style="color: var(--gold);"><strong>Rešenje:</strong> Otvorite projekat u VS Code-u i pokrenite ga preko <strong>Live Server</strong> ekstenzije!</p>
            </div>`;
        }
    }
}

// ===================== GLOBALNE KONSTANTE =====================

// categoryLabels je objekat koji mapira ključeve iz JSON-a na prijateljske nazive
// Koristi se za prikaz kategorije vozila na badge-u
// luksuzni -> Luksuzno, sportski -> Sportsko, suv -> SUV
const categoryLabels = { luksuzni:'Luksuzno', sportski:'Sportsko', suv:'SUV' };

// grid je referenca na DOM element gde se prikazuju automobili
// Čuvamo je kao konstantu da ne bismo svaki put ponovo tražili element
const grid = document.getElementById('carsGrid');

// ===================== RENDEROVANJE VOZILA =====================
// Ova funkcija prikazuje automobile u grid-u sa opcionalnim filtriranjem
// Parametar: filter - 'all' za sva vozila ili tip vozila ('luksuzni', 'sportski', 'suv')
// Redosled izvršavanja: 1. Očisti grid -> 2. Filtriraj -> 3. Kreiraj kartice -> 4. Dodaj u DOM
// Gde se koristi? Pri učitavanju podataka i promeni filtera

function renderCars(filter='all') {
    // ===================== ČIŠĆENJE GRID-A =====================
    
    // Očistimo postojeći sadržaj pre dodavanja novih elemenata
    // Sprčava dupliranje kartica pri svakom renderovanju
    grid.innerHTML = '';
    
    // ===================== FILTRIRANJE VOZILA =====================
    
    // Filtriramo vozila zavisno od parametra filter
    // Ternarni operator: filter==='all' ? cars : cars.filter(...)
    //    - Ako je filter 'all', prikaži sva vozila
    //    - Inače, filtriraj po tipu vozila
    const filtered = filter==='all' ? cars : cars.filter(c=>(c.type || '').toLowerCase()===filter);
    
    // ===================== KREIRANJE KARTICA =====================
    
    // forEach() iterira kroz svako filtrirano vozilo
    // car - trenutno vozilo, i - indeks (za animaciju)
    filtered.forEach((car,i) => {
        // Kreiramo div element za karticu vozila
        const card = document.createElement('div');
        
        // Postavljamo CSS klase za stilizovanje
        card.className = 'car-card visible';
        
        // ===================== ANIMACIJA =====================
        
        // Postavljamo delay za CSS animaciju
        // Svaka kartica se pojavljuje sa malim kašnjenjem
        // i*0.07 - prva kartica (i=0) nema delay, druga (i=1) 0.07s, treća 0.14s, itd.
        // Ovo kreira lep "stagger" efekat
        card.style.animationDelay = `${i*0.07}s`;
        
        // ===================== ODREĐIVANJE BADGE LABEL-A =====================
        
        // Pronalazimo prijateljski naziv za kategoriju vozila
        // (car.type || '').toLowerCase() - pretvara tip u mala slova
        // categoryLabels[label] || car.type - fallback na originalni tip ako ne postoji mapping
        const badgeLabel = categoryLabels[(car.type || '').toLowerCase()] || car.type;
        
        // ===================== HTML SADRŽAJ KARTICE =====================
        
        // Template literal za kompletnu karticu vozila
        card.innerHTML = `
            <div class="car-img-wrap">
                <!-- Slika vozila sa fallback mehanizmom -->
                <img src="${car.image}" alt="${car.name}" 
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <!-- Fallback emoji ako slika ne uspe da učita -->
                <div class="car-img-fallback" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-size:4rem;opacity:0.18;">🚗</div>
                <!-- Badge sa kategorijom vozila -->
                <div class="car-category-badge">${badgeLabel}</div>
            </div>
            
            <!-- Informacije o vozilu -->
            <div class="car-info">
                <div class="car-name">${car.name}</div>
                <div class="car-model">${car.year} • ${car.color}</div>
                
                <!-- Specifikacije vozila -->
                <div class="car-specs">
                    <div class="spec"><i class="fas fa-cog"></i>${car.transmission}</div>
                    <div class="spec"><i class="fas fa-gas-pump"></i>${car.fuel}</div>
                    <div class="spec"><i class="fas fa-users"></i>${car.seats}</div>
                </div>
                
                <!-- Footer sa cenom i dugmetom -->
                <div class="car-footer">
                    <div class="car-price">
                        <div class="amount">${car.pricePerDay}€</div>
                        <div class="period">/ dan</div>
                    </div>
                    <button class="book-btn" onclick="openReservation(${car.id})">
                        <i class="fas fa-calendar"></i> Rezerviši
                    </button>
                </div>
            </div>`;
        
        // ===================== DODAVANJE U DOM =====================
        
        // Dodajemo kreiranu karticu u grid
        grid.appendChild(card);
    });
}
// ===================== INICIJALIZACIJA NAKON UČITAVANJA DOM-A =====================

// DOMContentLoaded event se trigger-uje kada se HTML dokument učita i parsira
// Ovo je standardan način za pokretanje JavaScript koda nakon što je DOM spreman
// Arrow function () => {} je kraći zapis za funkciju
document.addEventListener('DOMContentLoaded', () => {
    // Debug log za praćenje učitavanja
    console.log("Loading cars...");
    
    // Pozivamo funkciju koja učitava podatke o vozilima
    loadCarsData();
});

// ===================== FALLBACK ZA VEĆ UČITAN DOM =====================

// Proveravamo da li je dokument već učitan
// document.readyState može biti:
//    - 'loading' - dokument se još uvek učitava
//    - 'interactive' - dokument je parsiran, ali resursi (slike, CSS) se još učitavaju
//    - 'complete' - dokument i svi resursi su učitani
//
// Zašto ovaj fallback?
//    - Ako se JavaScript učita nakon što je DOM već spreman
//    - DOMContentLoaded se neće trigger-ovati
//    - Ovo osigurava da se loadCarsData() pozove u svakom slučaju
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadCarsData();
}

// ===================== EVENT LISTENER ZA FILTER DUGMIĆE =====================

// querySelectorAll pronalazi SVE elemente sa klasom '.filter-btn'
// Ovo su dugmići za filtriranje (Sve, Luksuzno, Sportsko, SUV)
// Vraća NodeList (niz-like objekat) sa svim pronađenim dugmićima
document.querySelectorAll('.filter-btn').forEach(btn => {
    // Dodajemo click event listener na svako filter dugme
    btn.addEventListener('click', () => {
        // ===================== UKLANJANJE ACTIVE KLASE =====================
        
        // Prvo uklanjamo 'active' klasu sa SVIH filter dugmića
        // Ovo osigurava da samo jedno dugme bude aktivno u svakom trenutku
        document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
        
        // ===================== DODAVANJE ACTIVE KLASE =====================
        
        // Dodajemo 'active' klasu na kliknuto dugme
        // btn je referenca na dugme koje je kliknuto
        // 'active' klasa se koristi za CSS stiliziranje (npr. druga boja)
        btn.classList.add('active');
        
        // ===================== FILTRIRANJE I RENDEROVANJE =====================
        
        // btn.dataset.filter čita vrednost data-filter atributa
        // Na primer: data-filter="luksuzni" -> "luksuzni"
        // data-filter="all" -> "all"
        // Pozivamo renderCars() sa odabranim filterom
        renderCars(btn.dataset.filter);
    });
});
