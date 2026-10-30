import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy tools/
if (fs.existsSync('tools')) {
  copyDirSync('tools', path.join(distDir, 'tools'));
}

// Copy assets/
if (fs.existsSync('assets')) {
  copyDirSync('assets', path.join(distDir, 'assets'));
}

// Copy all static HTML and verification files
const rootFiles = [
  'index.html',
  'about-us.html',
  'contact-us.html',
  'privacy-policy.html',
  'terms.html',
  'sitemap.xml',
  'robots.txt',
  'google9ef6134b423728c7.html'
];

for (const file of rootFiles) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(distDir, file));
  }
}

console.log('✅ Build successful: All 10 tools, assets, and pages copied to dist/');
