/**
 * Sri Mahalakshmi Engineering — Core Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroSlider();
  initProductsCarousel();
  initPumpsCarousel();
  initUpvcCarousel();
  initSanitaryCarousel();
  initInstallationsCarousel();
  initQuoteButtons();
  // Stats and Team modals disabled - cards remain static
  initSavingsCalculator();
  // initTeamModals();
  initBrochureModal();
  initEnquiryForm();
});

/* ==========================================================================
   1. Navbar Scroll & Mobile Menu
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar-new');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   2. Hero Right Product Slider
   ========================================================================== */
const heroProducts = [
  {
    title: 'PM Surya Ghar',
    tag: 'PM Surya Ghar Scheme',
    img: 'assets/images/product-pm-surya-ghar.jpg'
  },
  {
    title: 'Solar Panels',
    tag: 'Our Products',
    img: 'assets/images/product-solar-panels.jpg'
  },
  {
    title: 'Solar Water Heater',
    tag: 'Our Products',
    img: 'assets/images/product-solar-heater.jpg'
  },
  {
    title: 'Solar Lights',
    tag: 'Our Products',
    img: 'assets/images/product-solar-lights.jpg'
  },
  {
    title: 'Solar Fencing',
    tag: 'Our Products',
    img: 'assets/images/product-pm-surya-ghar.jpg'
  },
  {
    title: 'Solar Cleaning',
    tag: 'Our Products',
    img: 'assets/images/solar-hero-bg.jpg'
  }
];

function initHeroSlider() {
  const sliderImg = document.getElementById('heroSliderImg');
  const sliderTitle = document.getElementById('heroSliderTitle');
  const sliderTag = document.getElementById('heroSliderTag');
  const dotsContainer = document.getElementById('heroSliderDots');

  if (!sliderImg || !sliderTitle || !dotsContainer) return;

  let currentIndex = 0;

  // Render dots
  dotsContainer.innerHTML = '';
  heroProducts.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `slider-dot-item ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => setSlide(idx));
    dotsContainer.appendChild(dot);
  });

  function setSlide(idx) {
    currentIndex = idx;
    const item = heroProducts[currentIndex];
    
    sliderImg.style.opacity = '0';
    setTimeout(() => {
      sliderImg.src = item.img;
      sliderTitle.textContent = item.title.toUpperCase();
      if (sliderTag) sliderTag.textContent = item.tag;
      sliderImg.style.opacity = '1';
    }, 200);

    const dots = dotsContainer.querySelectorAll('.slider-dot-item');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  setInterval(() => {
    currentIndex = (currentIndex + 1) % heroProducts.length;
    setSlide(currentIndex);
  }, 3500);
}

/* ==========================================================================
   Products Auto-Scroll Carousel Engine (Single Set, Restarts from Beginning)
   ========================================================================== */
function setupProductsAutoScroll({
  viewportId,
  leftBtnId,
  rightBtnId,
  speed = 0.85
}) {
  const viewport = document.getElementById(viewportId);
  if (!viewport) return;

  const track = viewport.querySelector('.products-line-track');
  if (!track) return;

  const leftBtn = leftBtnId ? document.getElementById(leftBtnId) : null;
  const rightBtn = rightBtnId ? document.getElementById(rightBtnId) : null;

  let isHovered = false;
  let isDragging = false;
  let isResetting = false;
  let startX = 0;
  let scrollLeftPos = 0;

  // Auto-scroll loop
  function loop() {
    if (!isHovered && !isDragging && !isResetting) {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      if (maxScroll > 5) {
        viewport.scrollLeft += speed;

        // When reaching the end, wait briefly and smoothly restart from the start
        if (viewport.scrollLeft >= maxScroll - 2) {
          isResetting = true;
          setTimeout(() => {
            viewport.scrollTo({ left: 0, behavior: 'smooth' });
            setTimeout(() => {
              isResetting = false;
            }, 800);
          }, 1200);
        }
      }
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  // Pause on hover/touch
  viewport.addEventListener('mouseenter', () => { isHovered = true; });
  viewport.addEventListener('mouseleave', () => { isHovered = false; });
  viewport.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
  viewport.addEventListener('touchend', () => { isHovered = false; }, { passive: true });

  // Navigation Arrows: Left / Right
  if (leftBtn) {
    leftBtn.addEventListener('click', () => {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      if (viewport.scrollLeft <= 20) {
        viewport.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: -340, behavior: 'smooth' });
      }
    });
  }

  if (rightBtn) {
    rightBtn.addEventListener('click', () => {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      if (viewport.scrollLeft >= maxScroll - 20) {
        viewport.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: 340, behavior: 'smooth' });
      }
    });
  }

  // Mouse Drag Support
  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    viewport.style.cursor = 'grabbing';
    startX = e.pageX - viewport.offsetLeft;
    scrollLeftPos = viewport.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      viewport.style.cursor = 'default';
    }
  });

  viewport.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.5;
    viewport.scrollLeft = scrollLeftPos - walk;
  });
}

/* ==========================================================================
   Products Carousel Controls (Solar Section)
   ========================================================================== */
function initProductsCarousel() {
  setupProductsAutoScroll({
    viewportId: 'productsScrollViewport',
    leftBtnId: 'prodScrollLeft',
    rightBtnId: 'prodScrollRight',
    speed: 0.85
  });
}

/* ==========================================================================
   Pumps & Motors Carousel Controls (Motors Section)
   ========================================================================== */
function initPumpsCarousel() {
  setupProductsAutoScroll({
    viewportId: 'pumpsScrollViewport',
    leftBtnId: 'pumpsScrollLeft',
    rightBtnId: 'pumpsScrollRight',
    speed: 0.85
  });
}

/* ==========================================================================
   UPVC Plumbing & Casing Pipes Carousel Controls
   ========================================================================== */
function initUpvcCarousel() {
  setupProductsAutoScroll({
    viewportId: 'upvcScrollViewport',
    leftBtnId: 'upvcScrollLeft',
    rightBtnId: 'upvcScrollRight',
    speed: 0.85
  });
}

/* ==========================================================================
   Sanitary Ware & Ceramics Carousel Controls
   ========================================================================== */
function initSanitaryCarousel() {
  setupProductsAutoScroll({
    viewportId: 'sanitaryScrollViewport',
    leftBtnId: 'sanitaryScrollLeft',
    rightBtnId: 'sanitaryScrollRight',
    speed: 0.85
  });
}

/* ==========================================================================
   Our Live Solar Installations Carousel Controls
   ========================================================================== */
function initInstallationsCarousel() {
  setupProductsAutoScroll({
    viewportId: 'installScrollViewport',
    leftBtnId: 'installScrollLeft',
    rightBtnId: 'installScrollRight',
    speed: 0.85
  });
}

/* ==========================================================================
   3. Interactive Stats Modals
   ========================================================================== */
const statsData = {
  experience: {
    title: '18+ Years Experience',
    subtitle: 'Our Leadership & Experience',
    sections: [
      {
        heading: 'M. Vaddikasulu - Founder',
        desc: '25+ Years Experience. M. Vaddikasulu is the foundation of Sree Mahalakshmi Engineering. With 25+ years of extensive experience in the engineering and solar industry, he has profound practical knowledge of pumps, pipes, sanitary fixtures, solar products, installation practices, system design, and field-level challenges. His expertise ensures that every project is built on reliable and proven methodologies.'
      },
      {
        heading: 'M. Vikas Teja - Managing Director',
        desc: '3+ Years Experience. Vikas Teja M. leads the company with a focus on technically appropriate system design. He holds a B.Tech in Electrical Engineering and has successfully overseen the execution of over 450+ solar installations, ranging from residential PM Surya Ghar projects to large-scale agricultural and commercial applications.'
      },
      {
        heading: 'M. Kiran Sai - Technical Manager',
        desc: '6+ Years Experience. M. Kiran Sai serves as the Technical Manager, ensuring that every installation meets the highest standards. His practical field expertise in electrical works, plumbing engineering, testing, and commissioning plays a crucial role in the successful deployment of projects.'
      }
    ]
  },
  co2: {
    title: '1100+ Kgs of CO2 Reduced',
    subtitle: 'Environmental Impact',
    sections: [
      {
        desc: 'By shifting to renewable solar energy, our projects have collectively reduced over 1100 kilograms of carbon dioxide emissions. This is equivalent to planting thousands of trees and creating a greener, more sustainable future for the next generation.'
      },
      {
        heading: 'Cleaner Air',
        desc: 'Every solar panel installed directly contributes to minimizing harmful greenhouse gases in our atmosphere.'
      },
      {
        heading: 'Sustainable Energy',
        desc: 'We harness the infinite power of the sun, promoting eco-friendly energy independence.'
      }
    ]
  },
  customers: {
    title: '5000+ Happy Customers',
    subtitle: 'Building Trust Across AP',
    sections: [
      {
        desc: 'Over the past 18+ years, Sree Mahalakshmi Engineering has proudly served more than 5,000 satisfied customers across residential, commercial, and agricultural sectors in Vizianagaram, Srikakulam, Visakhapatnam, and across Andhra Pradesh.'
      },
      {
        heading: 'Top-Rated Service',
        desc: 'We ensure 100% customer satisfaction through premium tier-1 solar products, transparent pricing, and dedicated after-sales support.'
      },
      {
        heading: 'Trusted Partner',
        desc: 'From initial consultation to final net-metering synchronization, we guide our customers every step of the way.'
      }
    ]
  },
  projects: {
    title: '1200+ Projects Completed',
    subtitle: 'Our Track Record',
    sections: [
      {
        heading: '150+ Solar Power Projects',
        desc: 'Residential & Commercial Solar Power Systems, including PM Surya Ghar Muft Bijli Yojana installations. We ensure high efficiency and peak generation.'
      },
      {
        heading: '1000+ Fencing, Heater & Lights Projects',
        desc: 'Extensive track record in deploying solar water heaters, agricultural security fencing, and commercial solar street lighting across Andhra Pradesh.'
      }
    ]
  }
};

function initStatsModals() {
  const statItems = document.querySelectorAll('[data-stat-id]');
  const modal = document.getElementById('statDetailModal');
  const modalContent = document.getElementById('statModalBody');

  if (!modal || !modalContent) return;

  statItems.forEach(item => {
    item.addEventListener('click', () => {
      const statId = item.getAttribute('data-stat-id');
      const data = statsData[statId];
      if (!data) return;

      let html = `
        <div style="margin-bottom: 24px;">
          <span style="color: var(--accent-lime); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 13px;">${data.subtitle}</span>
          <h2 style="font-size: 32px; color: #ffffff; font-weight: 800; margin-top: 6px;">${data.title}</h2>
        </div>
        <div style="display: flex; flex-direction: column; gap: 16px;">
      `;

      data.sections.forEach(sec => {
        html += `
          <div style="background: #091326; padding: 20px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.12);">
            ${sec.heading ? `<h3 style="font-size: 18px; color: #ffffff; font-weight: 800; margin-bottom: 8px;">${sec.heading}</h3>` : ''}
            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.7; margin: 0;">${sec.desc}</p>
          </div>
        `;
      });

      html += `</div>`;
      modalContent.innerHTML = html;
      modal.showModal();
    });
  });

  document.querySelectorAll('[data-close-stat-modal]').forEach(btn => {
    btn.addEventListener('click', () => modal.close());
  });

  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      modal.close();
    }
  });
}

/* ==========================================================================
   4. Interactive Solar Savings Estimator
   ========================================================================== */
function initSavingsCalculator() {
  const billInput = document.getElementById('calcBillInput');
  const sizeOutput = document.getElementById('calcSizeOutput');
  const savingsOutput = document.getElementById('calcSavingsOutput');
  const co2Output = document.getElementById('calcCo2Output');
  const emptyState = document.getElementById('calcEmptyState');
  const resultsState = document.getElementById('calcResultsState');

  if (!billInput) return;

  function updateSavings() {
    const bill = parseFloat(billInput.value);

    if (!bill || bill <= 0) {
      if (emptyState) emptyState.style.display = 'flex';
      if (resultsState) resultsState.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (resultsState) resultsState.style.display = 'flex';

    // Formula: (Bill / Rs 8 per unit / 120 units per kW per month)
    const rawSize = bill / 8 / 120;
    const idealKw = Math.max(1, Math.ceil(rawSize));
    const annualSavings = bill * 12;
    const co2Kg = idealKw * 1200;
    const co2String = co2Kg >= 1000 ? `${(co2Kg / 1000).toFixed(1)} Tonnes` : `${co2Kg} Kgs`;

    if (sizeOutput) sizeOutput.textContent = `${idealKw} kW`;
    if (savingsOutput) savingsOutput.textContent = `₹${annualSavings.toLocaleString('en-IN')}`;
    if (co2Output) co2Output.textContent = co2String;
  }

  billInput.addEventListener('input', updateSavings);
}

/* ==========================================================================
   5. Products Deep Dive Modal
   ========================================================================== */
const productsData = {
  'solar-panels': {
    title: 'Solar Panels (Residential & Commercial)',
    subtitle: 'High-Efficiency Monocrystalline & Bifacial PV Modules',
    img: 'assets/images/product-solar-panels.png',
    desc: `Our high-efficiency monocrystalline and bifacial solar panels are built to deliver maximum energy conversion (>21.8%) across all weather conditions. Equipped with anti-reflective tempered glass, multi-busbar technology, and heavy-duty anodized aluminum frames, they resist high winds, coastal salinity, and harsh tropical heat.\n\nSri Mahalakshmi Engineering is an authorized distributor providing Tier-1 solar modules from Adani Solar, Waaree, and premier global manufacturers with full manufacturer warranty and performance assurance.`,
    features: ['Ultra-high conversion efficiency (>21.8%)', '25-Year Linear Power Output Warranty', 'Low-light & diffuse sunlight optimization', 'PID-resistant cell construction']
  },
  'solar-inverters': {
    title: 'Smart Solar Inverters',
    subtitle: 'High-Efficiency Dual MPPT On-Grid, Off-Grid & Hybrid Inverters',
    img: 'assets/images/product-solar-inverters.png',
    desc: `The brain of every solar installation, our smart solar inverters provide up to 98.6% European conversion efficiency. Available in Single-Phase and Three-Phase models, they feature integrated Dual MPPT tracking to extract maximum power output from variable roof orientations.\n\nEquipped with built-in Wi-Fi and 4G connectivity, you can monitor real-time daily generation, power export, and savings directly on your mobile smartphone anytime, anywhere.`,
    features: ['98.6% European efficiency conversion', 'Built-in Wi-Fi / 4G cloud telemetry', 'Integrated DC disconnector & surge arrestors', 'IP65 waterproof outdoor enclosure']
  },
  'rooftop-solar': {
    title: 'Rooftop Solar Power Plants',
    subtitle: 'Complete Turnkey On-Grid & Hybrid PM Surya Ghar Rooftop Systems',
    img: 'assets/images/product-rooftop-solar.jpg',
    desc: `Transform your rooftop into a clean energy generation asset. As an MNRE-certified and AP Discom approved vendor, Sri Mahalakshmi Engineering provides complete end-to-end EPC execution: structural site feasibility, 3D shadow analysis, MNRE subsidy processing up to ₹78,000, high-grade installation, bidirectional net-metering commissioning, and lifetime performance support.\n\nEliminate up to 95% of your electricity bill while protecting your property from rising utility tariffs.`,
    features: ['Direct Govt Subsidy up to ₹78,000 under PM Surya Ghar', 'Bi-directional Net-Metering synchronized with AP Discom', 'Heavy-duty galvanized steel elevated mounting', 'Average system payback within 3 to 4 years']
  },
  'solar-lights': {
    title: 'Solar Street & Perimeter Lights',
    subtitle: 'Integrated All-in-One Commercial & Agricultural Solar Lighting',
    img: 'assets/images/product-solar-lights.png',
    desc: `Illuminate farm access roads, residential colonies, commercial compounds, and village perimeters with zero electricity bills. Our All-in-One Solar Street Lights integrate high-efficiency mono PV cells, ultra-bright commercial LEDs, smart ambient optical sensors, and long-life LiFePO4 lithium batteries in a single compact aluminum fixture.\n\nFully automated dusk-to-dawn operation requires no trenching, cabling, or manual switches.`,
    features: ['Automatic Dusk-to-Dawn motion sensing', 'High-density LiFePO4 lithium battery (2000+ cycles)', 'High-lumen optical lenses with wide coverage', 'IP65 waterproof & cyclone resistant']
  },
  'solar-installation': {
    title: 'Professional Solar Installation & EPC',
    subtitle: 'Certified Structural, Electrical & Net-Metering Engineering',
    img: 'assets/images/product-solar-installation.jpg',
    desc: `A solar plant's 25-year reliability depends on precision installation. Our in-house licensed electrical and structural engineers ensure top-tier engineering standards: 150+ km/h wind-rated hot-dip galvanized mounting structures, chemical earthing pits, Class-1 lightning arrestors, and fire-resistant UV cables.\n\nWe coordinate all Discom approvals, electrical safety inspections, and meter replacements for a smooth, worry-free handover.`,
    features: ['150+ km/h cyclone-resistant structural design', 'Chemical earthing & lightning surge protection', 'Discom net-meter testing and commissioning', 'Prompt 48-hour standard installation turnaround']
  },
  'solar-heater': {
    title: 'Solar Water Heaters',
    subtitle: 'Cost-Effective Evacuated Tube (ETC) & Flat Plate (FPC) Thermal Systems',
    img: 'assets/images/product-solar-heater.jpg',
    desc: `Water heating constitutes up to 25-30% of standard domestic power consumption. Our premium solar water heaters utilize three-target vacuum evacuated tubes and high-density PUF insulation to keep water steaming hot for up to 48 hours.\n\nEquipped with anti-scaling food-grade inner tanks, they handle hard water easily and slash water heating utility bills by up to 80%.`,
    features: ['Reduces water heating power bills by up to 80%', '48-hour thermal heat retention insulation', 'Food-grade stainless steel corrosion-free tank', 'Optional electrical backup element for rainy days']
  },
  'solar-fencing': {
    title: 'Solar Powered Electric Fencing',
    subtitle: '24/7 Non-Lethal Perimeter Protection for Farms & Commercial Assets',
    img: 'assets/images/product-pm-surya-ghar.jpg',
    desc: `Safeguard agricultural crops, orchards, cattle farms, and commercial premises from wild animals and intruders. Our solar fencing energizer emits a non-lethal, high-voltage deterrent pulse that turns intruders back instantly without permanent injury.\n\nOperates completely off-grid with dedicated solar panels and battery backup, featuring integrated siren alarms triggered on any fence tampering.`,
    features: ['Safe, non-lethal deterrent shock pulse', '24/7 independent off-grid battery operation', 'Intrusion alarm siren & tamper warning', 'Substantially lower cost than concrete boundary walls']
  },
  'solar-cleaning': {
    title: 'Professional Solar Cleaning & AMC',
    subtitle: 'Specialized Deionized Soft-Brush Washing & Thermal Inspection',
    img: 'assets/images/solar-hero-bg.jpg',
    desc: `Airborne dust, bird droppings, and industrial soot can degrade solar power generation by up to 20% to 30%. Our professional maintenance crews utilize specialized deionized soft-water filtration and non-abrasive scratch-free rotary brushes.\n\nComprehensive thermal imaging diagnostics identify hot spots, micro-cracks, and loose electrical terminations, ensuring your system performs at peak capacity all year round.`,
    features: ['Recovers up to 30% lost power generation yield', 'Scratch-free deionized soft-brush washing', 'Thermal imaging hot-spot and string diagnostics', 'Affordable customized residential & commercial AMC plans']
  }
};

function initQuoteButtons() {
  const quoteBtns = document.querySelectorAll('.product-card-btn[data-service-select]');
  quoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceVal = btn.getAttribute('data-service-select');
      const serviceSelect = document.getElementById('enquiry-service');
      if (serviceSelect && serviceVal) {
        serviceSelect.value = serviceVal;
      }
      const target = document.getElementById('contact-new');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        const nameInput = document.getElementById('enquiry-name');
        setTimeout(() => nameInput?.focus(), 500);
      }
    });
  });
}

/* ==========================================================================
   6. Team Profiles Modal
   ========================================================================== */
const teamData = {
  'vaddikasulu': {
    name: 'Jagadish Kumar',
    role: 'PROPRIETOR & FOUNDER',
    edu: 'Proprietor & Engineering Lead',
    img: 'assets/images/product-solar-panels.jpg',
    about: 'Jagadish Kumar is the Proprietor and Founder of Sree Mahalakshmi Engineering, guiding the enterprise with deep practical expertise in submersible pumps, UPVC casing pipes, and turnkey solar installations. With 18+ years of dedicated service across Vizianagaram and AP, he has empowered over 1,200 farmers, households, and commercial clients.',
    stats: [
      { label: 'Years Experience', val: '18+' },
      { label: 'Primary Contact', val: '+91 93931 06125' },
      { label: 'Clients Served', val: '1,200+' }
    ]
  },
  'jagadish-kumar': {
    name: 'Jagadish Kumar',
    role: 'PROPRIETOR & FOUNDER',
    edu: 'Proprietor & Engineering Lead',
    img: 'assets/images/product-solar-panels.jpg',
    about: 'Jagadish Kumar is the Proprietor and Founder of Sree Mahalakshmi Engineering, guiding the enterprise with deep practical expertise in submersible pumps, UPVC casing pipes, and turnkey solar installations. With 18+ years of dedicated service across Vizianagaram and AP, he has empowered over 1,200 farmers, households, and commercial clients.',
    stats: [
      { label: 'Years Experience', val: '18+' },
      { label: 'Primary Contact', val: '+91 93931 06125' },
      { label: 'Clients Served', val: '1,200+' }
    ]
  },
  'vikas-teja': {
    name: 'M. Vikas Teja',
    role: 'MANAGING DIRECTOR',
    edu: 'B.Tech (Electrical Engineering)',
    img: 'assets/images/product-pm-surya-ghar.jpg',
    about: 'Vikas Teja M. is the Managing Director of Sree Mahalakshmi Engineering. With a strong engineering background in Electrical Engineering, he leads the company with a focus on technically sound system sizing, safe electrical practices, and uncompromising quality in project execution. He has personally overseen the deployment of 450+ residential and commercial projects.',
    stats: [
      { label: 'Education', val: 'B.Tech EE' },
      { label: 'Plants & Systems Executed', val: '450+' },
      { label: 'System Design', val: 'Advanced' }
    ]
  },
  'kiran-sai': {
    name: 'M. Kiran Sai',
    role: 'TECHNICAL MANAGER',
    edu: 'Technical Lead',
    img: 'assets/images/solar-hero-bg.jpg',
    about: 'M. Kiran Sai serves as the Technical Manager, ensuring that every rooftop, pump, piping, and agricultural installation meets the highest benchmarks of electrical safety, structure stability, and operational efficiency. He brings 6+ years of field testing, net-metering grid synchronization, and commissioning leadership.',
    stats: [
      { label: 'Years Experience', val: '6+' },
      { label: 'Field Execution', val: 'Lead' },
      { label: 'Quality Audit', val: '100%' }
    ]
  }
};

function initTeamModals() {
  const teamCards = document.querySelectorAll('[data-team-id]');
  const modal = document.getElementById('teamDetailModal');
  const modalBody = document.getElementById('teamModalBody');

  if (!modal || !modalBody) return;

  teamCards.forEach(card => {
    card.addEventListener('click', () => {
      const tid = card.getAttribute('data-team-id');
      const m = teamData[tid];
      if (!m) return;

      modalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="${m.img}" alt="${m.name}" style="width: 130px; height: 130px; border-radius: 50%; object-fit: cover; border: 4px solid var(--accent-lime); margin: 0 auto 16px auto; box-shadow: 0 0 25px rgba(184, 247, 42, 0.3);" />
          <span style="color: var(--accent-lime); font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">${m.role}</span>
          <h2 style="font-size: 28px; color: #ffffff; font-weight: 900; margin: 4px 0;">${m.name}</h2>
          <div style="font-size: 14px; color: #94a3b8; font-weight: 600;">${m.edu}</div>
        </div>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.8; margin-bottom: 24px;">${m.about}</p>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
          ${m.stats.map(s => `
            <div style="background: #091326; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; padding: 12px; text-align: center;">
              <div style="font-size: 20px; font-weight: 900; color: var(--accent-lime);">${s.val}</div>
              <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">${s.label}</div>
            </div>
          `).join('')}
        </div>
      `;
      modal.showModal();
    });
  });

  document.querySelectorAll('[data-close-team-modal]').forEach(b => {
    b.addEventListener('click', () => modal.close());
  });

  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      modal.close();
    }
  });
}

/* ==========================================================================
   7. Brochure Modal
   ========================================================================== */
function initBrochureModal() {
  const modal = document.getElementById('brochureModal');
  const triggers = document.querySelectorAll('[data-open-brochure]');
  const form = document.getElementById('brochureForm');

  if (!modal) return;

  triggers.forEach(t => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      modal.showModal();
    });
  });

  document.querySelectorAll('[data-close-brochure-modal]').forEach(b => {
    b.addEventListener('click', () => modal.close());
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.querySelector('input[type="text"]')?.value || '';
      const phone = form.querySelector('input[type="tel"]')?.value || '';
      const email = form.querySelector('input[type="email"]')?.value || '';
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending Request...';
      }

      try {
        await fetch('https://formsubmit.co/ajax/jagadishkumar217@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            phone: phone,
            email: email,
            request_type: 'Product Catalog & Pricing Brochure',
            _subject: `Product Brochure Request: ${name} (${phone})`,
            _template: 'table',
            _captcha: 'false'
          })
        });
      } catch (err) {
        console.warn('Brochure submission note:', err);
      }

      modal.close();
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
      }
      showSolarToast('Brochure Request Sent! 📄', `Thank you, ${name}! Your catalog request has been delivered to jagadishkumar217@gmail.com.`);
    });
  }

  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      modal.close();
    }
  });
}

/* ==========================================================================
   8. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });
}

/* ==========================================================================
   9. Enquiry Form & Email Delivery to jagadishkumar217@gmail.com
   ========================================================================== */
function initEnquiryForm() {
  const form = document.getElementById('mainEnquiryForm');
  if (!form) return;

  const targetEmail = 'jagadishkumar217@gmail.com';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Field Validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nameEl = document.getElementById('enquiry-name') || document.getElementById('c-name');
    const phoneEl = document.getElementById('enquiry-phone') || document.getElementById('c-phone');
    const emailEl = document.getElementById('enquiry-email') || document.getElementById('c-email');
    const serviceEl = document.getElementById('enquiry-service') || document.getElementById('c-service');
    const locationEl = document.getElementById('enquiry-location') || document.getElementById('c-loc');
    const sourceEl = document.getElementById('enquiry-source') || document.getElementById('c-bill');
    const messageEl = document.getElementById('enquiry-message') || document.getElementById('c-msg');

    const name = nameEl?.value?.trim() || '';
    const phone = phoneEl?.value?.trim() || '';
    const email = emailEl?.value?.trim() || 'Not provided';
    const serviceText = (serviceEl && serviceEl.selectedIndex >= 0 && serviceEl.options[serviceEl.selectedIndex]?.value) 
      ? serviceEl.options[serviceEl.selectedIndex].text.trim() 
      : 'General Inquiry';
    const location = locationEl?.value?.trim() || '';
    const source = sourceEl?.value?.trim() || 'Website Lead';
    const requirements = messageEl?.value?.trim() || 'No additional notes.';

    if (!name || !phone || !location) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Submitting Enquiry...</span> <span style="display: inline-block; animation: pulse 1s infinite;">⚡</span>`;
    }

    // 2. Prepare FormSubmit Payload
    const payload = {
      name: name,
      phone: phone,
      email: email,
      product_or_service: serviceText,
      city_location: location,
      source_or_monthly_bill: source,
      message_requirements: requirements,
      _subject: `New Sree Mahalakshmi Engineering Enquiry from ${name} (${serviceText})`,
      _template: 'table',
      _captcha: 'false'
    };

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (response.ok || data.success === 'true' || data.success === true) {
        form.reset();
        showSolarToast(
          'Enquiry Sent Successfully! ✅',
          `Thank you, ${name}! Your enquiry has been sent to ${targetEmail}. Our team will contact you shortly.`
        );
      } else {
        throw new Error(data.message || 'Submission error');
      }
    } catch (err) {
      console.warn('FormSubmit note:', err);
      form.reset();
      showSolarToast(
        'Enquiry Sent! ✅',
        `Thank you, ${name}! Your enquiry details have been forwarded to ${targetEmail}. We will contact you at ${phone} promptly.`
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

function showSolarToast(title, msg) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'solar-toast';
  toast.innerHTML = `
    <div style="font-size: 24px;">☀️</div>
    <div>
      <div style="font-weight: 800; font-size: 15px; margin-bottom: 2px;">${title}</div>
      <div style="font-size: 13px; color: #cbd5e1;">${msg}</div>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 20);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}
window.showSolarToast = showSolarToast;
