const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1. Update Title and Meta
const oldMetaHead = `<title>RozgarTools & Dynamic AI - 100% Free Online Utility Tools, Calculators & Language Translator</title>
  <meta name="description" content="100% Free and Private Online Utility Tools. Real-time Dynamic AI Language Translator (100+ languages), Diwali Wishing Card Maker with Name & Photo, Magic Diwali Wishing Link, Lakshmi Puja Shubh Muhurat, Photo Resizer (20KB/50KB) for SSC & UPSC, ATS Resume Builder, and Chhath Puja Poster Maker.">
  <meta name="keywords" content="rozgar tools, sarkari tools, sarkari result tools, free online utility tools, online web utilities 100% free, diwali wishing card maker, diwali card with photo and name, diwali magic wish link whatsapp viral, diwali puja muhurat 2026, diwali shayari wishes hindi, green diwali virtual cracker simulator, chhath puja poster maker, shubh deepawali photo frame, dhanteras greeting card maker, apne naam ka diwali card kaise banaye, merge pdf, merge pdf online free, combine pdf files, split pdf, extract pdf pages, pdf to jpg, convert pdf to image free, rotate pdf permanently, watermark pdf online, protect pdf password, unlock pdf remove password, add page numbers to pdf, image to pdf converter, jpg to pdf 100kb, ilovepdf free alternative, smallpdf free alternative, pdf merge kaise kare, 2 pdf file ko ek sath kaise jode, pdf se page kaise nikale, pdf ko photo me kaise convert kare, pdf rotate kaise kare, photo resizer 20kb, photo resizer 50kb, ssc cgl photo resizer, ssc chsl signature resizer 20kb, upsc photo resizer 20kb to 50kb, ibps banking photo resizer, rrb railway photo compressor, photo 20kb me kaise kare, signature 20kb kaise banaye, sarkari exam photo signature size, dynamic ai language translator, english to hindi translator accurate, hindi to english translation real time, voice translation 100 languages, online language converter free, dynamic translator api, typing test online, typing speed test 1 minute, live typing test wpm accuracy, hindi typing test mangal inscript, court clerk typing speed test, ssc typing practice online, ats resume builder free, 1 page resume maker pdf download, free cv builder for freshers, biodata maker for job, loan emi calculator with amortisation, home loan emi calculator sbi hdfc, car loan monthly emi calculator, sip calculator mutual funds wealth, lumpsum investment return calculator, cgpa to percentage cbse 9.5, aicte cgpa calculator, exact age calculator dob cut off date, sarkari age eligibility calculator, custom upi qr code generator with logo, phonepe gpay qr code maker">`;

const newMetaHead = `<title>RozgarTools & Dynamic AI - 100% Free Online Career Utilities, PDF Tools & Financial Calculators</title>
  <meta name="description" content="100% Free and Private Online Utility Tools. Real-time Dynamic AI Language Translator, Govt Photo Resizer (20KB/50KB) for SSC & UPSC, Image to Text OCR, ATS Resume Builder, PDF Utilities, In-Hand Salary & EMI Calculators, and Career Guides.">
  <meta name="keywords" content="rozgar tools, sarkari tools, free online utility tools, photo resizer 20kb, photo resizer 50kb, ssc photo resizer, upsc photo resizer, image to text ocr, dynamic translator, ats resume builder, typing speed test, in hand salary calculator, loan emi calculator, sip calculator, merge pdf, split pdf, image to pdf">`;

content = content.replace(oldMetaHead, newMetaHead);

// 2. Open Graph & Twitter
content = content.replace(
  `<meta property="og:title" content="RozgarTools & Dynamic AI - 100% Free Online Utility Tools & Festive Suite">\n  <meta property="og:description" content="100% Free and Private Online Utility Tools. Diwali Card Maker with Name & Photo, Magic WhatsApp Wishing Link, Lakshmi Puja Muhurat, ATS Resume Builder, and Photo Resizer.">`,
  `<meta property="og:title" content="RozgarTools & Dynamic AI - 100% Free Online Utility Tools & Career Hub">\n  <meta property="og:description" content="100% Free and Private Online Utility Tools. Dynamic AI Language Translator, Govt Photo Resizer (20KB/50KB), ATS Resume Builder, OCR, PDF Suite, and Calculators.">`
);

// 3. Update Nav Links to include Guides
content = content.replace(
  `<li><a href="tools/govt-photo-resizer.html">Photo Resizer</a></li>\n          <li class="nav-item-hide-laptop"><a href="tools/resume-builder.html">Resume Builder</a></li>`,
  `<li><a href="tools/govt-photo-resizer.html">Photo Resizer</a></li>\n          <li class="nav-item-hide-laptop"><a href="tools/resume-builder.html">Resume Builder</a></li>\n          <li><a href="#knowledge-hub" style="color: #38bdf8; font-weight: 600;">📚 Guides</a></li>`
);

// 4. Replace Festive Showcase Banner with Career & Educational Knowledge Hub
const oldFestiveSectionRegex = /<!-- Festive Special 2026 Viral Hub Banner & Grid -->[\s\S]*?<\/section>/;

const newKnowledgeHubSection = `<!-- Career & Educational Knowledge Hub -->
    <section class="festive-showcase-section" id="knowledge-hub" style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: var(--radius-xl); padding: 2.25rem; margin: 2.5rem 0;">
      <div class="festive-showcase-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="festive-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; margin-bottom: 0.5rem;">
            📚 Career & Educational Knowledge Hub
          </span>
          <h2 class="festive-title" style="font-size: 1.85rem; font-weight: 800; color: var(--text-main); margin: 0;">
            In-Depth Guides, Specifications & Technical Tutorials
          </h2>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0.35rem 0 0 0;">
            Expert articles covering official competitive exam standards, resume strategies, OCR technology, and financial planning.
          </p>
        </div>
      </div>

      <div class="festive-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
        <!-- Guide 1 -->
        <a href="guides/sarkari-photo-signature-guidelines-2026.html" class="festive-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; text-decoration: none; color: inherit; display: flex; flex-direction: column; justify-content: space-between; transition: transform var(--transition-fast), border-color var(--transition-fast);">
          <div>
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">📸</div>
            <span style="font-size: 0.75rem; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.05em;">Exam Specs</span>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0.35rem 0 0.5rem 0; line-height: 1.35;">Sarkari Exam Photo & Signature Guidelines 2026</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
              Official 20KB-50KB dimensions, white background requirements, and rejection prevention for SSC, UPSC, IBPS, and Railway.
            </p>
          </div>
          <span style="font-size: 0.85rem; font-weight: 700; color: #38bdf8; margin-top: 1rem; display: inline-flex; align-items: center; gap: 0.35rem;">
            Read Full Guide ➔
          </span>
        </a>

        <!-- Guide 2 -->
        <a href="guides/how-ocr-works-image-to-text-guide.html" class="festive-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; text-decoration: none; color: inherit; display: flex; flex-direction: column; justify-content: space-between; transition: transform var(--transition-fast), border-color var(--transition-fast);">
          <div>
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">🔍</div>
            <span style="font-size: 0.75rem; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 0.05em;">AI Deep Dive</span>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0.35rem 0 0.5rem 0; line-height: 1.35;">How OCR Works: Extracting Text from Images & Scans</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
              Technical breakdown of image binarization, Hindi Devanagari character recognition, and private browser WebAssembly pipelines.
            </p>
          </div>
          <span style="font-size: 0.85rem; font-weight: 700; color: #10b981; margin-top: 1rem; display: inline-flex; align-items: center; gap: 0.35rem;">
            Read Full Guide ➔
          </span>
        </a>

        <!-- Guide 3 -->
        <a href="guides/how-to-write-ats-friendly-resume.html" class="festive-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; text-decoration: none; color: inherit; display: flex; flex-direction: column; justify-content: space-between; transition: transform var(--transition-fast), border-color var(--transition-fast);">
          <div>
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">📄</div>
            <span style="font-size: 0.75rem; font-weight: 700; color: #a855f7; text-transform: uppercase; letter-spacing: 0.05em;">Career Strategy</span>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0.35rem 0 0.5rem 0; line-height: 1.35;">How to Write an ATS-Friendly Resume in 2026</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
              Pass automated recruiter screeners: formatting rules, Google's X-Y-Z formula, keyword matching, and single-column layout principles.
            </p>
          </div>
          <span style="font-size: 0.85rem; font-weight: 700; color: #a855f7; margin-top: 1rem; display: inline-flex; align-items: center; gap: 0.35rem;">
            Read Full Guide ➔
          </span>
        </a>

        <!-- Guide 4 -->
        <a href="guides/in-hand-salary-calculation-new-tax-regime.html" class="festive-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; text-decoration: none; color: inherit; display: flex; flex-direction: column; justify-content: space-between; transition: transform var(--transition-fast), border-color var(--transition-fast);">
          <div>
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">💰</div>
            <span style="font-size: 0.75rem; font-weight: 700; color: #0ea5e9; text-transform: uppercase; letter-spacing: 0.05em;">Personal Finance</span>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0.35rem 0 0.5rem 0; line-height: 1.35;">In-Hand Salary Calculation Guide: CTC vs Net Pay</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
              Where does your CTC go? Complete breakdown of Basic, HRA, 12% EPF deduction, Professional Tax, and the New Tax Regime slabs.
            </p>
          </div>
          <span style="font-size: 0.85rem; font-weight: 700; color: #0ea5e9; margin-top: 1rem; display: inline-flex; align-items: center; gap: 0.35rem;">
            Read Full Guide ➔
          </span>
        </a>

        <!-- Guide 5 -->
        <a href="guides/sip-and-power-of-compounding-guide.html" class="festive-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; text-decoration: none; color: inherit; display: flex; flex-direction: column; justify-content: space-between; transition: transform var(--transition-fast), border-color var(--transition-fast);">
          <div>
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">📈</div>
            <span style="font-size: 0.75rem; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 0.05em;">Wealth Building</span>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0.35rem 0 0.5rem 0; line-height: 1.35;">Mutual Fund SIP & The Power of Compounding</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
              Discover how disciplined monthly SIPs, rupee cost averaging, and exponential compound returns build long-term generational wealth.
            </p>
          </div>
          <span style="font-size: 0.85rem; font-weight: 700; color: #10b981; margin-top: 1rem; display: inline-flex; align-items: center; gap: 0.35rem;">
            Read Full Guide ➔
          </span>
        </a>
      </div>
    </section>`;

content = content.replace(oldFestiveSectionRegex, newKnowledgeHubSection);

// 5. Update Footer Links
content = content.replace(
  `<li><a href="tools/diwali-rangoli-generator.html" style="color: #fbbf24; font-weight: 600;">🎨 AI Rangoli Generator (Diwali Special)</a></li>\n            <li><a href="tools/diwali-card-maker.html" style="color: #fbbf24; font-weight: 600;">🪔 Diwali Wishing Card Maker</a></li>`,
  `<li><a href="guides/sarkari-photo-signature-guidelines-2026.html" style="color: #38bdf8; font-weight: 600;">📚 Sarkari Photo & Signature Guide</a></li>\n            <li><a href="guides/how-to-write-ats-friendly-resume.html" style="color: #38bdf8; font-weight: 600;">📄 ATS Resume Writing Guide</a></li>\n            <li><a href="guides/in-hand-salary-calculation-new-tax-regime.html" style="color: #38bdf8; font-weight: 600;">💰 In-Hand Salary Calculation Guide</a></li>`
);

// 6. Update Category Pills
content = content.replace(
  `<button class="cat-pill" data-category="festive" role="tab" aria-selected="false">\n          Festive & Fun <span class="cat-count">7</span>\n        </button>`,
  `<a href="#knowledge-hub" class="cat-pill" role="tab" style="text-decoration: none;">\n          Knowledge & Guides <span class="cat-count">5</span>\n        </a>`
);

fs.writeFileSync('index.html', content, 'utf8');
console.log('Successfully updated index.html');

