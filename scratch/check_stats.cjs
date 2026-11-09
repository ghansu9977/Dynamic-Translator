const fs = require('fs');
const path = require('path');

const rootFiles = ['index.html', 'about-us.html', 'contact-us.html', 'privacy-policy.html', 'terms.html', 'disclaimer.html'];
const toolFiles = fs.readdirSync('tools').filter(f => f.endsWith('.html')).map(f => path.join('tools', f));
const allFiles = [...rootFiles, ...toolFiles];

const stats = [];

for (const file of allFiles) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  
  const textOnly = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
                          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
                          .replace(/<[^>]*>/g, ' ')
                          .replace(/\s+/g, ' ')
                          .trim();
  const wordCount = textOnly.split(' ').length;
  const hasVercel = /rozgartools\.vercel\.app|dynamic-translatx/i.test(content);
  const hasDesiRadio = /tools\/desi-radio\.html/i.test(content) && file !== 'tools\\desi-radio.html';
  const hasDisclaimer = content.includes('disclaimer.html');

  stats.push({
    file,
    wordCount,
    hasVercel,
    hasDesiRadio,
    hasDisclaimer
  });
}

console.table(stats);

