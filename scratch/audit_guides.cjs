const fs = require('fs');
const path = require('path');

const guideFiles = fs.readdirSync('guides').filter(f => f.endsWith('.html')).map(f => path.join('guides', f));

let allGood = true;

for (const f of guideFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const hasAdSense = content.includes('ca-pub-8683798796115175');
  const hasSchema = content.includes('application/ld+json');
  const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;

  console.log(`[GUIDE] ${f}: WordCount: ~${wordCount}, AdSense: ${hasAdSense}, Schema: ${hasSchema}`);
  if (!hasAdSense || !hasSchema || wordCount < 600) {
    allGood = false;
  }
}

console.log(allGood ? '✅ All guides verified successfully!' : '❌ Some guide checks failed');

