/**
 * Image to PDF Converter Logic
 * 100% Client-side image-to-PDF conversion with multi-image support, reordering, and A4 page layout options.
 */

document.addEventListener('DOMContentLoaded', () => {
  initImageToPdf();
});

function initImageToPdf() {
  const dropZone = document.getElementById('pdf-dropzone');
  const fileInput = document.getElementById('pdf-file-input');
  const browseBtn = document.getElementById('pdf-browse-btn');
  const imageListElem = document.getElementById('pdf-images-list');
  const generateBtn = document.getElementById('generate-pdf-btn');
  const clearBtn = document.getElementById('clear-all-images-btn');
  const orientationSelect = document.getElementById('pdf-orientation');
  const marginSelect = document.getElementById('pdf-margin');
  const imageCountBadge = document.getElementById('uploaded-count-badge');

  let uploadedImages = []; // Array of { id, file, dataUrl, name }

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

  function handleFiles(files) {
    const validImageFiles = files.filter(f => f.type.startsWith('image/'));
    if (validImageFiles.length === 0) {
      alert('Please select valid image files (JPG, PNG, WEBP).');
      return;
    }

    validImageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImages.push({
          id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          file: file,
          dataUrl: e.target.result,
          name: file.name
        });
        renderImagesList();
      };
      reader.readAsDataURL(file);
    });
  }

  function renderImagesList() {
    if (!imageListElem) return;
    imageListElem.innerHTML = '';

    if (imageCountBadge) {
      imageCountBadge.textContent = `${uploadedImages.length} image(s) added`;
    }

    if (generateBtn) {
      generateBtn.disabled = uploadedImages.length === 0;
    }

    if (uploadedImages.length === 0) {
      imageListElem.innerHTML = `
        <div style="text-align: center; color: var(--text-dim); padding: 2rem;">
          No images selected yet. Please upload images above.
        </div>
      `;
      return;
    }

    uploadedImages.forEach((imgObj, index) => {
      const item = document.createElement('div');
      item.className = 'glass-card';
      item.style.padding = '0.75rem 1rem';
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.justifyContent = 'space-between';
      item.style.marginBottom = '0.75rem';

      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; overflow: hidden;">
          <span style="font-weight: 700; color: var(--primary); min-width: 24px;">#${index + 1}</span>
          <img src="${imgObj.dataUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border);" alt="${imgObj.name}" />
          <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 240px;">
            <div style="font-weight: 600; font-size: 0.9rem;">${imgObj.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">${(imgObj.file.size / 1024).toFixed(1)} KB</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <button class="btn btn-secondary btn-sm" onclick="moveImageUp(${index})" ${index === 0 ? 'disabled' : ''} title="Move Up">↑</button>
          <button class="btn btn-secondary btn-sm" onclick="moveImageDown(${index})" ${index === uploadedImages.length - 1 ? 'disabled' : ''} title="Move Down">↓</button>
          <button class="btn btn-sm" style="background: rgba(244, 63, 94, 0.15); color: var(--accent-rose); border: 1px solid rgba(244, 63, 94, 0.3);" onclick="removeImage(${index})" title="Remove">✕</button>
        </div>
      `;
      imageListElem.appendChild(item);
    });
  }

  // Global window functions for inline onclick handlers
  window.moveImageUp = (idx) => {
    if (idx > 0) {
      const temp = uploadedImages[idx];
      uploadedImages[idx] = uploadedImages[idx - 1];
      uploadedImages[idx - 1] = temp;
      renderImagesList();
    }
  };

  window.moveImageDown = (idx) => {
    if (idx < uploadedImages.length - 1) {
      const temp = uploadedImages[idx];
      uploadedImages[idx] = uploadedImages[idx + 1];
      uploadedImages[idx + 1] = temp;
      renderImagesList();
    }
  };

  window.removeImage = (idx) => {
    uploadedImages.splice(idx, 1);
    renderImagesList();
  };

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      uploadedImages = [];
      renderImagesList();
    });
  }

  // Generate PDF via jsPDF
  if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
      if (uploadedImages.length === 0) return;

      generateBtn.disabled = true;
      generateBtn.textContent = '⏳ Generating PDF...';

      try {
        const { jsPDF } = window.jspdf;
        const orientation = orientationSelect ? orientationSelect.value : 'portrait';
        const marginMm = marginSelect ? parseInt(marginSelect.value, 10) : 10;

        const doc = new jsPDF({
          orientation: orientation,
          unit: 'mm',
          format: 'a4'
        });

        const pageWidth = orientation === 'portrait' ? 210 : 297;
        const pageHeight = orientation === 'portrait' ? 297 : 210;

        const maxContentWidth = pageWidth - (marginMm * 2);
        const maxContentHeight = pageHeight - (marginMm * 2);

        for (let i = 0; i < uploadedImages.length; i++) {
          if (i > 0) {
            doc.addPage('a4', orientation);
          }

          const imgData = uploadedImages[i].dataUrl;
          const imgElem = await loadImage(imgData);

          // Calculate aspect ratio fit inside margins
          const imgRatio = imgElem.width / imgElem.height;
          let drawWidth = maxContentWidth;
          let drawHeight = maxContentWidth / imgRatio;

          if (drawHeight > maxContentHeight) {
            drawHeight = maxContentHeight;
            drawWidth = maxContentHeight * imgRatio;
          }

          // Center the image on the page
          const posX = marginMm + ((maxContentWidth - drawWidth) / 2);
          const posY = marginMm + ((maxContentHeight - drawHeight) / 2);

          doc.addImage(imgData, 'JPEG', posX, posY, drawWidth, drawHeight);
        }

        doc.save('converted_images.pdf');

        if (window.showToast) {
          window.showToast('📄 PDF downloaded successfully!');
        }
      } catch (err) {
        console.error('PDF Generation Error:', err);
        alert('Error generating PDF. Please try again.');
      } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = '📄 Download PDF';
      }
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}
