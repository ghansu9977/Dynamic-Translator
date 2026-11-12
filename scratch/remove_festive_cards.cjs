const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const regex = /\s*<!-- Tool 26: Diwali Wishing Card -->[\s\S]*?<!-- Tool 31: Chhath Puja Card Maker -->[\s\S]*?<\/article>/;

if (regex.test(content)) {
  content = content.replace(regex, '');
  console.log('Successfully removed festive cards from tools-container.');
} else {
  // Try matching by article ID
  const startIdx = content.indexOf('<article class="tool-card" data-category="festive photos" id="card-diwali-card">');
  const endMarker = '</article>\n\n      </div>';
  const endIdx = content.indexOf(endMarker, startIdx);
  if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + content.substring(endIdx + '</article>'.length);
    console.log('Successfully removed festive cards via substring index.');
  } else {
    console.log('Could not find festive cards start/end');
  }
}

// Also update the tool counter badge in hero and tools section
content = content.replace(/36 Free Tools Available/g, '26 Free Tools & 5 Comprehensive Guides');
content = content.replace(/36 Free Utilities/g, '26 Free Tools & Guides');
content = content.replace(/suite of 36 client-side/g, 'suite of 26 client-side');
content = content.replace(/Search 36 tools/g, 'Search tools');
content = content.replace(/Explore All 36 Online Tools/g, 'Explore All Free Online Tools');

fs.writeFileSync('index.html', content, 'utf8');

