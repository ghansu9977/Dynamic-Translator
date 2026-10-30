/**
 * Rotate PDF Logic - RozgarTools
 * 100% Client-Side PDF Page Rotation via pdf-lib
 */

document.addEventListener('DOMContentLoaded', () => {
  initRotatePdf();
});

function initRotatePdf() {
  const dropZone = document.getElementById('rotate-dropzone');
  const fileInput = document.getElementById('rotate-file-input');
  const browseBtn = document.getElementById('rotate-browse-btn');
  const settingsCard = document.getElementById('rotate-settings-card');
  const fileTitle = document.getElementById('rotate-file-title');
  const fileMeta = document.getElementById('rotate-file-meta');
  const rotateRightBtn = document.getElementById('rotate-all-right-btn');
  const rotateLeftBtn = document.getElementById('rotate-all-left-btn');
  const rotateAngleDisplay = document.getElementById('current-rotation-angle');
  const saveBtn = document.getElementById('save-rotated-pdf-btn');
  const statusElem = document.getElementById('rotate-status-msg');

  let currentFile = null;
  let currentArrayBuffer = null;
  let rotationAngle = 0; // 0, 90, 180, 270

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
      rotationAngle = 0;
      updateAngleDisplay();

      const doc = await window.PDFLib.PDFDocument.load(currentArrayBuffer, { ignoreEncryption: true });
      const pagesCount = doc.getPageCount();

      if (fileTitle) fileTitle.textContent = file.name;
      if (fileMeta) fileMeta.textContent = `${pagesCount} Page${pagesCount > 1 ? 's' : ''} • ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      if (settingsCard) settingsCard.style.display = 'block';
      if (statusElem) statusElem.textContent = '';
      if (window.showToast) window.showToast(`Loaded "${file.name}" with ${pagesCount} pages.`, 'success');
    } catch (e) {
      console.error(e);
      if (window.showToast) window.showToast('Failed to load PDF: ' + e.message, 'error');
    }
  }

  function updateAngleDisplay() {
    if (rotateAngleDisplay) {
      rotateAngleDisplay.textContent = `${rotationAngle}°`;
    }
  }

  if (rotateRightBtn) {
    rotateRightBtn.addEventListener('click', () => {
      rotationAngle = (rotationAngle + 90) % 360;
      updateAngleDisplay();
    });
  }

  if (rotateLeftBtn) {
    rotateLeftBtn.addEventListener('click', () => {
      rotationAngle = (rotationAngle - 90 + 360) % 360;
      updateAngleDisplay();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      if (!currentArrayBuffer) return;

      if (rotationAngle === 0) {
        if (window.showToast) window.showToast('Please select a rotation angle first (e.g. +90° or -90°).', 'error');
        return;
      }

      try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span>⏳</span> Rotating Document...';
        if (statusElem) statusElem.textContent = 'Applying page rotations...';

        const pdfDoc = await window.PDFLib.PDFDocument.load(currentArrayBuffer);
        const pages = pdfDoc.getPages();

        pages.forEach(page => {
          const currentRotation = page.getRotation().angle;
          page.setRotation(window.PDFLib.degrees((currentRotation + rotationAngle) % 360));
        });

        const rotatedBytes = await pdfDoc.save();
        const blob = new Blob([rotatedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentFile.name.replace(/\.pdf$/i, '')}_rotated_${rotationAngle}deg.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        saveBtn.disabled = false;
        saveBtn.innerHTML = '<span>💾</span> Download Rotated PDF';
        if (statusElem) statusElem.textContent = '✅ PDF rotated and downloaded!';
        if (window.showToast) window.showToast('Rotated PDF downloaded successfully!', 'success');
      } catch (err) {
        console.error(err);
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<span>💾</span> Download Rotated PDF';
        if (statusElem) statusElem.textContent = '❌ Failed: ' + err.message;
        if (window.showToast) window.showToast('Error: ' + err.message, 'error');
      }
    });
  }
}
