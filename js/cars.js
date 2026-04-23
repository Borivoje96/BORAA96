/* ===================== CARS DATA ===================== */
let cars = [];

async function loadCarsData() {
    try {
        const response = await fetch('data/cars.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error("HTTP " + response.status);
        cars = await response.json();
        renderCars();
    } catch (error) {
        console.error("Greška pri učitavanju vozila iz JSON-a:", error);
        const grid = document.getElementById('carsGrid');
        if (grid) {
            grid.innerHTML = `<div style="grid-column: 1/-1; padding: 30px; background: rgba(255,50,50,0.1); border: 1px solid red; border-radius: 10px; color: white; text-align: center;">
                <h3 style="color: #ff5555; margin-bottom: 10px;">⚠️ Greška pri učitavanju podataka</h3>
                <p style="margin-bottom: 15px;">Automobili se ne prikazuju jer je sajt otvoren direktno iz foldera (<strong>file:///</strong>).</p>
                <p>Moderan web pregledač blokira učitavanje <strong>.json</strong> fajlova iz sigurnosnih razloga (CORS) kada nemate aktivan server.</p>
                <br/>
                <p style="color: var(--gold);"><strong>Rešenje:</strong> Otvorite projekat u VS Code-u i pokrenite ga preko <strong>Live Server</strong> ekstenzije!</p>
            </div>`;
        }
    }
}

const categoryLabels = { luksuzni:'Luksuzno', sportski:'Sportsko', suv:'SUV' };
const grid = document.getElementById('carsGrid');

function renderCars(filter='all') {
    grid.innerHTML = '';
    const filtered = filter==='all' ? cars : cars.filter(c=>(c.type || '').toLowerCase()===filter);
    filtered.forEach((car,i) => {
        const card = document.createElement('div');
        card.className = 'car-card visible';
        card.style.animationDelay = `${i*0.07}s`;
        
        const badgeLabel = categoryLabels[(car.type || '').toLowerCase()] || car.type;
        
        card.innerHTML = `
            <div class="car-img-wrap">
                <img src="${car.image}" alt="${car.name}" 
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <div class="car-img-fallback" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-size:4rem;opacity:0.18;">🚗</div>
                <div class="car-category-badge">${badgeLabel}</div>
            </div>
            <div class="car-info">
                <div class="car-name">${car.name}</div>
                <div class="car-model">${car.year} • ${car.color}</div>
                <div class="car-specs">
                    <div class="spec"><i class="fas fa-cog"></i>${car.transmission}</div>
                    <div class="spec"><i class="fas fa-gas-pump"></i>${car.fuel}</div>
                    <div class="spec"><i class="fas fa-users"></i>${car.seats}</div>
                </div>
                <div class="car-footer">
                    <div class="car-price">
                        <div class="amount">${car.pricePerDay}€</div>
                        <div class="period">/ dan</div>
                    </div>
                    <button class="book-btn" onclick="openReservation(${car.id})">
                        <i class="fas fa-calendar"></i> Rezerviši
                    </button>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    console.log("Loading cars...");
    loadCarsData();
});
// Fallback if already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadCarsData();
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        renderCars(btn.dataset.filter);
    });
});
