/**
 * Split PDF Logic - RozgarTools
 * 100% Client-Side PDF Splitting and Page Extraction via pdf-lib & JSZip
 */

document.addEventListener('DOMContentLoaded', () => {
  initSplitPdf();
});

function initSplitPdf() {
  const dropZone = document.getElementById('split-dropzone');
  const fileInput = document.getElementById('split-file-input');
  const browseBtn = document.getElementById('split-browse-btn');
  const splitSettings = document.getElementById('split-settings-card');
  const fileInfoTitle = document.getElementById('split-file-title');
  const fileInfoMeta = document.getElementById('split-file-meta');
  const rangeInput = document.getElementById('split-range-input');
  const splitModeRadios = document.querySelectorAll('input[name="split-mode"]');
  const rangeBox = document.getElementById('split-range-box');
  const splitBtn = document.getElementById('start-split-btn');
  const statusElem = document.getElementById('split-status-msg');

  let currentPdfFile = null;
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
        loadFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        loadFile(e.target.files[0]);
      }
    });
  }

  splitModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (rangeBox) {
        rangeBox.style.display = e.target.value === 'range' ? 'block' : 'none';
      }
    });
  });

  async function loadFile(file) {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      if (window.showToast) window.showToast('Please select a valid PDF file.', 'error');
      else alert('Please select a valid PDF file.');
      return;
    }

    try {
      if (statusElem) statusElem.textContent = 'Loading PDF...';
      currentPdfFile = file;
      currentArrayBuffer = await file.arrayBuffer();

      const pdfDoc = await window.PDFLib.PDFDocument.load(currentArrayBuffer, { ignoreEncryption: true });
      totalPages = pdfDoc.getPageCount();

      if (fileInfoTitle) fileInfoTitle.textContent = file.name;
      if (fileInfoMeta) fileInfoMeta.textContent = `${totalPages} Page${totalPages > 1 ? 's' : ''} • ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      if (rangeInput) {
        rangeInput.placeholder = `e.g. 1-${Math.min(3, totalPages)}, ${totalPages}`;
        rangeInput.value = `1-${totalPages}`;
      }

      if (splitSettings) splitSettings.style.display = 'block';
      if (statusElem) statusElem.textContent = '';
      if (window.showToast) window.showToast(`Loaded "${file.name}" with ${totalPages} pages.`, 'success');
    } catch (err) {
      console.error(err);
      if (window.showToast) window.showToast('Failed to load PDF: ' + err.message, 'error');
    }
  }

  function parsePageRange(rangeStr, maxPages) {
    const pages = new Set();
    const parts = rangeStr.split(',').map(p => p.trim()).filter(Boolean);

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map(s => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(maxPages, Math.max(start, end));
          for (let i = from; i <= to; i++) {
            pages.add(i - 1); // 0-indexed
          }
        }
      } else {
        const pageNum = parseInt(part, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
          pages.add(pageNum - 1); // 0-indexed
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  }

  if (splitBtn) {
    splitBtn.addEventListener('click', async () => {
      if (!currentArrayBuffer) {
        if (window.showToast) window.showToast('Please upload a PDF first.', 'error');
        return;
      }

      const activeMode = document.querySelector('input[name="split-mode"]:checked')?.value || 'range';

      try {
        splitBtn.disabled = true;
        splitBtn.innerHTML = '<span>⏳</span> Processing...';

        const srcDoc = await window.PDFLib.PDFDocument.load(currentArrayBuffer);

        if (activeMode === 'range') {
          const rangeVal = rangeInput.value.trim();
          if (!rangeVal) {
            alert('Please enter page numbers or range.');
            splitBtn.disabled = false;
            splitBtn.innerHTML = '<span>✂️</span> Split PDF Now';
            return;
          }

          const pageIndices = parsePageRange(rangeVal, totalPages);
          if (pageIndices.length === 0) {
            alert(`No valid pages selected. Range must be between 1 and ${totalPages}.`);
            splitBtn.disabled = false;
            splitBtn.innerHTML = '<span>✂️</span> Split PDF Now';
            return;
          }

          if (statusElem) statusElem.textContent = `Extracting ${pageIndices.length} pages...`;

          const newDoc = await window.PDFLib.PDFDocument.create();
          const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
          copiedPages.forEach(p => newDoc.addPage(p));

          const pdfBytes = await newDoc.save();
          downloadBlob(pdfBytes, `${currentPdfFile.name.replace(/\.pdf$/i, '')}_extracted.pdf`, 'application/pdf');

          if (statusElem) statusElem.textContent = '✅ Extraction complete!';
          if (window.showToast) window.showToast('Extracted pages downloaded successfully!', 'success');
        } else {
          // Extract each page to individual PDF in ZIP
          if (statusElem) statusElem.textContent = `Splitting into ${totalPages} separate pages...`;

          if (!window.JSZip) {
            throw new Error('ZIP library not loaded. Please refresh the page.');
          }

          const zip = new window.JSZip();

          for (let i = 0; i < totalPages; i++) {
            if (statusElem) statusElem.textContent = `Processing page ${i + 1} of ${totalPages}...`;
            const singleDoc = await window.PDFLib.PDFDocument.create();
            const [copiedPage] = await singleDoc.copyPages(srcDoc, [i]);
            singleDoc.addPage(copiedPage);
            const pageBytes = await singleDoc.save();
            const pageFilename = `page_${i + 1}.pdf`;
            zip.file(pageFilename, pageBytes);
          }

          if (statusElem) statusElem.textContent = 'Generating ZIP archive...';
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          downloadBlob(zipBlob, `${currentPdfFile.name.replace(/\.pdf$/i, '')}_split_pages.zip`, 'application/zip');

          if (statusElem) statusElem.textContent = '✅ All pages split and zipped!';
          if (window.showToast) window.showToast('All pages split successfully as ZIP!', 'success');
        }

        splitBtn.disabled = false;
        splitBtn.innerHTML = '<span>✂️</span> Split PDF Now';
      } catch (err) {
        console.error(err);
        splitBtn.disabled = false;
        splitBtn.innerHTML = '<span>✂️</span> Split PDF Now';
        if (statusElem) statusElem.textContent = '❌ Failed to split PDF: ' + err.message;
        if (window.showToast) window.showToast('Failed to split PDF: ' + err.message, 'error');
      }
    });
  }

  function downloadBlob(content, filename, type) {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
