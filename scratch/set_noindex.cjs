const fs = require('fs');

const files = [
  'tools/diwali-card-maker.html',
  'tools/diwali-cracker-simulator.html',
  'tools/diwali-magic-wish.html',
  'tools/diwali-puja-muhurat.html',
  'tools/diwali-rangoli-generator.html',
  'tools/diwali-shayari-status.html',
  'tools/chhath-puja-card-maker.html'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/<meta name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex, nofollow">');
    fs.writeFileSync(f, content, 'utf8');
    console.log('Set noindex on ' + f);
  }
}

