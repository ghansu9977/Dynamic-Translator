const fs = require('fs');
const path = require('path');

const toolsDir = path.resolve('tools');
const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

let updatedCount = 0;

for (const file of toolFiles) {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Add Disclaimer to Important Links <ul>
  if (content.includes('href="../terms.html"') && !content.includes('href="../disclaimer.html"')) {
    // Check if within <li>
    const liTermsRegex = /(<li>\s*<a\s+href=["']\.\.\/terms\.html["'][^>]*>.*?<\/a>\s*<\/li>)/i;
    if (liTermsRegex.test(content)) {
      content = content.replace(liTermsRegex, `$1\n            <li><a href="../disclaimer.html">Disclaimer</a></li>`);
      changed = true;
    } else {
      // Check if inline link
      const inlineTermsRegex = /(<a\s+href=["']\.\.\/terms\.html["'][^>]*>.*?<\/a>)/i;
      if (inlineTermsRegex.test(content)) {
        content = content.replace(inlineTermsRegex, `$1\n          <a href="../disclaimer.html" style="color: var(--text-dim);">Disclaimer</a>`);
        changed = true;
      }
    }
  }

  // 2. Also ensure footer-bottom has Disclaimer link if present
  if (content.includes('<div class="footer-bottom">') && !content.includes('href="../disclaimer.html"')) {
    const bottomTermsRegex = /(<a\s+href=["']\.\.\/terms\.html["'][^>]*>Terms<\/a>)/i;
    if (bottomTermsRegex.test(content)) {
      content = content.replace(bottomTermsRegex, `$1\n          <a href="../disclaimer.html" style="color: var(--text-dim);">Disclaimer</a>`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
  }
}

console.log(`Updated footer disclaimer link in ${updatedCount} tool files.`);
