const fs = require('fs');
const path = require('path');

const festiveFiles = [
  'chhath-puja-card-maker.html',
  'diwali-card-maker.html',
  'diwali-cracker-simulator.html',
  'diwali-magic-wish.html',
  'diwali-puja-muhurat.html',
  'diwali-rangoli-generator.html',
  'diwali-shayari-status.html'
];

const legalFooterLinks = `      <div class="footer-bottom" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
        <p style="margin: 0; color: var(--text-dim); font-size: 0.9rem;">© 2026 RozgarTools. All rights reserved.</p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem;">
          <a href="../index.html" style="color: var(--text-dim); text-decoration: none;">Home</a>
          <a href="../about-us.html" style="color: var(--text-dim); text-decoration: none;">About Us</a>
          <a href="../contact-us.html" style="color: var(--text-dim); text-decoration: none;">Contact Us</a>
          <a href="../privacy-policy.html" style="color: var(--text-dim); text-decoration: none;">Privacy Policy</a>
          <a href="../terms.html" style="color: var(--text-dim); text-decoration: none;">Terms</a>
          <a href="../disclaimer.html" style="color: var(--text-dim); text-decoration: none; font-weight: 600;">Disclaimer</a>
        </div>
      </div>`;

for (const file of festiveFiles) {
  const filePath = path.join('tools', file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace <div class="footer-bottom">...</div>
  const fbRegex = /<div class="footer-bottom">[\s\S]*?<\/div>/;
  if (fbRegex.test(content)) {
    content = content.replace(fbRegex, legalFooterLinks);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated footer links in festive tool: ${file}`);
  }
}

