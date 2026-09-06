/* ==========================================================================
   NEXVORA AI - Testimonials Carousel
   Smooth sliding carousel with dot navigation, auto-advance, and touch swipe
   ========================================================================== */

(function() {
  'use strict';

  const track = document.getElementById('testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoSlideInterval = null;

  function updateCarousel(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    updateCarousel(currentIndex + 1);
  }

  function prevSlide() {
    updateCarousel(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      updateCarousel(i);
    });
  });

  // Auto advance
  function startAutoPlay() {
    stopAutoPlay();
    autoSlideInterval = setInterval(nextSlide, 6500);
  }

  function stopAutoPlay() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  const wrapper = document.querySelector('.testimonials-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
    wrapper.addEventListener('touchstart', stopAutoPlay, { passive: true });
    wrapper.addEventListener('touchend', startAutoPlay);
  }

  // Touch Swipe Support
  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  });

  // Initial call
  updateCarousel(0);
  startAutoPlay();
})();
