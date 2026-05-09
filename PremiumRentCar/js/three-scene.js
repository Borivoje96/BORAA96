/* ===================== THREE.JS 3D SCENA ===================== */

// ===================== INICIJALIZACIJA RENDERERA =====================
// THREE.WebGLRenderer je klasa za renderovanje 3D sceni kroz WebGL
// Parametri:
//    - canvas: HTML canvas element za renderovanje
//    - alpha: true - podržava providnost (transparent pozadina)
//    - antialias: true - zaglađuje ivice (anti-aliasing)

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });

// setPixelRatio podešava rezoluciju renderovanja za high-DPI ekrane
// Math.min(window.devicePixelRatio, 2) - limitira na maksimalno 2x za performanse
// Zašto? Da bi izgledalo oštro na Retina/4K ekranima bez opterećenja GPU-a
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// setSize podešava veličinu renderera na veličinu prozora
renderer.setSize(window.innerWidth, window.innerHeight);

// ===================== SCENA I KAMERA =====================

// THREE.Scene je kontejner za sve 3D objekte
// Svi objekti, svetla i kamere se dodaju u scenu
const scene = new THREE.Scene();

// THREE.PerspectiveCamera simulira ljudsko oko
// Parametri:
//    - 60: FOV (field of view) u stepenima - širina vidnog polja
//    - window.innerWidth/window.innerHeight: aspect ratio (širina/visina)
//    - 0.1: near clipping plane - najbliži vidljivi objekat
//    - 1000: far clipping plane - najdalji vidljivi objekat
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);

// Postavljamo kameru u prostoru
// position.set(x, y, z) - pozicija kamere
// (0, 0, 6) - kamera je 6 jedinica iza centra scene
// Zašto (0,0,6)? Da bi videli objekte koji su oko (0,0,0)
camera.position.set(0, 0, 6);

// ===================== OSVETLJENJE SCENE =====================
// Osvetljenje je ključno za 3D scenu - bez njega sve je crno

// AmbientLight je svetlo koje osvetljava sve strane svih objekata podjednako
// Boja: 0xc9a84c (zlatna), Intenzitet: 0.3 (30% jačine)
// Zašto? Kreira osnovno osvetljenje i atmosferu
const ambientLight = new THREE.AmbientLight(0xc9a84c, 0.3);
scene.add(ambientLight);

// PointLight je svetlo koje zrači iz jedne tačke u sve pravce (kao sijalica)
// Prvo point light - zlatna boja, jačina 2, domet 20 jedinica
// Pozicija: (5, 5, 5) - gore desno iza scene
const pointLight1 = new THREE.PointLight(0xc9a84c, 2, 20);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

// Drugo point light - plava boja, jačina 1, domet 20 jedinica
// Pozicija: (-5, -3, 3) - dole levo ispred scene
// Kreira kontrast i dubinu
const pointLight2 = new THREE.PointLight(0x4060ff, 1, 20);
pointLight2.position.set(-5, -3, 3);
scene.add(pointLight2);

// DirectionalLight je svetlo koje zrači u jednom pravcu (kao sunce)
// Boja: bela, Intenzitet: 0.5
// Pozicija: (0, 10, 5) - iznad scene, malo unapred
// Kreira senke i definise glavni izvor svetla
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(0, 10, 5);
scene.add(dirLight);

// ===================== ČESTICE (PARTICLES) =====================
// Čestice kreiraju efekat "zvezdanog neba" ili galaksije u pozadini

// Broj čestica - 1200 čestica za gustu ali performansnu scenu
const particleCount = 1200;

// BufferGeometry je efikasan način za čuvanje velikih količina geometrijskih podataka
// Koristi se za renderovanje hiljada čestica bez problema sa performansama
const particleGeo = new THREE.BufferGeometry();

// ===================== KREIRANJE BUFFER-A =====================

// Float32Array je tipiziran niz za GPU efikasnost
// * 3 jer svaka čestica ima x, y, z koordinate
const positions = new Float32Array(particleCount * 3);  // Pozicije (x,y,z)
const colors = new Float32Array(particleCount * 3);     // Boje (r,g,b)
const sizes = new Float32Array(particleCount);         // Veličine

// ===================== GENERISANJE PODATAKA =====================

for(let i = 0; i < particleCount; i++) {
    const i3 = i * 3; // Indeks za x,y,z koordinate
    
    // ===================== POZICIJE ČESTICA =====================
    
    // Random pozicije u 3D prostoru
    // (Math.random()-0.5) * 20 - random broj između -10 i 10
    // (Math.random()-0.5) * 15 - 3 - random broj između -10.5 i 4.5
    positions[i3] = (Math.random()-0.5) * 20;     // X koordinata
    positions[i3+1] = (Math.random()-0.5) * 20; // Y koordinata
    positions[i3+2] = (Math.random()-0.5) * 15 - 3; // Z koordinata
    
    // ===================== BOJE ČESTICA =====================
    
    const t = Math.random(); // Random broj 0-1
    if(t > 0.7) {
        // 30% čestica su zlatne (0.788, 0.659, 0.298)
        colors[i3] = 0.788; colors[i3+1] = 0.659; colors[i3+2] = 0.298;
    } else {
        // 70% čestica su plavo-sive (0.3, 0.3, 0.5)
        colors[i3] = 0.3; colors[i3+1] = 0.3; colors[i3+2] = 0.5;
    }
    
    // ===================== VELIČINE ČESTICA =====================
    
    // Random veličine između 1 i 4
    sizes[i] = Math.random() * 3 + 1;
}

// ===================== POSTAVLJANJE BUFFER ATRIBUTA =====================

// setAttribute dodaje podatke u geometriju
// Prvi parametar: naziv atributa ('position', 'color', 'size')
// Drugi parametar: BufferAttribute sa podacima i brojem komponenti po vertex-u
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

// ===================== MATERIAL I OBJEKAT ČESTICA =====================

// PointsMaterial je specijalizovan material za renderovanje čestica
const particleMat = new THREE.PointsMaterial({
    size: 0.05,              // Osnovna veličina čestica
    vertexColors: true,       // Koristi boje iz vertex-a (ne uniformnu boju)
    transparent:true,          // Dozvoli providnost
    opacity:0.7,             // 70% providnost
    sizeAttenuation: true,    // Čestice se smanjuju sa udaljenošću
});

// THREE.Points je objekat koji renderuje čestice kao tačke
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// ===================== GEOMETRIJSKI OBLICI (WIREFRAME) =====================
// Ovi oblici dodaju vizuelni interes i dubinu sceni

// Niz za praćenje svih oblika i njihovih rotacija
const geoShapes = [];

// Wireframe material za prikaz samo ivica
const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0xc9a84c,      // Zlatna boja
    wireframe:true,       // Prikazuj samo ivice
    transparent:true,     // Dozvoli providnost
    opacity:0.08         // 8% providnost (vrlo providan)
});

// ===================== TORUS (PRSTEN) =====================

// Prvi torus - veliki, zlatni prsten oko scene
// TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments)
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(3.5, 0.015, 16, 100), // Veliki prsten
    new THREE.MeshBasicMaterial({ color:0xc9a84c, transparent:true, opacity:0.12 })
);
torus.rotation.x = Math.PI/3; // Rotacija za 60 stepeni
scene.add(torus);
// Dodajemo u niz za animaciju sa brzinom rotacije
geoShapes.push({mesh:torus, rx:0.003, ry:0.005});

// Drugi torus - veći, plavi prsten
const torus2 = new THREE.Mesh(
    new THREE.TorusGeometry(5, 0.008, 8, 80), // Veći prsten
    new THREE.MeshBasicMaterial({color:0x4060ff, transparent:true, opacity:0.07 })
);
torus2.rotation.x = -Math.PI/5; // Rotacija za -36 stepeni
torus2.rotation.y = Math.PI/4;  // Rotacija za 45 stepeni
scene.add(torus2);
geoShapes.push({mesh:torus2, rx:0.002, ry:-0.004});

// ===================== ICOSAHEDRON (20-STRANA) =====================

// Prvi icosahedron - zlatni, desno
const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.2, 0), // Poluprečnik 1.2, bez detalja
    wireframeMat
);
ico.position.set(4, 1, -2); // Pozicija u prostoru
scene.add(ico);
geoShapes.push({mesh:ico, rx:0.008, ry:0.01});

// Drugi icosahedron - plavi, levo
const ico2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.7, 0), // Manji poluprečnik
    new THREE.MeshBasicMaterial({color:0x6080ff,wireframe:true,transparent:true,opacity:0.1})
);
ico2.position.set(-4.5, -1, -1);
scene.add(ico2);
geoShapes.push({mesh:ico2, rx:0.012, ry:-0.007});

// ===================== OCTAHEDRON (8-STRANA) =====================

// Octahedron - zlatni, gore levo
const octa = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.9), // Poluprečnik 0.9
    new THREE.MeshBasicMaterial({color:0xc9a84c,wireframe:true,transparent:true,opacity:0.12})
);
octa.position.set(-3, 2, -3);
scene.add(octa);
geoShapes.push({mesh:octa, rx:-0.006, ry:0.009});

// ===================== MOUSE PARALLAX EFEKAT =====================
// Kamera prati pokrete miša da bi se scena osećala interaktivno

// Globalne promenljive za poziciju miša
// Vrednosti su između -1 i 1 (normalizovane)
let mouseX = 0, mouseY = 0;

// Event listener za praćenje pokreta miša
window.addEventListener('mousemove', e => {
    // Normalizujemo poziciju miša na opseg [-1, 1]
    // e.clientX/window.innerWidth - 0.5: pretvara [0,1] u [-0.5,0.5]
    // * 2: pretvara [-0.5,0.5] u [-1,1]
    mouseX = (e.clientX/window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY/window.innerHeight - 0.5) * 2;
});

// ===================== ANIMACIONA PETLJA =====================
// Clock je THREE.js klasa za praćenje vremena
const clock = new THREE.Clock();

function animate() {
    // requestAnimationFrame zakazuje sledeći frame (60fps)
    // Browser optimizuje animaciju i sinhronizuje sa refresh rate-om
    requestAnimationFrame(animate);
    
    // getElapsedTime() vraća vreme u sekundama od pokretanja clock-a
    const t = clock.getElapsedTime();
    
    // ===================== ANIMACIJA ČESTICA =====================
    
    // Rotiramo sistem čestica
    particles.rotation.y = t * 0.015; // Rotacija oko Y ose (sporo)
    particles.rotation.x = t * 0.008;  // Rotacija oko X ose (još sporije)
    
    // ===================== ANIMACIJA GEOMETRIJSKIH OBLIKA =====================
    
    // Rotiramo svaki geometrijski oblik
    geoShapes.forEach(s => {
        // s.rx i s.ry su brzine rotacije definisane pri kreiranju
        s.mesh.rotation.x += s.rx; // Rotacija oko X ose
        s.mesh.rotation.y += s.ry; // Rotacija oko Y ose
    });
    
    // ===================== KAMERA PARALLAX =====================
    
    // Smooth praćenje miša sa lerp efektom
    // camera.position.x += (cilj - trenutna) * faktor
    // mouseX * 0.5: ograničavamo kretanje kamere na +/-0.5 jedinice
    // * 0.03: faktor smooth-ova (3% ka cilju)
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.03;
    
    // lookAt() usmerava kameru ka tački (0,0,0) - centru scene
    camera.lookAt(0, 0, 0);
    
    // ===================== ANIMACIJA SVETLA =====================
    
    // Animiramo poziciju pointLight1 (zlatnog svetla)
    // Math.sin() i Math.cos() kreiraju kružno kretanje
    pointLight1.position.x = Math.sin(t * 0.5) * 6; // Kružno kretanje po X
    pointLight1.position.y = Math.cos(t * 0.3) * 4; // Kružno kretanje po Y
    
    // ===================== RENDEROVANJE =====================
    
    // render() crta scenu iz perspektive kamere
    renderer.render(scene, camera);
}

// Pokrećemo animacionu petlju
animate();

// ===================== RESPONSIVE RESIZING =====================
// Ovaj event listener osigurava da se scena prilagođava promeni veličine prozora

window.addEventListener('resize', () => {
    // ===================== AŽURIRANJE KAMERE =====================
    
    // Menjamo aspect ratio kamere da bi se prilagodio novoj veličini prozora
    camera.aspect = window.innerWidth/window.innerHeight;
    
    // updateProjectionMatrix() računa novu projekcionu matricu
    // Neophodno nakon promene aspect ratio-a
    camera.updateProjectionMatrix();
    
    // ===================== AŽURIRANJE RENDERERA =====================
    
    // Menjamo veličinu renderera da bi se uklopila u novi prozor
    renderer.setSize(window.innerWidth, window.innerHeight);
});
