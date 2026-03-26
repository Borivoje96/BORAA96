/**
 * Sistem za prikazivanje obaveštenja
 * Ovaj modul sadrži funkcije za kreiranje, prikazivanje i upravljanje obaveštenjima na stranici.
 * Obaveštenja se prikazuju u kontejneru koji se dinamički kreira ako ne postoji.
 * Podržani tipovi obaveštenja su: 'info', 'success', 'error', 'warning'.
 * Koristi Font Awesome ikone za vizuelno представление tipa obaveštenja.
 */

// Funkcija za prikazivanje obaveštenja
// Ova funkcija kreira i prikazuje obaveštenje na stranici sa zadatim porukom, tipom i trajanjem.
// Parametri:
//   message (string) - Tekst obaveštenja koji se prikazuje (obavezan)
//   type (string)    - Tip obaveštenja: 'info', 'success', 'error', 'warning' (podrazumevano: 'info')
//   duration (number) - Vreme prikazivanja u milisekundama (podrazumevano: 3000 = 3 sekunde)
//                     Ako je <= 0, obaveštenje neće se automatski zatvoriti (samo ručno klikom na 'x')
function showAlert(message, type = 'info', duration = 3000) {
    // Definišemo funkciju showAlert koja prima tri parametra:
    // 1. message: tekst obaveštenja koji želimo da prikažemo (obavezan parametar)
    // 2. type: tip obaveštenja (npr. 'info', 'success', 'error', 'warning'), podrazumevana vrednost je 'info'
    // 3. duration: vreme u milisekundama koliko će obaveštenje biti prikazano, podrazumevano 3000ms (3 sekunde)
    // Ako je duration postavljen na 0 ili negativan broj, obaveštenje neće se automatski zatvoriti (ali se može zatvoriti ručno).

    // Kreiranje elementa za obaveštenje
    // Kreiramo novi HTML 'div' element u memoriji koji će predstavljati naše obaveštenje.
    // Ovaj element još nije dodat u DOM, već se kreira u memoriji kako bismo ga mogli da konfigurišemo pre dodavanja.
    const alertElement = document.createElement('div');

    // Dodeljujemo CSS klase kreiranom elementu.
    // Osnovna klasa 'alert' se koristi za osnovno stilizovanje (padding, margin, border-radius itd.),
    // a klasa 'alert-{type}' (npr. 'alert-success', 'alert-error') se koristi za boju pozadine i teksta
    // na osnovu tipa obaveštenja (definisano u CSS-u).
    alertElement.className = `alert alert-${type}`;

    // Postavljamo unutrašnji HTML sadržaj našeg obaveštenja.
    // Koristimo шаблонски литерал (template literal) za lako ubacivanje promenljivih (${message} i ${getAlertIcon(type)}).
    // Sadrži kontejner 'alert-content' u kom se nalaze:
    // - ikonica (<i> tag) čija se klasa dinamički dobija pozivom funkcije getAlertIcon(type)
    //   Primer: ako je type = 'success', klasa će biti 'alert-icon fas fa-check-circle'
    // - tekst obaveštenja (<span> tag) u koji ubacujemo prosleđeni parametar 'message'
    // Takođe dodajemo dugme (<button>) sa znakom 'x' (&times;) za ručno zatvaranje obaveštenja.
    // Dugme ima klasu 'alert-close' kako bismo mogli da ga lako pronađemo za dodavanje event listenera.
    alertElement.innerHTML = `
        <div class="alert-content">
           <i class="alert-icon fas ${getAlertIcon(type)}"></i>
          <span class="alert-message">${message}</span>
       </div>
        <button class="alert-close">&times;</button>
    `;

    // Dodavanje obaveštenja u dokument
    // Pokušavamo da pronađemo postojeći kontejner za obaveštenja sa ID-jem 'alertsContainer'.
    // Ako ne postoji (null), pozivamo funkciju createAlertsContainer() da ga kreira i vrati.
    // Ovo osigurava da kontejner za obaveštenja uvek postoji pre nego što dodamo obaveštenje.
    const alertsContainer = document.getElementById('alertsContainer') || createAlertsContainer();

    // Dodajemo naše novokreirano obaveštenje (alertElement) kao dete u kontejner za obaveštenja (alertsContainer),
    // čime ono postaje vidljivo na stranici.
    // Metoda appendChild() dodaje element kao poslednje dete navedenog roditelja.
    alertsContainer.appendChild(alertElement);

    // Dodavanje event listenera za zatvaranje obaveštenja
    // Pronalazimo dugme za zatvaranje unutar našeg obaveštenja koristeći njegovu CSS klasu '.alert-close'
    // Metoda querySelector() vraća prvi element koji odgovara selektoru unutar alertElement.
    const closeButton = alertElement.querySelector('.alert-close');

    // Dodajemo 'osluškivač' događaja na dugme za zatvaranje.
    // Prvi parametar je tip događaja ('click'), drugi je funkcija koja se izvršava kada se događaj desi.
    // Kada korisnik klikne na dugme, izvršiće se anonimna funkcija koja uklanja obaveštenje iz DOM-a.
    closeButton.addEventListener('click', function () {
        // Metoda remove() uklanja element iz kojeg je pozvana iz DOM-a.
        // Ovo uklanja ceo alertElement (kontejner sa ikonom, porukom i dugmetom).
        alertElement.remove();
    });

    // Automatsko zatvaranje obaveštenja nakon određenog vremena
    // Proveravamo da li je prosleđeno vreme trajanja veće od 0
    // Ako je duration <= 0, obaveštenje neće se automatski zatvoriti (samo ručno).
    if (duration > 0) {
        // Koristimo setTimeout funkciju koja će izvršiti kod unutar nje nakon isteka zadatog vremena (duration)
        // Prvi parametar je funkcija za izvršavanje, drugi je kašnjenje u milisekundama.
        setTimeout(() => {
            // Pre uklanjanja, proveravamo da li se obaveštenje i dalje nalazi u dokumentu
            // (možda ga je korisnik već ručno zatvorio klikom na dugme)
            // Metoda contains() vraća true ako je element potomak dokumenta.body.
            if (document.body.contains(alertElement)) {
                // Ako je i dalje tu, uklanjamo ga iz DOM-a
                // Ovo sprečava grešku koja bi se desila ako pokušamo da uklonimo element koji već nije u DOM-u.
                alertElement.remove();
            }
        }, duration);
        // Prosleđujemo parametar duration kao vreme čekanja u milisekundama.
        // Na primer, ako je duration = 3000, funkcija unutar setTimeout će se izvršiti nakon 3 sekunde.
    }
}

// Funkcija za dobijanje ikone za obaveštenje
// Ova funkcija vraća odgovarajuću klasu ikone iz Font Awesome biblioteka na osnovu tipa obaveštenja.
// Prima parametar 'type' (string) i vraća string koji predstavlja klasu ikone (npr. 'fa-check-circle').
function getAlertIcon(type) {
    // Koristimo switch izraz da odredimo koju ikonu vratiti za dati tip obaveštenja.
    // Ovo je efikasnije od vise if/else blokova kada imamo više konstantnih vrednosti za proveru.
    switch (type) {
        case 'success':
            // Za uspešne obaveštenja prikazujemo ikonu potvrde (check circle)
            // Klasa 'fa-check-circle' iz Font Awesome biblioteka prikazuje zeleni kružni ikon sa check-om.
            return 'fa-check-circle';
        case 'error':
            // Za greške prikazujemo ikonu kružnog prečča (times circle)
            // Klasa 'fa-times-circle' prikazuje crveni kružni ikon sa X-om.
            return 'fa-times-circle';
        case 'warning':
            // Za upozorenja prikazujemo ikonu trostrukog uskličnika (exclamation triangle)
            // Klasa 'fa-exclamation-triangle' prikazuje żuti trokut sa uskličnikom.
            return 'fa-exclamation-triangle';
        case 'info':
        default:
            // Za informativna obaveštenja i za sve nepoznate tipove podrazumevano prikazujemo ikonu informacija (info circle)
            // Klasa 'fa-info-circle' prikazuje plavi kružni ikon sa 'i' unutar.
            return 'fa-info-circle';
    }
}

// Funkcija za kreiranje kontejnera za obaveštenja
// Ova funkcija kreira HTML element koji će služiti kao kontejner za sva obaveštenja na stranici.
// Kontejneru se dodeljuje ID 'alertsContainer' i klasa 'alerts-container' za stilizovanje.
// Nakon kreiranja, kontejner se dodaje na kraj tela dokumenta (body).
// Vraća kreirani kontejner element.
function createAlertsContainer() {
    // Kreiramo novi HTML 'div' element koji će služiti kao kontejner za obaveštenja.
    const container = document.createElement('div');
    // Postavljamo ID kontejnera na 'alertsContainer' kako bismo ga mogli lako pronaći kasnije
    // koristeći document.getElementById('alertsContainer').
    container.id = 'alertsContainer';
    // Dodajemo klasu 'alerts-container' za stilizovanje kroz CSS.
    // Ova klasa definiše poziciju (obično fixed ili absolute), z-index, i druge stilove za kontejner.
    container.className = 'alerts-container';
    // Dodajemo kontejner na kraj tela dokumenta.
    // Metoda appendChild() dodaje element kao poslednje dete body elementa.
    document.body.appendChild(container);
    // Vraćamo kreirani kontejner kako ga može funkcija showAlert da koristi.
    return container;
}

// Funkcije za različite tipove obaveštenja
// Ove funkcije su jednostavne omotačke (wrapperi) nad funkcijom showAlert sa podrazumevanim tipom obaveštenja.
// Svaka funkcija prima poruku i opcionalmente trajanje, a zatim poziva showAlert sa odgovarajućim tipom.
// Ove funkcije olakšavaju korišćenje jer ne moramo da памтимо tip obaveštenja svaki put.

// Funkcija za prikazivanje uspešnog obaveštenja
// Pozivamo showAlert sa tipom 'success' za prikaz zelenog obaveštenja sa ikonom potvrde.
function showSuccessAlert(message, duration = 3000) {
    // Prosleđujemo poruku, tip 'success' i trajanje funkciji showAlert.
    // Vraćamo rezultat poziva showAlert (koji je alertElement) kako bismo ga mogli da koristimo
    // ako je potrebno (npr. za dodatno prilagođavanje).
    return showAlert(message, 'success', duration);
}

// Funkcija za prikazivanje greške
// Pozivamo showAlert sa tipom 'error' za prikaz crvenog obaveštenja sa ikonom greške.
function showErrorAlert(message, duration = 3000) {
    // Prosleđujemo poruku, tip 'error' i trajanje funkciji showAlert.
    return showAlert(message, 'error', duration);
}

// Funkcija za prikazivanje upozorenja
// Pozivamo showAlert sa tipom 'warning' za prikaz żutog obaveštenja sa ikonom upozorenja.
function showWarningAlert(message, duration = 3000) {
    // Prosleđujemo poruku, tip 'warning' i trajanje funkciji showAlert.
    return showAlert(message, 'warning', duration);
}

// Funkcija za prikazivanje informativnog obaveštenja
// Pozivamo showAlert sa tipom 'info' za prikaz plavog obaveštenja sa ikonom informacija.
function showInfoAlert(message, duration = 3000) {
    // Prosleđujemo poruku, tip 'info' i trajanje funkciji showAlert.
    return showAlert(message, 'info', duration);
}
