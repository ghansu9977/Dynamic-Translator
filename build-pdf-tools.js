import fs from 'fs';
import path from 'path';

const pdfTools = [
  {
    file: 'merge-pdf.html',
    jsFile: 'merge-pdf.js',
    title: 'Merge PDF Online - Combine Multiple PDF Files Free',
    metaDesc: 'Merge multiple PDF files into one single document online for free. 100% private, client-side processing, no file limits, and instant download.',
    heading: 'Merge Multiple <span class="highlight">PDF Files</span> Online',
    subtitle: 'Combine PDFs in the exact order you want. Fast, secure, and 100% free with zero file uploads to servers.',
    dropzoneId: 'merge-dropzone',
    inputId: 'merge-file-input',
    browseId: 'merge-browse-btn',
    multiple: true,
    accept: '.pdf,application/pdf',
    dropIcon: '📑',
    dropTitle: 'Drag & Drop PDF files here',
    dropDesc: 'or click to browse multiple PDFs from your device',
    extraLibraries: ['https://unpkg.com/pdf-lib@1.17.9/dist/pdf-lib.min.js'],
    mainUi: `
      <!-- Uploaded Files & Reorder Area -->
      <div id="merge-action-card" class="glass-card" style="display: none; margin-top: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem;">
          <div>
            <h3 style="font-size: 1.15rem;">Selected Documents (<span id="merge-count-badge">0</span>)</h3>
            <span style="font-size: 0.8rem; color: var(--text-dim);">Total size: <span id="merge-total-size">0 B</span></span>
          </div>
          <button id="clear-merge-files-btn" class="btn btn-sm btn-secondary">Clear All</button>
        </div>
        <div class="pdf-files-list" id="merge-files-list"></div>
        <div style="margin-top: 1.5rem; text-align: center;">
          <button id="start-merge-btn" class="btn btn-lg btn-primary" style="width: 100%; max-width: 400px;">
            <span>⚡</span> Merge PDFs Now
          </button>
          <div id="merge-status-msg" style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--accent-emerald);"></div>
        </div>
      </div>
    `,
    faq: [
      { q: 'Is it safe to merge confidential documents here?', a: 'Yes! All merging is done locally in your browser using WebAssembly and JavaScript (pdf-lib). Your files are never sent over the internet or uploaded to any server.' },
      { q: 'How many PDF files can I merge?', a: 'You can merge as many files as your computer memory supports. There is no artificial file limit.' },
      { q: 'Can I change the order of pages/files before merging?', a: 'Yes, simply click the ↑ and ↓ arrows on each file card to arrange them in the exact order you desire.' }
    ]
  },
  {
    file: 'split-pdf.html',
    jsFile: 'split-pdf.js',
    title: 'Split PDF Online - Extract Pages from PDF Free',
    metaDesc: 'Split a PDF into separate files or extract specific page ranges for free. Private, browser-side processing, superfast and easy to use.',
    heading: 'Split PDF & <span class="highlight">Extract Pages</span> Online',
    subtitle: 'Separate one page or a whole range for easy conversion into independent PDF files.',
    dropzoneId: 'split-dropzone',
    inputId: 'split-file-input',
    browseId: 'split-browse-btn',
    multiple: false,
    accept: '.pdf,application/pdf',
    dropIcon: '✂️',
    dropTitle: 'Drag & Drop a PDF file here',
    dropDesc: 'or click to browse a PDF from your computer',
    extraLibraries: [
      'https://unpkg.com/pdf-lib@1.17.9/dist/pdf-lib.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
    ],
    mainUi: `
      <div id="split-settings-card" class="glass-card" style="display: none; margin-top: 2rem;">
        <div style="border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <h3 id="split-file-title" style="font-size: 1.2rem; margin-bottom: 0.25rem;">document.pdf</h3>
          <span id="split-file-meta" style="font-size: 0.85rem; color: var(--text-dim);">0 Pages • 0 MB</span>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label class="input-label">Choose Splitting Mode:</label>
          <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="radio" name="split-mode" value="range" checked> Extract Custom Range
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="radio" name="split-mode" value="all_pages"> Split Every Page into ZIP
            </label>
          </div>
        </div>

        <div id="split-range-box" style="margin-bottom: 1.75rem;">
          <label class="input-label" for="split-range-input">Enter Page Range or Numbers:</label>
          <input type="text" id="split-range-input" class="form-input" placeholder="e.g. 1-3, 5, 8-10" value="">
          <span style="font-size: 0.8rem; color: var(--text-dim); margin-top: 0.35rem; display: block;">
            Example: "1-5" extracts first 5 pages. "1, 3, 5" extracts only specific pages.
          </span>
        </div>

        <button id="start-split-btn" class="btn btn-lg btn-primary" style="width: 100%; max-width: 360px;">
          <span>✂️</span> Split PDF Now
        </button>
        <div id="split-status-msg" style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--accent-emerald);"></div>
      </div>
    `,
    faq: [
      { q: 'How does client-side PDF splitting work?', a: 'Your browser uses pdf-lib to read the PDF binary directly on your machine, extracts only the selected pages into a new clean document, and triggers instant download.' },
      { q: 'Can I extract non-consecutive pages?', a: 'Yes! You can enter comma-separated numbers like "1, 4, 7-10" to extract whichever pages you need.' }
    ]
  },
  {
    file: 'pdf-to-jpg.html',
    jsFile: 'pdf-to-jpg.js',
    title: 'PDF to JPG Converter - Convert PDF Pages to Images Free',
    metaDesc: 'Convert PDF document pages into high quality JPG or PNG images online. Free, fast, private, and download pages individually or as a single ZIP.',
    heading: 'Convert PDF to <span class="highlight">JPG & PNG</span> Images',
    subtitle: 'Extract every page of your PDF into high-definition images with 1-click batch download.',
    dropzoneId: 'pdf-to-jpg-dropzone',
    inputId: 'pdf-to-jpg-file-input',
    browseId: 'pdf-to-jpg-browse-btn',
    multiple: false,
    accept: '.pdf,application/pdf',
    dropIcon: '🖼️',
    dropTitle: 'Drag & Drop a PDF to convert',
    dropDesc: 'or click to browse from your device',
    extraLibraries: [
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
    ],
    mainUi: `
      <div id="pdf-pages-preview-card" class="glass-card" style="display: none; margin-top: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <div>
            <h3 id="pdf-to-jpg-title" style="font-size: 1.2rem;">document.pdf</h3>
            <span id="pdf-to-jpg-meta" style="font-size: 0.85rem; color: var(--text-dim);">0 Pages</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <select id="img-format-select" class="form-input" style="width: auto; padding: 0.4rem 0.85rem;">
              <option value="jpeg">JPG (Standard)</option>
              <option value="png">PNG (Lossless)</option>
            </select>
            <select id="img-quality-select" class="form-input" style="width: auto; padding: 0.4rem 0.85rem;">
              <option value="0.95">High Quality</option>
              <option value="0.8">Standard</option>
            </select>
            <button id="download-all-images-btn" class="btn btn-primary">
              <span>📦</span> Download All Pages as ZIP
            </button>
          </div>
        </div>

        <div id="pdf-to-jpg-status" style="margin-bottom: 1rem; font-size: 0.9rem; color: var(--accent-emerald);"></div>
        <div id="pdf-pages-grid" class="pdf-pages-grid"></div>
      </div>
    `,
    faq: [
      { q: 'What is the image resolution of the converted pages?', a: 'Pages are rendered at high-DPI 2x Retina scale (approx 150-200 DPI) ensuring crisp text and crystal clear graphics.' },
      { q: 'Can I download individual pages?', a: 'Yes, each page has its own "Download" button, or you can click "Download All Pages as ZIP" to get all images at once.' }
    ]
  },
  {
    file: 'rotate-pdf.html',
    jsFile: 'rotate-pdf.js',
    title: 'Rotate PDF Online - Permanently Rotate PDF Pages Free',
    metaDesc: 'Rotate PDF pages 90, 180, or 270 degrees clockwise and save permanently. Free, client-side, fast and secure.',
    heading: 'Rotate <span class="highlight">PDF Pages</span> Online',
    subtitle: 'Fix upside-down or sideways PDF scans permanently in seconds right in your browser.',
    dropzoneId: 'rotate-dropzone',
    inputId: 'rotate-file-input',
    browseId: 'rotate-browse-btn',
    multiple: false,
    accept: '.pdf,application/pdf',
    dropIcon: '🔄',
    dropTitle: 'Drag & Drop a PDF to rotate',
    dropDesc: 'or click to browse from your device',
    extraLibraries: ['https://unpkg.com/pdf-lib@1.17.9/dist/pdf-lib.min.js'],
    mainUi: `
      <div id="rotate-settings-card" class="glass-card" style="display: none; margin-top: 2rem;">
        <div style="border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <h3 id="rotate-file-title" style="font-size: 1.2rem;">document.pdf</h3>
          <span id="rotate-file-meta" style="font-size: 0.85rem; color: var(--text-dim);">0 Pages</span>
        </div>

        <div style="margin-bottom: 2rem; text-align: center;">
          <label class="input-label" style="margin-bottom: 1rem;">Choose Rotation Angle:</label>
          <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <button id="rotate-all-left-btn" class="btn btn-secondary">
              <span>↺</span> Rotate Left (-90°)
            </button>
            <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary); min-width: 80px;" id="current-rotation-angle">0°</div>
            <button id="rotate-all-right-btn" class="btn btn-secondary">
              <span>↻</span> Rotate Right (+90°)
            </button>
          </div>
        </div>

        <div style="text-align: center;">
          <button id="save-rotated-pdf-btn" class="btn btn-lg btn-primary" style="width: 100%; max-width: 360px;">
            <span>💾</span> Download Rotated PDF
          </button>
          <div id="rotate-status-msg" style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--accent-emerald);"></div>
        </div>
      </div>
    `,
    faq: [
      { q: 'Will the rotation be saved permanently?', a: 'Yes! The rotation metadata is saved into the PDF file structure so it opens correctly in Adobe Reader, Chrome, and any PDF viewer.' }
    ]
  },
  {
    file: 'pdf-watermark.html',
    jsFile: 'pdf-watermark.js',
    title: 'Watermark PDF Online - Add Text Watermark to PDF Free',
    metaDesc: 'Add customizable text watermarks to your PDF documents. Set opacity, position, font size, and color for privacy and copyright protection.',
    heading: 'Add <span class="highlight">Watermark to PDF</span> Online',
    subtitle: 'Stamp custom text like "CONFIDENTIAL", "DRAFT", or your company brand across all pages.',
    dropzoneId: 'watermark-dropzone',
    inputId: 'watermark-file-input',
    browseId: 'watermark-browse-btn',
    multiple: false,
    accept: '.pdf,application/pdf',
    dropIcon: '🌊',
    dropTitle: 'Drag & Drop a PDF to watermark',
    dropDesc: 'or click to browse from your device',
    extraLibraries: ['https://unpkg.com/pdf-lib@1.17.9/dist/pdf-lib.min.js'],
    mainUi: `
      <div id="watermark-settings-card" class="glass-card" style="display: none; margin-top: 2rem;">
        <div style="border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <h3 id="watermark-file-title" style="font-size: 1.2rem;">document.pdf</h3>
          <span id="watermark-file-meta" style="font-size: 0.85rem; color: var(--text-dim);">0 Pages</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.75rem;">
          <div>
            <label class="input-label" for="watermark-text-input">Watermark Text:</label>
            <input type="text" id="watermark-text-input" class="form-input" placeholder="e.g. CONFIDENTIAL" value="CONFIDENTIAL">
          </div>
          <div>
            <label class="input-label" for="watermark-position">Orientation / Position:</label>
            <select id="watermark-position" class="form-input">
              <option value="diagonal" selected>Diagonal (45° Center)</option>
              <option value="horizontal">Horizontal Center</option>
            </select>
          </div>
          <div>
            <label class="input-label" for="watermark-color">Color:</label>
            <select id="watermark-color" class="form-input">
              <option value="red" selected>Red Stamp</option>
              <option value="grey">Subtle Grey</option>
              <option value="blue">Blue</option>
              <option value="black">Black</option>
            </select>
          </div>
          <div>
            <label class="input-label" for="watermark-opacity">Opacity / Transparency:</label>
            <select id="watermark-opacity" class="form-input">
              <option value="0.15">15% (Very Light)</option>
              <option value="0.25" selected>25% (Recommended)</option>
              <option value="0.5">50% (Prominent)</option>
              <option value="0.8">80% (Solid)</option>
            </select>
          </div>
          <div>
            <label class="input-label" for="watermark-font-size">Font Size:</label>
            <select id="watermark-font-size" class="form-input">
              <option value="32">Small (32pt)</option>
              <option value="48" selected>Medium (48pt)</option>
              <option value="64">Large (64pt)</option>
            </select>
          </div>
        </div>

        <div style="text-align: center;">
          <button id="apply-watermark-btn" class="btn btn-lg btn-primary" style="width: 100%; max-width: 380px;">
            <span>🌊</span> Apply & Download Watermarked PDF
          </button>
          <div id="watermark-status-msg" style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--accent-emerald);"></div>
        </div>
      </div>
    `,
    faq: [
      { q: 'Will the watermark cover the underlying text?', a: 'The watermark uses custom opacity (transparency) so the underlying text and documents remain readable while preventing unauthorized replication.' }
    ]
  },
  {
    file: 'protect-pdf.html',
    jsFile: 'protect-pdf.js',
    title: 'Protect PDF Online - Encrypt PDF with Password Free',
    metaDesc: 'Add password protection and 128-bit encryption to your PDF document. Secure your confidential files 100% in your browser.',
    heading: 'Protect PDF with <span class="highlight">Password Encryption</span>',
    subtitle: 'Secure sensitive PDF files with password protection so only authorized people can open them.',
    dropzoneId: 'protect-dropzone',
    inputId: 'protect-file-input',
    browseId: 'protect-browse-btn',
    multiple: false,
    accept: '.pdf,application/pdf',
    dropIcon: '🔒',
    dropTitle: 'Drag & Drop a PDF to protect',
    dropDesc: 'or click to browse from your device',
    extraLibraries: ['https://unpkg.com/pdf-lib@1.17.9/dist/pdf-lib.min.js'],
    mainUi: `
      <div id="protect-settings-card" class="glass-card" style="display: none; margin-top: 2rem;">
        <div style="border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <h3 id="protect-file-title" style="font-size: 1.2rem;">document.pdf</h3>
          <span id="protect-file-meta" style="font-size: 0.85rem; color: var(--text-dim);">0 Pages</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 1.75rem;">
          <div>
            <label class="input-label" for="protect-password-input">Enter Document Password:</label>
            <input type="password" id="protect-password-input" class="form-input" placeholder="Enter secure password">
          </div>
          <div>
            <label class="input-label" for="protect-confirm-password">Confirm Password:</label>
            <input type="password" id="protect-confirm-password" class="form-input" placeholder="Repeat password">
          </div>
        </div>

        <div style="text-align: center;">
          <button id="protect-pdf-btn" class="btn btn-lg btn-primary" style="width: 100%; max-width: 360px;">
            <span>🔒</span> Encrypt & Download PDF
          </button>
          <div id="protect-status-msg" style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--accent-emerald);"></div>
        </div>
      </div>
    `,
    faq: [
      { q: 'Can anyone open the PDF without the password?', a: 'No, standard PDF readers will prompt for the password before allowing any viewing or printing.' }
    ]
  },
  {
    file: 'unlock-pdf.html',
    jsFile: 'unlock-pdf.js',
    title: 'Unlock PDF Online - Remove Password from PDF Free',
    metaDesc: 'Remove password and encryption from protected PDF files easily. 100% private, client-side decoding with zero uploads.',
    heading: 'Unlock PDF & <span class="highlight">Remove Password</span>',
    subtitle: 'Decouple security restrictions from PDF documents so you can open them instantly anytime.',
    dropzoneId: 'unlock-dropzone',
    inputId: 'unlock-file-input',
    browseId: 'unlock-browse-btn',
    multiple: false,
    accept: '.pdf,application/pdf',
    dropIcon: '🔓',
    dropTitle: 'Drag & Drop locked PDF here',
    dropDesc: 'or click to browse from your device',
    extraLibraries: ['https://unpkg.com/pdf-lib@1.17.9/dist/pdf-lib.min.js'],
    mainUi: `
      <div id="unlock-settings-card" class="glass-card" style="display: none; margin-top: 2rem;">
        <div style="border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <h3 id="unlock-file-title" style="font-size: 1.2rem;">locked_document.pdf</h3>
          <span id="unlock-file-meta" style="font-size: 0.85rem; color: var(--text-dim);">Locked Document</span>
        </div>

        <div style="max-width: 420px; margin: 0 auto 1.75rem;">
          <label class="input-label" for="unlock-password-input">Enter Current PDF Password:</label>
          <input type="password" id="unlock-password-input" class="form-input" placeholder="Enter password to remove it">
        </div>

        <div style="text-align: center;">
          <button id="unlock-pdf-btn" class="btn btn-lg btn-primary" style="width: 100%; max-width: 360px;">
            <span>🔓</span> Unlock & Download PDF
          </button>
          <div id="unlock-status-msg" style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--accent-emerald);"></div>
        </div>
      </div>
    `,
    faq: [
      { q: 'Is my password sent to any server?', a: 'Never! Decryption is performed entirely inside your browser memory using JavaScript.' }
    ]
  },
  {
    file: 'pdf-page-numbers.html',
    jsFile: 'pdf-page-numbers.js',
    title: 'Add Page Numbers to PDF Online Free',
    metaDesc: 'Insert page numbers into PDF documents easily. Choose positions, formats, and fonts with instant client-side download.',
    heading: 'Add <span class="highlight">Page Numbers</span> to PDF',
    subtitle: 'Number your PDF pages with customizable positioning, formats, and numbering styles.',
    dropzoneId: 'pagenum-dropzone',
    inputId: 'pagenum-file-input',
    browseId: 'pagenum-browse-btn',
    multiple: false,
    accept: '.pdf,application/pdf',
    dropIcon: '🔢',
    dropTitle: 'Drag & Drop PDF to add page numbers',
    dropDesc: 'or click to browse from your device',
    extraLibraries: ['https://unpkg.com/pdf-lib@1.17.9/dist/pdf-lib.min.js'],
    mainUi: `
      <div id="pagenum-settings-card" class="glass-card" style="display: none; margin-top: 2rem;">
        <div style="border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <h3 id="pagenum-file-title" style="font-size: 1.2rem;">document.pdf</h3>
          <span id="pagenum-file-meta" style="font-size: 0.85rem; color: var(--text-dim);">0 Pages</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.75rem;">
          <div>
            <label class="input-label" for="pagenum-position">Numbering Position:</label>
            <select id="pagenum-position" class="form-input">
              <option value="bottom-center" selected>Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-center">Top Center</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>
          <div>
            <label class="input-label" for="pagenum-format">Display Format:</label>
            <select id="pagenum-format" class="form-input">
              <option value="page_of_total" selected>Page 1 of 10</option>
              <option value="n_of_total">1/10</option>
              <option value="page_n">Page 1</option>
              <option value="simple">1</option>
            </select>
          </div>
          <div>
            <label class="input-label" for="pagenum-font-size">Font Size:</label>
            <select id="pagenum-font-size" class="form-input">
              <option value="9">Small (9pt)</option>
              <option value="11" selected>Standard (11pt)</option>
              <option value="14">Large (14pt)</option>
            </select>
          </div>
        </div>

        <div style="text-align: center;">
          <button id="apply-pagenum-btn" class="btn btn-lg btn-primary" style="width: 100%; max-width: 380px;">
            <span>🔢</span> Apply Numbers & Download PDF
          </button>
          <div id="pagenum-status-msg" style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--accent-emerald);"></div>
        </div>
      </div>
    `,
    faq: [
      { q: 'Can I customize where page numbers appear?', a: 'Yes! You can place them at the Bottom Center, Bottom Right, Top Right, or any of the standard positions.' }
    ]
  }
];

function generateHtml(tool) {
  const libTags = tool.extraLibraries.map(url => `  <script src="${url}"></script>`).join('\n');
  const faqItems = tool.faq.map(item => `
        <div class="faq-item">
          <button class="faq-question">
            <span>${item.q}</span>
            <span class="faq-icon">▾</span>
          </button>
          <div class="faq-answer">
            <p>${item.a}</p>
          </div>
        </div>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tool.title} | RozgarTools</title>
  <meta name="description" content="${tool.metaDesc}">
  <link rel="stylesheet" href="../assets/css/style.css">
  <link rel="icon" type="image/png" href="../assets/logo.png">
${libTags}
</head>
<body>

  <!-- Site Header Placeholder (Filled by update-headers) -->
  <header class="site-header"></header>

  <!-- Main Container -->
  <main class="container" style="padding-top: 2rem; padding-bottom: 4rem;">

    <!-- Breadcrumb -->
    <nav class="tool-breadcrumb" aria-label="Breadcrumb">
      <a href="../index.html">Home</a>
      <span>›</span>
      <a href="../index.html#tools-container">Tools</a>
      <span>›</span>
      <span>${tool.title.split('-')[0].trim()}</span>
    </nav>

    <!-- Tool Header -->
    <div class="tool-header-wrap">
      <h1 class="tool-page-title">${tool.heading}</h1>
      <p class="tool-page-subtitle">${tool.subtitle}</p>
    </div>

    <!-- Dropzone Area -->
    <div class="dropzone-box" id="${tool.dropzoneId}">
      <input type="file" id="${tool.inputId}" accept="${tool.accept}" ${tool.multiple ? 'multiple' : ''} style="display: none;">
      <div class="dropzone-icon">${tool.dropIcon}</div>
      <h3 class="dropzone-title">${tool.dropTitle}</h3>
      <p class="dropzone-desc">${tool.dropDesc}</p>
      <div style="margin-top: 1.25rem;">
        <button type="button" class="btn btn-primary" id="${tool.browseId}">
          <span>📁</span> Browse Files
        </button>
      </div>
    </div>

    ${tool.mainUi}

    <!-- FAQ Accordion -->
    <div class="seo-article" style="margin-top: 4rem;">
      <h2>Frequently Asked Questions</h2>
      <div class="faq-wrap">
${faqItems}
      </div>
    </div>

  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom" style="border-top: none; padding-top: 0;">
        <div>&copy; 2026 RozgarTools & Dynamic AI. All rights reserved.</div>
        <div style="display: flex; gap: 1rem;">
          <a href="../index.html" style="color: var(--text-dim);">Home</a>
          <a href="../privacy-policy.html" style="color: var(--text-dim);">Privacy Policy</a>
          <a href="../contact-us.html" style="color: var(--text-dim);">Contact</a>
          <a href="../terms.html" style="color: var(--text-dim);">Terms</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="../assets/js/main.js"></script>
  <script src="../assets/js/${tool.jsFile}"></script>
</body>
</html>`;
}

// Generate the HTML files
for (const tool of pdfTools) {
  const filePath = path.join('tools', tool.file);
  fs.writeFileSync(filePath, generateHtml(tool), 'utf-8');
  console.log(`Generated tools/${tool.file}`);
}

console.log('All PDF tools created successfully!');
