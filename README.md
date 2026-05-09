# 🏎️ Premium RentCar (Rent-a-Car Kragujevac)

Dobrodošli u repozitorijum **Premium RentCar** aplikacije! Ovo je moderna i interaktivna web aplikacija za iznajmljivanje automobila kreirana kao deo mog portfolio projekta. Sastoji se od korisničkog interfejsa za pregled i rezervaciju vozila, kao i funkcionalnog admin panela za upravljanje flotom.

## 📝 Opis

Premium RentCar je Vanilla JavaScript web aplikacija dizajnirana sa ciljem da pruži premium korisničko iskustvo. Projekat demonstrira moje veštine u kreiranju responsivnog, modernog interfejsa sa naprednim interakcijama i 3D elementima, kao i implementaciju klijentske logike za upravljanje podacima bez korišćenja eksternih frontend framework-a. Svi podaci se dinamički obrađuju i trenutno čuvaju u `localStorage`-u radi demonstracije funkcionalnosti.

## ✨ Funkcionalnosti

Evo šta aplikacija trenutno nudi:

- **Dinamičko učitavanje vozila:** Prikaz automobila iz lokalnog izvora podataka (JSON / localStorage).
- **Filtriranje i sortiranje vozila:** Mogućnost brzog sortiranja i filtriranja prema kategorijama (Luksuzna, Sportska, SUV).
- **Admin panel (`admin.html`):** Poseban deo aplikacije namenjen za dodavanje, brisanje i upravljanje vozilima i pregled poruka/rezervacija.
- **Autentifikacija korisnika:** Sistem registracije i prijave (simuliran putem `localStorage`-a).
- **Sistem rezervacija:** Mogućnost rezervisanja vozila uz dinamičku kalkulaciju cene na osnovu izabranih datuma.
- **Korisnički nalog:** Pregled aktivnih rezervacija i mogućnost otkazivanja istih.
- **Kontakt forma:** Validacija i simulirano slanje poruka (podaci stižu u admin panel).
- **Moderno UI/UX iskustvo:** Custom kursor, glatke *reveal* animacije na skrol i responzivan dizajn za sve uređaje.
- **3D Animacije:** Integracija Three.js biblioteke za atraktivan vizuelni efekat na početnoj strani.

*Napomena: Backend trenutno nije implementiran. Baza podataka i API pozivi su simulirani korišćenjem klijentskog `localStorage`-a u svrhu prezentacije koncepta portfolija.*

## 💻 Tehnologije

- **HTML5** & **CSS3** (Modularni CSS pristup za lakše održavanje)
- **JavaScript (ES6+)** - Vanilla JS za kompletnu klijentsku logiku
- **Three.js** - Za 3D animacije u Hero sekciji
- **Font Awesome (v6.5.1)** - Za ikonice
- **Google Fonts** - *Bebas Neue* i *Outfit* tipografija

## 📁 Struktura projekta

Projekat je organizovan na sledeći način radi lakšeg snalaženja i održavanja:

```text
📦 PremiumRentCar
 ┣ 📂 css            # Modularni stilovi (base.css, hero.css, itd.)
 ┣ 📂 js             # Logika podeljena po modulima (auth.js, cars.js, three-scene.js...)
 ┣ 📂 data           # Početni podaci (JSON podaci o vozilima)
 ┣ 📜 index.html     # Glavna korisnička stranica
 ┣ 📜 admin.html     # Administrativni panel
 ┗ 📜 README.md      # Dokumentacija
```

## 🚀 Instalacija

Da biste pokrenuli ovaj projekat lokalno na vašoj mašini, pratite ove korake:

1. **Klonirajte repozitorijum:**
   ```bash
   git clone git@github.com:Borivoje96/BORAA96.git
   ```
2. **Uđite u folder projekta:**
   ```bash
   cd PremiumRentCar
   ```
3. **Pokrenite projekat:**
   S obzirom da je ovo frontend aplikacija, možete je pokrenuti korišćenjem ekstenzije poput **Live Server** u VS Code-u, ili jednostavnim otvaranjem `index.html` fajla direktno u vašem web pregledaču.

## 📸 Screenshot-ovi

Ovde možete videti kako aplikacija izgleda u praksi:

### Početna (Hero) sekcija
![Hero Sekcija](./assets/PREMIUM%20RENT-CAR-SLIKE/SLIKA%201.PNG)

### Zašto Izabrati Nas
![Zašto Mi](./assets/PREMIUM%20RENT-CAR-SLIKE/SLIKA%202.PNG)

### Naša Vozila i Filtriranje
![Vozila](./assets/PREMIUM%20RENT-CAR-SLIKE/SLIKA%203.PNG)

### Naše Usluge
![Usluge](./assets/PREMIUM%20RENT-CAR-SLIKE/SLIKA%204.PNG)

### Kontakt Forma
![Kontakt](./assets/PREMIUM%20RENT-CAR-SLIKE/SLIKA%205.PNG)

### Admin Panel
![Admin Panel](./assets/PREMIUM%20RENT-CAR-SLIKE/SLIKA7.PNG)

### Footer (Podnožje)
![Footer](./assets/PREMIUM%20RENT-CAR-SLIKE/SLIKA%206.PNG)

## 👨‍💻 Autor

- **Borivoje** - *Frontend Developer*
- GitHub:https://github.com/Borivoje96/BORAA96.git
- LinkedIn: linkedin.com/in/borivoje-šunjevarić-8346ab278
