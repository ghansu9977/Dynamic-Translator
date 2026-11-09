const fs = require('fs');
const path = require('path');

const rootFiles = ['index.html', 'about-us.html', 'contact-us.html', 'privacy-policy.html', 'terms.html'];
const toolFiles = fs.readdirSync('tools').filter(f => f.endsWith('.html')).map(f => path.join('tools', f));
const allFiles = [...rootFiles, ...toolFiles];

const brokenLinks = [];
let totalLinksChecked = 0;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const fileDir = path.dirname(file);
  const linkRegex = /href=["']([^"'#:]+?)["']/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    let href = match[1];
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) continue;
    if (href.startsWith('javascript:')) continue;
    
    // strip query string and hash
    const cleanHref = href.split('?')[0].split('#')[0];
    if (!cleanHref) continue;

    totalLinksChecked++;
    const resolvedPath = path.resolve(fileDir, cleanHref);
    if (!fs.existsSync(resolvedPath)) {
      brokenLinks.push({ file, href, cleanHref, resolvedPath });
    }
  }
}

console.log(`Total internal links checked: ${totalLinksChecked}`);
console.log(`Real broken links found: ${brokenLinks.length}`);
if (brokenLinks.length > 0) {
  console.log(JSON.stringify(brokenLinks, null, 2));
}
