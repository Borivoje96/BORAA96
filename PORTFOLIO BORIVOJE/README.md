# 🚗 Premium Rent Car - Najbolja iznajmljivanja vozila

> **Moderni, responzivan i interaktivan web sajt za iznajmljivanje luksuznih vozila**

---

## 📖 Opis projekta

Premium Rent Car je profesionalna web aplikacija za iznajmljivanje vozila koja nudi:
- **Luksuzna vozila** sa detaljnim specifikacijama
- **Online rezervacije** sa automatskim izračunavanjem cena
- **Korisničke naloge** za praćenje rezervacija
- **Admin panel** za upravljanje vozilima i rezervacijama
- **3D pozadinska scena** sa interaktivnim efektima
- **Fully responzivan dizajn** za sve uređaje

---

## 🚀 Ključne funkcionalnosti

### 👤 Korisnički deo
- **Registracija i prijava** sa validacijom
- **Pretraga i filtriranje** vozila po kategorijama
- **Detaljni prikaz vozila** sa slikama i specifikacijama
- **Online rezervacije** sa odabirom datuma i lokacije
- **Korisnički panel** za pregled i upravljanje rezervacijama
- **Kontakt forma** sa porukama za admin tim

### 🛠️ Admin panel
- **Dashboard** sa statistikama i grafikonima
- **Upravljanje vozilima** (dodavanje, izmena, brisanje)
- **Pregled rezervacija** sa statusima i filtriranjem
- **Sistem poruka** za komunikaciju sa korisnicima
- **Real-time sinhronizacija** između tabova

### 🎨 UI/UX funkcionalnosti
- **Custom animirani cursor** sa hover efektima
- **Smooth scroll animacije** i parallax efekti
- **Scroll reveal animacije** za elemente
- **Counter animacije** za statistike
- **Responsive mobilni meni** sa hamburger ikonom
- **Toast notifikacije** za korisničke akcije

---

## 🛠️ Tehnologije

### Frontend
- **HTML5** - Semantička struktura
- **CSS3** - Moderni dizajn sa animacijama
- **JavaScript ES6+** - Interaktivnost i dinamički sadržaj
- **Font Awesome** - Ikone i UI elementi
- **Google Fonts** - Tipografija

### JavaScript biblioteke
- **Three.js** - 3D grafika i animacije
- **Chart.js** - Interaktivni grafikoni
- **IntersectionObserver API** - Performansne scroll animacije

### Podaci
- **localStorage** - Čuvanje korisničkih podataka
- **JSON** - Struktura podataka za vozila

---

## 📁 Struktura projekta

```
PORTFOLIO BORIVOJE/
├── 📄 index.html          # Glavna stranica
├── 📁 css/               # CSS stilovi
│   ├── base.css          # Osnovni stilovi
│   ├── sections.css      # Stilovi sekcija
│   └── admin.css         # Admin panel stilovi
├── 📁 js/                # JavaScript fajlovi
│   ├── main.js           # Glavni JavaScript
│   ├── auth.js           # Autentifikacija i rezervacije
│   ├── cars.js           # Učitavanje i prikaz vozila
│   ├── contact.js        # Kontakt forma i notifikacije
│   ├── cursor.js         # Custom cursor efekti
│   ├── modal.js          # Modalni prozori
│   ├── three-scene.js    # 3D pozadinska scena
│   ├── ui.js             # UI interakcije i animacije
│   └── admin.js         # Admin panel funkcionalnost
├── 📁 data/              # Podaci
│   └── cars.json         # Baza podataka vozila
└── 📁 assets/            # Resursi
    ├── images/           # Slike vozila
    └── icons/            # Ikone i logo
```

---

## 🚀 Brzi početak

### Preduvjeti
- Moderni web browser (Chrome, Firefox, Safari, Edge)
- Live Server ekstenzija za VS Code (preporučeno)

### Instalacija i pokretanje
1. **Klonirajte ili preuzmite projekat**
   ```bash
   git clone [repository-url]
   cd "PORTFOLIO BORIVOJE"
   ```

2. **Pokrenite sa Live Server**
   - Otvorite projekat u VS Code
   - Instalirajte "Live Server" ekstenziju
   - Desni klik na `index.html` → "Open with Live Server"

3. **Alternativno - otvorite direktno**
   - Dvoklik na `index.html`
   - ⚠️ **Napomena:** Neki funkcionalnosti možda neće raditi zbog CORS ograničenja

---

## 🎯 Korišćenje

### Za korisnike
1. **Registrujte se** ili se prijavite
2. **Pregledajte vozila** koristeći filtere
3. **Izaberite vozilo** i kliknite "Rezerviši"
4. **Popunite formu** sa datumima i lokacijom
5. **Potvrdite rezervaciju** - biće vidljiva u Vašem nalogu

### Za admin
1. **Prijavite se** sa:
   - Korisničko ime: `admin`
   - Lozinka: `admin123`
2. **Upravljajte vozilima** iz "Vozila" sekcije
3. **Pregledajte rezervacije** i menjajte statuse
4. **Odgovarajte na poruke** iz "Poruke" sekcije

---

## 🔧 Konfiguracija

### Dodavanje novih vozila
U `data/cars.json` dodajte:
```json
{
  "id": 123,
  "name": "Naziv vozila",
  "year": 2024,
  "color": "Boja",
  "transmission": "Automatski",
  "fuel": "Benzin",
  "seats": 5,
  "pricePerDay": 150,
  "image": "assets/images/car.jpg",
  "type": "luksuzni"
}
```

### Promena admin kredencijala
U `js/admin.js` promenite:
```javascript
const ADMIN_CREDENTIALS = {
  username: 'vas_username',
  password: 'vasa_lozinka'
};
```

---

## 🎨 Dizajn i UX

### Tema i boje
- **Primarna:** Zlatna (#c9a84c) - luksuz i premium
- **Sekundarna:** Plava (#4060ff) - poverenje i tehnologija
- **Pozadina:** Tamna sa 3D efektima
- **Tipografija:** Moderna, čitljiva fontova

### Responzivnost
- **Desktop:** 1200px+ - pun prikaz sa svim funkcionalnostima
- **Tablet:** 768px-1199px - prilagođeni layout
- **Mobilni:** <768px - optimizovan za dodir i male ekrane

### Animacije
- **Smooth transakcije** između stanja
- **Micro-interactions** za bolje korisničko iskustvo
- **Loading states** i feedback za sve akcije
- **3D parallax** za dubinu i interaktivnost

---

## 🔒 Bezbednost

### Implementirane mere
- **Input validacija** na klijentskoj strani
- **XSS prevencija** kroz sanitizaciju unosa
- **Password visibility toggle** za sigurniji unos
- **Session management** sa localStorage

### Preporuke za produkciju
- **Backend autentifikacija** sa JWT tokenima
- **HTTPS** za sve komunikacije
- **Rate limiting** za login pokušaje
- **Database** umesto localStorage za produkciju

---

## 🚀 Buduća unapređenja

### Planirane funkcionalnosti
- [ ] **Payment integration** (Stripe, PayPal)
- [ ] **Vehicle availability calendar**
- [ ] **Multi-language support**
- [ ] **Advanced search filters**
- [ ] **Review and rating system**
- [ ] **Mobile app** (React Native)
- [ ] **Email notifications**
- [ ] **GPS tracking** za vozila

### Tehnička unapređenja
- [ ] **Backend API** (Node.js/Express)
- [ ] **Database integration** (MongoDB/PostgreSQL)
- [ ] **Docker kontejnerizacija**
- [ ] **CI/CD pipeline**
- [ ] **Unit i E2E testovi**
- [ ] **PWA support**

---

## 🤝 Doprinos

### Kako doprineti
1. **Fork-ujte projekat**
2. **Kreirajte feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit-ujte promene** (`git commit -m 'Add some AmazingFeature'`)
4. **Push-ujte na branch** (`git push origin feature/AmazingFeature`)
5. **Otvorite Pull Request**

### Smernice za kod
- **Koristite ES6+ sintaksu**
- **Dodajte komentare** na srpskom jeziku
- **Follow-ujte postojeći stil koda**
- **Testirajte responsive dizajn**
- **Validirajte HTML i CSS**

---

## 📝 License

Ovaj projekat je licenciran pod MIT licencom - pogledajte `LICENSE` fajl za detalje.

---

## 📞 Kontakt

- **Autor:** Borivoje
- **Email:** [vas-email@example.com]
- **GitHub:** [github-username]
- **Live demo:** [demo-link]

---

## 🙏 Zahvalnice

- **Three.js** - 3D grafika
- **Chart.js** - Interaktivni grafikoni
- **Font Awesome** - Ikone
- **Google Fonts** - Tipografija
- **VS Code** - Development environment
- **Live Server** - Local development

---

## 📊 Statistike projekta

- **Veličina:** ~2MB (uključujući sve resurse)
- **Performance:** 95+ Lighthouse score
- **Browser support:** Chrome 90+, Firefox 88+, Safari 14+
- **Mobile friendly:** 100/100 Google PageSpeed

---

> **Napomena:** Ovo je demo verzija za portfolio svrhe. Za produkciju se preporučuje implementacija backend-a i prave baze podataka.

---

**Made with ❤️ by Borivoje**
