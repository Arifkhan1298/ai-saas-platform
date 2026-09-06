/* ==========================================================================
   NEXVORA AI - Pricing Switcher & Plan Selection
   Monthly/Yearly billing toggle with instant discount calculation and modal links
   ========================================================================== */

(function() {
  'use strict';

  const toggleSwitch = document.getElementById('pricing-toggle');
  const monthlyLabel = document.getElementById('label-monthly');
  const annualLabel = document.getElementById('label-annual');

  const priceStarter = document.getElementById('price-starter');
  const pricePro = document.getElementById('price-pro');
  const priceBusiness = document.getElementById('price-business');

  const periodEls = document.querySelectorAll('.price-period');

  const pricingData = {
    monthly: {
      starter: "19",
      pro: "49",
      business: "129",
      period: "/month, billed monthly"
    },
    annual: {
      starter: "15",
      pro: "39",
      business: "99",
      period: "/month, billed annually"
    }
  };

  let isAnnual = true; // default annual to showcase 20% savings

  if (!toggleSwitch) return;

  function updatePricing() {
    const mode = isAnnual ? 'annual' : 'monthly';
    const data = pricingData[mode];

    if (priceStarter) priceStarter.textContent = data.starter;
    if (pricePro) pricePro.textContent = data.pro;
    if (priceBusiness) priceBusiness.textContent = data.business;

    periodEls.forEach(el => {
      el.textContent = data.period;
    });

    if (isAnnual) {
      toggleSwitch.classList.add('annual');
      if (annualLabel) annualLabel.classList.add('active');
      if (monthlyLabel) monthlyLabel.classList.remove('active');
    } else {
      toggleSwitch.classList.remove('annual');
      if (monthlyLabel) monthlyLabel.classList.add('active');
      if (annualLabel) annualLabel.classList.remove('active');
    }
  }

  // Toggle switch click
  toggleSwitch.addEventListener('click', () => {
    isAnnual = !isAnnual;
    updatePricing();
    if (window.showToast) {
      const msg = isAnnual 
        ? "Switched to Annual Billing (Saved 20% across all plans)" 
        : "Switched to Monthly Billing";
      window.showToast("Billing Cycle Updated", msg, "info", 2400);
    }
  });

  if (monthlyLabel) {
    monthlyLabel.addEventListener('click', () => {
      if (isAnnual) {
        isAnnual = false;
        updatePricing();
      }
    });
  }

  if (annualLabel) {
    annualLabel.addEventListener('click', () => {
      if (!isAnnual) {
        isAnnual = true;
        updatePricing();
      }
    });
  }

  // Connect Plan buttons to Sign Up modal with pre-selected plan
  const planButtons = document.querySelectorAll('.plan-select-btn');
  planButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'Pro';
      if (window.openAuthModal) {
        window.openAuthModal('signup', plan);
      } else if (window.showToast) {
        window.showToast(`Selected ${plan} Plan`, "Launching setup wizard...", "success");
      }
    });
  });

  // Initial render
  updatePricing();
})();
