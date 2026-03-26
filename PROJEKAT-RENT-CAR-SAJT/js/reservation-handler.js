/**
 * Funkcije za upravljanje rezervacijama
 */

// Funkcija za kreiranje rezervacije
function createReservation(carId, startDate, endDate, location, totalPrice) {
    console.log('Kreiranje rezervacije:', { carId, startDate, endDate, location, totalPrice });
    
    // Provera da li je korisnik prijavljen
    if (!isUserLoggedIn()) {
        // Uklanjanje svih postojećih obaveštenja pre prikazivanja novog
        if (window.authAlerts && window.authAlerts.clear) {
            window.authAlerts.clear();
        }
        
        window.authAlerts.error('Morate biti prijavljeni da biste rezervisali vozilo', 'Nije moguće rezervisati');
        
        // Otvaranje modala za prijavu
        if (typeof window.showModal === 'function') {
            window.showModal('loginModal');
        } else if (typeof window.openSimpleModal === 'function') {
            window.openSimpleModal('loginModal');
        } else {
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }
        return false;
    }
    
    // Provera da li su svi podaci uneti
    if (!carId || !startDate || !endDate || !location) {
        if (window.authAlerts) {
            window.authAlerts.error('Molimo popunite sve podatke za rezervaciju', 'Nepotpuni podaci');
        }
        return false;
    }
    
    // Provera validnosti datuma - ova provera je sada deo validacije forme
    // i ne treba je ponavljati ovde da ne bi došlo do duplih poruka
    
    // Dobijanje podataka o korisniku
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        if (window.authAlerts) {
            window.authAlerts.error('Greška pri dobijanju podataka o korisniku', 'Greška sistema');
        }
        return false;
    }
    
    // Dobijanje podataka o vozilu
    const car = allCars.find(c => c.id == carId);
    if (!car) {
        if (window.authAlerts) {
            window.authAlerts.error('Vozilo nije pronađeno', 'Greška sistema');
        }
        return false;
    }
    
    // Ako ukupna cena nije prosleđena, izračunaj je
    if (!totalPrice || totalPrice <= 0) {
        // Izračunavanje broja dana
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Izračunavanje ukupne cene
        totalPrice = days * car.price;
    }
    
    // Kreiranje rezervacije
    const reservation = {
        id: Date.now().toString(),
        carId: carId,
        carName: car.name,
        carImage: car.image,
        startDate: startDate,
        endDate: endDate,
        location: location,
        totalPrice: totalPrice,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    // Dodavanje rezervacije korisniku
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
        if (window.authAlerts) {
            window.authAlerts.error('Korisnik nije pronađen', 'Greška sistema');
        }
        return false;
    }
    
    // Inicijalizacija niza rezervacija ako ne postoji
    if (!users[userIndex].reservations) {
        users[userIndex].reservations = [];
    }
    
    // Dodavanje rezervacije
    users[userIndex].reservations.push(reservation);
    
    // Ažuriranje podataka u localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Ažuriranje trenutnog korisnika
    currentUser.reservations = users[userIndex].reservations;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Zatvaranje modalnog prozora za rezervaciju
    if (typeof window.hideAllModals === 'function') {
        window.hideAllModals();
    } else if (typeof window.closeAllModals === 'function') {
        window.closeAllModals();
    } else {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = '';
    }
    
    // Prikazivanje poruke o uspešnoj rezervaciji
    if (window.authAlerts) {
        window.authAlerts.success(`Uspešno ste rezervisali vozilo ${car.name} za period ${formatDate(startDate)} - ${formatDate(endDate)}. Ukupna cena: ${totalPrice} €`, 'Uspešna rezervacija');
    }
    
    // Automatski prikaži rezervacije korisnika nakon uspešne rezervacije
    setTimeout(() => {
        // Ažuriranje prikaza rezervacija
        displayUserReservations();
        
        // Otvaranje modala za rezervacije
        if (typeof window.openSimpleModal === 'function') {
            window.openSimpleModal('userReservationsModal-1');
        } else if (typeof window.showModal === 'function') {
            window.showModal('userReservationsModal-1');
        } else {
            const reservationsModal = document.getElementById('userReservationsModal-1');
            if (reservationsModal) {
                reservationsModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }
    }, 500); // Malo odlaganje da bi se poruka o uspešnoj rezervaciji prikazala pre otvaranja modala
    
    return true;
}

// Funkcija za formatiranje datuma
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS');
}

// Funkcija za otkazivanje rezervacije
function cancelReservation(reservationId) {
    console.log('Otkazivanje rezervacije:', reservationId);
    
    // Provera da li je korisnik prijavljen
    if (!isUserLoggedIn()) {
        if (window.authAlerts) {
            window.authAlerts.error('Morate biti prijavljeni da biste otkazali rezervaciju', 'Nije moguće otkazati');
        }
        return false;
    }
    
    // Dobijanje podataka o korisniku
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.reservations) {
        if (window.authAlerts) {
            window.authAlerts.error('Greška pri dobijanju podataka o korisniku', 'Greška sistema');
        }
        return false;
    }
    
    // Pronalaženje rezervacije
    const reservationIndex = currentUser.reservations.findIndex(r => r.id === reservationId);
    if (reservationIndex === -1) {
        if (window.authAlerts) {
            window.authAlerts.error('Rezervacija nije pronađena', 'Greška sistema');
        }
        return false;
    }
    
    // Čuvanje podataka o rezervaciji za poruku
    const carName = currentUser.reservations[reservationIndex].carName;
    
    // Otkazivanje rezervacije (promjena statusa)
    currentUser.reservations[reservationIndex].status = 'cancelled';
    
    // Ažuriranje podataka u localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Ažuriranje podataka u listi korisnika
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].reservations = currentUser.reservations;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Ažuriranje prikaza rezervacija
    displayUserReservations();
    
    // Prikazivanje poruke o uspešnom otkazivanju
    if (window.authAlerts) {
        window.authAlerts.clear(); // Uklanjanje svih postojećih obaveštenja
        window.authAlerts.success(`Vaša rezervacija za vozilo ${carName} je uspešno otkazana. Rezervacija je sada označena kao otkazana.`, 'Rezervacija otkazana');
    } else {
        alert(`Vaša rezervacija za vozilo ${carName} je uspešno otkazana.`);
    }
    
    return true;
}

// Funkcija za brisanje rezervacije
function deleteReservation(reservationId) {
    console.log('Brisanje rezervacije:', reservationId);
    
    // Provera da li je korisnik prijavljen
    if (!isUserLoggedIn()) {
        if (window.authAlerts) {
            window.authAlerts.error('Morate biti prijavljeni da biste obrisali rezervaciju', 'Nije moguće obrisati');
        }
        return false;
    }
    
    // Dobijanje podataka o korisniku
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.reservations) {
        if (window.authAlerts) {
            window.authAlerts.error('Greška pri dobijanju podataka o korisniku', 'Greška sistema');
        }
        return false;
    }
    
    // Pronalaženje rezervacije
    const reservationIndex = currentUser.reservations.findIndex(r => r.id === reservationId);
    if (reservationIndex === -1) {
        if (window.authAlerts) {
            window.authAlerts.error('Rezervacija nije pronađena', 'Greška sistema');
        }
        return false;
    }
    
    // Čuvanje podataka o rezervaciji za poruku
    const carName = currentUser.reservations[reservationIndex].carName;
    
    // Brisanje rezervacije iz niza
    currentUser.reservations.splice(reservationIndex, 1);
    
    // Ažuriranje podataka u localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Ažuriranje podataka u listi korisnika
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].reservations = currentUser.reservations;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Ažuriranje prikaza rezervacija (modalni prozor ostaje otvoren)
    displayUserReservations();
    
    // Prikazivanje poruke o uspešnom brisanju
    if (window.authAlerts) {
        window.authAlerts.clear(); // Uklanjanje svih postojećih obaveštenja
        window.authAlerts.success(`Vaša rezervacija za vozilo ${carName} je trajno obrisana iz sistema.`, 'Rezervacija obrisana');
    } else {
        alert(`Vaša rezervacija za vozilo ${carName} je trajno obrisana iz sistema.`);
    }
    
    return true;
}

// Funkcija za prikazivanje rezervacija korisnika
function displayUserReservations() {
    console.log('Prikazivanje rezervacija korisnika');
    
    // Provera da li je korisnik prijavljen
    if (!isUserLoggedIn()) {
        if (window.authAlerts) {
            window.authAlerts.error('Morate biti prijavljeni da biste videli rezervacije', 'Nije moguće prikazati');
        }
        return;
    }
    
    // Dobijanje podataka o korisniku
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        if (window.authAlerts) {
            window.authAlerts.error('Greška pri dobijanju podataka o korisniku', 'Greška sistema');
        }
        return;
    }
    
    // Dobijanje kontejnera za rezervacije
    const reservationsContainer = document.getElementById('userReservationsContainer');
    if (!reservationsContainer) {
        console.error('Kontejner za rezervacije nije pronađen');
        return;
    }
    
    // Brisanje postojećeg sadržaja
    reservationsContainer.innerHTML = '';
    
    // Provera da li korisnik ima rezervacije
    if (!currentUser.reservations || currentUser.reservations.length === 0) {
        reservationsContainer.innerHTML = '<p class="no-reservations">Nemate aktivnih rezervacija.</p>';
        return;
    }
    
    // Sortiranje rezervacija po datumu (najnovije prvo)
    const sortedReservations = [...currentUser.reservations].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Kreiranje HTML-a za svaku rezervaciju
    sortedReservations.forEach(reservation => {
        const reservationElement = document.createElement('div');
        reservationElement.className = `reservation-card ${reservation.status === 'cancelled' ? 'cancelled' : ''}`;
        
        // Formatiranje datuma
        const startDate = new Date(reservation.startDate);
        const endDate = new Date(reservation.endDate);
        const formattedStartDate = `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}.`;
        const formattedEndDate = `${endDate.getDate()}.${endDate.getMonth() + 1}.${endDate.getFullYear()}.`;
        
        // Kreiranje HTML-a za rezervaciju
        reservationElement.innerHTML = `
            <div class="reservation-header">
                <h3 class="reservation-car-name">${reservation.carName}</h3>
                <span class="reservation-status ${reservation.status}">${reservation.status === 'active' ? 'Aktivna' : 'Otkazana'}</span>
            </div>
            <div class="reservation-details">
                <div class="reservation-car-image">
                    <img src="${reservation.carImage}" alt="${reservation.carName}" onerror="this.src='img/car-placeholder.jpg'">
                </div>
                <div class="reservation-info">
                    <p><i class="fas fa-calendar-alt"></i> Od: <strong>${formattedStartDate}</strong></p>
                    <p><i class="fas fa-calendar-check"></i> Do: <strong>${formattedEndDate}</strong></p>
                    <p><i class="fas fa-map-marker-alt"></i> Lokacija: <strong>${reservation.location}</strong></p>
                    <p><i class="fas fa-money-bill-wave"></i> Ukupna cena: <strong>${reservation.totalPrice} €</strong></p>
                </div>
            </div>
            <div class="reservation-actions">
                ${reservation.status === 'active' ? `
                    <button class="btn btn-warning" onclick="cancelReservation('${reservation.id}')">
                        <i class="fas fa-ban"></i>
                        <span>Otkaži rezervaciju</span>
                    </button>
                ` : ''}
                <button class="btn btn-danger" onclick="deleteReservation('${reservation.id}')">
                    <i class="fas fa-trash-alt"></i>
                    <span>Obriši rezervaciju</span>
                </button>
            </div>
        `;
        
        // Dodavanje rezervacije u kontejner
        reservationsContainer.appendChild(reservationElement);
    });
}

// Inicijalizacija kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    // Dodavanje event listenera za formu za rezervaciju
    const reservationForms = document.querySelectorAll('[id^="reservationForm-"]');
    reservationForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formId = this.id.split('-')[1];
            const carId = document.getElementById(`reservationCarId-${formId}`).value;
            const startDate = document.getElementById(`startDate-${formId}`).value;
            const endDate = document.getElementById(`endDate-${formId}`).value;
            const location = document.getElementById(`location-${formId}`).value;
            
            // Provera da li postoji greška u datumima
            const endDateInput = document.getElementById(`endDate-${formId}`);
            if (endDateInput && endDateInput.dataset.error) {
                // Prikazivanje greške
                if (window.authAlerts) {
                    window.authAlerts.error(endDateInput.dataset.error, 'Greška u datumima');
                } else {
                    alert(endDateInput.dataset.error);
                }
                return false;
            }
            
            const totalPrice = document.getElementById(`totalPrice-${formId}`).textContent.replace(' €', '');
            
            // Kreiranje rezervacije
            const success = createReservation(carId, startDate, endDate, location, totalPrice);
            
            if (success) {
                // Zatvaranje modala
                if (typeof window.closeModal === 'function') {
                    window.closeModal(`reservationModal-${formId}`);
                } else if (typeof window.closeSimpleModal === 'function') {
                    window.closeSimpleModal(`reservationModal-${formId}`);
                } else {
                    const modal = document.getElementById(`reservationModal-${formId}`);
                    if (modal) {
                        modal.style.display = 'none';
                    }
                }
                
                // Prikazivanje poruke o uspešnoj rezervaciji već se dešava u createReservation funkciji
            }
        });
    });
});
