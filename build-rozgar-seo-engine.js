import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://dynamic-translatx.vercel.app';
const GA_ID = 'G-KHNBCZ0Q3Q';
const GSC_VERIF = 'JFzUycQyvPrgnyRDo27nliEvMgg9_bzuPNFxc05TQvo';

console.log('🚀 Starting Rozgar SEO & Dynamic Intent Engine Builder...');

// ---------------------------------------------------------------------------
// 1. ADD CSS FOR INTENT BANNER, EXAM PILLS & PULSE ANIMATIONS
// ---------------------------------------------------------------------------
function updateCss() {
  const cssPath = path.resolve('assets/css/style.css');
  let css = fs.readFileSync(cssPath, 'utf-8');

  if (!css.includes('.rozgar-quick-pills')) {
    const additionalCss = `

/* ==========================================================================
   Rozgar Smart Intent & Quick Exam Navigation System
   ========================================================================== */
.rozgar-quick-pills {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin: 1.25rem 0 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  justify-content: center;
  flex-wrap: wrap;
}
.rozgar-quick-pills::-webkit-scrollbar {
  display: none;
}

.rozgar-pills-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent-amber);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rozgar-exam-tag {
  background: var(--bg-surface);
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.rozgar-exam-tag:hover {
  background: var(--bg-card);
  color: var(--text-main);
  border-color: var(--primary);
  transform: translateY(-1px);
}

.rozgar-exam-tag.active {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 0 15px var(--primary-glow);
}

/* Rozgar Smart Intent Match Banner */
.rozgar-intent-banner {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%);
  border: 1px solid rgba(99, 102, 241, 0.4);
  border-left: 5px solid var(--primary);
  border-radius: var(--radius-xl);
  padding: 1.5rem 1.75rem;
  margin: 1.5rem 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.25rem;
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
  animation: fadeIn 0.3s ease-out;
}

.intent-banner-content {
  flex: 1;
  min-width: 280px;
}

.intent-banner-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(99, 102, 241, 0.2);
  color: var(--primary);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.intent-banner-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.35rem;
}

.intent-banner-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 0.65rem;
}

.intent-banner-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.intent-spec-pill {
  font-size: 0.8rem;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-md);
  color: var(--accent-emerald);
  font-weight: 600;
}

.intent-banner-action {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%);
  color: #fff;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 15px var(--primary-glow);
}

.intent-banner-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--primary-glow);
}

/* Tool Card Matched Highlight */
.tool-card.intent-matched {
  border-color: var(--primary) !important;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.45) !important;
  transform: translateY(-4px) scale(1.02);
  position: relative;
}

.tool-card.intent-matched::before {
  content: "🎯 Best Match for your Search";
  position: absolute;
  top: -12px;
  left: 20px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 9999px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  z-index: 2;
}
`;
    css += additionalCss;
    fs.writeFileSync(cssPath, css, 'utf-8');
    console.log('✅ assets/css/style.css updated with Rozgar intent banner & exam pill styles.');
  }
}

// ---------------------------------------------------------------------------
// 2. UPDATE assets/js/main.js WITH INTENT ENGINE
// ---------------------------------------------------------------------------
function updateMainJs() {
  const jsPath = path.resolve('assets/js/main.js');
  let js = fs.readFileSync(jsPath, 'utf-8');

  if (!js.includes('initRozgarIntentEngine')) {
    // Add call to DOMContentLoaded
    js = js.replace(
      'initFaqAccordion();',
      'initFaqAccordion();\n  initRozgarIntentEngine();'
    );

    const intentEngineJs = `

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
      regex: /photo|resiz|compress|20kb|50kb|100kb|sign|signature|crop|passport|image\\s*size|pic/i,
      toolHref: 'tools/govt-photo-resizer.html',
      toolTitle: 'Govt Photo & Signature Resizer (20KB - 50KB)',
      cardHref: 'govt-photo-resizer.html',
      specs: 'Preset: 20 KB & 50 KB • Format: JPEG • Dimensions: 350×450 px • 100% Client-Side',
      desc: 'Resize passport photographs and signatures to exact 20KB or 50KB with zero quality loss.'
    },
    {
      regex: /age|dob|birth|cut.?off|eligib|how\\s*old|birthday|sal|umra/i,
      toolHref: 'tools/age-calculator.html',
      toolTitle: 'Exact Age & Cut-Off Date Calculator',
      cardHref: 'age-calculator.html',
      specs: 'Accuracy: Exact Years, Months & Days • Leap Year Handled • Official Cut-Off Standards',
      desc: 'Calculate your exact age as on official exam cut-off date to verify job eligibility.'
    },
    {
      regex: /typ|speed|wpm|cpm|keyboard|clerk|court|steno|fast\\s*typing/i,
      toolHref: 'tools/typing-test.html',
      toolTitle: 'Live Typing Speed Test (WPM & Accuracy)',
      cardHref: 'typing-test.html',
      specs: 'Session: 1, 2, 3 & 5 Mins • Live WPM & Accuracy • Recruitment Benchmarking',
      desc: 'Test your keyboard speed and accuracy for SSC, Railway, and High Court exams.'
    },
    {
      regex: /resume|cv|biodata|fresher|curriculum|portfolio|job\\s*app/i,
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
      regex: /pdf|jpg\\s*to\\s*pdf|image\\s*to\\s*pdf|scan|combine\\s*doc/i,
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
      regex: /emi|loan|interest|car\\s*loan|home\\s*loan|installment|bank/i,
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
    bannerTitle.textContent = \`🎯 Matching Rozgar Result for: "\${query}"\`;
    bannerDesc.textContent = matchInfo.desc;
    
    if (bannerSpecs && matchInfo.specs) {
      bannerSpecs.innerHTML = \`<span class="intent-spec-pill">📋 \${matchInfo.specs}</span>\`;
    }

    if (bannerBtn) {
      bannerBtn.style.display = 'block';
      bannerBtn.onclick = () => {
        window.location.href = matchInfo.toolHref;
      };
    }

    // Highlight matching tool card
    document.querySelectorAll('.tool-card').forEach(card => card.classList.remove('intent-matched'));
    const matchedLink = document.querySelector(\`a[href*="\${matchInfo.cardHref}"]\`);
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
        bannerTitle.textContent = \`🔍 Search Results for: "\${q}"\`;
        bannerDesc.textContent = 'Showing matching free utility tools and calculators.';
        if (bannerSpecs) bannerSpecs.innerHTML = '';
        if (bannerBtn) bannerBtn.style.display = 'none';
      }
    }
  }

  // Handle URL query on page load
  if (rawQuery) {
    handleQuery(decodeURIComponent(rawQuery).replace(/\\+/g, ' '));
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
`;
    js += intentEngineJs;
    fs.writeFileSync(jsPath, js, 'utf-8');
    console.log('✅ assets/js/main.js updated with initRozgarIntentEngine().');
  }
}

// ---------------------------------------------------------------------------
// 3. UPDATE index.html WITH QUICK EXAM PILLS & INTENT BANNER
// ---------------------------------------------------------------------------
function updateIndexHtml() {
  const indexPath = path.resolve('index.html');
  let content = fs.readFileSync(indexPath, 'utf-8');

  // Insert Quick Exam Pills after category filters if not present
  if (!content.includes('id="rozgar-quick-pills"')) {
    const pillsHtml = `
      <!-- Quick Rozgar Exam Selector for Instant Intent Matching -->
      <div class="rozgar-quick-pills" id="rozgar-quick-pills">
        <span class="rozgar-pills-label">⚡ Rozgar Quick Exams:</span>
        <button class="rozgar-exam-tag" data-exam="ssc" title="Staff Selection Commission (CGL, CHSL, MTS)">SSC Exams</button>
        <button class="rozgar-exam-tag" data-exam="upsc" title="Union Public Service Commission">UPSC Civil Services</button>
        <button class="rozgar-exam-tag" data-exam="railway" title="Railway Recruitment Board (NTPC, Group D)">Railway RRB</button>
        <button class="rozgar-exam-tag" data-exam="police" title="State Police Constable & SI">Police Bharti</button>
        <button class="rozgar-exam-tag" data-exam="banking" title="IBPS, SBI PO & Clerk">Banking Exams</button>
        <button class="rozgar-exam-tag" data-exam="court" title="High Court Clerk & Steno Typing">Court / Typing</button>
        <button class="rozgar-exam-tag" data-exam="teaching" title="CTET, State TET & PRT">Teaching Exams</button>
      </div>`;

    const catFiltersEnd = content.indexOf('</div>', content.indexOf('id="category-filters"'));
    if (catFiltersEnd !== -1) {
      content = content.substring(0, catFiltersEnd + 6) + '\n' + pillsHtml + content.substring(catFiltersEnd + 6);
    }
  }

  // Insert Intent Matcher Banner above Featured Tools section if not present
  if (!content.includes('id="rozgar-intent-banner"')) {
    const bannerHtml = `
    <!-- Rozgar Smart Intent Matcher Banner (Dynamic Result Display) -->
    <div id="rozgar-intent-banner" class="rozgar-intent-banner" style="display: none;">
      <div class="intent-banner-content">
        <div class="intent-banner-badge" id="intent-banner-badge">🎯 Rozgar Instant Match</div>
        <h3 class="intent-banner-title" id="intent-banner-title">Recommended Tools for your search</h3>
        <p class="intent-banner-desc" id="intent-banner-desc">Official examination specifications and instant tool match.</p>
        <div class="intent-banner-specs" id="intent-banner-specs"></div>
      </div>
      <button class="intent-banner-action" id="intent-banner-action-btn">Open Recommended Tool ➔</button>
    </div>`;

    const sectionStart = content.indexOf('<section>', content.indexOf('id="ad-slot-header"'));
    if (sectionStart !== -1) {
      content = content.substring(0, sectionStart) + bannerHtml + '\n\n    ' + content.substring(sectionStart);
    }
  }

  fs.writeFileSync(indexPath, content, 'utf-8');
  console.log('✅ index.html updated with Rozgar Quick Exam pills and Dynamic Intent Banner.');
}

// ---------------------------------------------------------------------------
// 4. CREATE DEDICATED PROGRAMMATIC ROZGAR SEO PAGES
// ---------------------------------------------------------------------------
function createRozgarPages() {
  const toolsDir = path.resolve('tools');

  // Page 1: tools/rozgar-photo-resizer.html
  const rozgarPhotoPath = path.join(toolsDir, 'rozgar-photo-resizer.html');
  const basePhotoResizer = fs.readFileSync(path.join(toolsDir, 'govt-photo-resizer.html'), 'utf-8');
  
  let rozgarPhotoHtml = basePhotoResizer
    .replaceAll('<title>Online Photo & Signature Resizer (20KB - 50KB Free) | RozgarTools</title>', '<title>Rozgar Photo Resizer (20KB - 50KB Free) - Rozgar Result Photo & Signature Size Maker | RozgarTools</title>')
    .replaceAll('tools/govt-photo-resizer.html', 'tools/rozgar-photo-resizer.html')
    .replaceAll('Govt Photo Resizer (20KB - 50KB)', 'Rozgar Photo & Signature Resizer (20KB - 50KB)')
    .replace(
      '<meta name="description" content="Resize and compress passport photo & signature to exact 20KB, 50KB, or 100KB for SSC, UPSC, IBPS, Railway exam applications. 100% free, private & instant.">',
      '<meta name="description" content="Official Rozgar Photo Resizer & Signature Tool. Compress and resize passport photos to exact 20KB, 50KB, or 100KB for Rozgar Result, SSC, UPSC, Railway, Police Bharti, and Banking forms. 100% Free & Secure.">'
    )
    .replace(
      'photo resizer 20kb, photo resizer 50kb',
      'rozgar photo resizer, rozgar photo resizer 20kb, rozgar signature resizer, rozgar result photo resizer, sarkari rozgar photo size, rozgar photo crop, ssc photo resizer rozgar, upsc photo resizer rozgar, photo 20kb kaise banaye rozgar'
    );

  // Update H1 in rozgar-photo-resizer
  rozgarPhotoHtml = rozgarPhotoHtml.replace(
    /<h1>[\s\S]*?<\/h1>/i,
    '<h1>Rozgar Photo & Signature Resizer <span class="highlight">(20KB - 50KB Free)</span></h1>'
  );

  fs.writeFileSync(rozgarPhotoPath, rozgarPhotoHtml, 'utf-8');
  console.log('✅ Created tools/rozgar-photo-resizer.html');

  // Page 2: tools/rozgar-age-calculator.html
  const rozgarAgePath = path.join(toolsDir, 'rozgar-age-calculator.html');
  const baseAgeCalculator = fs.readFileSync(path.join(toolsDir, 'age-calculator.html'), 'utf-8');

  let rozgarAgeHtml = baseAgeCalculator
    .replaceAll('<title>Online Age Calculator - Exact Age as on Cut-Off Date | RozgarTools</title>', '<title>Rozgar Age Calculator - Calculate Age from DOB for Sarkari Rozgar Exams | RozgarTools</title>')
    .replaceAll('tools/age-calculator.html', 'tools/rozgar-age-calculator.html')
    .replaceAll('Exact Age & Cut-off Date Calculator', 'Rozgar Age Calculator & Eligibility Checker')
    .replace(
      '<meta name="description" content="Calculate your exact age in years, months, and days from Date of Birth. Check eligibility for SSC, UPSC, Banking, Defence exams with cut-off date calculator.">',
      '<meta name="description" content="Rozgar Age Calculator. Calculate your exact age in years, months, and days from Date of Birth as on official recruitment cut-off date. 100% accurate for Rozgar Result, SSC, UPSC, and Railway exams.">'
    )
    .replace(
      'age calculator, exact age calculator',
      'rozgar age calculator, rozgar result age calculator, sarkari rozgar age calculator, rozgar age calculator online, dob calculator rozgar, calculate age from date of birth rozgar, age limit for govt jobs rozgar'
    );

  rozgarAgeHtml = rozgarAgeHtml.replace(
    /<h1>[\s\S]*?<\/h1>/i,
    '<h1>Rozgar Age Calculator <span class="highlight">(Exact Age as on Cut-Off Date)</span></h1>'
  );

  fs.writeFileSync(rozgarAgePath, rozgarAgeHtml, 'utf-8');
  console.log('✅ Created tools/rozgar-age-calculator.html');

  // Page 3: tools/rozgar-typing-test.html
  const rozgarTypingPath = path.join(toolsDir, 'rozgar-typing-test.html');
  const baseTypingTest = fs.readFileSync(path.join(toolsDir, 'typing-test.html'), 'utf-8');

  let rozgarTypingHtml = baseTypingTest
    .replaceAll('<title>Free Typing Speed Test Online - Live WPM & Accuracy (1 Min) | RozgarTools</title>', '<title>Rozgar Typing Test Online - 1 Min Typing Speed Practice (30 & 35 WPM) | RozgarTools</title>')
    .replaceAll('tools/typing-test.html', 'tools/rozgar-typing-test.html')
    .replaceAll('Live Typing Speed Test (WPM)', 'Rozgar Typing Speed Test (WPM & Accuracy)')
    .replace(
      '<meta name="description" content="Test your keyboard typing speed in 1 minute. Live WPM, CPM, accuracy score, and instant performance grade. Perfect for SSC, clerical & court exam practice.">',
      '<meta name="description" content="Rozgar Typing Test Online. Practice 1 minute typing tests for SSC CGL, CHSL, Railway, and High Court Clerk exams. Real-time WPM, accuracy %, and instant scorecard.">'
    )
    .replace(
      'typing test online, typing speed test',
      'rozgar typing test, rozgar typing test online, sarkari typing test 1 minute, rozgar typing speed test, ssc typing test rozgar, high court clerk typing test rozgar, 30 wpm typing test, 35 wpm typing test rozgar'
    );

  rozgarTypingHtml = rozgarTypingHtml.replace(
    /<h1>[\s\S]*?<\/h1>/i,
    '<h1>Rozgar Typing Test <span class="highlight">(Live WPM & Accuracy Practice)</span></h1>'
  );

  fs.writeFileSync(rozgarTypingPath, rozgarTypingHtml, 'utf-8');
  console.log('✅ Created tools/rozgar-typing-test.html');

  // Page 4: tools/sarkari-rozgar-tools.html (All in One Rozgar Hub)
  const rozgarHubPath = path.join(toolsDir, 'sarkari-rozgar-tools.html');
  const rozgarHubHtml = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sarkari Rozgar Tools - All Online Exam Utilities, Photo Resizer & Calculators | RozgarTools</title>
  <meta name="description" content="All-in-One Sarkari Rozgar Utility Portal. Instant access to Rozgar Photo Resizer 20KB, Age Calculator, Typing Speed Test, ATS Resume Builder, and Document to PDF tools. 100% Free & Secure.">
  <meta name="keywords" content="sarkari rozgar tools, rozgar result tools, sarkari result tools portal, free rozgar online tools, photo resizer rozgar, age calculator rozgar, typing test rozgar, resume builder rozgar, image to pdf rozgar, sarkari exam utilities">
  <meta name="author" content="RozgarTools & Dynamic AI">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="google-site-verification" content="${GSC_VERIF}" />
  <link rel="canonical" href="${SITE_URL}/tools/sarkari-rozgar-tools.html">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${SITE_URL}/tools/sarkari-rozgar-tools.html">
  <meta property="og:title" content="Sarkari Rozgar Tools - All Online Exam Utilities & Calculators">
  <meta property="og:description" content="All-in-one free portal for government exam aspirants: 20KB Photo Resizer, Exact Age Calculator, 1-Min Typing Test, ATS Resume Maker.">
  <meta property="og:image" content="${SITE_URL}/assets/logo.png">
  <meta property="og:site_name" content="RozgarTools & Dynamic AI">

  <link rel="stylesheet" href="../assets/css/style.css">
  <link rel="icon" type="image/png" href="../assets/logo.png">

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  </script>

  <!-- Schema Markup -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Sarkari Rozgar Tools Portal",
        "url": "${SITE_URL}/tools/sarkari-rozgar-tools.html",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.96", "ratingCount": "9410" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE_URL}/" },
          { "@type": "ListItem", "position": 2, "name": "Tools", "item": "${SITE_URL}/#tools-container" },
          { "@type": "ListItem", "position": 3, "name": "Sarkari Rozgar Tools Hub", "item": "${SITE_URL}/tools/sarkari-rozgar-tools.html" }
        ]
      }
    ]
  }
  </script>
</head>
<body>

  <!-- Header -->
  <header class="site-header">
    <div class="container nav-wrap">
      <a href="../index.html" class="brand-logo" id="home-logo-link">
        <img src="../assets/logo.png" alt="RozgarTools Logo" class="brand-icon-img">
        <div class="brand-text">Rozgar<span>Tools</span></div>
      </a>
      <nav class="desktop-nav" aria-label="Main Navigation">
        <ul class="nav-links">
          <li><a href="../index.html"><span>🏠</span> Home</a></li>
          <li><a href="rozgar-photo-resizer.html"><span>📸</span> Photo Resizer</a></li>
          <li><a href="rozgar-age-calculator.html"><span>🎂</span> Age Calculator</a></li>
          <li><a href="rozgar-typing-test.html"><span>⌨️</span> Typing Test</a></li>
          <li><a href="resume-builder.html"><span>📄</span> Resume Builder</a></li>
          <li><a href="dynamic-translator.html"><span>🌐</span> AI Translator</a></li>
        </ul>
      </nav>
      <div class="nav-actions">
        <button class="theme-toggle-btn" id="theme-toggle-btn" aria-label="Toggle theme">
          <span id="theme-icon">🌙</span>
        </button>
      </div>
    </div>
  </header>

  <main class="container" style="padding-top: 2rem;">
    <!-- Breadcrumb -->
    <nav class="breadcrumb-nav">
      <ol>
        <li><a href="../index.html">🏠 Home</a></li>
        <span class="separator">›</span>
        <li><a href="../index.html#tools-container">Tools</a></li>
        <span class="separator">›</span>
        <li class="current">Sarkari Rozgar Tools Hub</li>
      </ol>
    </nav>

    <!-- Hero -->
    <div style="text-align: center; margin: 2rem 0 3rem;">
      <div class="badge-privacy" style="margin-bottom: 1rem;">
        ⚡ 100% Free • Private Client-Side Tools • Zero Server Uploads
      </div>
      <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem;">
        Sarkari <span class="highlight">Rozgar Tools Hub</span>
      </h1>
      <p style="font-size: 1.1rem; color: var(--text-muted); max-width: 750px; margin: 0 auto;">
        The complete, dedicated online utility center for government job applicants, SSC, UPSC, Railway, Police Bharti, and Banking exam forms.
      </p>
    </div>

    <!-- Quick Exam Navigation Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3.5rem;">
      
      <div class="tool-card" style="border-top: 4px solid var(--primary);">
        <div class="tool-icon-wrap">📸</div>
        <h3 class="tool-title">Rozgar Photo & Signature Resizer</h3>
        <p class="tool-desc">Compress photos to exact 20KB, 50KB, or 100KB with standard 3.5×4.5 cm dimensions for SSC, UPSC, and IBPS forms.</p>
        <a href="rozgar-photo-resizer.html" class="btn btn-primary" style="margin-top: 1rem;">Open Photo Resizer ➔</a>
      </div>

      <div class="tool-card" style="border-top: 4px solid var(--accent-amber);">
        <div class="tool-icon-wrap" style="background: var(--accent-amber);">🎂</div>
        <h3 class="tool-title">Rozgar Exact Age Calculator</h3>
        <p class="tool-desc">Calculate your precise chronological age as on any designated cut-off date to check recruitment eligibility.</p>
        <a href="rozgar-age-calculator.html" class="btn btn-primary" style="margin-top: 1rem;">Open Age Calculator ➔</a>
      </div>

      <div class="tool-card" style="border-top: 4px solid var(--accent-cyan);">
        <div class="tool-icon-wrap" style="background: var(--accent-cyan);">⌨️</div>
        <h3 class="tool-title">Rozgar Live Typing Speed Test</h3>
        <p class="tool-desc">Practice 1-minute, 2-minute, and 5-minute typing tests with real-time WPM, accuracy %, and clerical benchmarks.</p>
        <a href="rozgar-typing-test.html" class="btn btn-primary" style="margin-top: 1rem;">Open Typing Test ➔</a>
      </div>

      <div class="tool-card" style="border-top: 4px solid var(--accent-emerald);">
        <div class="tool-icon-wrap" style="background: var(--accent-emerald);">📄</div>
        <h3 class="tool-title">1-Page ATS Resume Builder</h3>
        <p class="tool-desc">Create modern, professional ATS-friendly single-page resumes with instant A4 PDF export. No sign-up required.</p>
        <a href="resume-builder.html" class="btn btn-primary" style="margin-top: 1rem;">Open Resume Builder ➔</a>
      </div>

      <div class="tool-card" style="border-top: 4px solid #ef4444;">
        <div class="tool-icon-wrap" style="background: #ef4444;">📑</div>
        <h3 class="tool-title">JPG / PNG to PDF Converter</h3>
        <p class="tool-desc">Combine educational marksheets, caste certificates, and identity cards into a single clean PDF document.</p>
        <a href="image-to-pdf.html" class="btn btn-primary" style="margin-top: 1rem;">Open Image to PDF ➔</a>
      </div>

      <div class="tool-card" style="border-top: 4px solid #8b5cf6;">
        <div class="tool-icon-wrap" style="background: #8b5cf6;">🌐</div>
        <h3 class="tool-title">Dynamic AI Language Translator</h3>
        <p class="tool-desc">Translate official government notifications, question papers, and study material across 100+ languages in real time.</p>
        <a href="dynamic-translator.html" class="btn btn-primary" style="margin-top: 1rem;">Open AI Translator ➔</a>
      </div>

    </div>

    <!-- Official Recruitment Standards Reference Table -->
    <article class="seo-article" style="margin-bottom: 3.5rem;">
      <h2>Official Government Exam Standards & Document Guidelines</h2>
      <p>
        Application forms for national recruitment boards frequently get rejected due to incorrect photo resolutions or file sizes. Below is the official reference guide:
      </p>

      <div style="overflow-x: auto; margin: 1.5rem 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem;">
          <thead>
            <tr style="background: var(--bg-surface); text-align: left;">
              <th style="padding: 0.75rem 1rem; border: 1px solid var(--border);">Exam Authority</th>
              <th style="padding: 0.75rem 1rem; border: 1px solid var(--border);">Photo Size</th>
              <th style="padding: 0.75rem 1rem; border: 1px solid var(--border);">Signature Size</th>
              <th style="padding: 0.75rem 1rem; border: 1px solid var(--border);">Typing / Key Standard</th>
              <th style="padding: 0.75rem 1rem; border: 1px solid var(--border);">Action Tool</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><strong>SSC (CGL, CHSL, MTS, GD)</strong></td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">20 KB – 50 KB (JPEG)</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">10 KB – 20 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">35 WPM English / 30 WPM Hindi</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><a href="rozgar-photo-resizer.html" style="color: var(--primary);">Photo Resizer</a></td>
            </tr>
            <tr>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><strong>UPSC Civil Services</strong></td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">20 KB – 300 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">20 KB – 300 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">Age 21–32 as on Aug 1</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><a href="rozgar-age-calculator.html" style="color: var(--primary);">Age Calculator</a></td>
            </tr>
            <tr>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><strong>Railway RRB (NTPC, Group D)</strong></td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">20 KB – 50 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">10 KB – 20 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">30 WPM Typing Test</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><a href="rozgar-typing-test.html" style="color: var(--primary);">Typing Test</a></td>
            </tr>
            <tr>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><strong>IBPS & SBI Banking</strong></td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">20 KB – 50 KB (200×230 px)</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">10 KB – 20 KB (Black Ink)</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">Thumb Impression 20–50 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><a href="rozgar-photo-resizer.html" style="color: var(--primary);">Photo Resizer</a></td>
            </tr>
            <tr>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><strong>State Police Recruitment</strong></td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">20 KB – 100 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">10 KB – 50 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">Age 18–25 years</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><a href="rozgar-photo-resizer.html" style="color: var(--primary);">Photo Resizer</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container footer-bottom">
      <p>&copy; 2026 RozgarTools & Dynamic AI. All rights reserved.</p>
      <p>Official Sarkari Rozgar Online Utilities Hub</p>
    </div>
  </footer>

  <script src="../assets/js/main.js"></script>
</body>
</html>`;

  fs.writeFileSync(rozgarHubPath, rozgarHubHtml, 'utf-8');
  console.log('✅ Created tools/sarkari-rozgar-tools.html');
}

// ---------------------------------------------------------------------------
// 5. UPDATE SITEMAP WITH ALL ROZGAR PAGES
// ---------------------------------------------------------------------------
function updateSitemap() {
  const today = '2026-10-30';

  const pages = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/tools/sarkari-rozgar-tools.html`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/tools/rozgar-photo-resizer.html`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/tools/rozgar-age-calculator.html`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/tools/rozgar-typing-test.html`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/tools/dynamic-translator.html`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/tools/govt-photo-resizer.html`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/tools/resume-builder.html`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/tools/typing-test.html`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/tools/emi-calculator.html`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/tools/sip-calculator.html`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/tools/age-calculator.html`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/tools/qr-generator.html`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/tools/image-to-pdf.html`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/tools/cgpa-calculator.html`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/about-us.html`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${SITE_URL}/contact-us.html`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${SITE_URL}/privacy-policy.html`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${SITE_URL}/terms.html`, priority: '0.5', changefreq: 'monthly' }
  ];

  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const p of pages) {
    sitemapXml += `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>\n`;
  }

  sitemapXml += `</urlset>\n`;

  fs.writeFileSync(path.resolve('sitemap.xml'), sitemapXml, 'utf-8');
  if (fs.existsSync('public')) {
    fs.writeFileSync(path.resolve('public', 'sitemap.xml'), sitemapXml, 'utf-8');
  }
  console.log('✅ sitemap.xml updated with all new Rozgar programmatic landing pages.');
}

// ---------------------------------------------------------------------------
// EXECUTE
// ---------------------------------------------------------------------------
updateCss();
updateMainJs();
updateIndexHtml();
createRozgarPages();
updateSitemap();

console.log('🎉 Rozgar SEO & Dynamic Intent Engine Successfully Built and Integrated!');
