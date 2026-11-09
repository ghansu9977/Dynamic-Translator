const fs = require('fs');
const path = require('path');

const rootFiles = ['index.html', 'about-us.html', 'contact-us.html', 'privacy-policy.html', 'terms.html', 'disclaimer.html'];
const toolFiles = fs.readdirSync('tools').filter(f => f.endsWith('.html')).map(f => path.join('tools', f));
const allFiles = [...rootFiles, ...toolFiles];

const adsenseScript = `  <!-- Google AdSense Verification -->\n  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8683798796115175" crossorigin="anonymous"></script>\n`;

let injected = 0;

for (const file of allFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('ca-pub-8683798796115175')) continue;

  if (content.includes('gtag(\'config\', \'G-KHNBCZ0Q3Q\');\n  </script>')) {
    content = content.replace('gtag(\'config\', \'G-KHNBCZ0Q3Q\');\n  </script>', `gtag('config', 'G-KHNBCZ0Q3Q');\n  </script>\n\n${adsenseScript}`);
    fs.writeFileSync(file, content, 'utf8');
    injected++;
  } else if (content.includes('</head>')) {
    content = content.replace('</head>', `${adsenseScript}</head>`);
    fs.writeFileSync(file, content, 'utf8');
    injected++;
  }
}

console.log(`Injected Google AdSense tag into ${injected} pages.`);

