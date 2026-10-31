/**
 * RozgarTools - Govt Form Photo & Signature Resizer Logic
 * Supports BOTH Single Image and Multiple / Batch Images Resizing
 * 100% Client-Side Privacy: Canvas Binary Search Compression + JSZip Batch Downloader
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
  const statusBadge = document.getElementById('resizer-status-badge');

  // Tabs & Views
  const tabSingle = document.getElementById('tab-single-mode');
  const tabBatch = document.getElementById('tab-batch-mode');
  const singleWrap = document.getElementById('single-preview-wrap');
  const batchWrap = document.getElementById('batch-preview-wrap');
  const batchTabCount = document.getElementById('batch-tab-count');
  const batchTargetLabel = document.getElementById('batch-target-label');
  const batchGrid = document.getElementById('batch-grid-container');

  // Single View Elements
  const origImgElem = document.getElementById('orig-img-preview');
  const resizedImgElem = document.getElementById('resized-img-preview');
  const origKbStat = document.getElementById('orig-kb-stat');
  const resizedKbStat = document.getElementById('resized-kb-stat');
  const origDimStat = document.getElementById('orig-dim-stat');
  const resizedDimStat = document.getElementById('resized-dim-stat');
  const downloadSingleBtn = document.getElementById('download-image-btn');

  // Batch View Elements
  const batchAddBtn = document.getElementById('batch-add-more-btn');
  const batchClearBtn = document.getElementById('batch-clear-btn');
  const downloadZipBtn = document.getElementById('download-all-zip-btn');
  const downloadDirectBtn = document.getElementById('download-all-direct-btn');

  // State Variables
  let currentSourceImage = null;
  let sourceFileName = 'govt_photo';
  let processedBlob = null;
  let targetKb = 50; // default 50KB for passport
  let targetWidth = 350;
  let targetHeight = 450;
  let isDimensionPresetActive = 'passport'; // 'passport', 'signature', 'original', 'custom'
  let activeMode = 'single'; // 'single' or 'batch'

  // Batch Array of items: { id, file, name, originalKb, img, processedBlob, finalKb, renderW, renderH }
  let batchItems = [];

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
        handleFilesSelection(Array.from(e.dataTransfer.files));
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFilesSelection(Array.from(e.target.files));
        fileInput.value = ''; // Reset input to allow re-selecting same files
      }
    });
  }

  if (batchAddBtn && fileInput) {
    batchAddBtn.addEventListener('click', () => fileInput.click());
  }

  if (batchClearBtn) {
    batchClearBtn.addEventListener('click', () => {
      batchItems = [];
      updateBatchView();
      switchMode('single');
      if (window.showToast) window.showToast('Batch queue cleared.');
    });
  }

  // Mode Tabs Switching
  if (tabSingle && tabBatch) {
    tabSingle.addEventListener('click', () => switchMode('single'));
    tabBatch.addEventListener('click', () => switchMode('batch'));
  }

  function switchMode(mode) {
    activeMode = mode;
    if (mode === 'single') {
      if (tabSingle) tabSingle.classList.add('active');
      if (tabBatch) tabBatch.classList.remove('active');
      if (singleWrap) singleWrap.style.display = 'block';
      if (batchWrap) batchWrap.style.display = 'none';
    } else {
      if (tabSingle) tabSingle.classList.remove('active');
      if (tabBatch) tabBatch.classList.add('active');
      if (singleWrap) singleWrap.style.display = 'none';
      if (batchWrap) batchWrap.style.display = 'block';
    }
  }

  // Main File Handler (Single vs Multiple)
  function handleFilesSelection(files) {
    const validImageFiles = files.filter(f => f.type.startsWith('image/'));
    if (validImageFiles.length === 0) {
      if (window.showToast) window.showToast('Please select valid image files (JPG, PNG, WebP).', 'error');
      else alert('Please select valid image files (JPG, PNG, WebP).');
      return;
    }

    if (validImageFiles.length === 1 && batchItems.length === 0) {
      // Single Mode
      loadSingleFile(validImageFiles[0]);
      switchMode('single');
    } else {
      // Multiple / Batch Mode
      switchMode('batch');
      addFilesToBatch(validImageFiles);
    }
  }

  // Load Single File
  function loadSingleFile(file) {
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

        // Dimensions preset defaults
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

        processSingleImage();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Add Files to Batch
  async function addFilesToBatch(files) {
    if (statusBadge) {
      statusBadge.textContent = `⏳ Loading ${files.length} images...`;
      statusBadge.className = 'badge-processing';
    }

    for (const file of files) {
      const id = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      const name = file.name.replace(/\.[^/.]+$/, "");
      const originalKb = (file.size / 1024).toFixed(1);

      const img = await loadImageAsync(file);
      batchItems.push({
        id,
        file,
        name,
        originalKb,
        img,
        processedBlob: null,
        finalKb: 0,
        renderW: 0,
        renderH: 0,
        isProcessing: true
      });
    }

    updateBatchView();
    await processBatchImages();
  }

  function loadImageAsync(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Render Batch Gallery Grid
  function updateBatchView() {
    if (batchTabCount) batchTabCount.textContent = batchItems.length;
    if (batchTargetLabel) batchTargetLabel.textContent = `${targetKb} KB`;

    if (!batchGrid) return;
    batchGrid.innerHTML = '';

    if (batchItems.length === 0) {
      batchGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2.5rem; color: var(--text-dim);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📁</div>
          <p>No photos in batch queue. Drag and drop multiple photos to start.</p>
        </div>
      `;
      return;
    }

    batchItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'batch-card';
      card.id = `card_${item.id}`;

      const thumbSrc = item.processedBlob ? URL.createObjectURL(item.processedBlob) : item.img.src;
      const statusText = item.isProcessing 
        ? '⏳ Compressing...' 
        : `Exact ${item.finalKb} KB`;

      card.innerHTML = `
        <button type="button" class="batch-card-remove" title="Remove image" data-id="${item.id}">✖</button>
        <div class="batch-thumb-wrap">
          <img class="batch-thumb" src="${thumbSrc}" alt="${item.name}">
        </div>
        <div class="batch-info">
          <div class="batch-name" title="${item.name}">${item.name}</div>
          <div class="batch-meta">
            <span>Orig: ${item.originalKb} KB</span>
            <span>${item.renderW || item.img.naturalWidth}×${item.renderH || item.img.naturalHeight}px</span>
          </div>
          <span class="batch-status-badge">${statusText}</span>
        </div>
        <button type="button" class="btn btn-accent btn-sm batch-btn-download" data-id="${item.id}" ${item.isProcessing ? 'disabled' : ''}>
          📥 Download (${item.finalKb || targetKb} KB)
        </button>
      `;

      // Event: Remove
      const removeBtn = card.querySelector('.batch-card-remove');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        batchItems = batchItems.filter(i => i.id !== item.id);
        updateBatchView();
        if (batchItems.length === 0) switchMode('single');
      });

      // Event: Single Download in Card
      const dlBtn = card.querySelector('.batch-btn-download');
      dlBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (item.processedBlob) {
          downloadBlob(item.processedBlob, `${item.name}_${targetKb}kb_govt_form.jpg`);
        }
      });

      batchGrid.appendChild(card);
    });
  }

  // Process Entire Batch
  async function processBatchImages() {
    if (batchItems.length === 0) return;

    if (statusBadge) {
      statusBadge.textContent = `⚡ Compressing 0/${batchItems.length}...`;
      statusBadge.className = 'badge-processing';
    }

    let completed = 0;
    for (const item of batchItems) {
      item.isProcessing = true;
      const res = await compressImageToTarget(item.img, targetKb, targetWidth, targetHeight, isDimensionPresetActive);
      item.processedBlob = res.blob;
      item.finalKb = (res.blob.size / 1024).toFixed(1);
      item.renderW = res.renderW;
      item.renderH = res.renderH;
      item.isProcessing = false;

      completed++;
      if (statusBadge) {
        statusBadge.textContent = `⚡ Compressing ${completed}/${batchItems.length}...`;
      }

      // Update specific card in DOM
      const card = document.getElementById(`card_${item.id}`);
      if (card) {
        const thumb = card.querySelector('.batch-thumb');
        if (thumb) thumb.src = URL.createObjectURL(item.processedBlob);

        const badge = card.querySelector('.batch-status-badge');
        if (badge) badge.textContent = `Exact ${item.finalKb} KB`;

        const meta = card.querySelector('.batch-meta span:last-child');
        if (meta) meta.textContent = `${item.renderW}×${item.renderH}px`;

        const dlBtn = card.querySelector('.batch-btn-download');
        if (dlBtn) {
          dlBtn.disabled = false;
          dlBtn.textContent = `📥 Download (${item.finalKb} KB)`;
        }
      }
    }

    if (statusBadge) {
      statusBadge.textContent = `✅ Ready! All ${batchItems.length} photos resized to ~${targetKb} KB`;
      statusBadge.className = 'badge-success';
    }

    if (window.showToast) {
      window.showToast(`Batch completed: ${batchItems.length} photos ready for download!`);
    }
  }

  // Core Compression Function (Binary Search Canvas)
  async function compressImageToTarget(sourceImg, targetKbs, tWidth, tHeight, dimPreset) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let renderW = tWidth || 350;
    let renderH = tHeight || 450;

    if (dimPreset === 'original') {
      renderW = sourceImg.naturalWidth;
      renderH = sourceImg.naturalHeight;
    }

    canvas.width = renderW;
    canvas.height = renderH;

    // Fill white background for transparent PNGs
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, renderW, renderH);

    // High quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceImg, 0, 0, renderW, renderH);

    // Binary search for target KB
    const targetBytes = targetKbs * 1024;
    let minQuality = 0.05;
    let maxQuality = 0.98;
    let bestBlob = null;
    let bestDiff = Infinity;

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

    // Step-down canvas size if even min quality is larger than target
    if (bestBlob && bestBlob.size > targetBytes * 1.1) {
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
      scCtx.drawImage(sourceImg, 0, 0, scaledW, scaledH);

      bestBlob = await canvasToBlob(scCanvas, 'image/jpeg', 0.85);
      renderW = scaledW;
      renderH = scaledH;
    }

    return { blob: bestBlob, renderW, renderH };
  }

  // Single Image Compression
  async function processSingleImage() {
    if (!currentSourceImage) return;

    if (statusBadge) {
      statusBadge.textContent = '🔄 Processing... (Compressing)';
      statusBadge.className = 'badge-processing';
    }

    const res = await compressImageToTarget(currentSourceImage, targetKb, targetWidth, targetHeight, isDimensionPresetActive);
    processedBlob = res.blob;
    const finalKb = (processedBlob.size / 1024).toFixed(1);
    const objectUrl = URL.createObjectURL(processedBlob);

    if (resizedImgElem) resizedImgElem.src = objectUrl;
    if (resizedKbStat) resizedKbStat.textContent = `${finalKb} KB`;
    if (resizedDimStat) resizedDimStat.textContent = `${res.renderW} × ${res.renderH} px`;

    if (statusBadge) {
      statusBadge.textContent = `✅ Ready! Exact ${finalKb} KB (Target: ${targetKb} KB)`;
      statusBadge.className = 'badge-success';
    }

    if (window.showToast) {
      window.showToast(`Compressed successfully to ${finalKb} KB!`);
    }
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), type, quality);
    });
  }

  function downloadBlob(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (window.showToast) window.showToast(`📥 Downloaded ${filename}`);
  }

  // Single Download Trigger
  if (downloadSingleBtn) {
    downloadSingleBtn.addEventListener('click', () => {
      if (!processedBlob) {
        alert('Please upload an image first to download.');
        return;
      }
      downloadBlob(processedBlob, `${sourceFileName}_${targetKb}kb_govt_form.jpg`);
    });
  }

  // Batch Download All Direct (Sequential)
  if (downloadDirectBtn) {
    downloadDirectBtn.addEventListener('click', () => {
      const readyItems = batchItems.filter(i => i.processedBlob);
      if (readyItems.length === 0) {
        alert('No resized photos ready to download.');
        return;
      }

      if (window.showToast) window.showToast(`Downloading all ${readyItems.length} photos...`);

      readyItems.forEach((item, index) => {
        setTimeout(() => {
          downloadBlob(item.processedBlob, `${item.name}_${targetKb}kb_govt_form.jpg`);
        }, index * 250);
      });
    });
  }

  // Lazy-load JSZip Helper
  function loadJSZipLib() {
    return new Promise((resolve, reject) => {
      if (window.JSZip) return resolve(window.JSZip);
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      script.onload = () => resolve(window.JSZip);
      script.onerror = () => reject(new Error('Failed to load ZIP library.'));
      document.head.appendChild(script);
    });
  }

  // Batch Download All as ZIP (1-Click)
  if (downloadZipBtn) {
    downloadZipBtn.addEventListener('click', async () => {
      const readyItems = batchItems.filter(i => i.processedBlob);
      if (readyItems.length === 0) {
        alert('No resized photos ready to package.');
        return;
      }

      downloadZipBtn.disabled = true;
      const originalText = downloadZipBtn.textContent;
      downloadZipBtn.textContent = '⏳ Creating ZIP Archive...';

      try {
        const JSZip = await loadJSZipLib();
        const zip = new JSZip();

        readyItems.forEach((item, idx) => {
          const fileName = `${item.name || 'photo_' + (idx + 1)}_${targetKb}kb.jpg`;
          zip.file(fileName, item.processedBlob);
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadBlob(zipBlob, `RozgarTools_Resized_${targetKb}KB_Batch.zip`);
        if (window.showToast) window.showToast('📦 Batch ZIP downloaded successfully!');
      } catch (err) {
        console.error(err);
        alert('Error creating ZIP archive: ' + err.message);
      } finally {
        downloadZipBtn.disabled = false;
        downloadZipBtn.textContent = originalText;
      }
    });
  }

  // Re-process on Settings Change
  if (processBtn) {
    processBtn.addEventListener('click', () => {
      if (activeMode === 'batch') processBatchImages();
      else if (currentSourceImage) processSingleImage();
    });
  }

  // KB Presets Event Listeners
  presetKbPills.forEach(pill => {
    pill.addEventListener('click', () => {
      presetKbPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const kb = parseInt(pill.getAttribute('data-kb'), 10);
      targetKb = kb;
      if (targetKbInput) targetKbInput.value = kb;

      // Auto-suggest dimensions
      if (kb === 20 && isDimensionPresetActive !== 'custom') {
        selectDimensionPreset('signature');
      } else if (kb === 50 && isDimensionPresetActive !== 'custom') {
        selectDimensionPreset('passport');
      }

      if (batchTargetLabel) batchTargetLabel.textContent = `${targetKb} KB`;

      if (activeMode === 'batch' && batchItems.length > 0) {
        processBatchImages();
      } else if (currentSourceImage) {
        processSingleImage();
      }
    });
  });

  if (targetKbInput) {
    targetKbInput.addEventListener('input', () => {
      const val = parseInt(targetKbInput.value, 10);
      if (!isNaN(val) && val > 0) {
        targetKb = val;
        presetKbPills.forEach(p => {
          if (parseInt(p.getAttribute('data-kb'), 10) === val) p.classList.add('active');
          else p.classList.remove('active');
        });

        if (batchTargetLabel) batchTargetLabel.textContent = `${targetKb} KB`;

        if (activeMode === 'batch' && batchItems.length > 0) {
          processBatchImages();
        } else if (currentSourceImage) {
          processSingleImage();
        }
      }
    });
  }

  // Dimension Presets
  presetDimPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const preset = pill.getAttribute('data-dim');
      selectDimensionPreset(preset);
      if (activeMode === 'batch' && batchItems.length > 0) {
        processBatchImages();
      } else if (currentSourceImage) {
        processSingleImage();
      }
    });
  });

  function selectDimensionPreset(preset) {
    isDimensionPresetActive = preset;
    presetDimPills.forEach(p => {
      if (p.getAttribute('data-dim') === preset) p.classList.add('active');
      else p.classList.remove('active');
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
}
