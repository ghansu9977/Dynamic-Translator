import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// 1. Update search placeholder and counts
html = html.replace(/placeholder="Search 10 tools\.\.\. \(e\.g\. Translator[^\"]*"/, 'placeholder="Search 18 tools... (e.g. Merge PDF, Split PDF, Translator, Photo 20KB, EMI, Typing, Resume, QR)"');
html = html.replace(/<span class="cat-count">10<\/span>/, '<span class="cat-count">18</span>');
html = html.replace(/10 Free Tools Available/, '18 Free Tools Available');

// 2. Add PDF filter pill right after All Tools pill
if (!html.includes('data-category="pdf"')) {
  const oldCategoryAll = `<button class="cat-pill active" data-category="all" role="tab" aria-selected="true">
          <span>🔥</span> All Tools <span class="cat-count">18</span>
        </button>`;

  const newCategoryPills = `<button class="cat-pill active" data-category="all" role="tab" aria-selected="true">
          <span>🔥</span> All Tools <span class="cat-count">18</span>
        </button>
        <button class="cat-pill" data-category="pdf" role="tab" aria-selected="false">
          <span>📑</span> PDF Tools (iLovePDF)
        </button>`;

  html = html.replace(oldCategoryAll, newCategoryPills);
}

// 3. New PDF Cards to insert at beginning of tools-grid
const newPdfCards = `
        <!-- PDF Tool 1: Merge PDF -->
        <article class="tool-card" data-category="pdf">
          <div style="position: absolute; top: 12px; right: 12px; font-size: 0.75rem; font-weight: 700; background: rgba(139, 92, 246, 0.15); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.3); padding: 3px 10px; border-radius: 9999px;">
            📑 Popular
          </div>
          <div class="tool-icon-wrap" style="background: rgba(139, 92, 246, 0.15); color: #a78bfa;">📑</div>
          <h3 class="tool-title">Merge PDF Online</h3>
          <p class="tool-desc">
            Combine multiple PDF files into one single document in any order with drag-and-drop reordering. 100% private in-browser merging.
          </p>
          <div class="tool-tags">
            <span class="tag-badge">Combine PDFs</span>
            <span class="tag-badge">Drag & Drop Order</span>
            <span class="tag-badge">Zero Server Upload</span>
          </div>
          <a href="tools/merge-pdf.html" class="btn btn-primary" style="margin-top: auto;">
            <span>📑</span> Merge PDFs Free
          </a>
        </article>

        <!-- PDF Tool 2: Split PDF -->
        <article class="tool-card" data-category="pdf">
          <div style="position: absolute; top: 12px; right: 12px; font-size: 0.75rem; font-weight: 700; background: rgba(244, 63, 94, 0.15); color: var(--accent-rose); border: 1px solid rgba(244, 63, 94, 0.3); padding: 3px 10px; border-radius: 9999px;">
            ✂️ Fast
          </div>
          <div class="tool-icon-wrap" style="background: rgba(244, 63, 94, 0.15); color: var(--accent-rose);">✂️</div>
          <h3 class="tool-title">Split PDF & Extract Pages</h3>
          <p class="tool-desc">
            Extract specific page ranges (e.g. 1-3, 5, 8-10) or split all pages into separate PDF files downloaded in a ZIP.
          </p>
          <div class="tool-tags">
            <span class="tag-badge">Extract Pages</span>
            <span class="tag-badge">Page Range</span>
            <span class="tag-badge">ZIP Export</span>
          </div>
          <a href="tools/split-pdf.html" class="btn btn-primary" style="margin-top: auto;">
            <span>✂️</span> Split PDF Free
          </a>
        </article>

        <!-- PDF Tool 3: PDF to JPG -->
        <article class="tool-card" data-category="pdf">
          <div style="position: absolute; top: 12px; right: 12px; font-size: 0.75rem; font-weight: 700; background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan); border: 1px solid rgba(6, 182, 212, 0.3); padding: 3px 10px; border-radius: 9999px;">
            🖼️ High-Res
          </div>
          <div class="tool-icon-wrap cyan">🖼️</div>
          <h3 class="tool-title">PDF to JPG / PNG Converter</h3>
          <p class="tool-desc">
            Convert every page of your PDF into high-definition JPG or PNG images with individual or 1-click batch ZIP downloads.
          </p>
          <div class="tool-tags">
            <span class="tag-badge">PDF to Images</span>
            <span class="tag-badge">JPG & PNG</span>
            <span class="tag-badge">Retina Quality</span>
          </div>
          <a href="tools/pdf-to-jpg.html" class="btn btn-primary" style="margin-top: auto;">
            <span>🖼️</span> Convert PDF to Images
          </a>
        </article>

        <!-- PDF Tool 4: Rotate PDF -->
        <article class="tool-card" data-category="pdf">
          <div class="tool-icon-wrap" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa;">🔄</div>
          <h3 class="tool-title">Rotate PDF Pages</h3>
          <p class="tool-desc">
            Permanently rotate PDF pages by 90°, 180°, or 270° clockwise or counter-clockwise. Fix upside-down scans instantly.
          </p>
          <div class="tool-tags">
            <span class="tag-badge">Rotate 90°/180°</span>
            <span class="tag-badge">Permanent Fix</span>
            <span class="tag-badge">All Pages</span>
          </div>
          <a href="tools/rotate-pdf.html" class="btn btn-primary" style="margin-top: auto;">
            <span>🔄</span> Rotate PDF Free
          </a>
        </article>

        <!-- PDF Tool 5: Watermark PDF -->
        <article class="tool-card" data-category="pdf">
          <div class="tool-icon-wrap" style="background: rgba(99, 102, 241, 0.15); color: #818cf8;">🌊</div>
          <h3 class="tool-title">Watermark PDF Online</h3>
          <p class="tool-desc">
            Stamp customizable text watermarks like "CONFIDENTIAL", "DRAFT", or brand names with custom opacity, position, and colors.
          </p>
          <div class="tool-tags">
            <span class="tag-badge">Text Stamp</span>
            <span class="tag-badge">Custom Opacity</span>
            <span class="tag-badge">Diagonal / Center</span>
          </div>
          <a href="tools/pdf-watermark.html" class="btn btn-primary" style="margin-top: auto;">
            <span>🌊</span> Watermark PDF Free
          </a>
        </article>

        <!-- PDF Tool 6: Protect PDF -->
        <article class="tool-card" data-category="pdf">
          <div style="position: absolute; top: 12px; right: 12px; font-size: 0.75rem; font-weight: 700; background: rgba(245, 158, 11, 0.15); color: var(--accent-amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 3px 10px; border-radius: 9999px;">
            🔒 128-Bit
          </div>
          <div class="tool-icon-wrap amber">🔒</div>
          <h3 class="tool-title">Protect PDF with Password</h3>
          <p class="tool-desc">
            Encrypt your sensitive PDF files with password security. Restrict unauthorized opening, copying, and printing.
          </p>
          <div class="tool-tags">
            <span class="tag-badge">Password Encryption</span>
            <span class="tag-badge">Security</span>
            <span class="tag-badge">100% Client-Side</span>
          </div>
          <a href="tools/protect-pdf.html" class="btn btn-primary" style="margin-top: auto;">
            <span>🔒</span> Protect PDF Free
          </a>
        </article>

        <!-- PDF Tool 7: Unlock PDF -->
        <article class="tool-card" data-category="pdf">
          <div class="tool-icon-wrap" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);">🔓</div>
          <h3 class="tool-title">Unlock PDF & Remove Password</h3>
          <p class="tool-desc">
            Remove password and security restrictions from your encrypted PDF documents for easy sharing and opening.
          </p>
          <div class="tool-tags">
            <span class="tag-badge">Remove Password</span>
            <span class="tag-badge">Instant Decrypt</span>
            <span class="tag-badge">Private</span>
          </div>
          <a href="tools/unlock-pdf.html" class="btn btn-primary" style="margin-top: auto;">
            <span>🔓</span> Unlock PDF Free
          </a>
        </article>

        <!-- PDF Tool 8: Add Page Numbers -->
        <article class="tool-card" data-category="pdf">
          <div class="tool-icon-wrap" style="background: rgba(234, 179, 8, 0.15); color: #facc15;">🔢</div>
          <h3 class="tool-title">Add Page Numbers to PDF</h3>
          <p class="tool-desc">
            Insert clean header or footer page numbers into your PDF with custom position (Bottom Center, Bottom Right, Top) and formats.
          </p>
          <div class="tool-tags">
            <span class="tag-badge">Numbering</span>
            <span class="tag-badge">Header/Footer</span>
            <span class="tag-badge">Page X of Y</span>
          </div>
          <a href="tools/pdf-page-numbers.html" class="btn btn-primary" style="margin-top: auto;">
            <span>🔢</span> Add Numbers Free
          </a>
        </article>
`;

if (!html.includes('href="tools/merge-pdf.html"')) {
  const toolsGridStart = '<div class="tools-grid" id="tools-container">';
  html = html.replace(toolsGridStart, toolsGridStart + '\n' + newPdfCards);
}

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('index.html updated with 18 tools and PDF filter!');
