[README.md](https://github.com/user-attachments/files/27289363/README.md)
# Premium RentCar 🚗

Premium rent-a-car web aplikacija za iznajmljivanje luksuznih vozila u Kragujevcu.

## 📋 Opis

Kompletan web sistem za rent-a-car poslovanje sa:
- Modernim korisničkim interfejsom
- Admin panelom za upravljanje
- Sistemom rezervacija
- Korisničkim nalogima

## ✨ Funkcionalnosti

### Korisnički Deo
- **Hero sekcija** sa 3D animacijom (Three.js)
- **Katalog vozila** sa filtriranjem (Luksuzna, Sportska, SUV)
- **Sistem rezervacija** sa automatskim izračunavanjem cene
- **Registracija i prijava** korisnika
- **Kontakt forma** za upite
- **Responsive design** za sve uređaje
- **Custom cursor** efekat
- **Smooth scroll** animacije

### Admin Panel
- **Dashboard** sa statistikom i chart-ovima
- **Upravljanje rezervacijama** (statusi, brisanje)
- **Pregled poruka** sa kontakt forme
- **Login sistem** za administratore
- **Real-time sinhronizacija** podataka

## 🛠️ Tehnologije

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Grafika**: Three.js
- **Charting**: Chart.js
- **Ikone**: Font Awesome 6.5.1
- **Fontovi**: Google Fonts (Bebas Neue, Outfit, Plus Jakarta Sans)
- **Podaci**: LocalStorage (demo rešenje)

## 📁 Struktura Projekta

```
PremiumRentCar/
├── index.html          # Glavna korisnička stranica
├── admin.html          # Admin panel
├── css/
│   ├── base.css        # Globalni stilovi i varijable
│   ├── navbar.css      # Navigacija
│   ├── hero.css        # Hero sekcija
│   ├── sections.css    # Sektorski stilovi
│   ├── footer.css      # Footer
│   ├── modal.css       # Modal prozori
│   ├── responsive.css  # Responsivnost
│   └── admin.css       # Admin stilovi
├── js/
│   ├── three-scene.js  # Three.js animacija
│   ├── cursor.js       # Custom cursor
│   ├── ui.js           # UI interakcije
│   ├── contact.js      # Kontakt forma
│   ├── auth.js         # Autentifikacija i rezervacije
│   ├── cars.js         # Prikaz vozila
│   ├── modal.js        # Modal funkcionalnost
│   └── admin.js        # Admin logika
└── data/
    └── cars.json       # Podaci o vozilima
```

## 🚀 Instalacija i Pokretanje

1. **Kloniraj repository**
```bash
git clone [repository-url]
cd PremiumRentCar
```

2. **Otvori u browser-u**
- Jednostavno otvori `index.html` ili `admin.html` u bilo kom modernom browser-u
- Nije potreban server za pokretanje

3. **Admin pristup**
- Email: `admin`
- Lozinka: `admin`

## 💡 Korišćenje

### Korisnički Deo
1. Pregledaj katalog vozila
2. Registruj se ili prijavi
3. Izaberi vozilo i klikni "Rezerviši"
4. Popunite formu sa datumima i lokacijom
5. Potvrdite rezervaciju
6. Pratite status u "Moj Nalog"

### Admin Panel
1. Prijavi se sa admin kredencijalima
2. Pregledaj statistiku na Dashboard-u
3. Upravljaj rezervacijama (menjaj status, briši)
4. Odgovaraj na poruke sa kontakt forme

## 🎨 Dizajn

- **Tema**: Dark premium sa zlatnim akcentima
- **Boje**: 
  - Primary: `#c9a84c` (Gold)
  - Background: `#050608` (Black)
  - Text: `#f5f0e8` (Off-white)
- **Fontovi**: Bebas Neue (display), Outfit (body)
- **Animacije**: Smooth transitions, reveal effects, 3D particles

## ⚠️ Ograničenja (Demo Verzija)

Ovo je **frontend demo projekat** sa sledećim ograničenjima:

- **Nema backend-a** - podaci se čuvaju u localStorage
- **Bezbednost** - lozinke nema hash-ovane (za demo)
- **Email** - kontakt forma ne šalje stvarne email-ove
- **Slike** - koriste se Unsplash URL-ovi
- **Skalabilnost** - localStorage ima limit (5-10MB)

## 🔮 Budući Razvoj

Za produkciju potrebno:

- [ ] Backend (Node.js/Express ili PHP/Laravel)
- [ ] Baza podataka (PostgreSQL ili MongoDB)
- [ ] Auth sistem (JWT, OAuth)
- [ ] Payment gateway (Stripe, PayPal)
- [ ] Email servis (SendGrid, Mailgun)
- [ ] Image upload (Cloudinary, AWS S3)
- [ ] Unit i E2E testovi
- [ ] CI/CD pipeline
- [ ] SEO optimizacija

## 👨‍💻 Autor

Napravljeno sa ❤️ u Kragujevcu

## 📄 Licence

Ovaj projekat je kreiran za edukativne i portfolio svrhe.

## 🤝 Doprinos

Doprinosi su dobrodošli! Slobodno otvori issue ili napravi pull request.
