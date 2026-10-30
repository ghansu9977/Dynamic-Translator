import fs from 'fs';
import path from 'path';

// Template generator for Desktop Nav + Mobile Drawer
function getHeaderHtml(prefix, activePage) {
  const tools = [
    { file: 'dynamic-translator.html', title: 'AI Translator', desc: '100+ languages real-time AI', icon: '🌐', color: 'cyan', badge: 'Dynamic AI' },
    { file: 'govt-photo-resizer.html', title: 'Govt Photo Resizer', desc: 'Compress to 20KB / 50KB', icon: '📸', color: 'green', badge: '20KB / 50KB' },
    { file: 'resume-builder.html', title: 'ATS Resume Builder', desc: 'Instant 1-page modern PDF', icon: '📄', color: 'purple', badge: 'Instant PDF' },
    { file: 'emi-calculator.html', title: 'Loan EMI Calculator', desc: 'Home, car & personal loan', icon: '🏦', color: 'amber', badge: 'Charts' },
    { file: 'typing-test.html', title: 'Typing Speed Test', desc: 'Live WPM & accuracy test', icon: '⌨️', color: 'blue', badge: '1 Min' },
    { file: 'qr-generator.html', title: 'UPI QR Generator', desc: 'Payment & URL QR codes', icon: '📱', color: 'rose', badge: 'Free' },
    { file: 'image-to-pdf.html', title: 'Image to PDF', desc: 'Batch convert JPG/PNG', icon: '📑', color: 'emerald', badge: 'Batch' },
    { file: 'sip-calculator.html', title: 'SIP Calculator', desc: 'Mutual funds wealth projector', icon: '📈', color: 'indigo', badge: 'Wealth' },
    { file: 'cgpa-calculator.html', title: 'CGPA Calculator', desc: '10-point CGPA to percentage', icon: '🎓', color: 'orange', badge: 'Percent' },
    { file: 'age-calculator.html', title: 'Age Calculator', desc: 'Exact birth age & days', icon: '🎂', color: 'yellow', badge: 'Exact' }
  ];

  const homeHref = prefix ? `${prefix}index.html` : 'index.html';
  const aboutHref = prefix ? `${prefix}about-us.html` : 'about-us.html';
  const contactHref = prefix ? `${prefix}contact-us.html` : 'contact-us.html';
  const privacyHref = prefix ? `${prefix}privacy-policy.html` : 'privacy-policy.html';
  const termsHref = prefix ? `${prefix}terms.html` : 'terms.html';

  const toolHref = (file) => (prefix ? file : `tools/${file}`);

  const dropdownItems = tools.map(t => `
                <a href="${toolHref(t.file)}" class="dropdown-item ${activePage === t.file ? 'active' : ''}">
                  <div class="item-icon-box ${t.color}">${t.icon}</div>
                  <div class="item-text">
                    <span class="item-title">${t.title}</span>
                    <span class="item-desc">${t.desc}</span>
                  </div>
                </a>`).join('');

  const drawerToolItems = tools.map(t => `
        <li>
          <a href="${toolHref(t.file)}" class="drawer-item ${activePage === t.file ? 'active' : ''}">
            <span class="drawer-item-icon">${t.icon}</span>
            <div class="drawer-item-content">
              <span class="drawer-item-title">${t.title}</span>
              <span class="drawer-item-badge">${t.badge}</span>
            </div>
          </a>
        </li>`).join('');

  return `  <!-- Site Header -->
  <header class="site-header">
    <div class="container nav-wrap">
      <a href="${homeHref}" class="brand-logo" id="home-logo-link">
        <div class="brand-icon">⚡</div>
        <div class="brand-text">Rozgar<span>Tools</span></div>
      </a>

      <!-- Desktop Navigation Links -->
      <nav class="desktop-nav" aria-label="Main Navigation">
        <ul class="nav-links">
          <li><a href="${homeHref}" class="${activePage === 'home' ? 'active' : ''}"><span>🏠</span> Home</a></li>
          <li><a href="${toolHref('dynamic-translator.html')}" class="${activePage === 'dynamic-translator.html' ? 'active' : ''}"><span>🌐</span> AI Translator</a></li>
          <li><a href="${toolHref('govt-photo-resizer.html')}" class="${activePage === 'govt-photo-resizer.html' ? 'active' : ''}"><span>📸</span> Photo Resizer</a></li>
          <li><a href="${toolHref('resume-builder.html')}" class="${activePage === 'resume-builder.html' ? 'active' : ''}"><span>📄</span> Resume Builder</a></li>
          <li class="nav-dropdown">
            <button class="nav-dropdown-trigger" id="all-tools-dropdown-btn" aria-expanded="false" aria-haspopup="true">
              <span>🧰</span> All Tools <span class="dropdown-arrow">▾</span>
            </button>
            <div class="nav-dropdown-menu" id="all-tools-dropdown-menu">
              <div class="dropdown-header">
                <span class="dropdown-title">All Utility Tools & Calculators</span>
                <span class="dropdown-badge">⚡ 100% Free & Private</span>
              </div>
              <div class="dropdown-grid">${dropdownItems}
              </div>
            </div>
          </li>
          <li><a href="${aboutHref}" class="${activePage === 'about-us.html' ? 'active' : ''}"><span>ℹ️</span> About</a></li>
        </ul>
      </nav>

      <div class="nav-actions">
        <button class="nav-search-trigger" id="nav-search-trigger" aria-label="Search tools" title="Search Tools">
          <span>🔍</span>
          <span class="search-kbd-hint">Search</span>
        </button>
        <button class="theme-toggle-btn" id="theme-toggle-btn" aria-label="Toggle theme" title="Toggle Dark/Light Mode">
          <span id="theme-icon">🌙</span>
        </button>
        <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle navigation menu" aria-expanded="false">☰</button>
      </div>
    </div>
  </header>

  <!-- Mobile Navigation Overlay & Drawer -->
  <div class="mobile-drawer-overlay" id="mobile-drawer-overlay"></div>
  <aside class="mobile-drawer" id="mobile-drawer" aria-label="Mobile Navigation Menu">
    <div class="mobile-drawer-header">
      <a href="${homeHref}" class="brand-logo">
        <div class="brand-icon">⚡</div>
        <div class="brand-text">Rozgar<span>Tools</span></div>
      </a>
      <button class="mobile-drawer-close" id="mobile-drawer-close" aria-label="Close menu">✕</button>
    </div>

    <div class="mobile-drawer-search">
      <span class="drawer-search-icon">🔍</span>
      <input type="text" id="drawer-search-input" placeholder="Search any tool..." aria-label="Search in menu">
    </div>

    <div class="mobile-drawer-body">
      <div class="drawer-section-title">All Utility Tools</div>
      <ul class="drawer-nav-list" id="drawer-tools-list">${drawerToolItems}
      </ul>

      <div class="drawer-section-title">Navigation & Info</div>
      <ul class="drawer-nav-list">
        <li>
          <a href="${homeHref}" class="drawer-item ${activePage === 'home' ? 'active' : ''}">
            <span class="drawer-item-icon">🏠</span>
            <span class="drawer-item-title">Home</span>
          </a>
        </li>
        <li>
          <a href="${aboutHref}" class="drawer-item ${activePage === 'about-us.html' ? 'active' : ''}">
            <span class="drawer-item-icon">ℹ️</span>
            <span class="drawer-item-title">About Us</span>
          </a>
        </li>
        <li>
          <a href="${contactHref}" class="drawer-item ${activePage === 'contact-us.html' ? 'active' : ''}">
            <span class="drawer-item-icon">✉️</span>
            <span class="drawer-item-title">Contact Support</span>
          </a>
        </li>
        <li>
          <a href="${privacyHref}" class="drawer-item ${activePage === 'privacy-policy.html' ? 'active' : ''}">
            <span class="drawer-item-icon">🔒</span>
            <span class="drawer-item-title">Privacy Policy</span>
          </a>
        </li>
        <li>
          <a href="${termsHref}" class="drawer-item ${activePage === 'terms.html' ? 'active' : ''}">
            <span class="drawer-item-icon">📜</span>
            <span class="drawer-item-title">Terms of Service</span>
          </a>
        </li>
      </ul>
    </div>

    <div class="mobile-drawer-footer">
      <span>🔒</span> 100% Client-Side Privacy • Zero Server Uploads
    </div>
  </aside>`;
}

// Regex to replace <header class="site-header">...</header> and any existing mobile drawer
const headerRegex = /<header class="site-header">[\s\S]*?<\/header>(?:\s*<!-- Mobile Navigation Overlay & Drawer -->\s*<div class="mobile-drawer-overlay"[\s\S]*?<\/aside>)?/;

// 1. Process tools directory
const toolsDir = path.resolve('tools');
const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

for (const file of toolFiles) {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const newHeader = getHeaderHtml('../', file);
  if (headerRegex.test(content)) {
    content = content.replace(headerRegex, newHeader);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated header in tools/${file}`);
  } else {
    console.warn(`Could not match header in tools/${file}`);
  }
}

// 2. Process root informational files
const rootFiles = ['about-us.html', 'contact-us.html', 'privacy-policy.html', 'terms.html'];
for (const file of rootFiles) {
  const filePath = path.resolve(file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const newHeader = getHeaderHtml('', file);
    if (headerRegex.test(content)) {
      content = content.replace(headerRegex, newHeader);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated header in ${file}`);
    } else {
      console.warn(`Could not match header in ${file}`);
    }
  }
}

console.log('All headers updated successfully!');
