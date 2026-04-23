/* ===================== CURSOR ===================== */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let rx=0, ry=0;
window.addEventListener('mousemove', e => {
    cur.style.left = e.clientX+'px';
    cur.style.top = e.clientY+'px';
    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;
    ring.style.left = rx+'px';
    ring.style.top = ry+'px';
});

function lerp(a,b,t){ return a+(b-a)*t; }
let rax=0,ray=0;
function animCursor(){
    rax = lerp(rax, parseFloat(ring.style.left||0), 0.15);
    ray = lerp(ray, parseFloat(ring.style.top||0), 0.15);
    requestAnimationFrame(animCursor);
}
animCursor();

document.addEventListener('mouseover', e => {
    const target = e.target.closest('a, button, .car-card, .filter-btn, .advantage-card, .service-card');
    if (target) {
        cur.style.width='20px'; cur.style.height='20px';
        ring.style.width='60px'; ring.style.height='60px';
        ring.style.opacity='0.8';
    }
});
document.addEventListener('mouseout', e => {
    const target = e.target.closest('a, button, .car-card, .filter-btn, .advantage-card, .service-card');
    if (target) {
        cur.style.width='12px'; cur.style.height='12px';
        ring.style.width='40px'; ring.style.height='40px';
        ring.style.opacity='0.6';
    }
});
