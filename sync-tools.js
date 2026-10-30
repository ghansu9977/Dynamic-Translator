import fs from 'fs';
import path from 'path';

const sourceDir = path.resolve('..', 'multi-tool');
const targetDir = path.resolve('.');

console.log('Syncing Multi-Tool project into live landing_page directory...');
console.log('Source:', sourceDir);
console.log('Target:', targetDir);

// Helper to copy directory recursively
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

// 1. Copy tools directory
console.log('Copying tools/ ...');
copyDirSync(path.join(sourceDir, 'tools'), path.join(targetDir, 'tools'));

// 2. Copy assets directory
console.log('Copying assets/ ...');
copyDirSync(path.join(sourceDir, 'assets'), path.join(targetDir, 'assets'));

// 3. Copy top-level HTML and config files
const filesToCopy = [
  'about-us.html',
  'contact-us.html',
  'privacy-policy.html',
  'terms.html',
  'sitemap.xml',
  'robots.txt'
];

for (const file of filesToCopy) {
  const src = path.join(sourceDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(targetDir, file));
    console.log(`Copied ${file}`);
  }
}

console.log('Sync completed successfully!');
