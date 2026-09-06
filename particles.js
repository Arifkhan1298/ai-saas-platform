/* ==========================================================================
   NEXVORA AI - Lightweight Neural Particles & Mouse Glow
   Subtle, futuristic, and highly performant canvas network
   ========================================================================== */

(function() {
  'use strict';

  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };
  let isTabActive = true;
  let animationFrameId;

  // Accessibility check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initDimensions() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.8 + 0.8;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 20 + 5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      // Soft electric blue and violet tones
      const colors = ['rgba(59, 130, 246, 0.4)', 'rgba(139, 92, 246, 0.35)', 'rgba(6, 182, 212, 0.35)'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Natural drifting
      this.x += this.vx;
      this.y += this.vy;
      // Wrap around borders
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse interactive deflection
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * this.density * 0.4;
          const directionY = forceDirectionY * force * this.density * 0.4;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }
  }

  function createParticles() {
    particles = [];
    // Adjust density based on screen resolution
    const count = Math.min(Math.floor((width * height) / 24000), 55);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 120;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.12;
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!isTabActive || prefersReducedMotion) return;

    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
      particles[i].update();
    }
    connectParticles();

    animationFrameId = requestAnimationFrame(animate);
  }

  // Mouse Glow element positioning
  const cursorGlow = document.querySelector('.cursor-glow');

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (cursorGlow) {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    initDimensions();
    createParticles();
  });

  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    if (isTabActive && !prefersReducedMotion) {
      cancelAnimationFrame(animationFrameId);
      animate();
    }
  });

  // Initialization
  initDimensions();
  createParticles();
  if (!prefersReducedMotion) {
    animate();
  }
})();
