/**
 * PDF Page Numbers Logic - RozgarTools
 * 100% Client-Side PDF Page Numbering with customizable position and format via pdf-lib
 */

document.addEventListener('DOMContentLoaded', () => {
  initPdfPageNumbers();
});

function initPdfPageNumbers() {
  const dropZone = document.getElementById('pagenum-dropzone');
  const fileInput = document.getElementById('pagenum-file-input');
  const browseBtn = document.getElementById('pagenum-browse-btn');
  const settingsCard = document.getElementById('pagenum-settings-card');
  const fileTitle = document.getElementById('pagenum-file-title');
  const fileMeta = document.getElementById('pagenum-file-meta');
  const positionSelect = document.getElementById('pagenum-position');
  const formatSelect = document.getElementById('pagenum-format');
  const fontSizeSelect = document.getElementById('pagenum-font-size');
  const applyBtn = document.getElementById('apply-pagenum-btn');
  const statusElem = document.getElementById('pagenum-status-msg');

  let currentFile = null;
  let currentArrayBuffer = null;
  let totalPages = 0;

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
      totalPages = doc.getPageCount();

      if (fileTitle) fileTitle.textContent = file.name;
      if (fileMeta) fileMeta.textContent = `${totalPages} Page${totalPages > 1 ? 's' : ''} • ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      if (settingsCard) settingsCard.style.display = 'block';
      if (statusElem) statusElem.textContent = '';
      if (window.showToast) window.showToast(`Loaded "${file.name}". Choose numbering position below.`, 'success');
    } catch (e) {
      console.error(e);
      if (window.showToast) window.showToast('Failed to load PDF: ' + e.message, 'error');
    }
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', async () => {
      if (!currentArrayBuffer) return;

      try {
        applyBtn.disabled = true;
        applyBtn.innerHTML = '<span>⏳</span> Stamping Numbers...';
        if (statusElem) statusElem.textContent = 'Inserting page numbers...';

        const pdfDoc = await window.PDFLib.PDFDocument.load(currentArrayBuffer);
        const font = await pdfDoc.embedFont(window.PDFLib.StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();

        const position = positionSelect ? positionSelect.value : 'bottom-center';
        const format = formatSelect ? formatSelect.value : 'page_of_total';
        const fontSize = parseInt(fontSizeSelect ? fontSizeSelect.value : '11', 10);
        const color = window.PDFLib.rgb(0.2, 0.2, 0.2);

        pages.forEach((page, i) => {
          const pageNum = i + 1;
          let label = `${pageNum}`;
          if (format === 'page_of_total') {
            label = `Page ${pageNum} of ${totalPages}`;
          } else if (format === 'n_of_total') {
            label = `${pageNum}/${totalPages}`;
          } else if (format === 'page_n') {
            label = `Page ${pageNum}`;
          }

          const { width, height } = page.getSize();
          const textWidth = font.widthOfTextAtSize(label, fontSize);
          const margin = 28;

          let x, y;
          if (position === 'bottom-center') {
            x = (width - textWidth) / 2;
            y = margin;
          } else if (position === 'bottom-right') {
            x = width - textWidth - margin;
            y = margin;
          } else if (position === 'bottom-left') {
            x = margin;
            y = margin;
          } else if (position === 'top-right') {
            x = width - textWidth - margin;
            y = height - margin;
          } else if (position === 'top-center') {
            x = (width - textWidth) / 2;
            y = height - margin;
          }

          page.drawText(label, {
            x,
            y,
            size: fontSize,
            font,
            color
          });
        });

        const numberedBytes = await pdfDoc.save();
        const blob = new Blob([numberedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentFile.name.replace(/\.pdf$/i, '')}_numbered.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        applyBtn.disabled = false;
        applyBtn.innerHTML = '<span>🔢</span> Apply Numbers & Download PDF';
        if (statusElem) statusElem.textContent = '✅ Page numbers added successfully!';
        if (window.showToast) window.showToast('Numbered PDF downloaded successfully!', 'success');
      } catch (err) {
        console.error(err);
        applyBtn.disabled = false;
        applyBtn.innerHTML = '<span>🔢</span> Apply Numbers & Download PDF';
        if (statusElem) statusElem.textContent = '❌ Failed: ' + err.message;
        if (window.showToast) window.showToast('Error: ' + err.message, 'error');
      }
    });
  }
}
