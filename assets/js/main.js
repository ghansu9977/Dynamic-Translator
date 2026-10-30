/**
 * Multi-Tool Web Portal - Core App Logic
 * Handles Theme Toggling, Mobile Menu, Live Tool Search, Category Filters, Back to Top, FAQ Accordion, and Toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initNavDropdown();
  initNavSearchTrigger();
  initToolSearchAndFilters();
  initBackToTop();
  initFaqAccordion();
  initRozgarIntentEngine();
});

/* ==========================================================================
   Theme Toggle (Dark / Light) with LocalStorage Persistence
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('site-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const activeTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', activeTheme);
  updateThemeIcon(activeTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('site-theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(newTheme === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
    });
  }
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
  }
}

/* ==========================================================================
   Desktop Navigation Dropdown
   ========================================================================== */
function initNavDropdown() {
  const dropdownBtn = document.getElementById('all-tools-dropdown-btn');
  const dropdown = dropdownBtn ? dropdownBtn.closest('.nav-dropdown') : null;

  if (dropdownBtn && dropdown) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('active');
      dropdownBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        dropdownBtn.setAttribute('aria-expanded', 'false');
        dropdownBtn.focus();
      }
    });
  }
}

/* ==========================================================================
   Nav Quick Search Trigger
   ========================================================================== */
function initNavSearchTrigger() {
  const searchTrigger = document.getElementById('nav-search-trigger');
  const searchInput = document.getElementById('tool-search-input');

  if (searchTrigger) {
    searchTrigger.addEventListener('click', () => {
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          searchInput.focus();
          searchInput.select();
        }, 300);
      } else {
        const isSubdir = window.location.pathname.includes('/tools/');
        window.location.href = (isSubdir ? '../index.html' : 'index.html') + '#tool-search-input';
      }
    });
  }

  // Auto-focus search if arrived with hash
  if (window.location.hash === '#tool-search-input' && searchInput) {
    setTimeout(() => {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInput.focus();
    }, 400);
  }
}

/* ==========================================================================
   Mobile Navigation Drawer (Touch-Friendly, Full-Screen Overlay, Live Search)
   ========================================================================== */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawerSearch = document.getElementById('drawer-search-input');
  const drawerToolsList = document.getElementById('drawer-tools-list');

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (drawerSearch) {
        setTimeout(() => drawerSearch.focus(), 300);
      }
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (drawerSearch) {
        drawerSearch.value = '';
        filterDrawerTools('');
      }
    }
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Close when clicking any drawer item
  if (drawer) {
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // Live filter inside mobile drawer
  function filterDrawerTools(query) {
    if (!drawerToolsList) return;
    const items = drawerToolsList.querySelectorAll('li');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = !query || text.includes(query) ? 'block' : 'none';
    });
  }

  if (drawerSearch) {
    drawerSearch.addEventListener('input', (e) => {
      filterDrawerTools(e.target.value.toLowerCase().trim());
    });
  }
}

/* ==========================================================================
   Homepage Live Tool Search & Category Filter Pills
   ========================================================================== */
function initToolSearchAndFilters() {
  const searchInput = document.getElementById('tool-search-input');
  const clearSearchBtn = document.getElementById('search-clear-btn');
  const toolCards = document.querySelectorAll('.tool-card');
  const catPills = document.querySelectorAll('.cat-pill');
  const resultsCountEl = document.getElementById('tools-count-badge');

  let activeCategory = 'all';
  let activeSearchQuery = '';

  function applyFilter() {
    let visibleCount = 0;

    toolCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || 'all';
      const title = card.querySelector('.tool-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.tool-desc')?.textContent.toLowerCase() || '';
      const tags = Array.from(card.querySelectorAll('.tag-badge')).map(t => t.textContent.toLowerCase()).join(' ');

      const matchesCategory = (activeCategory === 'all') || (cardCategory === activeCategory);
      const matchesSearch = !activeSearchQuery || 
        title.includes(activeSearchQuery) || 
        desc.includes(activeSearchQuery) || 
        tags.includes(activeSearchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.25s ease-out';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultsCountEl) {
      resultsCountEl.textContent = `${visibleCount} Tools Available`;
    }
  }

  // Live search input
  if (clearSearchBtn) {
    clearSearchBtn.style.display = 'none';
  }

  if (searchInput && toolCards.length > 0) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value.toLowerCase().trim();
      if (clearSearchBtn) {
        clearSearchBtn.style.display = activeSearchQuery.length > 0 ? 'flex' : 'none';
      }
      applyFilter();
    });

    // Clear search
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        activeSearchQuery = '';
        clearSearchBtn.style.display = 'none';
        searchInput.focus();
        applyFilter();
      });
    }

    // Shortcut: Press '/' key to focus search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }

  // Category filter pills
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });

      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      activeCategory = pill.getAttribute('data-category') || 'all';

      applyFilter();
    });
  });
}

/* ==========================================================================
   Back to Top Floating Button
   ========================================================================== */
function initBackToTop() {
  let backBtn = document.getElementById('back-to-top');
  
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'back-to-top';
    backBtn.className = 'back-to-top-btn';
    backBtn.title = 'Back to top';
    backBtn.setAttribute('aria-label', 'Scroll to top');
    backBtn.innerHTML = '↑';
    document.body.appendChild(backBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   Global Toast Notification
   ========================================================================== */
function showToast(message, type = 'success') {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  const icon = type === 'error' ? '⚠️' : '✅';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
window.showToast = showToast;


/* ==========================================================================
   Rozgar Smart Intent & Search Query Engine
   Automatically captures user search intent from URL parameters (?q=, ?search=, ?exam=, ?job=, ?rozgar=)
   or live input, and dynamically adapts content, specs, and highlights the right tool.
   ========================================================================== */
function initRozgarIntentEngine() {
  const urlParams = new URLSearchParams(window.location.search);
  const rawQuery = urlParams.get('q') || urlParams.get('search') || urlParams.get('exam') || urlParams.get('job') || urlParams.get('rozgar') || '';
  
  const searchInput = document.getElementById('tool-search-input');
  const banner = document.getElementById('rozgar-intent-banner');
  const bannerTitle = document.getElementById('intent-banner-title');
  const bannerDesc = document.getElementById('intent-banner-desc');
  const bannerSpecs = document.getElementById('intent-banner-specs');
  const bannerBtn = document.getElementById('intent-banner-action-btn');
  const examTags = document.querySelectorAll('.rozgar-exam-tag');

  const examDb = {
    ssc: {
      name: 'SSC (CGL, CHSL, MTS, GD, Steno)',
      toolHref: 'tools/govt-photo-resizer.html',
      specs: 'Photo: 20KB–50KB (3.5×4.5 cm JPEG) • Signature: 10KB–20KB • Age: 18–27/32 yrs • Typing: 35 WPM',
      desc: 'Official Staff Selection Commission application standards. Photos must have clear white background.',
      cardHref: 'govt-photo-resizer.html'
    },
    upsc: {
      name: 'UPSC Civil Services (IAS, IPS, NDA, CDS)',
      toolHref: 'tools/govt-photo-resizer.html',
      specs: 'Photo: 20KB–300KB (350×350 px min) • Signature: 20KB–300KB • Age: 21–32 yrs',
      desc: 'Union Public Service Commission photo & signature specifications. High-clarity face required.',
      cardHref: 'govt-photo-resizer.html'
    },
    railway: {
      name: 'Railway Recruitment Board (RRB NTPC, Group D, ALP)',
      toolHref: 'tools/govt-photo-resizer.html',
      specs: 'Photo: 20KB–50KB JPEG • Signature: 10KB–20KB • Age: 18–33/36 yrs • Typing: 30 WPM',
      desc: 'Indian Railways recruitment criteria. Photo and document conversion without quality loss.',
      cardHref: 'govt-photo-resizer.html'
    },
    police: {
      name: 'State Police Bharti (Constable & Sub-Inspector)',
      toolHref: 'tools/govt-photo-resizer.html',
      specs: 'Photo: 20KB–100KB • Signature: 10KB–50KB • Age: 18–25/28 yrs',
      desc: 'Police recruitment standard document specifications. Clear frontal photo.',
      cardHref: 'govt-photo-resizer.html'
    },
    banking: {
      name: 'Banking Exams (IBPS PO, Clerk, SBI & RBI)',
      toolHref: 'tools/govt-photo-resizer.html',
      specs: 'Photo: 20KB–50KB (200×230 px) • Signature: 10KB–20KB (140×60 px) • Age: 20–30 yrs',
      desc: 'Institute of Banking Personnel Selection criteria. Strictly black ink signature.',
      cardHref: 'govt-photo-resizer.html'
    },
    court: {
      name: 'High Court & District Court (Clerk, Steno)',
      toolHref: 'tools/typing-test.html',
      specs: 'Typing Speed: 30 WPM (Hindi) / 35 WPM (English) • 90%+ Accuracy • Age: 18–35 yrs',
      desc: 'Judicial clerical typing speed test benchmarks and certification practice.',
      cardHref: 'typing-test.html'
    },
    teaching: {
      name: 'Teaching Exams (CTET, State TET, KVS, DSSSB, PRT)',
      toolHref: 'tools/govt-photo-resizer.html',
      specs: 'Photo: 10KB–100KB • Signature: 4KB–30KB • Age Eligibility Check',
      desc: 'Central and State Teacher Eligibility exam requirements.',
      cardHref: 'govt-photo-resizer.html'
    }
  };

  const intentRules = [
    {
      regex: /photo|resiz|compress|20kb|50kb|100kb|sign|signature|crop|passport|image\s*size|pic/i,
      toolHref: 'tools/govt-photo-resizer.html',
      toolTitle: 'Govt Photo & Signature Resizer (20KB - 50KB)',
      cardHref: 'govt-photo-resizer.html',
      specs: 'Preset: 20 KB & 50 KB • Format: JPEG • Dimensions: 350×450 px • 100% Client-Side',
      desc: 'Resize passport photographs and signatures to exact 20KB or 50KB with zero quality loss.'
    },
    {
      regex: /age|dob|birth|cut.?off|eligib|how\s*old|birthday|sal|umra/i,
      toolHref: 'tools/age-calculator.html',
      toolTitle: 'Exact Age & Cut-Off Date Calculator',
      cardHref: 'age-calculator.html',
      specs: 'Accuracy: Exact Years, Months & Days • Leap Year Handled • Official Cut-Off Standards',
      desc: 'Calculate your exact age as on official exam cut-off date to verify job eligibility.'
    },
    {
      regex: /typ|speed|wpm|cpm|keyboard|clerk|court|steno|fast\s*typing/i,
      toolHref: 'tools/typing-test.html',
      toolTitle: 'Live Typing Speed Test (WPM & Accuracy)',
      cardHref: 'typing-test.html',
      specs: 'Session: 1, 2, 3 & 5 Mins • Live WPM & Accuracy • Recruitment Benchmarking',
      desc: 'Test your keyboard speed and accuracy for SSC, Railway, and High Court exams.'
    },
    {
      regex: /resume|cv|biodata|fresher|curriculum|portfolio|job\s*app/i,
      toolHref: 'tools/resume-builder.html',
      toolTitle: '1-Page ATS Resume & CV Builder',
      cardHref: 'resume-builder.html',
      specs: 'Format: 1-Page Modern ATS • Output: High-Res A4 PDF • 100% Free & No Sign-up',
      desc: 'Create an ATS-friendly single-page resume tailored for government and corporate jobs.'
    },
    {
      regex: /translat|hindi|english|bhasha|anuvad|language|marathi|bengali|tamil|speech/i,
      toolHref: 'tools/dynamic-translator.html',
      toolTitle: 'Dynamic AI Language Translator (100+ Languages)',
      cardHref: 'dynamic-translator.html',
      specs: 'Languages: 100+ Supported • Real-Time AI • Audio Text-to-Speech • Zero Limit',
      desc: 'Translate job notices, exam instructions, and study material with neural accuracy.'
    },
    {
      regex: /pdf|jpg\s*to\s*pdf|image\s*to\s*pdf|scan|combine\s*doc/i,
      toolHref: 'tools/image-to-pdf.html',
      toolTitle: 'JPG / PNG to PDF Converter',
      cardHref: 'image-to-pdf.html',
      specs: 'Multi-Image Batch • Custom Margins • A4 Print Ready • Zero Server Upload',
      desc: 'Combine identity proofs, marksheets, and certificates into a single uploadable PDF.'
    },
    {
      regex: /cgpa|sgpa|percent|marks|cbse|grade|division|university/i,
      toolHref: 'tools/cgpa-calculator.html',
      toolTitle: 'CGPA to Percentage & Marks Calculator',
      cardHref: 'cgpa-calculator.html',
      specs: 'Formulas: CBSE (× 9.5), AICTE, SGPA Credit-Weighted • Instant Grade & Division',
      desc: 'Convert 10-point CGPA into percentage recognized by recruitment boards and universities.'
    },
    {
      regex: /emi|loan|interest|car\s*loan|home\s*loan|installment|bank/i,
      toolHref: 'tools/emi-calculator.html',
      toolTitle: 'Home, Car & Personal Loan EMI Calculator',
      cardHref: 'emi-calculator.html',
      specs: 'Detailed Monthly EMI • Reducing Interest Amortization • Visual Donut Chart',
      desc: 'Plan education, home, or personal loan monthly repayments and interest breakdown.'
    },
    {
      regex: /sip|mutual|lump|invest|wealth|return|fund|compounding/i,
      toolHref: 'tools/sip-calculator.html',
      toolTitle: 'SIP & Lumpsum Return Calculator',
      cardHref: 'sip-calculator.html',
      specs: 'Modes: Monthly SIP & Lumpsum • Compounding Projection • Interactive Graphs',
      desc: 'Forecast long-term compounding returns and future wealth growth in mutual funds.'
    },
    {
      regex: /qr|upi|phonepe|gpay|paytm|wifi|barcode/i,
      toolHref: 'tools/qr-generator.html',
      toolTitle: 'Custom QR Code Generator (UPI, WiFi & URL)',
      cardHref: 'qr-generator.html',
      specs: 'UPI Payment URI • High-Res PNG • Custom Color Palette • Works Offline',
      desc: 'Generate custom QR codes for direct UPI merchant payments, WiFi, and links.'
    }
  ];

  function showIntentResult(query, matchInfo) {
    if (!banner || !bannerTitle || !bannerDesc) return;
    
    banner.style.display = 'flex';
    bannerTitle.textContent = `🎯 Matching Rozgar Result for: "${query}"`;
    bannerDesc.textContent = matchInfo.desc;
    
    if (bannerSpecs && matchInfo.specs) {
      bannerSpecs.innerHTML = `<span class="intent-spec-pill">📋 ${matchInfo.specs}</span>`;
    }

    if (bannerBtn) {
      bannerBtn.style.display = 'block';
      bannerBtn.onclick = () => {
        window.location.href = matchInfo.toolHref;
      };
    }

    // Highlight matching tool card
    document.querySelectorAll('.tool-card').forEach(card => card.classList.remove('intent-matched'));
    const matchedLink = document.querySelector(`a[href*="${matchInfo.cardHref}"]`);
    if (matchedLink) {
      const matchedCard = matchedLink.closest('.tool-card');
      if (matchedCard) {
        matchedCard.classList.add('intent-matched');
        setTimeout(() => {
          matchedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }

  function handleQuery(q) {
    if (!q) return;
    const cleanQ = q.trim().toLowerCase();

    // 1. Check if matches any exam
    for (const [key, examData] of Object.entries(examDb)) {
      if (cleanQ.includes(key) || examData.name.toLowerCase().includes(cleanQ)) {
        showIntentResult(examData.name, {
          toolHref: examData.toolHref,
          toolTitle: examData.name,
          cardHref: examData.cardHref,
          specs: examData.specs,
          desc: examData.desc
        });
        return;
      }
    }

    // 2. Check general intent rules
    for (const rule of intentRules) {
      if (rule.regex.test(cleanQ)) {
        showIntentResult(q, rule);
        return;
      }
    }

    // 3. Fallback: filter tools by raw text
    if (searchInput) {
      searchInput.value = q;
      searchInput.dispatchEvent(new Event('input'));
      if (banner) {
        banner.style.display = 'flex';
        bannerTitle.textContent = `🔍 Search Results for: "${q}"`;
        bannerDesc.textContent = 'Showing matching free utility tools and calculators.';
        if (bannerSpecs) bannerSpecs.innerHTML = '';
        if (bannerBtn) bannerBtn.style.display = 'none';
      }
    }
  }

  // Handle URL query on page load
  if (rawQuery) {
    handleQuery(decodeURIComponent(rawQuery).replace(/\+/g, ' '));
  }

  // Handle exam pill clicks
  examTags.forEach(tag => {
    tag.addEventListener('click', () => {
      examTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      const examKey = tag.dataset.exam;
      if (examDb[examKey]) {
        handleQuery(examKey);
      }
    });
  });

  // Also hook into live search input on homepage
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val.length >= 3) {
        clearTimeout(window._intentTimeout);
        window._intentTimeout = setTimeout(() => {
          handleQuery(val);
        }, 400);
      } else if (val.length === 0 && banner) {
        banner.style.display = 'none';
        document.querySelectorAll('.tool-card').forEach(card => card.classList.remove('intent-matched'));
      }
    });
  }
}
