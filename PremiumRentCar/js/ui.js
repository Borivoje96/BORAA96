/* ===================== NAVIGACIONA TRAKA (NAVBAR) ===================== */

// Pronalazimo navbar element po ID-u
// Čuvamo ga kao konstantu da ne bismo svaki put tražili element
const navbar = document.getElementById('navbar');

// ===================== SCROLL EFEKAT NA NAVBAR-U =====================
// Ovaj event listener menja izgled navbar-a kada korisnik scroll-uje
// window.addEventListener('scroll', callback) - sluša scroll događaje na celom prozoru

window.addEventListener('scroll', () => {
    // classList.toggle() dodaje ili uklanja CSS klasu zavisno od uslova
    // 'scrolled' - CSS klasa za stilizovanje navbar-a kada je scroll-ovan
    // window.scrollY > 50 - uslov: da li je scroll pozicija veća od 50px
    // 
    // Ako je window.scrollY > 50:
    //    - Dodaje 'scrolled' klasu (npr. menja boju, dodaje senku)
    // Ako je window.scrollY <= 50:
    //    - Uklanja 'scrolled' klasu (vraća originalni izgled)
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===================== MOBILNI MENI - HAMBURGER =====================

// Event listener za hamburger ikonicu (otvaranje mobilnog menija)
// getElementById('hamburger') pronalazi hamburger dugme
document.getElementById('hamburger').addEventListener('click', () => {
    // Dodajemo 'open' klasu na mobilni meni
    // 'open' klasa čini meni vidljivim (npr. transform: translateX(0))
    document.getElementById('mobileMenu').classList.add('open');
});

// ===================== ZATVARANJE MOBILNOG MENIJA =====================

// Funkcija za zatvaranje mobilnog menija
function closeMobile() {
    // Uklanjamo 'open' klasu iz mobilnog menija
    // Meni postaje nevidljiv (npr. transform: translateX(-100%))
    document.getElementById('mobileMenu').classList.remove('open');
}

// Event listener za X dugme (zatvaranje mobilnog menija)
// getElementById('mobileClose') pronalazi X dugme
document.getElementById('mobileClose').addEventListener('click', closeMobile);

/* ===================== SCROLL REVEAL ANIMACIJE ===================== */
// Ovaj kod kreira efekat gde se elementi pojavljuju kada se scroll-uje do njih

// ===================== PRONALAŽENJE ELEMENATA =====================

// querySelectorAll pronalazi SVE elemente sa klasom '.reveal'
// Ovo su elementi koji treba da se animiraju pri scroll-u
// Vraća NodeList (niz-like objekat) sa svim pronađenim elementima
const reveals = document.querySelectorAll('.reveal');

// ===================== INTERSECTION OBSERVER =====================
// IntersectionObserver je Web API koji praćuje kada elementi ulaze/izlaze iz viewport-a
// Koristi se za performansne scroll animacije (bolje od scroll event listener-a)

// Kreiramo novi IntersectionObserver sa callback funkcijom
const observer = new IntersectionObserver(entries => {
    // entries je niz svih praćenih elemenata koji su se promenili
    entries.forEach(e => { 
        // e.isIntersecting je true kada element ulazi u viewport
        if(e.isIntersecting) {
            // Dodajemo 'visible' klasu koja trigger-uje CSS animaciju
            // Npr. fade-in, slide-up, itd.
            e.target.classList.add('visible'); 
        }
    });
}, { 
    // Konfiguracioni objekat za observer
    threshold: 0.12 // 12% elementa mora biti vidljivo da bi se trigger-ovala animacija
    // Zašto 0.12? Da bi animacija počela malo pre nego što element bude potpuno vidljiv
});

// ===================== POKRETANJE OBSERVER-A =====================

// observer.observe() počinje praćenje svakog elementa
// Svaki element sa klasom '.reveal' će se animirati kada uđe u viewport
reveals.forEach(r => observer.observe(r));

/* ===================== COUNTER ANIMACIJA (BROJAČI) ===================== */
// Ovaj kod kreira animaciju brojanja za statističke brojeve

// ===================== INTERSECTION OBSERVER ZA STATISTIKU =====================

// Kreiramo IntersectionObserver specifično za statističke brojače
const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        // Proveravamo da li je container sa statistikom ušao u viewport
        if(e.isIntersecting) {
            // ===================== PRONALAŽENJE BROJAČA =====================
            
            // querySelectorAll pronalazi sve elemente sa data-target atributom
            // data-target sadrži konačnu vrednost brojača
            e.target.querySelectorAll('[data-target]').forEach(el => {
                // ===================== KONFIGURACIJA BROJAČA =====================
                
                // +el.dataset.target konvertuje string u broj
                // data-target je string (npr. "1500"), + pretvara u broj 1500
                const target = +el.dataset.target;
                
                // Određujemo suffix (znak nakon broja)
                // Za brojeve >= 1000 dodajemo '+' (npr. "1500+")
                const suffix = target >= 1000 ? '+' : '+';
                
                // ===================== ANIMACIONA BROJANJA =====================
                
                let current = 0; // Početna vrednost brojača
                const step = target / 60; // Korak animacije (60 frame-a za celu animaciju)
                
                // setInterval kreira animaciju sa 20ms delay (50fps)
                const timer = setInterval(() => {
                    // Povećavamo trenutnu vrednost za step
                    // Math.min osigurava da ne pređemo target vrednost
                    current = Math.min(current+step, target);
                    
                    // Postavljamo tekstualni sadržaj elementa
                    // Math.floor() zaokružuje na ceo broj
                    el.textContent = Math.floor(current) + suffix;
                    
                    // ===================== ZAVRŠETAK ANIMACIJE =====================
                    
                    // Ako smo dostigli target vrednost, zaustavimo timer
                    if(current >= target) clearInterval(timer);
                }, 20);
            });
            
            // ===================== PREKIDANJE PRAĆENJA =====================
            
            // unobserve() prestaje da prati element
            // Zašto? Da bi se animacija izvršila samo jednom
            statsObs.unobserve(e.target);
        }
    });
}, { 
    threshold: 0.4 // 40% elementa mora biti vidljivo za pokretanje animacije
    // Zašto viši threshold? Da bi korisnik imao vremena da vidi brojač pre animacije
});

// ===================== POKRETANJE OBSERVER-A =====================

// Proveravamo da li postoji .stats-container element
// document.querySelector() vraća prvi element koji odgovara selektoru ili null
// && (logical AND) izvršava desnu stranu samo ako leva nije falsy
// Ovo je defensive programming - izbegavamo greške ako element ne postoji
document.querySelector('.stats-container') && statsObs.observe(document.querySelector('.stats-container'));

/* ===================== GODINA U FOOTER-U ===================== */
// Ovaj kod automatski ažurira godinu u footer-u

// Pronalazimo element sa ID 'year' i postavljamo mu trenutnu godinu
// getFullYear() vraća punu godinu (npr. 2026)
// Ovo osigurava da je godina uvek automatski ažurirana
document.getElementById('year').textContent = new Date().getFullYear();

/* ===================== SMOOTH SCROLL ANIMACIJA ===================== */
// Ovaj kod omogućava glatko scroll-ovanje do sekcija kada se klikne na link

// ===================== PRONALAŽENJE LINKOVA =====================

// querySelectorAll pronalazi SVE linkove (a elemente) koji:
//    - Počinjuju sa '#' (href^="#")
//    - To su anchor linkovi za navigaciju unutar stranice
document.querySelectorAll('a[href^="#"]').forEach(a => {
    // Dodajemo click event listener na svaki anchor link
    a.addEventListener('click', e => {
        // ===================== SPREČAVANJE DEFAULT PONAŠANJA =====================
        
        // preventDefault() sprečava default ponašanje linka
        // Default: skok na tačku (instant scroll)
        // Mi želimo smooth scroll animaciju
        e.preventDefault();
        
        // ===================== PRONALAŽENJE CILJNOG ELEMENTA =====================
        
        // a.getAttribute('href') uzima href atribut linka (npr. "#about")
        // document.querySelector() pronalazi element sa tim ID-jem
        const target = document.querySelector(a.getAttribute('href'));
        
        // ===================== SMOOTH SCROLL =====================
        
        // Proveravamo da li ciljni element postoji
        if(target) {
            // scrollIntoView() je metoda za glatko scroll-ovanje do elementa
            // behavior: 'smooth' - glatka animacija scroll-a
            // block: 'start' - element će biti pri vrhu viewport-a
            target.scrollIntoView({behavior:'smooth', block:'start'});
        }
    });
});
