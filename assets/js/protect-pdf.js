/**
 * Protect PDF Logic - RozgarTools
 * 100% Client-Side PDF Password Encryption via pdf-lib
 */

document.addEventListener('DOMContentLoaded', () => {
  initProtectPdf();
});

function initProtectPdf() {
  const dropZone = document.getElementById('protect-dropzone');
  const fileInput = document.getElementById('protect-file-input');
  const browseBtn = document.getElementById('protect-browse-btn');
  const settingsCard = document.getElementById('protect-settings-card');
  const fileTitle = document.getElementById('protect-file-title');
  const fileMeta = document.getElementById('protect-file-meta');
  const passInput = document.getElementById('protect-password-input');
  const confirmPassInput = document.getElementById('protect-confirm-password');
  const protectBtn = document.getElementById('protect-pdf-btn');
  const statusElem = document.getElementById('protect-status-msg');

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
      if (window.showToast) window.showToast(`Loaded "${file.name}". Set your password below.`, 'success');
    } catch (e) {
      console.error(e);
      if (window.showToast) window.showToast('Failed to load PDF: ' + e.message, 'error');
    }
  }

  if (protectBtn) {
    protectBtn.addEventListener('click', async () => {
      if (!currentArrayBuffer) return;

      const password = passInput ? passInput.value : '';
      const confirmPass = confirmPassInput ? confirmPassInput.value : '';

      if (!password) {
        alert('Please enter a password to protect the PDF.');
        if (passInput) passInput.focus();
        return;
      }

      if (password !== confirmPass) {
        alert('Passwords do not match. Please check and re-enter.');
        if (confirmPassInput) confirmPassInput.focus();
        return;
      }

      try {
        protectBtn.disabled = true;
        protectBtn.innerHTML = '<span>⏳</span> Encrypting Document...';
        if (statusElem) statusElem.textContent = 'Encrypting PDF client-side...';

        const pdfDoc = await window.PDFLib.PDFDocument.load(currentArrayBuffer);
        
        // Encrypt with user and owner password
        await pdfDoc.encrypt({
          userPassword: password,
          ownerPassword: password,
          permissions: {
            printing: 'highResolution',
            modifying: false,
            copying: false,
            annotating: false,
            fillingForms: true,
            contentAccessibility: true,
            documentAssembly: false
          }
        });

        const encryptedBytes = await pdfDoc.save();
        const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentFile.name.replace(/\.pdf$/i, '')}_protected.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        protectBtn.disabled = false;
        protectBtn.innerHTML = '<span>🔒</span> Encrypt & Download PDF';
        if (statusElem) statusElem.textContent = '✅ PDF encrypted with password successfully!';
        if (window.showToast) window.showToast('Protected PDF downloaded successfully!', 'success');
      } catch (err) {
        console.error(err);
        protectBtn.disabled = false;
        protectBtn.innerHTML = '<span>🔒</span> Encrypt & Download PDF';
        if (statusElem) statusElem.textContent = '❌ Failed: ' + err.message;
        if (window.showToast) window.showToast('Error: ' + err.message, 'error');
      }
    });
  }
}
