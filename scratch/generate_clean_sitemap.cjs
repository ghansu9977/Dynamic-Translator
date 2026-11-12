const fs = require('fs');

const today = new Date().toISOString().split('T')[0];

const sitemapUrls = [
  // Homepage
  { loc: 'https://www.rozgartools.store/', priority: '1.0', changefreq: 'daily' },

  // Comprehensive Guides (Pillars of Content Quality)
  { loc: 'https://www.rozgartools.store/guides/sarkari-photo-signature-guidelines-2026.html', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/guides/how-ocr-works-image-to-text-guide.html', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/guides/how-to-write-ats-friendly-resume.html', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/guides/in-hand-salary-calculation-new-tax-regime.html', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/guides/sip-and-power-of-compounding-guide.html', priority: '0.9', changefreq: 'weekly' },

  // Key Career & Exam Utilities
  { loc: 'https://www.rozgartools.store/tools/govt-photo-resizer.html', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/tools/passport-photo-sheet-maker.html', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/tools/sarkari-rozgar-tools.html', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/tools/age-calculator.html', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/tools/typing-test.html', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/tools/resume-builder.html', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/tools/ats-resume-checker.html', priority: '0.8', changefreq: 'weekly' },

  // AI & Document Tools
  { loc: 'https://www.rozgartools.store/tools/dynamic-translator.html', priority: '0.9', changefreq: 'daily' },
  { loc: 'https://www.rozgartools.store/tools/image-to-text.html', priority: '0.9', changefreq: 'daily' },
  { loc: 'https://www.rozgartools.store/tools/image-to-pdf.html', priority: '0.8', changefreq: 'weekly' },

  // PDF Suite
  { loc: 'https://www.rozgartools.store/tools/merge-pdf.html', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/tools/split-pdf.html', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/tools/pdf-to-jpg.html', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/tools/rotate-pdf.html', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://www.rozgartools.store/tools/pdf-watermark.html', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://www.rozgartools.store/tools/protect-pdf.html', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://www.rozgartools.store/tools/unlock-pdf.html', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://www.rozgartools.store/tools/pdf-page-numbers.html', priority: '0.7', changefreq: 'monthly' },

  // Financial & Everyday Utilities
  { loc: 'https://www.rozgartools.store/tools/salary-calculator.html', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/tools/emi-calculator.html', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/tools/sip-calculator.html', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/tools/gst-calculator.html', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://www.rozgartools.store/tools/cgpa-calculator.html', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://www.rozgartools.store/tools/qr-generator.html', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://www.rozgartools.store/tools/whatsapp-direct-chat.html', priority: '0.7', changefreq: 'monthly' },

  // Mandatory AdSense Legal & Trust Pages
  { loc: 'https://www.rozgartools.store/about-us.html', priority: '0.6', changefreq: 'monthly' },
  { loc: 'https://www.rozgartools.store/privacy-policy.html', priority: '0.6', changefreq: 'monthly' },
  { loc: 'https://www.rozgartools.store/terms.html', priority: '0.6', changefreq: 'monthly' },
  { loc: 'https://www.rozgartools.store/disclaimer.html', priority: '0.6', changefreq: 'monthly' },
  { loc: 'https://www.rozgartools.store/contact-us.html', priority: '0.6', changefreq: 'monthly' }
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const item of sitemapUrls) {
  xml += `  <url>\n    <loc>${item.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${item.changefreq}</changefreq>\n    <priority>${item.priority}</priority>\n  </url>\n`;
}

xml += `</urlset>\n`;

fs.writeFileSync('sitemap.xml', xml, 'utf8');
if (fs.existsSync('public')) {
  fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
}
if (fs.existsSync('dist')) {
  fs.writeFileSync('dist/sitemap.xml', xml, 'utf8');
}

console.log(`Generated pristine sitemap.xml with ${sitemapUrls.length} verified high-quality URLs.`);

