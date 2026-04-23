/* ===================== THREE.JS 3D SCENE ===================== */
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 6);

// Lighting
const ambientLight = new THREE.AmbientLight(0xc9a84c, 0.3);
scene.add(ambientLight);
const pointLight1 = new THREE.PointLight(0xc9a84c, 2, 20);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);
const pointLight2 = new THREE.PointLight(0x4060ff, 1, 20);
pointLight2.position.set(-5, -3, 3);
scene.add(pointLight2);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(0, 10, 5);
scene.add(dirLight);

// Particles
const particleCount = 1200;
const particleGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

for(let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random()-0.5) * 20;
    positions[i3+1] = (Math.random()-0.5) * 20;
    positions[i3+2] = (Math.random()-0.5) * 15 - 3;
    
    const t = Math.random();
    if(t > 0.7) {
        colors[i3] = 0.788; colors[i3+1] = 0.659; colors[i3+2] = 0.298; // gold
    } else {
        colors[i3] = 0.3; colors[i3+1] = 0.3; colors[i3+2] = 0.5; // blue-grey
    }
    sizes[i] = Math.random() * 3 + 1;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const particleMat = new THREE.PointsMaterial({
    size: 0.05, vertexColors: true,
    transparent:true, opacity:0.7,
    sizeAttenuation: true,
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// Geometric wireframe shapes
const geoShapes = [];
const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0xc9a84c, wireframe:true, transparent:true, opacity:0.08
});

// Torus
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(3.5, 0.015, 16, 100),
    new THREE.MeshBasicMaterial({ color:0xc9a84c, transparent:true, opacity:0.12 })
);
torus.rotation.x = Math.PI/3;
scene.add(torus);
geoShapes.push({mesh:torus, rx:0.003, ry:0.005});

const torus2 = new THREE.Mesh(
    new THREE.TorusGeometry(5, 0.008, 8, 80),
    new THREE.MeshBasicMaterial({ color:0x4060ff, transparent:true, opacity:0.07 })
);
torus2.rotation.x = -Math.PI/5;
torus2.rotation.y = Math.PI/4;
scene.add(torus2);
geoShapes.push({mesh:torus2, rx:0.002, ry:-0.004});

// Icosahedron
const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.2, 0),
    wireframeMat
);
ico.position.set(4, 1, -2);
scene.add(ico);
geoShapes.push({mesh:ico, rx:0.008, ry:0.01});

const ico2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.7, 0),
    new THREE.MeshBasicMaterial({color:0x6080ff,wireframe:true,transparent:true,opacity:0.1})
);
ico2.position.set(-4.5, -1, -1);
scene.add(ico2);
geoShapes.push({mesh:ico2, rx:0.012, ry:-0.007});

// Octahedron
const octa = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.9),
    new THREE.MeshBasicMaterial({color:0xc9a84c,wireframe:true,transparent:true,opacity:0.12})
);
octa.position.set(-3, 2, -3);
scene.add(octa);
geoShapes.push({mesh:octa, rx:-0.006, ry:0.009});

// Mouse parallax
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', e => {
    mouseX = (e.clientX/window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY/window.innerHeight - 0.5) * 2;
});

// Animation
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    
    particles.rotation.y = t * 0.015;
    particles.rotation.x = t * 0.008;
    
    geoShapes.forEach(s => {
        s.mesh.rotation.x += s.rx;
        s.mesh.rotation.y += s.ry;
    });
    
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
    
    pointLight1.position.x = Math.sin(t * 0.5) * 6;
    pointLight1.position.y = Math.cos(t * 0.3) * 4;
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
