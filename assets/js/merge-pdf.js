/**
 * Merge PDF Logic - RozgarTools
 * 100% Client-Side PDF Merging with Drag & Drop Reordering via pdf-lib
 */

document.addEventListener('DOMContentLoaded', () => {
  initMergePdf();
});

function initMergePdf() {
  const dropZone = document.getElementById('merge-dropzone');
  const fileInput = document.getElementById('merge-file-input');
  const browseBtn = document.getElementById('merge-browse-btn');
  const filesListElem = document.getElementById('merge-files-list');
  const actionCard = document.getElementById('merge-action-card');
  const mergeBtn = document.getElementById('start-merge-btn');
  const clearBtn = document.getElementById('clear-merge-files-btn');
  const totalCountBadge = document.getElementById('merge-count-badge');
  const totalSizeBadge = document.getElementById('merge-total-size');
  const statusElem = document.getElementById('merge-status-msg');

  let pdfFiles = []; // Array of { id, file, name, size, pageCount, bytes }

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
      if (e.dataTransfer.files) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files) {
        handleFiles(Array.from(e.target.files));
      }
    });
  }

  async function handleFiles(files) {
    const validFiles = files.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (validFiles.length === 0) {
      if (window.showToast) window.showToast('Please select valid PDF files.', 'error');
      else alert('Please select valid PDF files.');
      return;
    }

    if (statusElem) statusElem.textContent = 'Reading PDF files...';

    for (const file of validFiles) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        let pageCount = 1;
        try {
          if (window.PDFLib) {
            const pdfDoc = await window.PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            pageCount = pdfDoc.getPageCount();
          }
        } catch (err) {
          console.warn('Could not read page count:', err);
        }

        pdfFiles.push({
          id: 'pdf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          file,
          name: file.name,
          size: file.size,
          pageCount,
          bytes: arrayBuffer
        });
      } catch (e) {
        console.error('Error loading PDF file:', e);
      }
    }

    renderList();
    if (fileInput) fileInput.value = '';
    if (statusElem) statusElem.textContent = '';
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function renderList() {
    if (!filesListElem) return;

    if (pdfFiles.length === 0) {
      filesListElem.innerHTML = '';
      if (actionCard) actionCard.style.display = 'none';
      if (totalCountBadge) totalCountBadge.textContent = '0 Files';
      return;
    }

    if (actionCard) actionCard.style.display = 'block';
    if (totalCountBadge) totalCountBadge.textContent = `${pdfFiles.length} PDF${pdfFiles.length > 1 ? 's' : ''}`;

    const totalBytes = pdfFiles.reduce((acc, curr) => acc + curr.size, 0);
    if (totalSizeBadge) totalSizeBadge.textContent = formatBytes(totalBytes);

    filesListElem.innerHTML = pdfFiles.map((item, index) => `
      <div class="pdf-item-card" data-id="${item.id}">
        <div class="pdf-item-left">
          <span class="pdf-order-badge">${index + 1}</span>
          <div class="pdf-file-icon">📑</div>
          <div class="pdf-item-info">
            <span class="pdf-item-name" title="${item.name}">${item.name}</span>
            <span class="pdf-item-meta">${item.pageCount} page${item.pageCount > 1 ? 's' : ''} • ${formatBytes(item.size)}</span>
          </div>
        </div>
        <div class="pdf-item-actions">
          <button class="pdf-action-btn move-up" title="Move Up" ${index === 0 ? 'disabled' : ''} onclick="window.movePdfFile(${index}, -1)">↑</button>
          <button class="pdf-action-btn move-down" title="Move Down" ${index === pdfFiles.length - 1 ? 'disabled' : ''} onclick="window.movePdfFile(${index}, 1)">↓</button>
          <button class="pdf-action-btn remove-btn" title="Remove" onclick="window.removePdfFile(${index})">✕</button>
        </div>
      </div>
    `).join('');
  }

  window.movePdfFile = function(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= pdfFiles.length) return;
    const item = pdfFiles.splice(index, 1)[0];
    pdfFiles.splice(newIndex, 0, item);
    renderList();
  };

  window.removePdfFile = function(index) {
    pdfFiles.splice(index, 1);
    renderList();
  };

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      pdfFiles = [];
      renderList();
    });
  }

  if (mergeBtn) {
    mergeBtn.addEventListener('click', async () => {
      if (pdfFiles.length < 2) {
        if (window.showToast) window.showToast('Please add at least 2 PDF files to merge.', 'error');
        else alert('Please add at least 2 PDF files to merge.');
        return;
      }

      try {
        mergeBtn.disabled = true;
        mergeBtn.innerHTML = '<span>⏳</span> Merging PDFs...';
        if (statusElem) statusElem.textContent = 'Processing PDF pages client-side...';

        const mergedPdf = await window.PDFLib.PDFDocument.create();

        for (let i = 0; i < pdfFiles.length; i++) {
          const item = pdfFiles[i];
          if (statusElem) statusElem.textContent = `Merging file ${i + 1} of ${pdfFiles.length}: ${item.name}...`;

          const srcPdf = await window.PDFLib.PDFDocument.load(item.bytes);
          const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
          copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        if (statusElem) statusElem.textContent = 'Saving merged document...';
        const mergedPdfBytes = await mergedPdf.save();

        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `merged_document_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        mergeBtn.disabled = false;
        mergeBtn.innerHTML = '<span>⚡</span> Merge PDFs Now';
        if (statusElem) statusElem.textContent = '✅ Merged successfully!';
        if (window.showToast) window.showToast('PDFs merged successfully! Download started.', 'success');
      } catch (err) {
        console.error('Failed to merge PDFs:', err);
        mergeBtn.disabled = false;
        mergeBtn.innerHTML = '<span>⚡</span> Merge PDFs Now';
        if (statusElem) statusElem.textContent = '❌ Failed to merge. Please ensure files are not password protected.';
        if (window.showToast) window.showToast('Failed to merge: ' + err.message, 'error');
      }
    });
  }
}
