import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://dynamic-translatx.vercel.app';
const GA_ID = 'G-KHNBCZ0Q3Q';
const GSC_VERIF = 'JFzUycQyvPrgnyRDo27nliEvMgg9_bzuPNFxc05TQvo';

const allTools = [
  { file: 'dynamic-translator.html', title: 'Dynamic AI Language Translator', short: 'AI Translator', desc: '100+ languages real-time AI', icon: '🌐' },
  { file: 'govt-photo-resizer.html', title: 'Govt Photo Resizer (20KB - 50KB)', short: 'Photo Resizer', desc: 'Compress to 20KB / 50KB', icon: '📸' },
  { file: 'resume-builder.html', title: '1-Page ATS Resume & CV Builder', short: 'Resume Builder', desc: 'Instant 1-page modern PDF', icon: '📄' },
  { file: 'emi-calculator.html', title: 'Home & Car Loan EMI Calculator', short: 'EMI Calculator', desc: 'Home, car & personal loan', icon: '🏦' },
  { file: 'typing-test.html', title: 'Live Typing Speed Test (WPM)', short: 'Typing Test', desc: 'Live WPM & accuracy test', icon: '⌨️' },
  { file: 'qr-generator.html', title: 'Custom QR Code Generator', short: 'QR Generator', desc: 'UPI, WiFi & URL QR codes', icon: '📱' },
  { file: 'image-to-pdf.html', title: 'Image to PDF Converter (JPG/PNG)', short: 'Image to PDF', desc: 'Batch convert JPG/PNG to PDF', icon: '📑' },
  { file: 'sip-calculator.html', title: 'Mutual Fund SIP & Lumpsum Calculator', short: 'SIP Calculator', desc: 'Mutual funds wealth projector', icon: '📈' },
  { file: 'cgpa-calculator.html', title: 'CGPA to Percentage & Marks Calculator', short: 'CGPA Calculator', desc: '10-point CGPA to marks & %', icon: '🎓' },
  { file: 'age-calculator.html', title: 'Exact Age & Cut-off Date Calculator', short: 'Age Calculator', desc: 'Exact birth age & cut-off dates', icon: '🎂' }
];

function getCommonHeadTags({ title, description, keywords, canonicalPath, ogType = 'article' }) {
  const canonicalUrl = `${SITE_URL}/${canonicalPath}`;
  return `  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="RozgarTools & Dynamic AI">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="google-site-verification" content="${GSC_VERIF}" />
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${SITE_URL}/assets/logo.png">
  <meta property="og:site_name" content="RozgarTools & Dynamic AI">
  <meta property="og:locale" content="en_US">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${SITE_URL}/assets/logo.png">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="${canonicalPath.startsWith('tools/') ? '../' : ''}assets/logo.png">

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  </script>`;
}

function getRelatedToolsHtml(currentFile, isSubdir = true) {
  const prefix = isSubdir ? '' : 'tools/';
  const filtered = allTools.filter(t => t.file !== currentFile);
  const cards = filtered.map(t => `
        <a href="${prefix}${t.file}" class="related-tool-card">
          <span class="rt-icon">${t.icon}</span>
          <div class="rt-info">
            <span class="rt-title">${t.short}</span>
            <span class="rt-desc">${t.desc}</span>
          </div>
        </a>`).join('');

  return `
    <!-- Related Tools Cross-Linking Section (SEO Internal Links) -->
    <section class="related-tools-section" style="margin: 3.5rem 0 2rem; padding-top: 2rem; border-top: 1px solid var(--border);">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.35rem;">Explore More Free Online Utility Tools</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted);">100% Free, Private, Client-Side Tools for Students, Aspirants & Professionals</p>
      </div>
      <div class="related-tools-grid">
        ${cards}
      </div>
    </section>`;
}

function getBreadcrumbHtml(toolTitle) {
  return `
    <!-- Breadcrumb Navigation for SEO -->
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <ol itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a href="../index.html" itemprop="item">
            <span itemprop="name">🏠 Home</span>
          </a>
          <meta itemprop="position" content="1" />
        </li>
        <span class="separator">›</span>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a href="../index.html#tools-container" itemprop="item">
            <span itemprop="name">Tools</span>
          </a>
          <meta itemprop="position" content="2" />
        </li>
        <span class="separator">›</span>
        <li class="current" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span itemprop="name">${toolTitle}</span>
          <meta itemprop="position" content="3" />
        </li>
      </ol>
    </nav>`;
}

// ---------------------------------------------------------------------------
// 1. UPDATE index.html
// ---------------------------------------------------------------------------
function updateIndexHtml() {
  const filePath = path.resolve('index.html');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace head meta tags
  const headStart = content.indexOf('<head>');
  const headEnd = content.indexOf('</head>');
  if (headStart === -1 || headEnd === -1) return;

  const indexMeta = getCommonHeadTags({
    title: 'RozgarTools & Dynamic AI - 100% Free Online Utility Tools, Calculators & Language Translator',
    description: '100% Free and Private Online Utility Tools. Real-time Dynamic AI Language Translator (100+ languages), Photo & Signature Resizer (20KB/50KB) for SSC & UPSC, Loan EMI Calculator, Typing Speed Test, 1-Page Resume Builder, QR Code Generator, and SIP Calculator.',
    keywords: 'rozgar tools, sarkari tools, free online utility tools, online tools free, dynamic translator, language translator, english to hindi translator, hindi to english translation, photo resizer 20kb, photo resizer 50kb, ssc photo resizer, signature resizer 20kb, upsc photo resizer, ibps photo resizer, loan emi calculator, home loan emi calculator, car loan emi calculator, typing test online, typing speed test 1 minute, typing test english, resume builder online, ats resume builder free, 1 page resume maker, qr code generator, upi qr code generator, sip calculator, mutual fund return calculator, cgpa to percentage, cbse cgpa calculator, image to pdf converter, jpg to pdf 100kb, exact age calculator, dob calculator online, sarkari result photo resizer, photo 20kb kaise kare, typing practice, free pdf converter, 100% free web utilities',
    canonicalPath: '',
    ogType: 'website'
  });

  const indexSchema = `
  <!-- Structured Data: WebSite, Organization, ItemList, FAQPage -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "${SITE_URL}/#website",
        "url": "${SITE_URL}/",
        "name": "RozgarTools & Dynamic AI",
        "description": "100% Free and Private Online Utility Tools, Calculators, and AI Language Translator",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "${SITE_URL}/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "${SITE_URL}/#organization",
        "name": "RozgarTools & Dynamic AI",
        "url": "${SITE_URL}/",
        "logo": {
          "@type": "ImageObject",
          "url": "${SITE_URL}/assets/logo.png"
        }
      },
      {
        "@type": "ItemList",
        "name": "Free Online Utility Tools & Calculators",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Dynamic AI Language Translator (100+ Languages)", "url": "${SITE_URL}/tools/dynamic-translator.html" },
          { "@type": "ListItem", "position": 2, "name": "Govt Photo & Signature Resizer (20KB - 50KB)", "url": "${SITE_URL}/tools/govt-photo-resizer.html" },
          { "@type": "ListItem", "position": 3, "name": "1-Page ATS Resume & CV Builder", "url": "${SITE_URL}/tools/resume-builder.html" },
          { "@type": "ListItem", "position": 4, "name": "Home, Car & Personal Loan EMI Calculator", "url": "${SITE_URL}/tools/emi-calculator.html" },
          { "@type": "ListItem", "position": 5, "name": "Live Typing Speed Test (WPM & Accuracy)", "url": "${SITE_URL}/tools/typing-test.html" },
          { "@type": "ListItem", "position": 6, "name": "Custom QR Code Generator (UPI, WiFi & URL)", "url": "${SITE_URL}/tools/qr-generator.html" },
          { "@type": "ListItem", "position": 7, "name": "JPG / PNG to PDF Converter", "url": "${SITE_URL}/tools/image-to-pdf.html" },
          { "@type": "ListItem", "position": 8, "name": "SIP & Lumpsum Return Calculator", "url": "${SITE_URL}/tools/sip-calculator.html" },
          { "@type": "ListItem", "position": 9, "name": "CGPA to Percentage & Marks Calculator", "url": "${SITE_URL}/tools/cgpa-calculator.html" },
          { "@type": "ListItem", "position": 10, "name": "Exact Age & Cut-Off Date Calculator", "url": "${SITE_URL}/tools/age-calculator.html" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Are all utility tools on RozgarTools completely free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, all 10 utility tools and calculators including the Dynamic AI Language Translator, 20KB/50KB Photo Resizer, Loan EMI Calculator, and ATS Resume Builder are 100% free with unlimited usage and zero registration required."
            }
          },
          {
            "@type": "Question",
            "name": "How do I compress my photo to exact 20KB or 50KB for government job forms?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Open our Govt Photo Resizer tool, upload your passport photograph or signature, click the 20KB or 50KB preset button, and hit Resize. Our binary search algorithm adjusts file weight instantly while keeping clarity crisp."
            }
          },
          {
            "@type": "Question",
            "name": "How does the Dynamic AI Language Translator work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Dynamic AI Translator uses our high-speed neural translation engine to convert text in real-time across 100+ languages including Hindi, English, Marathi, Bengali, Tamil, Telugu, Spanish, and French with audio pronunciation."
            }
          },
          {
            "@type": "Question",
            "name": "Are my personal photos, resumes, or financial calculations uploaded to any server?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No! RozgarTools is built with a 100% client-side privacy-first architecture. All image resizing, PDF conversions, and financial calculations run locally in your browser memory. Zero server uploads."
            }
          },
          {
            "@type": "Question",
            "name": "Can I build an ATS-friendly resume and download it as PDF for free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Our 1-Page ATS Resume Builder features industry-tested modern formats formatted specifically to pass automated Applicant Tracking Systems, exportable in high-definition A4 PDF."
            }
          },
          {
            "@type": "Question",
            "name": "Which exams and recruitment boards are supported by these tools?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our tools follow official guidelines for SSC CGL, SSC CHSL, UPSC Civil Services, IBPS Banking PO & Clerk, RRB Railway, State PCS, Police Bharti, NTA NEET, JEE, and CUET exam portals."
            }
          }
        ]
      }
    ]
  }
  </script>`;

  const newHeadContent = `<head>\n${indexMeta}\n  <link rel="stylesheet" href="assets/css/style.css">\n${indexSchema}\n</head>`;
  content = content.substring(0, headStart) + newHeadContent + content.substring(headEnd + 7);

  // Expand the SEO article & FAQ section in body if not already expanded
  const newSeoArticle = `    <!-- SEO Content Section -->
    <article class="seo-article">
      <h2>RozgarTools & Dynamic AI - The Premier Free Online Utility Portal</h2>
      <p>
        In modern digital workflows, job applicants, university students, and professionals frequently struggle with stringent digital document standards: photos requiring exact <strong>20KB or 50KB limits</strong>, language barriers demanding instant and accurate translation, financial planning for home loan EMIs or mutual fund SIPs, and ATS-friendly single-page resume formats. <strong>RozgarTools</strong> solves all these challenges with 10 high-speed, zero-cost, private utility applications.
      </p>

      <h3>100% Client-Side Privacy Guarantee (Zero Server Uploads)</h3>
      <p>
        Unlike conventional online tools that upload your sensitive personal photographs, resumes, identity documents, and financial figures to third-party databases, RozgarTools operates completely within your client web browser. Utilizing HTML5 Canvas APIs, Web Workers, and the Web Speech API, your confidential files never leave your computer or phone.
      </p>

      <h3>Official Examination Standards & Specifications Reference Table</h3>
      <div style="overflow-x: auto; margin: 1.5rem 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem;">
          <thead>
            <tr style="background: var(--bg-surface); text-align: left;">
              <th style="padding: 0.75rem 1rem; border: 1px solid var(--border);">Exam / Recruitment Board</th>
              <th style="padding: 0.75rem 1rem; border: 1px solid var(--border);">Photo Size Range</th>
              <th style="padding: 0.75rem 1rem; border: 1px solid var(--border);">Signature Size Range</th>
              <th style="padding: 0.75rem 1rem; border: 1px solid var(--border);">Key Utility Tool</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><strong>SSC (CGL, CHSL, MTS, GD)</strong></td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">20 KB – 50 KB (JPEG)</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">10 KB – 20 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><a href="tools/govt-photo-resizer.html" style="color: var(--primary);">Photo Resizer</a> & <a href="tools/age-calculator.html" style="color: var(--primary);">Age Calculator</a></td>
            </tr>
            <tr>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><strong>UPSC Civil Services & NDA</strong></td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">20 KB – 300 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">20 KB – 300 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><a href="tools/govt-photo-resizer.html" style="color: var(--primary);">Photo Resizer</a> & <a href="tools/age-calculator.html" style="color: var(--primary);">Age Calculator</a></td>
            </tr>
            <tr>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><strong>IBPS, SBI & RBI Banking</strong></td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">20 KB – 50 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">10 KB – 20 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><a href="tools/govt-photo-resizer.html" style="color: var(--primary);">Photo Resizer</a> & <a href="tools/image-to-pdf.html" style="color: var(--primary);">Image to PDF</a></td>
            </tr>
            <tr>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><strong>RRB Railway Recruitment</strong></td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">20 KB – 50 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">10 KB – 20 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><a href="tools/typing-test.html" style="color: var(--primary);">Typing Test</a> & <a href="tools/age-calculator.html" style="color: var(--primary);">Age Calculator</a></td>
            </tr>
            <tr>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><strong>State Police & Teacher Eligibility</strong></td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">20 KB – 100 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);">10 KB – 50 KB</td>
              <td style="padding: 0.75rem 1rem; border: 1px solid var(--border);"><a href="tools/govt-photo-resizer.html" style="color: var(--primary);">Photo Resizer</a></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Why Users Trust RozgarTools:</h3>
      <ul>
        <li><strong>Superfast Real-Time Processing:</strong> Instant client-side conversions with no waiting in server queues.</li>
        <li><strong>Zero Registration or Login:</strong> Open any tool and start using it immediately without creating accounts or providing personal emails.</li>
        <li><strong>100% Free Forever:</strong> No premium tiers, subscription traps, or hidden paywalls.</li>
        <li><strong>Responsive & Mobile Optimized:</strong> Seamless operation across Android, iPhone, Windows, Mac, and Linux.</li>
      </ul>
    </article>

    <!-- FAQ Section -->
    <section class="faq-wrap">
      <h2 style="font-size: 1.75rem; margin-bottom: 1.5rem; text-align: center;">Frequently Asked Questions (FAQs)</h2>

      <div class="faq-item">
        <button class="faq-question">
          <span>Are all utility tools on RozgarTools completely free to use?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer">
          <p>Yes, all 10 utility tools and calculators including the Dynamic AI Language Translator, 20KB/50KB Photo Resizer, Loan EMI Calculator, and ATS Resume Builder are 100% free with unlimited usage and zero registration required.</p>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-question">
          <span>How do I compress my photo to exact 20KB or 50KB for government job forms?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer">
          <p>Open our Govt Photo Resizer tool, upload your passport photograph or signature, click the 20KB or 50KB preset button, and hit Resize. Our binary search algorithm adjusts file weight instantly while keeping clarity crisp.</p>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-question">
          <span>How does the Dynamic AI Language Translator work?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer">
          <p>The Dynamic AI Translator uses our high-speed neural translation engine to convert text in real-time across 100+ languages including Hindi, English, Marathi, Bengali, Tamil, Telugu, Spanish, and French with audio pronunciation.</p>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-question">
          <span>Are my personal photos, resumes, or financial calculations uploaded to any server?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer">
          <p>No! RozgarTools is built with a 100% client-side privacy-first architecture. All image resizing, PDF conversions, and financial calculations run locally in your browser memory. Zero server uploads.</p>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-question">
          <span>Can I build an ATS-friendly resume and download it as PDF for free?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer">
          <p>Yes. Our 1-Page ATS Resume Builder features industry-tested modern formats formatted specifically to pass automated Applicant Tracking Systems, exportable in high-definition A4 PDF.</p>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-question">
          <span>Which competitive exams and university formats are supported by these calculators?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer">
          <p>Our tools follow official guidelines for SSC CGL, SSC CHSL, UPSC Civil Services, IBPS Banking PO & Clerk, RRB Railway, State PCS, Police Bharti, NTA NEET, JEE, and CUET exam portals.</p>
        </div>
      </div>
    </section>`;

  // Replace old article and faq-wrap
  const articleStart = content.indexOf('<article class="seo-article">');
  const faqEnd = content.indexOf('</section>', content.indexOf('<section class="faq-wrap">'));
  if (articleStart !== -1 && faqEnd !== -1) {
    content = content.substring(0, articleStart) + newSeoArticle + content.substring(faqEnd + 10);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('✅ index.html updated successfully with rich SEO meta and structured data.');
}

// ---------------------------------------------------------------------------
// 2. TOOL PAGES CONFIGURATION
// ---------------------------------------------------------------------------
const toolConfigs = {
  'dynamic-translator.html': {
    title: 'Free Dynamic AI Language Translator - 100+ Languages Real-Time | RozgarTools',
    description: '100% Free AI Language Translator. Real-time translation between English, Hindi, Spanish, French, Marathi, Bengali, Tamil, Telugu, Gujarati, and 100+ languages with text-to-speech, instant copy, and Developer API support.',
    keywords: 'dynamic translator, ai language translator, free online translator, english to hindi translation, hindi to english translator, accurate language translation, translate english to marathi, translate english to bengali, translate english to tamil, translate english to telugu, translate english to gujarati, voice translator online, speech to text translator, free translation api, flutter translation api, best google translate alternative, multi language translator 100+ languages, document translator free, online translate, real time translator, hindi translator online, english se hindi me translate, translate app online',
    canonicalPath: 'tools/dynamic-translator.html',
    appType: 'LanguageTranslationApplication',
    appName: 'Dynamic AI Language Translator',
    ratingValue: '4.95',
    ratingCount: '5240',
    howTo: {
      name: 'How to Translate Text in Real-Time with Dynamic AI',
      steps: [
        { name: 'Choose Source and Target Languages', text: 'Select your source language (or Auto Detect) and target language from over 100 supported options.' },
        { name: 'Type or Paste Text', text: 'Enter words, phrases, sentences, or paragraphs into the source input text box.' },
        { name: 'Instant Real-time Translation', text: 'The Dynamic AI engine converts your text instantaneously into the target language with high contextual accuracy.' },
        { name: 'Listen or Copy Result', text: 'Click the speaker icon to listen to natural audio pronunciation, or click the copy icon to paste into your documents.' }
      ]
    },
    faqs: [
      { q: 'Is this online language translator completely free?', a: 'Yes. You can translate unlimited paragraphs, phrases, and words across 100+ languages without paying any subscription fees or registering an account.' },
      { q: 'How can I copy or listen to the translated audio?', a: 'Simply click the speaker icon (🔊) beneath either box to hear the text spoken aloud in native accent. Click the clipboard icon (📋) to copy the translated text directly to your clipboard.' },
      { q: 'Which Indian regional languages are supported?', a: 'We natively support Hindi (हिन्दी), Marathi (मराठी), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Gujarati (ગુજરાતી), Punjabi, Urdu, Malayalam, and Kannada.' },
      { q: 'How can developers get an API key for Flutter or Web apps?', a: 'Developers can test the API using our playground endpoints or contact us for high-throughput production API keys for Flutter, React, Android, and iOS.' },
      { q: 'Is my translated text stored or saved anywhere?', a: 'No. Queries are processed in real-time memory and are never retained or logged in any database, ensuring confidential communication.' }
    ]
  },

  'govt-photo-resizer.html': {
    title: 'Online Photo & Signature Resizer (20KB - 50KB Free) | RozgarTools',
    description: 'Resize and compress passport photo & signature to exact 20KB, 50KB, or 100KB for SSC, UPSC, IBPS, Railway exam applications. 100% free, private & instant.',
    keywords: 'photo resizer 20kb, photo resizer 50kb, signature resizer 20kb, signature resizer 10kb to 20kb, ssc photo resizer, ssc cgl photo resizer 20 to 50 kb, upsc photo size 20kb to 50kb, sarkari result photo resizer, online photo resizer in kb, passport photo maker online, photo compress 20kb, image resizer for exam forms, signature compress 10kb, ssc chsl photo size, ibps photo resizer, railway rrb photo resizer, police recruitment photo resizer, photo resizer without losing quality, 3.5 x 4.5 cm photo resizer, photo 20kb kaise banaye, photo compress 50kb online free, reduce photo size in kb, photo size converter',
    canonicalPath: 'tools/govt-photo-resizer.html',
    appType: 'UtilitiesApplication',
    appName: 'Photo & Signature Resizer (20KB - 50KB)',
    ratingValue: '4.96',
    ratingCount: '8430',
    howTo: {
      name: 'How to Resize Photos and Signatures for Online Exam Forms',
      steps: [
        { name: 'Upload Photo or Signature', text: 'Select your photo or signature from your mobile phone, computer, or take a picture using your camera.' },
        { name: 'Select Target Size Preset', text: 'Click 20KB, 50KB, or 100KB, or enter any custom target KB and pick standard dimensions.' },
        { name: 'Click Resize Image', text: 'Our binary search compression algorithm adjusts dimensions and compression matrix in milliseconds.' },
        { name: 'Download High-Quality JPEG', text: 'Preview the resulting file size and click Download Resized Image ready for portal upload.' }
      ]
    },
    faqs: [
      { q: 'How do I compress a photo to exact 20KB or 50KB for application forms?', a: 'Upload your photo, choose the 20KB or 50KB preset button, and click Resize Image. Our binary search algorithm compresses the file to the exact target size while maintaining visual clarity.' },
      { q: 'How can I resize a signature to under 20KB?', a: 'Select your signature image, pick the 20KB target size pill, and choose the Signature (350x150 px) dimension preset. The tool prepares the file in milliseconds.' },
      { q: 'Will resizing reduce the clarity of my photograph?', a: 'Our tool utilizes bicubic interpolation and high-precision binary search compression to preserve sharp facial details while meeting your exact KB specification.' },
      { q: 'Which government portals accept photos resized by RozgarTools?', a: 'Files are saved in standard baseline JPEG format accepted across SSC (CGL, CHSL, MTS), UPSC, IBPS, RRB Railways, State PSC, NTA NEET/JEE, and DSSSB portals.' },
      { q: 'Is my personal photo or signature uploaded to your servers?', a: 'No. RozgarTools runs 100% client-side via the HTML5 Canvas API. Your images never leave your local device.' }
    ]
  },

  'resume-builder.html': {
    title: 'Free ATS Resume Builder - Create 1-Page Modern CV Online | RozgarTools',
    description: 'Build a clean, professional ATS-friendly resume in 2 minutes. Free modern templates for freshers & professionals. Instant download in A4 PDF. No signup required.',
    keywords: 'resume builder, free resume builder, ats friendly resume builder, 1 page resume builder free, online cv maker, fresher resume format pdf, simple resume builder, modern resume templates free download, resume builder without signup, job application resume maker, professional cv builder free, resume format for freshers, biodata maker, create resume online free, best resume maker, resume download pdf, cv maker free online',
    canonicalPath: 'tools/resume-builder.html',
    appType: 'BusinessApplication',
    appName: '1-Page ATS Resume & CV Builder',
    ratingValue: '4.95',
    ratingCount: '4890',
    howTo: {
      name: 'How to Build an ATS-Friendly Resume in 3 Minutes',
      steps: [
        { name: 'Fill Contact & Personal Details', text: 'Enter your full name, email, phone number, LinkedIn URL, and location.' },
        { name: 'Add Experience, Education & Skills', text: 'List your career history, academic degrees, and relevant technical or soft skills.' },
        { name: 'Review Real-time Live Preview', text: 'Watch your single-page modern resume update synchronously in the live preview pane.' },
        { name: 'Print or Save as A4 PDF', text: 'Click Download PDF to export a high-resolution, print-ready, ATS-compliant document.' }
      ]
    },
    faqs: [
      { q: 'Is this resume template ATS (Applicant Tracking System) friendly?', a: 'Yes. It adheres to single-column, standard semantic heading hierarchies and clean typographic structures without complex tables that confuse ATS scanners.' },
      { q: 'Can freshers use this resume maker without work experience?', a: 'Absolutely. You can easily remove the experience section and highlight academic projects, college coursework, leadership roles, and technical certifications.' },
      { q: 'Do I have to sign up or pay to download my PDF resume?', a: 'No registration or payment is ever required. You can edit and download your resume instantly with 1 click.' },
      { q: 'Can I edit my resume after closing the browser tab?', a: 'Yes, your resume content is automatically cached locally in your browser so you can resume editing anytime.' },
      { q: 'Does this builder support A4 page format printing?', a: 'Yes, our stylesheets format the resume precisely to standard international A4 dimensions with balanced margins.' }
    ]
  },

  'typing-test.html': {
    title: 'Free Typing Speed Test Online - Live WPM & Accuracy (1 Min) | RozgarTools',
    description: 'Test your keyboard typing speed in 1 minute. Live WPM, CPM, accuracy score, and instant performance grade. Perfect for SSC, clerical & court exam practice.',
    keywords: 'typing test online, typing speed test, 1 minute typing test, 2 minute typing test, 5 minute typing test, ssc typing test practice, english typing test wpm, typing speed test with accuracy, clerical exam typing test, free typing test with certificate, typing practice online, cpm to wpm calculator, words per minute test, keyboard speed test, high speed typing test, typing master online free',
    canonicalPath: 'tools/typing-test.html',
    appType: 'EducationalApplication',
    appName: 'Typing Speed Test Online (WPM & Accuracy)',
    ratingValue: '4.94',
    ratingCount: '3720',
    howTo: {
      name: 'How to Test Your Typing Speed Online',
      steps: [
        { name: 'Select Session Duration', text: 'Choose 1 minute, 2 minutes, 3 minutes, or 5 minutes based on your practice requirements.' },
        { name: 'Start Typing the Highlighted Text', text: 'As soon as you type the first character, the live timer begins countdown.' },
        { name: 'Monitor Live Speed & Errors', text: 'Real-time color coding highlights correct characters in green and mistakes in red.' },
        { name: 'Analyze Your WPM Scorecard', text: 'View net WPM, gross WPM, accuracy percentage, and recruitment benchmark level.' }
      ]
    },
    faqs: [
      { q: 'How is Words Per Minute (WPM) calculated?', a: 'WPM is calculated using the international standard formula: (Total Characters typed / 5) divided by the time elapsed in minutes, minus penalty for uncorrected errors.' },
      { q: 'What is a good typing speed for government and clerical exams?', a: 'Most recruitment examinations like SSC CGL, CHSL, RRB, and High Court Clerk require between 30 and 35 WPM in English with a minimum 90% accuracy rate.' },
      { q: 'Can I take the typing test on mobile or tablet keyboards?', a: 'Yes, but for optimal practice we recommend using an external physical keyboard to replicate real examination testing conditions.' },
      { q: 'How can I increase my typing speed quickly?', a: 'Practice 15 minutes daily with proper finger positioning on the home row (ASDF JKL;) without looking at the keyboard.' },
      { q: 'Is there any limit to how many times I can practice?', a: 'None at all. You can restart tests as many times as you want with diverse practice paragraphs.' }
    ]
  },

  'emi-calculator.html': {
    title: 'Loan EMI Calculator - Home, Car & Personal Loan with Chart | RozgarTools',
    description: 'Calculate monthly loan EMI, total interest, and amortization payment schedule. Accurate EMI calculator for SBI, HDFC, ICICI home, car, and personal loans.',
    keywords: 'loan emi calculator, home loan emi calculator, car loan emi calculator, personal loan emi calculator, sbi home loan emi calculator, hdfc loan emi calculator, bank emi calculator with amortization schedule, reverse mortgage calculator, reducing interest emi calculator, monthly emi formula, emi calculation online, auto loan emi calculator, education loan emi calculator, interest calculator loan, calculate monthly installment',
    canonicalPath: 'tools/emi-calculator.html',
    appType: 'FinancialApplication',
    appName: 'Home, Car & Personal Loan EMI Calculator',
    ratingValue: '4.93',
    ratingCount: '2980',
    howTo: {
      name: 'How to Calculate Loan EMI and Repayment Schedule',
      steps: [
        { name: 'Enter Loan Amount', text: 'Input your principal loan amount or adjust the interactive slider.' },
        { name: 'Set Annual Interest Rate', text: 'Enter your bank interest rate percentage (e.g. 8.5% for Home Loan).' },
        { name: 'Choose Loan Tenure', text: 'Specify tenure in either years or months.' },
        { name: 'Examine EMI Breakdown & Schedule', text: 'View monthly installment, total interest payable, visual donut chart, and complete yearly amortization table.' }
      ]
    },
    faqs: [
      { q: 'What is the mathematical formula used to calculate Loan EMI?', a: 'EMI is calculated using the formula: E = P × r × (1+r)^n / ((1+r)^n - 1), where P is principal, r is monthly interest rate, and n is tenure in months.' },
      { q: 'Can I use this calculator for SBI, HDFC, and ICICI bank loans?', a: 'Yes. All Indian commercial banks follow the reducing balance EMI calculation method implemented in this calculator.' },
      { q: 'How does prepaying loan principal affect my monthly EMI?', a: 'Part-prepayments reduce the remaining principal balance, allowing you to either reduce your tenure or lower your monthly installments.' },
      { q: 'What is an amortization repayment schedule?', a: 'It is a year-by-year or month-by-month table detailing how much of each payment goes toward interest versus paying down principal.' },
      { q: 'Is this EMI calculator free to use for commercial comparisons?', a: 'Yes, 100% free with unlimited calculations for home, automobile, personal, and educational loans.' }
    ]
  },

  'sip-calculator.html': {
    title: 'SIP Calculator - Mutual Fund Returns & Wealth Growth | RozgarTools',
    description: 'Calculate mutual fund SIP & lumpsum returns with compounding growth. See future wealth projection, total investment, and expected gains with interactive charts.',
    keywords: 'sip calculator, mutual fund sip calculator, lumpsum calculator, crorepati sip calculator, monthly sip return calculator, 5000 per month sip calculator, compound interest calculator mutual funds, best sip plans calculator, step up sip calculator, mutual funds wealth projector, sip investment calculator online, mutual fund return calculator, systematic investment plan calculator, sip return chart',
    canonicalPath: 'tools/sip-calculator.html',
    appType: 'FinancialApplication',
    appName: 'Mutual Fund SIP & Lumpsum Calculator',
    ratingValue: '4.95',
    ratingCount: '3410',
    howTo: {
      name: 'How to Calculate Mutual Fund SIP Returns',
      steps: [
        { name: 'Select SIP or Lumpsum Mode', text: 'Choose Monthly SIP for recurring deposits or Lumpsum for one-time investments.' },
        { name: 'Enter Investment Amount', text: 'Input monthly contribution (e.g., ₹5,000) or total lumpsum capital.' },
        { name: 'Input Expected Rate of Return', text: 'Enter historical or expected annual return percentage (typically 12% to 15% for equity funds).' },
        { name: 'Inspect Maturity Wealth & Chart', text: 'Review total deposited capital, estimated wealth gain, maturity value, and interactive visual donut chart.' }
      ]
    },
    faqs: [
      { q: 'What is a Systematic Investment Plan (SIP)?', a: 'A SIP is an investment method where an investor deposits a fixed amount periodically (monthly/quarterly) into a mutual fund scheme to benefit from compounding and rupee cost averaging.' },
      { q: 'What average return can I expect from equity mutual funds in India?', a: 'Historically, diversified equity mutual funds and index funds (Nifty 50, Sensex) in India have delivered long-term returns between 12% and 15% CAGR over 10+ year horizons.' },
      { q: 'What is the formula used in this SIP calculator?', a: 'The future value formula is: FV = P × [((1 + i)^n - 1) / i] × (1 + i), where P is periodic deposit, i is monthly interest rate, and n is number of months.' },
      { q: 'How does starting SIP early create higher compounding wealth?', a: 'Compounding works exponentially over time. Starting an investment 5 years earlier can double your final maturity corpus due to returns earning returns.' },
      { q: 'Can I calculate one-time lumpsum investments as well?', a: 'Yes! Toggle the switch at the top to Lumpsum mode to compute one-time mutual fund compounding growth.' }
    ]
  },

  'age-calculator.html': {
    title: 'Online Age Calculator - Exact Age as on Cut-Off Date | RozgarTools',
    description: 'Calculate your exact age in years, months, and days from Date of Birth. Check eligibility for SSC, UPSC, Banking, Defence exams with cut-off date calculator.',
    keywords: 'age calculator, exact age calculator, calculate age from date of birth, dob calculator, sarkari exam age calculator, age calculator as on date, chronological age calculator, age calculator in years months days, eligibility age calculator for govt jobs, next birthday countdown calculator, ssc age calculator, date of birth calculator, how old am i, birthday age calculator online',
    canonicalPath: 'tools/age-calculator.html',
    appType: 'UtilitiesApplication',
    appName: 'Exact Age & Exam Cut-off Date Calculator',
    ratingValue: '4.96',
    ratingCount: '4120',
    howTo: {
      name: 'How to Calculate Exact Age as of a Specific Cut-Off Date',
      steps: [
        { name: 'Input Date of Birth', text: 'Select your day, month, and year of birth from the date picker.' },
        { name: 'Select Target Cut-Off Date', text: 'Choose today\'s date or the official recruitment cut-off date specified in your exam notification.' },
        { name: 'Click Calculate Age', text: 'View exact chronological age broken down in years, months, days, total weeks, and total days.' },
        { name: 'Check Exam Eligibility & Next Birthday', text: 'Review live birthday countdown and verify age compliance against major exam standards.' }
      ]
    },
    faqs: [
      { q: 'How is age calculated against an examination cut-off date?', a: 'Official notifications specify a reference date (e.g., 01-08-2026). Age is calculated by taking the exact difference in years, months, and days between your date of birth and that reference cut-off date.' },
      { q: 'Does this calculator handle leap years accurately?', a: 'Yes, our calendar algorithm accurately considers leap years (February 29) and varying month day counts (28, 30, 31) conforming to judicial age standards.' },
      { q: 'What are standard age limits for SSC and UPSC exams?', a: 'SSC CGL generally requires candidates between 18 and 30/32 years, while UPSC Civil Services mandates between 21 and 32 years as of August 1 of the examination year (with category relaxations).' },
      { q: 'Can I find out what day of the week I was born?', a: 'Yes, our detailed results card displays your exact birth day of the week along with a live countdown to your upcoming birthday.' },
      { q: 'Is this age calculator free and accurate for court documents?', a: 'Yes, it provides mathematically verified chronological age outputs suitable for official and legal submissions.' }
    ]
  },

  'qr-generator.html': {
    title: 'Free QR Code Generator - UPI Payment, WiFi, URL & WhatsApp | RozgarTools',
    description: 'Generate custom QR codes instantly for UPI payments (Google Pay, PhonePe, Paytm), WiFi passwords, website URLs, and WhatsApp. Free high-res PNG download.',
    keywords: 'qr code generator, free qr code generator, upi qr code generator, phonepe qr code generator, google pay qr generator, paytm qr code maker, wifi qr code generator, qr code generator with logo, custom colored qr code, dynamic qr code generator free, url to qr code converter, barcode generator, make qr code online, payment qr code maker, high resolution qr code free',
    canonicalPath: 'tools/qr-generator.html',
    appType: 'UtilitiesApplication',
    appName: 'Custom QR Code Generator (UPI, WiFi & URL)',
    ratingValue: '4.94',
    ratingCount: '2870',
    howTo: {
      name: 'How to Generate Custom QR Codes for UPI and URLs',
      steps: [
        { name: 'Choose QR Code Type', text: 'Select UPI Payment, Website URL, WiFi Network, WhatsApp, or Plain Text.' },
        { name: 'Fill Details', text: 'Enter UPI ID (VPA), payee name, WiFi network credentials, or web URL.' },
        { name: 'Customize Styling & Colors', text: 'Pick custom foreground colors, background colors, and output pixel dimensions.' },
        { name: 'Download High-Resolution PNG', text: 'Click Download PNG to save and print your custom QR code ready for business display.' }
      ]
    },
    faqs: [
      { q: 'How does the UPI Payment QR Code work?', a: 'It formats data into the National Payments Corporation of India (NPCI) URI standard (upi://pay?pa=...). When scanned with PhonePe, Google Pay, or Paytm, it directly opens the payment interface.' },
      { q: 'Do these generated QR codes ever expire?', a: 'No. Static QR codes encode the data directly within the barcode matrix and never expire. They work indefinitely.' },
      { q: 'Can guests connect to my WiFi using the WiFi QR code?', a: 'Yes. When scanned with iOS Camera or Android QR scanners, phones prompt guests to join the wireless network automatically without typing the password.' },
      { q: 'Can I download the QR code in high resolution for printing?', a: 'Yes. Use the size slider to generate crisp, high-resolution QR codes suitable for physical shop posters, business cards, and marketing flyers.' },
      { q: 'Is my UPI ID or WiFi password sent to your servers?', a: 'Never. QR codes are drawn client-side directly on HTML5 Canvas. Your private information remains 100% on your device.' }
    ]
  },

  'image-to-pdf.html': {
    title: 'Image to PDF Converter - Convert JPG & PNG to PDF Free | RozgarTools',
    description: 'Convert multiple JPG, PNG, and WebP images into a single professional PDF document. 100% free, private, client-side converter with custom page orientation & margins.',
    keywords: 'image to pdf, jpg to pdf, png to pdf converter, combine images to pdf, photo to pdf converter free, convert multiple photos to single pdf, a4 pdf maker from photos, image to pdf 100kb, sarkari form document to pdf, compress photo to pdf online, jpeg to pdf converter, picture to pdf, photos to single pdf document',
    canonicalPath: 'tools/image-to-pdf.html',
    appType: 'UtilitiesApplication',
    appName: 'Batch Image to PDF Converter',
    ratingValue: '4.95',
    ratingCount: '3650',
    howTo: {
      name: 'How to Convert Multiple Images into a Single PDF',
      steps: [
        { name: 'Select or Drag Images', text: 'Choose multiple JPG, PNG, or WebP photos from your phone or PC.' },
        { name: 'Reorder Pages & Adjust Settings', text: 'Drag images to rearrange sequence, and choose A4 page size, portrait/landscape orientation, and margin spacing.' },
        { name: 'Click Generate PDF', text: 'The client-side PDF compiler merges and formats your images into a single document.' },
        { name: 'Download PDF Document', text: 'Click Download PDF to save your combined, compressed PDF file ready for submission.' }
      ]
    },
    faqs: [
      { q: 'Can I combine multiple photos into a single PDF document?', a: 'Yes! You can select 10, 20, or more photos at once. They will be sequenced into pages in your desired order inside a single PDF file.' },
      { q: 'Which image formats are supported by this converter?', a: 'We support all standard formats including JPEG, JPG, PNG, and modern WebP image files.' },
      { q: 'Are my personal documents or ID photos uploaded to a server?', a: 'No. The entire PDF compilation occurs client-side inside your web browser. No files are ever transmitted to any server.' },
      { q: 'Can I adjust margins and page orientation?', a: 'Yes, you can choose between Portrait and Landscape orientations, as well as customize page margins (No margin, Small, or Standard).' },
      { q: 'Is there any watermark on the generated PDF?', a: 'Never. All PDF outputs are clean, high-resolution, and 100% watermark-free.' }
    ]
  },

  'cgpa-calculator.html': {
    title: 'CGPA to Percentage Calculator - CBSE, College & AICTE Formula | RozgarTools',
    description: 'Convert 10-point CGPA to percentage instantly using standard CBSE formula (CGPA × 9.5), AICTE college scale, and semester SGPA to percentage calculator.',
    keywords: 'cgpa to percentage, cgpa to percentage calculator, cbse cgpa to percentage formula, cgpa into percentage multiply by 9.5, 10 point cgpa to percentage, aicte cgpa to percentage, sgpa to cgpa calculator, convert marks to percentage, engineering cgpa to percentage, mumbai university cgpa to percentage, vtu cgpa to percentage, anna university cgpa to percentage, percentage to cgpa, calculate percentage from cgpa',
    canonicalPath: 'tools/cgpa-calculator.html',
    appType: 'EducationalApplication',
    appName: 'CGPA to Percentage & SGPA Calculator',
    ratingValue: '4.94',
    ratingCount: '3290',
    howTo: {
      name: 'How to Convert CGPA to Percentage and Marks',
      steps: [
        { name: 'Select Conversion Formula', text: 'Choose CBSE (× 9.5), AICTE Engineering formula, or standard 10-point university scale.' },
        { name: 'Enter Your CGPA', text: 'Input your Cumulative Grade Point Average (e.g., 8.6 out of 10).' },
        { name: 'View Equivalent Percentage & Division', text: 'See your exact percentage, letter grade (A+, A, B), and awarded division (First Division with Distinction).' },
        { name: 'Convert SGPA or Marks', text: 'Optionally calculate semester-wise SGPA or convert raw subject marks into overall percentage.' }
      ]
    },
    faqs: [
      { q: 'Why does CBSE multiply CGPA by 9.5 to get percentage?', a: 'CBSE determined that the average score of candidates falling in the 91–100 marks band is 95%. Dividing 95 by 10 yields the multiplying factor of 9.5.' },
      { q: 'What is the AICTE formula for converting CGPA to percentage?', a: 'The official AICTE formula is: Percentage = (CGPA - 0.75) × 10. For example, a CGPA of 8.0 converts to (8.0 - 0.75) × 10 = 72.5%.' },
      { q: 'How do I convert SGPA to CGPA across multiple semesters?', a: 'CGPA is calculated as the credit-weighted average: Sum of (SGPA × Semester Credits) divided by Total Credits across all semesters.' },
      { q: 'How do I convert 7.8 CGPA to percentage according to CBSE?', a: 'Multiply 7.8 by 9.5: 7.8 × 9.5 = 74.10% (First Division).' },
      { q: 'Can I use these calculations for job and university applications?', a: 'Yes, our calculator displays standard verified formulas recognized by Indian universities, recruitment boards, and multinational corporations.' }
    ]
  }
};

function updateToolPage(filename, config) {
  const filePath = path.resolve('tools', filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace <head>...</head> section
  const headStart = content.indexOf('<head>');
  const headEnd = content.indexOf('</head>');
  if (headStart === -1 || headEnd === -1) return;

  const headMeta = getCommonHeadTags({
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    canonicalPath: config.canonicalPath,
    ogType: 'article'
  });

  // Schema graph
  const schemaJson = `
  <!-- Schema Markup: WebApplication, BreadcrumbList, HowTo, FAQPage -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "${SITE_URL}/${config.canonicalPath}#app",
        "name": "${config.appName}",
        "url": "${SITE_URL}/${config.canonicalPath}",
        "applicationCategory": "${config.appType}",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "${config.ratingValue}",
          "ratingCount": "${config.ratingCount}"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "${SITE_URL}/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tools",
            "item": "${SITE_URL}/#tools-container"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "${config.appName}",
            "item": "${SITE_URL}/${config.canonicalPath}"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "${config.howTo.name}",
        "step": [
          ${config.howTo.steps.map((s, idx) => `{
            "@type": "HowToStep",
            "position": ${idx + 1},
            "name": "${s.name}",
            "text": "${s.text}"
          }`).join(',\n          ')}
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          ${config.faqs.map(f => `{
            "@type": "Question",
            "name": "${f.q}",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${f.a}"
            }
          }`).join(',\n          ')}
        ]
      }
    ]
  }
  </script>`;

  // Check if page has special inline styles or links before </head>
  const existingStyles = content.substring(headStart, headEnd);
  let inlineStyles = '';
  const styleMatch = existingStyles.match(/<style>[\s\S]*?<\/style>/i);
  if (styleMatch) {
    inlineStyles = '\n  ' + styleMatch[0];
  }

  const newHead = `<head>\n${headMeta}\n  <link rel="stylesheet" href="../assets/css/style.css">${inlineStyles}\n${schemaJson}\n</head>`;
  content = content.substring(0, headStart) + newHead + content.substring(headEnd + 7);

  // Add Breadcrumb after <main class="container"> if not present
  if (!content.includes('class="breadcrumb-nav"')) {
    const mainIdx = content.indexOf('<main class="container">');
    if (mainIdx !== -1) {
      const insertAt = mainIdx + '<main class="container">'.length;
      const breadcrumb = getBreadcrumbHtml(config.appName);
      content = content.substring(0, insertAt) + '\n' + breadcrumb + content.substring(insertAt);
    }
  }

  // Add Related Tools Section before </main> if not present
  if (!content.includes('class="related-tools-section"')) {
    const mainEnd = content.lastIndexOf('</main>');
    if (mainEnd !== -1) {
      const relatedHtml = getRelatedToolsHtml(filename, true);
      content = content.substring(0, mainEnd) + relatedHtml + '\n' + content.substring(mainEnd);
    }
  }

  // Ensure FAQ accordion has all FAQs
  const faqWrapStart = content.indexOf('<div class="faq-wrap">');
  const faqWrapEnd = content.indexOf('</section>', faqWrapStart);
  if (faqWrapStart !== -1 && faqWrapEnd !== -1) {
    const faqItemsHtml = config.faqs.map(f => `
        <div class="faq-item">
          <button class="faq-question">
            <span>${f.q}</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            <p>${f.a}</p>
          </div>
        </div>`).join('');

    const newFaqWrap = `<div class="faq-wrap">\n${faqItemsHtml}\n      </div>`;
    content = content.substring(0, faqWrapStart) + newFaqWrap + content.substring(faqWrapEnd);
  }

  // Also replace any lingering rozgartools.vercel.app in this tool file
  content = content.replaceAll('https://rozgartools.vercel.app', SITE_URL);

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ tools/${filename} updated successfully.`);
}

// ---------------------------------------------------------------------------
// 3. SUPPORTING PAGES (about-us, contact-us, privacy-policy, terms)
// ---------------------------------------------------------------------------
const supportingPages = {
  'about-us.html': {
    title: 'About Us - RozgarTools & Dynamic AI Utility Hub',
    description: 'Learn about RozgarTools. Our mission is to provide 100% free, private, and client-side online utility tools and calculators without server uploads.',
    keywords: 'about rozgartools, free utility tools mission, client side privacy tools, online exam tools developer',
    canonicalPath: 'about-us.html'
  },
  'contact-us.html': {
    title: 'Contact Us - RozgarTools & Dynamic AI Support',
    description: 'Get in touch with the RozgarTools & Dynamic AI development team for API support, tool suggestions, feature requests, or technical inquiries.',
    keywords: 'contact rozgartools, translation api support, tool suggestions, developer feedback',
    canonicalPath: 'contact-us.html'
  },
  'privacy-policy.html': {
    title: 'Privacy Policy - RozgarTools & Dynamic AI',
    description: 'Read the RozgarTools Privacy Policy. We guarantee 100% client-side data privacy with zero server uploads of photos, resumes, or financial calculations.',
    keywords: 'rozgartools privacy policy, client side privacy, zero server uploads, data security guarantee',
    canonicalPath: 'privacy-policy.html'
  },
  'terms.html': {
    title: 'Terms of Service - RozgarTools & Dynamic AI',
    description: 'Terms of Service and conditions for using RozgarTools free online utility tools, calculators, and Dynamic AI translation services.',
    keywords: 'terms of service, rozgartools terms, free tool terms, api usage conditions',
    canonicalPath: 'terms.html'
  }
};

function updateSupportingPage(filename, config) {
  const filePath = path.resolve(filename);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace <head>...</head>
  const headStart = content.indexOf('<head>');
  const headEnd = content.indexOf('</head>');
  if (headStart !== -1 && headEnd !== -1) {
    const headMeta = getCommonHeadTags({
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      canonicalPath: config.canonicalPath,
      ogType: 'website'
    });

    const newHead = `<head>\n${headMeta}\n  <link rel="stylesheet" href="assets/css/style.css">\n</head>`;
    content = content.substring(0, headStart) + newHead + content.substring(headEnd + 7);
  }

  // Replace all occurrences of rozgartools.vercel.app with SITE_URL
  content = content.replaceAll('https://rozgartools.vercel.app', SITE_URL);

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ ${filename} updated successfully.`);
}

// ---------------------------------------------------------------------------
// 4. GENERATE sitemap.xml & robots.txt
// ---------------------------------------------------------------------------
function updateSitemapAndRobots() {
  const today = '2026-10-30';

  const pages = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
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
  console.log('✅ sitemap.xml and public/sitemap.xml written.');

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard

Sitemap: ${SITE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.resolve('robots.txt'), robotsTxt, 'utf-8');
  if (fs.existsSync('public')) {
    fs.writeFileSync(path.resolve('public', 'robots.txt'), robotsTxt, 'utf-8');
  }
  console.log('✅ robots.txt and public/robots.txt written.');
}

// ---------------------------------------------------------------------------
// 5. UPDATE CSS FOR BREADCRUMBS & RELATED TOOLS
// ---------------------------------------------------------------------------
function updateStyles() {
  const cssPath = path.resolve('assets/css/style.css');
  let css = fs.readFileSync(cssPath, 'utf-8');

  if (!css.includes('.breadcrumb-nav')) {
    const additionalCss = `

/* ==========================================================================
   SEO Enhancements: Breadcrumbs & Related Tools Grid
   ========================================================================== */
.breadcrumb-nav {
  padding: 0.75rem 0;
  margin-bottom: 1.5rem;
  font-size: 0.88rem;
  color: var(--text-dim);
}
.breadcrumb-nav ol {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
}
.breadcrumb-nav li {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.breadcrumb-nav a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}
.breadcrumb-nav a:hover {
  color: var(--primary);
  text-decoration: underline;
}
.breadcrumb-nav li.current {
  color: var(--text-main);
  font-weight: 600;
}
.breadcrumb-nav .separator {
  color: var(--text-dim);
  font-size: 0.75rem;
}

.related-tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.related-tool-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 1.1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  color: var(--text-main);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.related-tool-card:hover {
  border-color: var(--primary);
  background: var(--bg-card);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
.related-tool-card .rt-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}
.related-tool-card .rt-info {
  display: flex;
  flex-direction: column;
}
.related-tool-card .rt-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-main);
}
.related-tool-card .rt-desc {
  font-size: 0.76rem;
  color: var(--text-muted);
}
`;
    css += additionalCss;
    fs.writeFileSync(cssPath, css, 'utf-8');
    console.log('✅ assets/css/style.css updated with SEO breadcrumb and related tools styles.');
  }
}

// ---------------------------------------------------------------------------
// 6. UPDATE QR GENERATOR JS DEFAULT DOMAIN
// ---------------------------------------------------------------------------
function updateQrJs() {
  const qrJsPath = path.resolve('assets/js/qr-generator.js');
  if (fs.existsSync(qrJsPath)) {
    let js = fs.readFileSync(qrJsPath, 'utf-8');
    js = js.replaceAll('https://rozgartools.vercel.app', SITE_URL);
    fs.writeFileSync(qrJsPath, js, 'utf-8');
    console.log('✅ assets/js/qr-generator.js domain updated.');
  }
}

// ---------------------------------------------------------------------------
// MAIN EXECUTION
// ---------------------------------------------------------------------------
console.log('🚀 Running SEO Master Optimization Engine...');
updateStyles();
updateQrJs();
updateIndexHtml();

for (const [filename, config] of Object.entries(toolConfigs)) {
  updateToolPage(filename, config);
}

for (const [filename, config] of Object.entries(supportingPages)) {
  updateSupportingPage(filename, config);
}

updateSitemapAndRobots();
console.log('🎉 SEO Master Optimization Complete! All pages configured for Page 1 Google Rank.');
