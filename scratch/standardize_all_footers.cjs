const fs = require('fs');
const path = require('path');

const toolsDir = path.resolve('tools');
const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

const standardFooter = `  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding: 1.5rem 0;">
        <div style="color: var(--text-dim); font-size: 0.9rem;">&copy; 2026 RozgarTools. All rights reserved.</div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem;">
          <a href="../index.html" style="color: var(--text-dim); text-decoration: none;">Home</a>
          <a href="../about-us.html" style="color: var(--text-dim); text-decoration: none;">About Us</a>
          <a href="../contact-us.html" style="color: var(--text-dim); text-decoration: none;">Contact Us</a>
          <a href="../privacy-policy.html" style="color: var(--text-dim); text-decoration: none;">Privacy Policy</a>
          <a href="../terms.html" style="color: var(--text-dim); text-decoration: none;">Terms</a>
          <a href="../disclaimer.html" style="color: var(--text-dim); text-decoration: none; font-weight: 600;">Disclaimer</a>
        </div>
      </div>
    </div>
  </footer>`;

let fixedCount = 0;

for (const file of toolFiles) {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // If footer already has all links including disclaimer, skip
  const hasAbout = content.includes('about-us.html');
  const hasPrivacy = content.includes('privacy-policy.html');
  const hasTerms = content.includes('terms.html');
  const hasContact = content.includes('contact-us.html');
  const hasDisclaimer = content.includes('disclaimer.html');

  if (hasAbout && hasPrivacy && hasTerms && hasContact && hasDisclaimer) {
    continue;
  }

  // Replace existing <footer ...> ... </footer>
  const footerRegex = /<!--\s*(?:Site\s*)?Footer\s*-->\s*<footer class="site-footer">[\s\S]*?<\/footer>|<footer class="site-footer">[\s\S]*?<\/footer>/;
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, standardFooter);
    fs.writeFileSync(filePath, content, 'utf8');
    fixedCount++;
    console.log(`Standardized footer in tools/${file}`);
  }
}

console.log(`Successfully standardized legal footers in ${fixedCount} tool files.`);

