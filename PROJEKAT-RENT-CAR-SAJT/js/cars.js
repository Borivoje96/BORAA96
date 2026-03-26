/**
 * Funkcije za upravljanje vozilima
 */

// Globalne promenljive
let allCars = [];
let filteredCars = [];
let currentFilter = 'all';

// Funkcija za učitavanje vozila iz JSON fajla
function loadCars() {
    console.log('Učitavanje vozila iz JSON fajla...');
    
    // Prikazivanje poruke o učitavanju
    const carsContainer = document.querySelector('.cars-grid');
    if (carsContainer) {
        carsContainer.innerHTML = '<p class="loading-message">Učitavanje vozila...</p>';
    }
    
    // Korišćenje fetch API-ja za učitavanje cars.json fajla
    fetch('data/cars.json')
        .then(response => {
            console.log('Odgovor servera:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error('Greška pri učitavanju vozila. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Uspešno učitana vozila:', data.length);
            console.log('Prvi auto:', JSON.stringify(data[0]));
            
            // Mapiranje podataka iz JSON-a u format koji koristimo
            allCars = data.map(car => ({
                id: car.id,
                name: car.name,
                category: car.type.toLowerCase(),
                price: car.pricePerDay,
                image: car.image,
                features: [
                    car.transmission,
                    car.fuel,
                    `${car.seats} sedišta`,
                    car.year
                ],
                description: `${car.name} ${car.year} - ${car.color}`,
                details: {
                    seats: car.seats,
                    transmission: car.transmission,
                    fuel: car.fuel,
                    year: car.year,
                    color: car.color,
                    available: car.available
                }
            }));
            
            // Postavljanje vozila u globalni prostor
            window.allCars = allCars;
            
            console.log('Mapirana vozila:', allCars.length);
            
            // Inicijalno prikazivanje svih vozila
            filteredCars = [...allCars];
            renderCars();
        })
        .catch(error => {
            console.error('Greška pri učitavanju vozila:', error);
            
            // Prikazivanje greške u kontejneru
            if (carsContainer) {
                carsContainer.innerHTML = `<p class="error-message">Greška pri učitavanju vozila: ${error.message}</p>`;
            }
            
            // Pokušaj učitavanja sa alternativnom putanjom
            console.log('Pokušaj učitavanja sa alternativnom putanjom...');
            fetch('./data/cars.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Greška pri učitavanju vozila sa alternativnom putanjom. Status: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Uspešno učitana vozila sa alternativnom putanjom:', data.length);
                    
                    // Mapiranje podataka iz JSON-a u format koji koristimo
                    allCars = data.map(car => ({
                        id: car.id,
                        name: car.name,
                        category: car.type.toLowerCase(),
                        price: car.pricePerDay,
                        image: car.image,
                        features: [
                            car.transmission,
                            car.fuel,
                            `${car.seats} sedišta`,
                            car.year
                        ],
                        description: `${car.name} ${car.year} - ${car.color}`,
                        details: {
                            seats: car.seats,
                            transmission: car.transmission,
                            fuel: car.fuel,
                            year: car.year,
                            color: car.color,
                            available: car.available
                        }
                    }));
                    
                    // Postavljanje vozila u globalni prostor
                    window.allCars = allCars;
                    
                    // Inicijalno prikazivanje svih vozila
                    filteredCars = [...allCars];
                    renderCars();
                })
                .catch(alternativeError => {
                    console.error('Greška pri učitavanju vozila sa alternativnom putanjom:', alternativeError);
                    
                    // Prikazivanje greške u kontejneru
                    if (carsContainer) {
                        carsContainer.innerHTML = `
                            <p class="error-message">Nije moguće učitati vozila. Molimo proverite da li je fajl cars.json dostupan.</p>
                            <p>Detalji greške: ${error.message}</p>
                            <p>Alternativna putanja greška: ${alternativeError.message}</p>
                        `;
                    }
                });
        });
}

// Funkcija za filtriranje vozila
function filterCars(category) {
    console.log('Filtriranje vozila:', category);
    
    currentFilter = category;
    
    // Ažuriranje aktivnog filtera
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        }
    });
    
    // Filtriranje vozila
    if (category === 'all') {
        filteredCars = [...allCars];
    } else {
        filteredCars = allCars.filter(car => car.category.toLowerCase() === category.toLowerCase());
    }
    
    // Prikaz filtriranih vozila
    renderCars();
}

// Funkcija za prikaz vozila
function renderCars() {
    const carsContainer = document.querySelector('.cars-grid');
    if (!carsContainer) {
        console.error('Element .cars-grid nije pronađen!');
        return;
    }
    
    console.log('Renderovanje vozila:', filteredCars.length);
    
    // Brisanje postojećeg sadržaja
    carsContainer.innerHTML = '';
    
    // Ako nema vozila, prikaži poruku
    if (filteredCars.length === 0) {
        carsContainer.innerHTML = '<p class="no-cars">Nema vozila u ovoj kategoriji.</p>';
        return;
    }
    
    // Kreiranje HTML-a za svako vozilo
    filteredCars.forEach(car => {
        const carElement = document.createElement('div');
        carElement.className = 'car-card';
        carElement.setAttribute('data-aos', 'fade-up');
        
        // Kreiranje HTML-a za vozilo
        carElement.innerHTML = `
            <div class="car-image">
                <img src="${car.image}" alt="${car.name}" onerror="this.src='img/car-placeholder.jpg'">
            </div>
            <div class="car-details">
                <h3 class="car-name">${car.name}</h3>
                <p class="car-description">${car.description}</p>
                <div class="car-features">
                    ${car.features.map(feature => `<span class="feature">${feature}</span>`).join('')}
                </div>
                <div class="car-price">
                    <span class="price">${car.price} €</span>
                    <span class="price-period">/ dan</span>
                </div>
                <button class="btn btn-primary" onclick="window.openReservationModal(${car.id})">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Rezerviši</span>
                </button>
            </div>
        `;
        
        // Dodavanje vozila u kontejner
        carsContainer.appendChild(carElement);
    });
    
    console.log('Vozila su uspešno renderovana.');
}

// Funkcija za otvaranje modala za rezervaciju
function openReservationModal(carId) {
    console.log('Otvaranje modala za rezervaciju vozila:', carId);
    
    // Provera da li je korisnik prijavljen
    if (!isUserLoggedIn()) {
        // Uklanjanje svih postojećih obaveštenja pre prikazivanja novog
        if (window.authAlerts && window.authAlerts.clear) {
            window.authAlerts.clear();
        }
        
        // Prikazivanje poruke o potrebi za prijavom
        window.authAlerts.error('Morate biti prijavljeni da biste rezervisali vozilo', 'Nije moguće rezervisati');
        
        // Otvaranje modala za prijavu
        if (typeof window.showModal === 'function') {
            window.showModal('loginModal');
        } else {
            console.error('Funkcija showModal nije dostupna');
            // Pokušaj sa alternativnim funkcijama
            if (typeof window.showLoginModal === 'function') {
                window.showLoginModal();
            } else {
                console.error('Funkcija showLoginModal nije dostupna');
                // Direktno otvaranje modala
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            }
        }
        return;
    }
    
    // Pronalaženje vozila
    const car = allCars.find(c => c.id === carId.toString());
    if (!car) {
        if (window.authAlerts) {
            window.authAlerts.error('Vozilo nije pronađeno', 'Greška');
        }
        return;
    }
    
    // Popunjavanje podataka u modalu
    document.getElementById('reservationCarId-1').value = car.id;
    document.getElementById('reservationCarName-1').textContent = car.name;
    document.getElementById('reservationPricePerDay-1').textContent = `${car.price} €`;
    document.getElementById('pricePerDayCalc-1').textContent = `${car.price} €`;
    
    // Resetovanje forme
    document.getElementById('reservationForm-1').reset();
    
    // Otvaranje modala koristeći dostupnu funkciju
    if (typeof window.showModal === 'function') {
        window.showModal('reservationModal-1');
    } else {
        console.error('Funkcija showModal nije dostupna');
        // Pokušaj sa alternativnim funkcijama
        if (typeof window.openSimpleModal === 'function') {
            window.openSimpleModal('reservationModal-1');
        } else {
            console.error('Funkcija openSimpleModal nije dostupna');
            // Direktno otvaranje modala
            const reservationModal = document.getElementById('reservationModal-1');
            if (reservationModal) {
                // Zatvaranje svih modalnih prozora pre otvaranja novog
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
                
                reservationModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }
    }
}

// Postavljanje funkcije kao globalne da bi bila dostupna iz HTML-a
window.openReservationModal = openReservationModal;

// Inicijalizacija kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM učitan, inicijalizacija cars.js...');
    
    // Učitavanje vozila
    loadCars();
    
    // Dodavanje event listenera za filtere
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterCars(filter);
        });
    });
    
    console.log('Inicijalizacija cars.js završena.');
});
