/**
 * Funkcije za kalkulaciju cene rezervacije
 */

// Funkcija za izračunavanje cene rezervacije
function calculateReservationPrice(startDate, endDate, pricePerDay) {
    // Provera da li su datumi validni
    if (!startDate || !endDate) {
        return {
            days: 0,
            totalPrice: 0,
            error: null
        };
    }
    
    // Konvertovanje datuma u Date objekte
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Provera da li je krajnji datum nakon početnog
    if (end <= start) {
        return {
            days: 0,
            totalPrice: 0,
            error: "Datum vraćanja mora biti nakon datuma preuzimanja"
        };
    }
    
    // Izračunavanje broja dana
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Izračunavanje ukupne cene
    const totalPrice = days * pricePerDay;
    
    return {
        days,
        totalPrice,
        error: null
    };
}

// Funkcija za ažuriranje prikaza cene
function updatePriceDisplay(formId) {
    const startDateInput = document.getElementById(`startDate-${formId}`);
    const endDateInput = document.getElementById(`endDate-${formId}`);
    const pricePerDayElement = document.getElementById(`reservationPricePerDay-${formId}`);
    
    if (!startDateInput || !endDateInput || !pricePerDayElement) {
        console.error('Nedostaju elementi za kalkulaciju cene');
        return;
    }
    
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    // Ako nema datuma, ne prikazujemo ništa
    if (!startDate || !endDate) {
        return;
    }
    
    // Izvlačenje cene iz teksta (uklanjanje € znaka)
    const priceText = pricePerDayElement.textContent.trim();
    const pricePerDay = parseInt(priceText.replace('€', '').trim());
    
    if (isNaN(pricePerDay)) {
        console.error('Nije moguće parsirati cenu:', priceText);
        return;
    }
    
    // Izračunavanje cene
    const { days, totalPrice, error } = calculateReservationPrice(startDate, endDate, pricePerDay);
    
    // Ažuriranje prikaza
    const daysCountElement = document.getElementById(`daysCount-${formId}`);
    const pricePerDayCalcElement = document.getElementById(`pricePerDayCalc-${formId}`);
    const totalPriceElement = document.getElementById(`totalPrice-${formId}`);
    const priceCalculationElement = document.getElementById(`priceCalculation-${formId}`);
    
    // Čuvamo informaciju o grešci, ali je ne prikazujemo odmah
    if (error) {
        // Samo čuvamo informaciju o grešci za kasniju validaciju
        endDateInput.dataset.error = error;
    } else {
        // Brisanje greške ako je sve u redu
        delete endDateInput.dataset.error;
    }
    
    // Prikazujemo cenu čak i ako postoji greška u datumima
    if (daysCountElement) {
        daysCountElement.textContent = days > 0 ? `${days} dana` : '0 dana';
    }
    
    if (pricePerDayCalcElement) {
        pricePerDayCalcElement.textContent = `${pricePerDay} €`;
    }
    
    if (totalPriceElement) {
        totalPriceElement.textContent = `${totalPrice} €`;
    }
    
    // Prikazujemo kontejner za cenu
    if (priceCalculationElement) {
        priceCalculationElement.style.display = 'block';
    }
    
    // Ažuriranje skrivenog polja za ukupnu cenu ako postoji
    const totalPriceInput = document.getElementById(`totalPriceInput-${formId}`);
    if (totalPriceInput) {
        totalPriceInput.value = totalPrice;
    }
}

// Inicijalizacija kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    // Sakrijemo prikaz cene na početku
    const priceCalculations = document.querySelectorAll('[id^="priceCalculation-"]');
    priceCalculations.forEach(element => {
        element.style.display = 'none';
    });
    
    // Dodavanje event listenera za datume rezervacije
    const startDateInputs = document.querySelectorAll('[id^="startDate-"]');
    const endDateInputs = document.querySelectorAll('[id^="endDate-"]');
    
    startDateInputs.forEach(input => {
        // Postavljanje minimalnog datuma na današnji
        const today = new Date().toISOString().split('T')[0];
        input.min = today;
        
        input.addEventListener('change', function() {
            const formId = this.id.split('-')[1];
            updatePriceDisplay(formId);
        });
    });
    
    endDateInputs.forEach(input => {
        input.addEventListener('change', function() {
            const formId = this.id.split('-')[1];
            updatePriceDisplay(formId);
        });
    });
    
    // Dodavanje event listenera za forme rezervacije
    const reservationForms = document.querySelectorAll('[id^="reservationForm-"]');
    reservationForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            // Validacija forme se sada obavlja u reservation-handler.js
            // Ovaj event listener više nije potreban
        });
    });
});
