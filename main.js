/* ==========================================================================
   NEXVORA AI - Main Controller
   Navbar transitions, mobile nav, stat counters, FAQ accordions, and utilities
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Sticky Navbar Transition
  const navbar = document.querySelector('.navbar');
  function handleNavScroll() {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // 2. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileClose = document.getElementById('mobile-drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links .nav-link');

  function openMobileNav() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // 3. Smooth Anchor Scrolling with header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. Animated Statistics Counters
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsCounted = false;

  function runStatsCounter() {
    if (statsCounted) return;
    statsCounted = true;

    statNumbers.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const duration = 2000;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out quartic
        const ease = 1 - Math.pow(1 - progress, 4);
        const currentVal = (target * ease).toFixed(decimals);

        el.textContent = `${prefix}${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  const trustSection = document.querySelector('.trust-section');
  if (trustSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runStatsCounter();
        }
      });
    }, { threshold: 0.25 });
    observer.observe(trustSection);
  }

  // 5. FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerEl = item.querySelector('.faq-answer');

    if (questionBtn && answerEl) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          answerEl.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answerEl.style.maxHeight = answerEl.scrollHeight + 32 + 'px';
        }
      });
    }
  });

  // Open first FAQ item by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstAnswer = firstItem.querySelector('.faq-answer');
    firstItem.classList.add('active');
    if (firstAnswer) {
      firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 32 + 'px';
    }
  }

  // 6. Newsletter Subscription Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const email = emailInput ? emailInput.value.trim() : '';

      if (email && email.includes('@')) {
        if (window.showToast) {
          window.showToast('Subscribed!', `You will receive NEXVORA product updates at ${email}`, 'success');
        }
        if (emailInput) emailInput.value = '';
      } else {
        if (window.showToast) {
          window.showToast('Invalid Email', 'Please enter a valid email address.', 'info');
        }
      }
    });
  }

  // 7. Workspace Interactive Dashboard Sidebar navigation
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const name = item.textContent.trim();
      if (window.showToast) {
        window.showToast('Workspace View Updated', `Switched to ${name} module`, 'info', 1800);
      }
    });
  });

  // 8. AI Writing Studio Interactive Toolbar Actions
  const editorTools = document.querySelectorAll('.editor-tool-btn');
  editorTools.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const action = btn.textContent.trim();
      if (window.showToast) {
        window.showToast('Editor Format', `Applied ${action} to selection`, 'info', 1400);
      }
    });
  });

  const rewritePillBtn = document.getElementById('btn-editor-rewrite');
  if (rewritePillBtn) {
    rewritePillBtn.addEventListener('click', () => {
      const editorText = document.getElementById('editor-live-content');
      if (editorText) {
        editorText.innerHTML = `<strong>NEXVORA AI</strong> streamlines high-velocity team operations by connecting vector search with generative synthesis, achieving measurable <strong>3.4x efficiency improvements</strong> across all technical documentation.`;
        if (window.showToast) {
          window.showToast('Rewritten with Executive Tone', 'Sentence clarity improved by +28%', 'success');
        }
      }
    });
  }
});
