/**
 * AuraTech Innovations — Interactive Engine & Core Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileNav();
  initSolutionFilters();
  initRoiCalculator();
  initMetricCounters();
  initTestimonialsSlider();
  initFaqAccordion();
  initConsultationModal();
  initFormsAndToasts();
});

/* ==========================================================================
   1. Navbar Scroll Effect & Active Links
   ========================================================================== */
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   2. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-mobile-toggle');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   3. Interactive Solutions Filter Tabs
   ========================================================================== */
function initSolutionFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const solutionCards = document.querySelectorAll('.solution-card');

  if (!filterTabs.length || !solutionCards.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Set active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      // Filter solution cards
      solutionCards.forEach(card => {
        const categories = card.getAttribute('data-categories') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          // Add micro fade-in animation
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// Add CSS animation for cards dynamically
const filterAnimStyle = document.createElement('style');
filterAnimStyle.innerHTML = `
@keyframes fadeInCard {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
`;
document.head.appendChild(filterAnimStyle);

/* ==========================================================================
   4. Interactive ROI & Project Scope Estimator
   ========================================================================== */
function initRoiCalculator() {
  const calcForm = document.getElementById('roiCalculatorForm');
  if (!calcForm) return;

  const projectTypeInputs = calcForm.querySelectorAll('input[name="projectType"]');
  const scaleSlider = document.getElementById('calcScaleSlider');
  const scaleDisplay = document.getElementById('calcScaleDisplay');
  const velocityInputs = calcForm.querySelectorAll('input[name="calcVelocity"]');
  const supportInputs = calcForm.querySelectorAll('input[name="calcSupport"]');

  // Outputs
  const estCostDisplay = document.getElementById('estCostOutput');
  const estSprintsDisplay = document.getElementById('estSprintsOutput');
  const estTeamDisplay = document.getElementById('estTeamOutput');
  const estUptimeDisplay = document.getElementById('estUptimeOutput');
  const estStackDisplay = document.getElementById('estStackOutput');

  function calculateEstimate() {
    // 1. Base cost by project type
    let baseRate = 28000;
    let baseSprints = 4;
    let teamArchetype = '3 Principal Eng + 1 Architect';
    let defaultStack = 'Next.js, Node, PostgreSQL, AWS';

    const selectedType = calcForm.querySelector('input[name="projectType"]:checked');
    if (selectedType) {
      switch (selectedType.value) {
        case 'cloud':
          baseRate = 35000;
          baseSprints = 6;
          teamArchetype = '2 Cloud Architects + 2 DevOps SRE';
          defaultStack = 'Kubernetes, Terraform, AWS/GCP, Datadog';
          break;
        case 'ai':
          baseRate = 42000;
          baseSprints = 8;
          teamArchetype = '2 ML Engineers + 2 Full-Stack + 1 MLOps';
          defaultStack = 'PyTorch, LangChain, FastAPI, VectorDB, vLLM';
          break;
        case 'saas':
          baseRate = 32000;
          baseSprints = 6;
          teamArchetype = '1 Lead Architect + 3 Full-Stack + 1 UI/UX';
          defaultStack = 'Next.js, Tailwind, Go, PostgreSQL, Redis';
          break;
        case 'security':
          baseRate = 26000;
          baseSprints = 4;
          teamArchetype = '2 SecOps Lead + 1 Compliance Spec';
          defaultStack = 'Falco, HashiCorp Vault, SOC2 Toolkit, Snyk';
          break;
      }
    }

    // 2. User scale multiplier
    const scaleVal = scaleSlider ? parseInt(scaleSlider.value, 10) : 50;
    let scaleMultiplier = 1;
    let userLabel = '50K Active Users';

    if (scaleVal <= 25) {
      scaleMultiplier = 0.85;
      userLabel = '< 10K Users / Prototype';
    } else if (scaleVal <= 50) {
      scaleMultiplier = 1.0;
      userLabel = '10K - 100K Users / Mid-Market';
    } else if (scaleVal <= 75) {
      scaleMultiplier = 1.35;
      userLabel = '100K - 1M Users / High Scale';
    } else {
      scaleMultiplier = 1.75;
      userLabel = '1M+ Users / Global Enterprise';
    }

    if (scaleDisplay) {
      scaleDisplay.textContent = userLabel;
    }

    // 3. Velocity / Timeline multiplier
    let velocityMultiplier = 1.0;
    const selectedVelocity = calcForm.querySelector('input[name="calcVelocity"]:checked');
    if (selectedVelocity) {
      if (selectedVelocity.value === 'rush') {
        velocityMultiplier = 1.3;
        baseSprints = Math.max(3, Math.round(baseSprints * 0.7));
      } else if (selectedVelocity.value === 'relaxed') {
        velocityMultiplier = 0.95;
        baseSprints = Math.round(baseSprints * 1.25);
      }
    }

    // 4. Support tier
    let supportAddon = 0;
    let slaUptime = '99.9% Standard SLA';
    const selectedSupport = calcForm.querySelector('input[name="calcSupport"]:checked');
    if (selectedSupport) {
      if (selectedSupport.value === 'platinum') {
        supportAddon = 8500;
        slaUptime = '99.999% Dedicated 24/7 SRE';
      } else if (selectedSupport.value === 'gold') {
        supportAddon = 4500;
        slaUptime = '99.95% High-Availability SLA';
      }
    }

    // Total Calculation
    const totalEstimate = Math.round((baseRate * scaleMultiplier * velocityMultiplier) + supportAddon);
    const finalSprints = Math.max(3, baseSprints);

    // Update UI with smooth formatting
    if (estCostDisplay) {
      estCostDisplay.textContent = `$${totalEstimate.toLocaleString()}`;
    }
    if (estSprintsDisplay) {
      estSprintsDisplay.textContent = `${finalSprints} Sprints (~${finalSprints * 2} wks)`;
    }
    if (estTeamDisplay) {
      estTeamDisplay.textContent = teamArchetype;
    }
    if (estUptimeDisplay) {
      estUptimeDisplay.textContent = slaUptime;
    }
    if (estStackDisplay) {
      estStackDisplay.textContent = defaultStack;
    }
  }

  // Attach event listeners
  projectTypeInputs.forEach(i => i.addEventListener('change', calculateEstimate));
  if (scaleSlider) scaleSlider.addEventListener('input', calculateEstimate);
  velocityInputs.forEach(i => i.addEventListener('change', calculateEstimate));
  supportInputs.forEach(i => i.addEventListener('change', calculateEstimate));

  // Initial calculation
  calculateEstimate();
}

/* ==========================================================================
   5. Animated Number Counters on Scroll
   ========================================================================== */
function initMetricCounters() {
  const metricValues = document.querySelectorAll('.metric-number');
  if (!metricValues.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  metricValues.forEach(el => observer.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target') || '0');
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = (target * easeProgress).toFixed(decimals);

      el.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  }
}

/* ==========================================================================
   6. Testimonials Slider
   ========================================================================== */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  const slideCount = slides.length;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (idx === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlide() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    currentIndex = (index + slideCount) % slideCount;
    updateSlide();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }

  // Autoplay with pause on hover
  let autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), 6000);
  const container = document.querySelector('.testimonial-slider-container');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    container.addEventListener('mouseleave', () => {
      clearInterval(autoplayInterval);
      autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), 6000);
    });
  }
}

/* ==========================================================================
   7. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  if (!faqHeaders.length) return;

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Close all other items in the same container
      const parentContainer = faqItem.parentElement;
      if (parentContainer) {
        parentContainer.querySelectorAll('.faq-item').forEach(item => {
          item.classList.remove('active');
        });
      }

      // Toggle current
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   8. Consultation Modal & Native <dialog>
   ========================================================================== */
function initConsultationModal() {
  const modal = document.getElementById('consultationModal');
  const triggerBtns = document.querySelectorAll('[data-open-modal="consultation"]');
  const closeBtns = document.querySelectorAll('[data-close-modal="consultation"]');

  if (!modal) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.showModal();
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.close();
    });
  });

  // Close when clicking modal backdrop
  modal.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close();
    }
  });
}

/* ==========================================================================
   9. Form Submissions & Global Toast Notifications
   ========================================================================== */
function initFormsAndToasts() {
  // 1. Toast container creation if not present
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  window.showToast = function(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">✨</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 20);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  };

  // 2. Intercept Consultation Form
  const modalForm = document.getElementById('consultationForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = document.getElementById('consultationModal');
      if (modal) modal.close();
      modalForm.reset();
      window.showToast('Architecture Consultation Scheduled', 'Our Principal Solutions Architect will contact you within 2 business hours.');
    });
  }

  // 3. Intercept Newsletter Form
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      window.showToast('Subscribed to AuraTech Insights', 'You will receive our weekly architectural deep-dives.');
    });
  });

  // 4. Intercept Contact Page RFP Form
  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.reset();
      window.showToast('Proposal Request Received', 'Thank you! We will review your RFP and deliver a detailed scope breakdown.');
    });
  }
}
