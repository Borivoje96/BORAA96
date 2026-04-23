/* ===================== MODAL ===================== */
let currentCar = null;

function openReservation(id) {
    currentCar = cars.find(c=>String(c.id)===String(id));
    if(!currentCar) return;
    
    // Provera da li je korisnik ulogovan pre nego što dozvolimo rezervaciju
    if (typeof checkAuthBeforeReservation === 'function' && !checkAuthBeforeReservation()) {
        return; // auth.js će otvoriti modal za prijavu
    }

    document.getElementById('modalCarName').textContent = `${currentCar.name} • ${currentCar.year}`;
    document.getElementById('modalCarPrice').textContent = `${currentCar.pricePerDay}€ po danu`;
    document.getElementById('resDateFrom').value='';
    document.getElementById('resDateTo').value='';
    document.getElementById('resLocation').value='';
    document.getElementById('priceSummary').style.display='none';
    document.getElementById('reservationModal').classList.add('open');
    
    // Set min date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('resDateFrom').min = today;
    document.getElementById('resDateTo').min = today;
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

function calcPrice() {
    const fromInput = document.getElementById('resDateFrom');
    const toInput = document.getElementById('resDateTo');
    const from = fromInput.value;
    const to = toInput.value;
    
    // Sprečava da datum povratka bude pre datuma preuzimanja
    if (from) {
        toInput.min = from;
        if (to && new Date(to) < new Date(from)) {
            toInput.value = ''; // Resetuj datum povratka
            document.getElementById('priceSummary').style.display = 'none';
            return;
        }
    }

    if(!from || !to || !currentCar) return;
    
    // Ako se vraća istog dana, računamo kao 1 dan. U suprotnom razlika u danima.
    let days = Math.round((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24));
    if (days === 0) days = 1; 
    if (days < 0) return; // Za svaki slučaj

    document.getElementById('priceSummary').style.display = 'block';
    document.getElementById('sumDays').textContent = `${days} dan${days > 1 ? 'a' : ''}`;
    document.getElementById('sumPerDay').textContent = `${currentCar.pricePerDay}€`;
    document.getElementById('sumTotal').textContent = `${days * currentCar.pricePerDay}€`;
}

function confirmReservation() {
    const from = document.getElementById('resDateFrom').value;
    const to = document.getElementById('resDateTo').value;
    const loc = document.getElementById('resLocation').value;
    if(!from||!to||!loc) {
        showNotification('error','Greška','Molimo popunite sva polja!');
        return;
    }
    
    let days = Math.round((new Date(to)-new Date(from))/(1000*60*60*24));
    if (days === 0) days = 1;
    
    const totalPrice = days * currentCar.pricePerDay;

    // Čuvamo rezervaciju preko auth.js
    if (typeof saveReservation === 'function') {
        saveReservation({
            carId: currentCar.id,
            carName: currentCar.name,
            carImage: currentCar.image,
            dateFrom: from,
            dateTo: to,
            location: loc,
            days: days,
            totalPrice: totalPrice,
            status: 'Aktivna'
        });
    }

    closeModal('reservationModal');
    showNotification('success','Rezervacija Uspešna!',`${currentCar.name} je rezervisan. Možete videti detalje na Vašem nalogu.`);
}

document.getElementById('reservationModal').addEventListener('click', function(e) {
    if(e.target === this) closeModal('reservationModal');
});
