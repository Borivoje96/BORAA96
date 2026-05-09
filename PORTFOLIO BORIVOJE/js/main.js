// CURSOR
const cur = document.getElementById('cur');
const curRing = document.getElementById('curRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
function animRing(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;curRing.style.left=rx+'px';curRing.style.top=ry+'px';requestAnimationFrame(animRing);}
animRing();
document.querySelectorAll('a,button,.project-card,.service-row,.cert-card,.interest-card,.skill-tag,.tool-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.classList.add('big');curRing.classList.add('big');});
  el.addEventListener('mouseleave',()=>{cur.classList.remove('big');curRing.classList.remove('big');});
});

// INTERSECTION OBSERVER
const observer = new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('visible'),i*60);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.fade-up,.fade-left').forEach(el=>observer.observe(el));

// COUNTER ANIMATION
const counterObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !e.target.dataset.counted){
      e.target.dataset.counted='1';
      const target=+e.target.dataset.target;
      const suffix=e.target.dataset.suffix||'+';
      let cur=0;
      const step=Math.max(1,Math.floor(target/40));
      const timer=setInterval(()=>{
        cur+=step;
        if(cur>=target){cur=target;clearInterval(timer);}
        e.target.textContent=cur+suffix;
      },40);
    }
  });
},{threshold:0.5});
document.querySelectorAll('.num[data-target]').forEach(el=>{
  el.dataset.suffix='+';
  counterObs.observe(el);
});
