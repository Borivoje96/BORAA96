/* ===================== CUSTOM CURSOR ===================== */

// ===================== GLOBALNE PROMENLJIVE =====================

// cur je referenca na glavni cursor element (mala tačka)
// getElementById() pronalazi element sa ID 'cursor' u HTML-u
const cur = document.getElementById('cursor');

// ring je referenca na ring element (krug oko cursor-a)
// Ovo je veći, providni krug koji prati cursor sa delay-om
const ring = document.getElementById('cursorRing');

// rx i ry su trenutne pozicije ring-a (x i y koordinate)
// Početna vrednost je 0,0 (gore levo)
// Koristi se za smooth praćenje miša
let rx=0, ry=0;

// ===================== MOUSEMOVE EVENT HANDLER =====================
// Ovaj event listener se poziva svaki put kada se miš pomeri
// Parametar: e - event object sa informacijama o mišu (pozicija, target, itd.)
// Redosled izvršavanja: 1. Ažuriraj glavni cursor -> 2. Ažuriraj ring poziciju -> 3. Postavi stilove
// Zašto window.addEventListener? Sluša miš pokrete na celom prozoru

window.addEventListener('mousemove', e => {
    // ===================== AŽURIRANJE GLAVNOG CURSOR-A =====================
    
    // Postavljamo poziciju glavnog cursor-a na trenutnu poziciju miša
    // e.clientX - X koordinata miša (broj piksela od leve ivice prozora)
    // e.clientY - Y koordinata miša (broj piksela od vrha prozora)
    // + 'px' - dodajemo 'px' unit za CSS positioning
    cur.style.left = e.clientX+'px';
    cur.style.top = e.clientY+'px';
    
    // ===================== SMOOTH PRAĆENJE RING-A (LERP) =====================
    
    // Linearna interpolacija (lerp) za smooth praćenje
    // Formula: novaPozicija = trenutnaPozicija + (ciljnaPozicija - trenutnaPozicija) * faktor
    // 
    // rx += (e.clientX - rx) * 0.12
    //    - e.clientX - rx: razlika između miš pozicije i ring pozicije
    //    - * 0.12: 12% te razlike (faktor smooth-ova)
    //    - +=: dodajemo na trenutnu poziciju
    //
    // Zašto lerp?
    //    - Ring ne ide direktno na miš poziciju
    //    - Prati miš sa kašnjenjem (lag efekat)
    //    - Kreira smooth, prirodno kretanje
    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;
    
    // ===================== AŽURIRANJE RING POZICIJE =====================
    
    // Postavljamo ring poziciju na izračunate vrednosti
    // Ring će "goniti" miš sa malim kašnjenjem
    ring.style.left = rx+'px';
    ring.style.top = ry+'px';
});

// ===================== LERP FUNKCIJA =====================
// Linearna interpolacija - glatka tranzicija između dve vrednosti
// Parametri:
//    - a: početna vrednost
//    - b: ciljna vrednost
//    - t: faktor (0-1) - koliko se približavamo cilju
// Vraća: nova vrednost između a i b
// Formula: a + (b - a) * t

function lerp(a,b,t){ 
    return a+(b-a)*t; 
}

// ===================== GLOBALNE PROMENLJIVE ZA ANIMACIJU =====================

// rax i ray su animirane pozicije ring-a
// Koriste se u animacionoj petlji za dodatni smooth efekat
let rax=0,ray=0;

// ===================== ANIMACIONA PETLJA =====================
// Ova funkcija kreira kontinualnu animaciju za smooth praćenje miša
// Koristi requestAnimationFrame za 60fps animaciju
// Zašto dodatna animacija?
    // - Još smooth-ije praćenje
    // - Eliminiše jitter kada se miš brzo pomeri
    // - Dodaje "elastic" efekat

function animCursor(){
    // ===================== LERP ANIMACIJA =====================
    
    // Primenjujemo lerp na ring poziciju
    // parseFloat(ring.style.left||0) - trenutna CSS pozicija ring-a
    // || 0 - fallback ako style.left nije postavljen
    // 0.15 - faktor smooth-ova (15% ka cilju)
    rax = lerp(rax, parseFloat(ring.style.left||0), 0.15);
    ray = lerp(ray, parseFloat(ring.style.top||0), 0.15);
    
    // ===================== NASTAVAK ANIMACIJE =====================
    
    // requestAnimationFrame() zakazuje sledeći frame
    // Browser optimizuje animaciju i sinhronizuje sa refresh rate-om
    // Ovo kreira beskonačnu animacionu petlju (60fps)
    requestAnimationFrame(animCursor);
}

// Pokrećemo animacionu petlju
// Ovo se poziva jednom da bi započela animacija
animCursor();

// ===================== MOUSEOVER EVENT - HOVER EFEKAT =====================
// Ovaj event listener se poziva kada miš pređe preko elementa
// Menja veličinu cursor-a kada se miš nalazi iznad interaktivnih elemenata
// Parametar: e - event object

// CSS selektori za interaktivne elemente:
//    - a: linkovi
//    - button: dugmići
//    - .car-card: kartice automobila
//    - .filter-btn: filter dugmići
//    - .advantage-card: prednosti kartice
//    - .service-card: usluge kartice

document.addEventListener('mouseover', e => {
    // ===================== PRONALAŽENJE TARGET ELEMENTA =====================
    
    // e.target.closest() pronalazi najbliži roditeljski element koji odgovara selektoru
    // Zašto closest? Ako korisnik klikne na ikonicu UNUTAR dugmeta, closest će naći dugme
    // Ovo je robustnije od direktnog proveravanja e.target
    const target = e.target.closest('a, button, .car-card, .filter-btn, .advantage-card, .service-card');
    
    // ===================== PROMENA VELIČINE CURSOR-A =====================
    
    if (target) {
        // Povećavamo glavni cursor (mala tačka)
        // 20px x 20px - veća veličina za bolju vidljivost
        cur.style.width='20px'; 
        cur.style.height='20px';
        
        // Povećavamo ring (krug oko cursor-a)
        // 60px x 60px - veći krug za efekt
        ring.style.width='60px'; 
        ring.style.height='60px';
        
        // Povećavamo opacity (vidljivost) ring-a
        // 0.8 - 80% vidljivost (intenzivniji efekat)
        ring.style.opacity='0.8';
    }
});

// ===================== MOUSEOUT EVENT - RESET EFEKTA =====================
// Ovaj event listener se poziva kada miš napusti element
// Vraća cursor na originalnu veličinu

document.addEventListener('mouseout', e => {
    // Isti princip kao u mouseover - pronalazimo najbliži interaktivni element
    const target = e.target.closest('a, button, .car-card, .filter-btn, .advantage-card, .service-card');
    
    if (target) {
        // ===================== RESET VELIČINE =====================
        
        // Vraćamo glavni cursor na originalnu veličinu
        // 12px x 12px - default veličina
        cur.style.width='12px'; 
        cur.style.height='12px';
        
        // Vraćamo ring na originalnu veličinu
        // 40px x 40px - default veličina
        ring.style.width='40px'; 
        ring.style.height='40px';
        
        // Vraćamo opacity na default vrednost
        // 0.6 - 60% vidljivost (subtilniji efekat)
        ring.style.opacity='0.6';
    }
});
