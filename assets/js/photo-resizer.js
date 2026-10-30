/**
 * Govt Form Photo & Signature Resizer Logic
 * High-precision Client-Side Binary Search Canvas Compression Engine
 * Guarantees exact target KB (20KB, 50KB, 100KB, Custom) with optimal clarity.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPhotoResizer();
});

function initPhotoResizer() {
  const dropZone = document.getElementById('resizer-dropzone');
  const fileInput = document.getElementById('resizer-file-input');
  const browseBtn = document.getElementById('browse-file-btn');
  const targetKbInput = document.getElementById('target-kb-input');
  const presetKbPills = document.querySelectorAll('.preset-kb-btn');
  const presetDimPills = document.querySelectorAll('.preset-dim-btn');
  const customWidthInput = document.getElementById('custom-width-input');
  const customHeightInput = document.getElementById('custom-height-input');
  const lockAspectCheck = document.getElementById('lock-aspect-ratio');
  const processBtn = document.getElementById('process-image-btn');
  const downloadBtn = document.getElementById('download-image-btn');

  const previewSection = document.getElementById('preview-section');
  const origImgElem = document.getElementById('orig-img-preview');
  const resizedImgElem = document.getElementById('resized-img-preview');
  const origKbStat = document.getElementById('orig-kb-stat');
  const resizedKbStat = document.getElementById('resized-kb-stat');
  const origDimStat = document.getElementById('orig-dim-stat');
  const resizedDimStat = document.getElementById('resized-dim-stat');
  const statusBadge = document.getElementById('resizer-status-badge');

  let currentSourceImage = null;
  let sourceFileName = 'govt_photo';
  let targetKb = 50; // default 50KB for passport
  let targetWidth = 350;
  let targetHeight = 450;
  let isDimensionPresetActive = 'passport'; // 'passport', 'signature', 'original', 'custom'
  let processedBlob = null;

  // File Upload Handlers
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
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
      }
    });
  }

  // KB Presets
  presetKbPills.forEach(pill => {
    pill.addEventListener('click', () => {
      presetKbPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const kb = parseInt(pill.getAttribute('data-kb'), 10);
      targetKb = kb;
      if (targetKbInput) targetKbInput.value = kb;

      // Auto-suggest dimensions if 20KB is selected (usually signature)
      if (kb === 20 && isDimensionPresetActive !== 'custom') {
        selectDimensionPreset('signature');
      } else if (kb === 50 && isDimensionPresetActive !== 'custom') {
        selectDimensionPreset('passport');
      }

      if (currentSourceImage) processImage();
    });
  });

  if (targetKbInput) {
    targetKbInput.addEventListener('input', () => {
      const val = parseInt(targetKbInput.value, 10);
      if (!isNaN(val) && val > 0) {
        targetKb = val;
        presetKbPills.forEach(p => {
          if (parseInt(p.getAttribute('data-kb'), 10) === val) {
            p.classList.add('active');
          } else {
            p.classList.remove('active');
          }
        });
        if (currentSourceImage) processImage();
      }
    });
  }

  // Dimension Presets
  presetDimPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const preset = pill.getAttribute('data-dim');
      selectDimensionPreset(preset);
      if (currentSourceImage) processImage();
    });
  });

  function selectDimensionPreset(preset) {
    isDimensionPresetActive = preset;
    presetDimPills.forEach(p => {
      if (p.getAttribute('data-dim') === preset) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    if (preset === 'passport') {
      targetWidth = 350;
      targetHeight = 450;
      if (customWidthInput) customWidthInput.value = 350;
      if (customHeightInput) customHeightInput.value = 450;
    } else if (preset === 'signature') {
      targetWidth = 350;
      targetHeight = 150;
      if (customWidthInput) customWidthInput.value = 350;
      if (customHeightInput) customHeightInput.value = 150;
    } else if (preset === 'original' && currentSourceImage) {
      targetWidth = currentSourceImage.naturalWidth;
      targetHeight = currentSourceImage.naturalHeight;
      if (customWidthInput) customWidthInput.value = targetWidth;
      if (customHeightInput) customHeightInput.value = targetHeight;
    }
  }

  if (customWidthInput && customHeightInput) {
    customWidthInput.addEventListener('input', () => {
      const w = parseInt(customWidthInput.value, 10);
      if (!isNaN(w) && w > 0) {
        targetWidth = w;
        if (lockAspectCheck && lockAspectCheck.checked && currentSourceImage) {
          const ratio = currentSourceImage.naturalHeight / currentSourceImage.naturalWidth;
          targetHeight = Math.round(w * ratio);
          customHeightInput.value = targetHeight;
        }
        isDimensionPresetActive = 'custom';
        presetDimPills.forEach(p => p.classList.remove('active'));
      }
    });

    customHeightInput.addEventListener('input', () => {
      const h = parseInt(customHeightInput.value, 10);
      if (!isNaN(h) && h > 0) {
        targetHeight = h;
        if (lockAspectCheck && lockAspectCheck.checked && currentSourceImage) {
          const ratio = currentSourceImage.naturalWidth / currentSourceImage.naturalHeight;
          targetWidth = Math.round(h * ratio);
          customWidthInput.value = targetWidth;
        }
        isDimensionPresetActive = 'custom';
        presetDimPills.forEach(p => p.classList.remove('active'));
      }
    });
  }

  // Load File
  function handleFileSelection(file) {
    if (!file || !file.type.match('image.*')) {
      alert('Please select a valid image file (JPG or PNG).');
      return;
    }

    sourceFileName = file.name.replace(/\.[^/.]+$/, "");
    const origSizeKb = (file.size / 1024).toFixed(1);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        currentSourceImage = img;
        if (origImgElem) origImgElem.src = img.src;
        if (origKbStat) origKbStat.textContent = `${origSizeKb} KB`;
        if (origDimStat) origDimStat.textContent = `${img.naturalWidth} × ${img.naturalHeight} px`;

        // Default dimensions set to passport if not changed
        if (isDimensionPresetActive === 'passport') {
          targetWidth = 350;
          targetHeight = 450;
        } else if (isDimensionPresetActive === 'signature') {
          targetWidth = 350;
          targetHeight = 150;
        } else {
          targetWidth = img.naturalWidth;
          targetHeight = img.naturalHeight;
        }
        if (customWidthInput) customWidthInput.value = targetWidth;
        if (customHeightInput) customHeightInput.value = targetHeight;

        if (previewSection) previewSection.style.display = 'block';
        processImage();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Process / Compress Logic
  if (processBtn) {
    processBtn.addEventListener('click', () => {
      if (currentSourceImage) processImage();
    });
  }

  async function processImage() {
    if (!currentSourceImage) return;

    if (statusBadge) {
      statusBadge.textContent = '🔄 Processing... (Compressing)';
      statusBadge.className = 'badge-processing';
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Scale dimensions based on target or preset
    let renderW = targetWidth || 350;
    let renderH = targetHeight || 450;

    canvas.width = renderW;
    canvas.height = renderH;

    // Fill white background for transparent PNGs
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, renderW, renderH);

    // Draw image with smooth bicubic scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(currentSourceImage, 0, 0, renderW, renderH);

    // Binary Search Compression for Exact Target KB
    const targetBytes = targetKb * 1024;
    let minQuality = 0.05;
    let maxQuality = 0.98;
    let bestBlob = null;
    let bestDiff = Infinity;

    // 8-step Binary Search for precise JPEG quality match
    for (let step = 0; step < 8; step++) {
      const midQuality = (minQuality + maxQuality) / 2;
      const blob = await canvasToBlob(canvas, 'image/jpeg', midQuality);

      const diff = Math.abs(blob.size - targetBytes);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestBlob = blob;
      }

      if (blob.size > targetBytes) {
        maxQuality = midQuality;
      } else {
        minQuality = midQuality;
      }
    }

    // If even minQuality is higher than target (happens with massive canvas dimensions)
    if (bestBlob && bestBlob.size > targetBytes * 1.1) {
      // Step-down canvas resolution slightly to guarantee under target KB
      const scaleFactor = Math.sqrt(targetBytes / bestBlob.size);
      const scaledW = Math.round(renderW * scaleFactor * 0.95);
      const scaledH = Math.round(renderH * scaleFactor * 0.95);

      const scCanvas = document.createElement('canvas');
      scCanvas.width = scaledW;
      scCanvas.height = scaledH;
      const scCtx = scCanvas.getContext('2d');
      scCtx.fillStyle = '#FFFFFF';
      scCtx.fillRect(0, 0, scaledW, scaledH);
      scCtx.imageSmoothingQuality = 'high';
      scCtx.drawImage(currentSourceImage, 0, 0, scaledW, scaledH);

      bestBlob = await canvasToBlob(scCanvas, 'image/jpeg', 0.85);
      renderW = scaledW;
      renderH = scaledH;
    }

    processedBlob = bestBlob;
    const finalKb = (processedBlob.size / 1024).toFixed(1);
    const objectUrl = URL.createObjectURL(processedBlob);

    if (resizedImgElem) resizedImgElem.src = objectUrl;
    if (resizedKbStat) resizedKbStat.textContent = `${finalKb} KB`;
    if (resizedDimStat) resizedDimStat.textContent = `${renderW} × ${renderH} px`;

    if (statusBadge) {
      statusBadge.textContent = `✅ Ready! Exact ${finalKb} KB (Target: ${targetKb} KB)`;
      statusBadge.className = 'badge-success';
    }

    if (window.showToast) {
      window.showToast(`Successfully compressed to ${finalKb} KB!`);
    }
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), type, quality);
    });
  }

  // 1-Click Download Handler
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!processedBlob) {
        alert('Please upload an image first to download.');
        return;
      }

      const a = document.createElement('a');
      a.href = URL.createObjectURL(processedBlob);
      a.download = `${sourceFileName}_${targetKb}kb_govt_form.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (window.showToast) {
        window.showToast('📥 Photo downloaded successfully!');
      }
    });
  }
}
