/**
 * PDF Watermark Logic - RozgarTools
 * 100% Client-Side PDF Watermarking with custom text, angle, and opacity via pdf-lib
 */

document.addEventListener('DOMContentLoaded', () => {
  initPdfWatermark();
});

function initPdfWatermark() {
  const dropZone = document.getElementById('watermark-dropzone');
  const fileInput = document.getElementById('watermark-file-input');
  const browseBtn = document.getElementById('watermark-browse-btn');
  const settingsCard = document.getElementById('watermark-settings-card');
  const fileTitle = document.getElementById('watermark-file-title');
  const fileMeta = document.getElementById('watermark-file-meta');
  const textInput = document.getElementById('watermark-text-input');
  const fontSizeSelect = document.getElementById('watermark-font-size');
  const opacitySelect = document.getElementById('watermark-opacity');
  const colorSelect = document.getElementById('watermark-color');
  const positionSelect = document.getElementById('watermark-position');
  const applyBtn = document.getElementById('apply-watermark-btn');
  const statusElem = document.getElementById('watermark-status-msg');

  let currentFile = null;
  let currentArrayBuffer = null;

  if (browseBtn && fileInput) {
    browseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadPdf(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        loadPdf(e.target.files[0]);
      }
    });
  }

  async function loadPdf(file) {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      if (window.showToast) window.showToast('Please select a valid PDF file.', 'error');
      return;
    }

    try {
      currentFile = file;
      currentArrayBuffer = await file.arrayBuffer();

      const doc = await window.PDFLib.PDFDocument.load(currentArrayBuffer, { ignoreEncryption: true });
      const pagesCount = doc.getPageCount();

      if (fileTitle) fileTitle.textContent = file.name;
      if (fileMeta) fileMeta.textContent = `${pagesCount} Page${pagesCount > 1 ? 's' : ''} • ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      if (settingsCard) settingsCard.style.display = 'block';
      if (statusElem) statusElem.textContent = '';
      if (window.showToast) window.showToast(`Loaded "${file.name}". Enter your watermark text below.`, 'success');
    } catch (e) {
      console.error(e);
      if (window.showToast) window.showToast('Failed to load PDF: ' + e.message, 'error');
    }
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', async () => {
      if (!currentArrayBuffer) return;

      const text = textInput ? textInput.value.trim() : '';
      if (!text) {
        alert('Please enter a watermark text (e.g. CONFIDENTIAL or your name).');
        if (textInput) textInput.focus();
        return;
      }

      try {
        applyBtn.disabled = true;
        applyBtn.innerHTML = '<span>⏳</span> Stamping Watermark...';
        if (statusElem) statusElem.textContent = 'Embedding watermark across all pages...';

        const pdfDoc = await window.PDFLib.PDFDocument.load(currentArrayBuffer);
        const font = await pdfDoc.embedFont(window.PDFLib.StandardFonts.HelveticaBold);
        const pages = pdfDoc.getPages();

        const fontSize = parseInt(fontSizeSelect ? fontSizeSelect.value : '48', 10);
        const opacity = parseFloat(opacitySelect ? opacitySelect.value : '0.25');
        const colorVal = colorSelect ? colorSelect.value : 'red';
        const position = positionSelect ? positionSelect.value : 'diagonal';

        // Color mapping
        let colorRgb;
        if (colorVal === 'red') colorRgb = window.PDFLib.rgb(0.9, 0.1, 0.1);
        else if (colorVal === 'blue') colorRgb = window.PDFLib.rgb(0.1, 0.3, 0.85);
        else if (colorVal === 'green') colorRgb = window.PDFLib.rgb(0.1, 0.7, 0.3);
        else if (colorVal === 'black') colorRgb = window.PDFLib.rgb(0.1, 0.1, 0.1);
        else colorRgb = window.PDFLib.rgb(0.5, 0.5, 0.5); // grey

        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        pages.forEach(page => {
          const { width, height } = page.getSize();

          if (position === 'diagonal') {
            const x = (width - textWidth) / 2;
            const y = (height - textHeight) / 2;
            page.drawText(text, {
              x,
              y,
              size: fontSize,
              font,
              color: colorRgb,
              opacity,
              rotate: window.PDFLib.degrees(45)
            });
          } else {
            // Horizontal Center
            const x = (width - textWidth) / 2;
            const y = (height - textHeight) / 2;
            page.drawText(text, {
              x,
              y,
              size: fontSize,
              font,
              color: colorRgb,
              opacity
            });
          }
        });

        const watermarkedBytes = await pdfDoc.save();
        const blob = new Blob([watermarkedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentFile.name.replace(/\.pdf$/i, '')}_watermarked.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        applyBtn.disabled = false;
        applyBtn.innerHTML = '<span>🌊</span> Apply & Download Watermarked PDF';
        if (statusElem) statusElem.textContent = '✅ Watermark applied successfully!';
        if (window.showToast) window.showToast('Watermarked PDF downloaded successfully!', 'success');
      } catch (err) {
        console.error(err);
        applyBtn.disabled = false;
        applyBtn.innerHTML = '<span>🌊</span> Apply & Download Watermarked PDF';
        if (statusElem) statusElem.textContent = '❌ Failed: ' + err.message;
        if (window.showToast) window.showToast('Error: ' + err.message, 'error');
      }
    });
  }
}
