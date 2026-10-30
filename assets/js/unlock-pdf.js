/**
 * Unlock PDF Logic - RozgarTools
 * 100% Client-Side PDF Password Removal via pdf-lib
 */

document.addEventListener('DOMContentLoaded', () => {
  initUnlockPdf();
});

function initUnlockPdf() {
  const dropZone = document.getElementById('unlock-dropzone');
  const fileInput = document.getElementById('unlock-file-input');
  const browseBtn = document.getElementById('unlock-browse-btn');
  const settingsCard = document.getElementById('unlock-settings-card');
  const fileTitle = document.getElementById('unlock-file-title');
  const fileMeta = document.getElementById('unlock-file-meta');
  const passInput = document.getElementById('unlock-password-input');
  const unlockBtn = document.getElementById('unlock-pdf-btn');
  const statusElem = document.getElementById('unlock-status-msg');

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

      if (fileTitle) fileTitle.textContent = file.name;
      if (fileMeta) fileMeta.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB • Locked Document`;
      if (settingsCard) settingsCard.style.display = 'block';
      if (statusElem) statusElem.textContent = '';
      if (window.showToast) window.showToast(`Loaded "${file.name}". Enter password to unlock.`, 'success');
    } catch (e) {
      console.error(e);
      if (window.showToast) window.showToast('Failed to load PDF: ' + e.message, 'error');
    }
  }

  if (unlockBtn) {
    unlockBtn.addEventListener('click', async () => {
      if (!currentArrayBuffer) return;

      const password = passInput ? passInput.value : '';
      if (!password) {
        alert('Please enter the PDF password to unlock.');
        if (passInput) passInput.focus();
        return;
      }

      try {
        unlockBtn.disabled = true;
        unlockBtn.innerHTML = '<span>⏳</span> Decrypting & Unlocking...';
        if (statusElem) statusElem.textContent = 'Verifying password and decrypting...';

        // Load document with password
        // In pdf-lib, loading with password or copying pages to fresh PDF removes protection
        const pdfDoc = await window.PDFLib.PDFDocument.load(currentArrayBuffer, {
          password: password,
          ignoreEncryption: false
        });

        // Create clean unencrypted clone
        const unlockedDoc = await window.PDFLib.PDFDocument.create();
        const pageIndices = pdfDoc.getPageIndices();
        const copiedPages = await unlockedDoc.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach(p => unlockedDoc.addPage(p));

        const unlockedBytes = await unlockedDoc.save();
        const blob = new Blob([unlockedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentFile.name.replace(/\.pdf$/i, '')}_unlocked.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        unlockBtn.disabled = false;
        unlockBtn.innerHTML = '<span>🔓</span> Unlock & Download PDF';
        if (statusElem) statusElem.textContent = '✅ PDF password removed! Download started.';
        if (window.showToast) window.showToast('PDF unlocked and downloaded successfully!', 'success');
      } catch (err) {
        console.error(err);
        unlockBtn.disabled = false;
        unlockBtn.innerHTML = '<span>🔓</span> Unlock & Download PDF';
        if (statusElem) statusElem.textContent = '❌ Incorrect password or unsupported encryption.';
        if (window.showToast) window.showToast('Incorrect password or failed to unlock.', 'error');
      }
    });
  }
}
