/**
 * PDF to JPG / PNG Converter Logic - RozgarTools
 * 100% Client-Side PDF to high-resolution Image conversion via pdf.js & JSZip
 */

document.addEventListener('DOMContentLoaded', () => {
  initPdfToJpg();
});

function initPdfToJpg() {
  const dropZone = document.getElementById('pdf-to-jpg-dropzone');
  const fileInput = document.getElementById('pdf-to-jpg-file-input');
  const browseBtn = document.getElementById('pdf-to-jpg-browse-btn');
  const previewSection = document.getElementById('pdf-pages-preview-card');
  const fileTitle = document.getElementById('pdf-to-jpg-title');
  const fileMeta = document.getElementById('pdf-to-jpg-meta');
  const pagesGrid = document.getElementById('pdf-pages-grid');
  const downloadAllBtn = document.getElementById('download-all-images-btn');
  const imgFormatSelect = document.getElementById('img-format-select');
  const imgQualitySelect = document.getElementById('img-quality-select');
  const statusElem = document.getElementById('pdf-to-jpg-status');

  let currentFile = null;
  let renderedPages = []; // Array of { pageNum, blob, dataUrl, filename }

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
        processPdf(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processPdf(e.target.files[0]);
      }
    });
  }

  async function processPdf(file) {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      if (window.showToast) window.showToast('Please select a valid PDF file.', 'error');
      else alert('Please select a valid PDF file.');
      return;
    }

    if (!window.pdfjsLib) {
      alert('PDF rendering engine not loaded. Please check internet connection and reload.');
      return;
    }

    // Configure worker
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    try {
      currentFile = file;
      renderedPages = [];
      if (statusElem) statusElem.textContent = 'Loading and parsing PDF document...';
      if (pagesGrid) pagesGrid.innerHTML = '';
      if (previewSection) previewSection.style.display = 'block';

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;

      if (fileTitle) fileTitle.textContent = file.name;
      if (fileMeta) fileMeta.textContent = `${totalPages} Page${totalPages > 1 ? 's' : ''} • ${(file.size / (1024 * 1024)).toFixed(2)} MB`;

      const format = imgFormatSelect ? imgFormatSelect.value : 'jpeg';
      const quality = imgQualitySelect ? parseFloat(imgQualitySelect.value) : 0.92;
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const ext = format === 'png' ? 'png' : 'jpg';

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (statusElem) statusElem.textContent = `Rendering page ${pageNum} of ${totalPages}...`;
        const page = await pdf.getPage(pageNum);

        // Render at 2x scale for sharp output
        const scale = 2.0;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        const dataUrl = canvas.toDataURL(mimeType, quality);
        const filename = `${file.name.replace(/\.pdf$/i, '')}_page_${pageNum}.${ext}`;

        renderedPages.push({
          pageNum,
          dataUrl,
          filename
        });

        // Append to preview grid
        const card = document.createElement('div');
        card.className = 'pdf-page-card';
        card.innerHTML = `
          <div class="pdf-page-img-box">
            <img src="${dataUrl}" alt="Page ${pageNum}">
          </div>
          <div class="pdf-page-info">
            <span class="pdf-page-num">Page ${pageNum}</span>
            <button class="btn btn-sm btn-secondary page-download-btn" onclick="window.downloadSinglePage(${pageNum - 1})">
              ⬇ Download ${ext.toUpperCase()}
            </button>
          </div>
        `;
        pagesGrid.appendChild(card);
      }

      if (statusElem) statusElem.textContent = `✅ Successfully converted ${totalPages} page${totalPages > 1 ? 's' : ''}!`;
      if (window.showToast) window.showToast(`Converted all ${totalPages} pages to ${ext.toUpperCase()}!`, 'success');
    } catch (err) {
      console.error(err);
      if (statusElem) statusElem.textContent = '❌ Error converting PDF: ' + err.message;
      if (window.showToast) window.showToast('Failed to convert PDF: ' + err.message, 'error');
    }
  }

  window.downloadSinglePage = function(index) {
    const page = renderedPages[index];
    if (!page) return;
    const a = document.createElement('a');
    a.href = page.dataUrl;
    a.download = page.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', async () => {
      if (renderedPages.length === 0) return;

      if (!window.JSZip) {
        alert('ZIP library not loaded. Please refresh the page.');
        return;
      }

      try {
        downloadAllBtn.disabled = true;
        downloadAllBtn.innerHTML = '<span>⏳</span> Compressing into ZIP...';

        const zip = new window.JSZip();

        for (const page of renderedPages) {
          const base64Data = page.dataUrl.split(',')[1];
          zip.file(page.filename, base64Data, { base64: true });
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentFile.name.replace(/\.pdf$/i, '')}_images.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        downloadAllBtn.disabled = false;
        downloadAllBtn.innerHTML = '<span>📦</span> Download All Pages as ZIP';
        if (window.showToast) window.showToast('ZIP downloaded successfully!', 'success');
      } catch (e) {
        console.error(e);
        downloadAllBtn.disabled = false;
        downloadAllBtn.innerHTML = '<span>📦</span> Download All Pages as ZIP';
        alert('Failed to generate ZIP: ' + e.message);
      }
    });
  }
}
