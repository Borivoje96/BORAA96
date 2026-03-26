# Premium Rent-A-Car

Ovo je projekat za iznajmljivanje vozila (Rent-A-Car) sa modernim korisničkim interfejsom i naprednim funkcionalnostima.

## Korišćene tehnologije i biblioteke

### Frontend
- **HTML5** — Struktura sajta
- **CSS3** — Prilagođeni stilovi (više od 20 zasebnih CSS fajlova)
- **JavaScript (ES6)** — Interaktivnost i logika aplikacije (više od 20 JS fajlova)
- **Font Awesome** — Ikonice ([cdnjs](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css))
- **AOS (Animate On Scroll)** — Animacije pri skrolovanju ([unpkg](https://unpkg.com/aos@2.3.1/dist/aos.css))
- **Poppins** web font — Custom fontovi (lokalno, folder `fonts/`)

### Funkcionalnosti
- Višestruki modalni prozori (prijava, registracija, rezervacija, potvrda):
  - Modalni prozori su otporni na greške, ne preklapaju se i koriste izolovan JS kod
  - Zatvaranje svih prethodnih modala pre otvaranja novog
  - Sve funkcije za otvaranje/zatvaranje su globalno dostupne
- Napredan sistem obaveštenja:
  - Animacije sa slide/fade efektima i emoji ikonama
  - Poruke su stilizovane prema plavoj paleti sajta
  - Nema dupliranja poruka – svaki alert je jedinstven
  - Uklanjanje svih prethodnih obaveštenja pre prikaza novog
- Validacija unosa za sve forme (prijava, registracija, rezervacija):
  - Detaljna validacija svakog polja (email, lozinka, datumi...)
  - Centralizovana validacija datuma za rezervacije (samo jedna poruka o grešci)
  - Sprečeno kreiranje rezervacije sa pogrešnim datumima
  - Prikaz cene odmah nakon izbora datuma, pre rezervacije
- Prikaz i filtriranje vozila iz JSON fajla (`data/cars.json`)
- Prikaz korisničkih rezervacija u posebnom modalnom prozoru
- Detaljna poruka o uspešnoj rezervaciji (ime vozila, period, ukupna cena)
- Prijava, registracija i odjava:
  - Potpuno izolovane funkcije za svaku akciju (kloniranje formi, uklanjanje event listenera)
  - Jedinstven sistem za prikazivanje obaveštenja i validaciju
  - Sve funkcije za odjavu su centralizovane i uklanjaju duple poruke
- Navigacija i footer:
  - Uvek vidljivi, sa doslednim bojama i stilovima
  - Bez JS logike za skrivanje/pojavljivanje
- Moderni hero, banner i sekcija sa prednostima:
  - Profesionalni izgled sa ikonama i animacijama
  - Plava paleta boja, hover efekti, 3D senke
  - Responzivan raspored za sve veličine ekrana
- Prilagođeni alerti i dijalozi za sve ključne akcije
- Projekat je u potpunosti statički, bez frameworka i servera – sve radi lokalno

### Organizacija projekta
- **index.html** — Glavna stranica
- **css/** — Svi stilovi (organizovani po sekcijama/komponentama)
- **js/** — Svi JavaScript fajlovi (po funkcionalnostima)
- **data/** — Podaci o vozilima (`cars.json`)
- **fonts/** — Poppins fontovi
- **images/** — Slike vozila i sajta

### Fontovi

Font Poppins je preuzet sa Google Fonts i nalazi se u folderu `fonts/`.

Ako želiš da preuzmeš fontove ponovo, možeš koristiti skriptu `download_fonts.ps1` (PowerShell skripta u projektu) ili ih ručno skinuti sa [Google Fonts](https://fonts.google.com/specimen/Poppins) u .woff2 formatu i staviti u `fonts/` folder.

### Napomene
- Sva logika za modalne prozore, validaciju i obaveštenja je ručno implementirana bez frameworka
- Korišćene su moderne tehnike (ES6, custom properties, CSS grid/flexbox)
- Projekat je u potpunosti statički i može se pokrenuti lokalno bez servera

## Kako pokrenuti projekat

1. Preuzmi ceo folder na svoj računar.
2. Otvori fajl `index.html` dvoklikom ili u omiljenom browseru.
3. Sve funkcionalnosti će raditi lokalno, nije potreban nikakav server ili instalacija.

---

© 2025 Premium Rent-A-Car. Sva prava zadržana.
