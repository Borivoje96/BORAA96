// LOADING SCREEN
const loadingScreen = document.getElementById('loadingScreen');

window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 2000);
});

// PARTICLES SYSTEM
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Mouse interaction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.x -= (dx / distance) * force * 2;
        particle.y -= (dy / distance) * force * 2;
      }
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(212, 175, 55, ${particle.opacity})`;
      this.ctx.fill();
    });
    
    // Draw connections
    this.particles.forEach((particle1, i) => {
      this.particles.slice(i + 1).forEach(particle2 => {
        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle1.x, particle1.y);
          this.ctx.lineTo(particle2.x, particle2.y);
          this.ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 * (1 - distance / 120)})`;
          this.ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particles
const particlesCanvas = document.getElementById('particles-canvas');
if (particlesCanvas) {
  new ParticleSystem(particlesCanvas);
}

// CUSTOM CURSOR
const cur = document.getElementById('cur');
const curRing = document.getElementById('curRing');

document.addEventListener('mousemove', (e) => {
  cur.style.left = e.clientX + 'px';
  cur.style.top = e.clientY + 'px';
  curRing.style.left = e.clientX + 'px';
  curRing.style.top = e.clientY + 'px';
});

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .project-card, .service-row, .process-step, .cert-card, .interest-card');

interactiveElements.forEach(element => {
  element.addEventListener('mouseenter', () => {
    cur.classList.add('hover');
    curRing.classList.add('hover');
  });
  
  element.addEventListener('mouseleave', () => {
    cur.classList.remove('hover');
    curRing.classList.remove('hover');
  });
});

// SMOOTH SCROLL REVEAL ANIMATIONS
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all elements with fade-up or fade-left classes
document.addEventListener('DOMContentLoaded', () => {
  const fadeElements = document.querySelectorAll('.fade-up, .fade-left');
  fadeElements.forEach(element => {
    observer.observe(element);
  });
});

// COUNTER ANIMATION
const counters = document.querySelectorAll('.num');
const speed = 200;

const countUp = (counter) => {
  const target = +counter.getAttribute('data-target');
  const count = +counter.innerText;
  const increment = target / speed;

  if (count < target) {
    counter.innerText = Math.ceil(count + increment);
    setTimeout(() => countUp(counter), 10);
  } else {
    counter.innerText = target;
  }
};

// Start counter animation when element is visible
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.innerText === '0') {
      countUp(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => {
  counterObserver.observe(counter);
});

// NAVIGATION ACTIVE STATE
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// SMOOTH SCROLL FOR NAVIGATION LINKS
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// PROJECT CARD CLICK HANDLERS
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
  card.addEventListener('click', () => {
    // You can add project modal or navigation logic here
    console.log('Project card clicked');
  });
});

// FORM SUBMISSION
const submitBtn = document.querySelector('.submit-btn');
const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');

if (submitBtn) {
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Basic form validation
    let isValid = true;
    formInputs.forEach(input => {
      if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        input.style.borderColor = 'red';
      } else {
        input.style.borderColor = '';
      }
    });
    
    if (isValid) {
      // Show success message
      submitBtn.textContent = 'MESSAGE SENT ✓';
      submitBtn.style.background = '#4CAF50';
      
      // Reset form after 3 seconds
      setTimeout(() => {
        formInputs.forEach(input => input.value = '');
        submitBtn.textContent = 'SEND MESSAGE →';
        submitBtn.style.background = '';
      }, 3000);
    } else {
      // Show error message
      submitBtn.textContent = 'PLEASE FILL REQUIRED FIELDS';
      submitBtn.style.background = '#f44336';
      
      setTimeout(() => {
        submitBtn.textContent = 'SEND MESSAGE →';
        submitBtn.style.background = '';
      }, 3000);
    }
  });
}

// PARALLAX EFFECT FOR HERO SHAPES
const shapes = document.querySelectorAll('.shape');
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.5;
    shape.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// MOBILE MENU (if needed in future)
const mobileMenuToggle = () => {
  // Add mobile menu functionality here if needed
};

// LAZY LOADING FOR IMAGES (if images are added)
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      imageObserver.unobserve(img);
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));

// TYPING EFFECT FOR HERO SUBTITLE (optional)
const typeWriter = (element, text, speed = 50) => {
  let i = 0;
  element.innerHTML = '';
  
  const type = () => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  };
  
  type();
};

// Initialize typing effect if needed
// const heroSub = document.querySelector('.hero-sub');
// if (heroSub) {
//   const originalText = heroSub.textContent;
//   setTimeout(() => typeWriter(heroSub, originalText, 30), 1500);
// }

// SCROLL PROGRESS BAR (optional)
const updateScrollProgress = () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = (scrollTop / scrollHeight) * 100;
  
  // Create progress bar if it doesn't exist
  let progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: ${scrollPercent}%;
      height: 2px;
      background: var(--gold);
      z-index: 1001;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
  } else {
    progressBar.style.width = scrollPercent + '%';
  }
};

window.addEventListener('scroll', updateScrollProgress);

// THEME TOGGLE (optional)
const toggleTheme = () => {
  // Add dark/light theme toggle functionality here
};

// PERFORMANCE MONITORING (for development)
const performanceMonitor = () => {
  if (window.performance && window.performance.timing) {
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    console.log(`Page load time: ${loadTime}ms`);
  }
};

window.addEventListener('load', performanceMonitor);

// ERROR HANDLING
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

// SERVICE WORKER REGISTRATION (for PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered'))
    //   .catch(error => console.log('SW registration failed'));
  });
}

console.log('Portfolio script loaded successfully!');
