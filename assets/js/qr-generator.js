/**
 * QR Code Generator Engine
 * Supports UPI Payment, URLs, WiFi, WhatsApp, Text, custom colors, size, and PNG/SVG download.
 */

document.addEventListener('DOMContentLoaded', () => {
  initQrGenerator();
});

let qrcodeObj = null;

function initQrGenerator() {
  const typeBtns = document.querySelectorAll('.qr-type-btn');
  const typeForms = document.querySelectorAll('.qr-form-type');
  const qrColorDark = document.getElementById('qr-color-dark');
  const qrColorLight = document.getElementById('qr-color-light');
  const qrSizeSlider = document.getElementById('qr-size-slider');
  const qrSizeVal = document.getElementById('qr-size-val');
  const downloadPngBtn = document.getElementById('download-qr-png');
  const copyQrBtn = document.getElementById('copy-qr-content');

  let activeType = 'upi';

  // Switch Tabs / Types
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      typeForms.forEach(f => f.style.display = 'none');

      btn.classList.add('active');
      activeType = btn.dataset.type;
      const targetForm = document.getElementById(`qr-form-${activeType}`);
      if (targetForm) targetForm.style.display = 'block';

      generateQRCode();
    });
  });

  // Size Slider
  if (qrSizeSlider && qrSizeVal) {
    qrSizeSlider.addEventListener('input', () => {
      qrSizeVal.textContent = qrSizeSlider.value + 'px';
      generateQRCode();
    });
  }

  // Colors
  if (qrColorDark) qrColorDark.addEventListener('input', generateQRCode);
  if (qrColorLight) qrColorLight.addEventListener('input', generateQRCode);

  // Form Inputs Auto-trigger
  const allInputs = document.querySelectorAll('.qr-input-field');
  allInputs.forEach(input => {
    input.addEventListener('input', generateQRCode);
  });

  // Download PNG Button
  if (downloadPngBtn) {
    downloadPngBtn.addEventListener('click', () => {
      const container = document.getElementById('qrcode-canvas-wrap');
      const img = container.querySelector('img');
      const canvas = container.querySelector('canvas');
      let dataUrl = '';

      if (canvas) {
        dataUrl = canvas.toDataURL('image/png');
      } else if (img && img.src) {
        dataUrl = img.src;
      }

      if (dataUrl) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `rozgartools_qr_${activeType}_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if (window.showToast) window.showToast('✅ QR Code downloaded successfully!');
      }
    });
  }

  // Copy Content / Share
  if (copyQrBtn) {
    copyQrBtn.addEventListener('click', () => {
      const payload = getPayloadString(activeType);
      if (payload) {
        navigator.clipboard.writeText(payload).then(() => {
          if (window.showToast) window.showToast('📋 QR payload copied to clipboard!');
        });
      }
    });
  }

  // Initial generation
  generateQRCode();
}

function getPayloadString(type) {
  if (type === 'upi') {
    const vpa = (document.getElementById('upi-id')?.value || '').trim();
    const name = encodeURIComponent((document.getElementById('upi-name')?.value || '').trim());
    const amount = (document.getElementById('upi-amount')?.value || '').trim();
    const note = encodeURIComponent((document.getElementById('upi-note')?.value || '').trim());

    if (!vpa) return 'upi://pay?pa=demo@upi&pn=RozgarTools&cu=INR';
    let url = `upi://pay?pa=${vpa}&pn=${name}&cu=INR`;
    if (amount && parseFloat(amount) > 0) url += `&am=${parseFloat(amount).toFixed(2)}`;
    if (note) url += `&tn=${note}`;
    return url;
  } 
  else if (type === 'url') {
    let url = (document.getElementById('url-input')?.value || '').trim();
    if (!url) url = 'https://dynamic-translatx.vercel.app';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  }
  else if (type === 'wifi') {
    const ssid = (document.getElementById('wifi-ssid')?.value || '').trim();
    const pass = (document.getElementById('wifi-pass')?.value || '').trim();
    const enc = document.getElementById('wifi-enc')?.value || 'WPA';
    if (!ssid) return 'WIFI:S:MyHomeWiFi;T:WPA;P:Password123;;';
    return `WIFI:S:${ssid};T:${enc};P:${pass};;`;
  }
  else if (type === 'whatsapp') {
    let phone = (document.getElementById('wa-phone')?.value || '').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent((document.getElementById('wa-msg')?.value || '').trim());
    if (!phone) phone = '919876543210';
    return `https://wa.me/${phone}?text=${msg}`;
  }
  else if (type === 'text') {
    const txt = (document.getElementById('text-input')?.value || '').trim();
    return txt || 'RozgarTools - 100% Free Utility Tools';
  }
  return 'https://dynamic-translatx.vercel.app';
}

function generateQRCode() {
  const container = document.getElementById('qrcode-canvas-wrap');
  if (!container) return;

  const payload = getPayloadString(document.querySelector('.qr-type-btn.active')?.dataset.type || 'upi');
  const size = parseInt(document.getElementById('qr-size-slider')?.value || '240', 10);
  const colorDark = document.getElementById('qr-color-dark')?.value || '#000000';
  const colorLight = document.getElementById('qr-color-light')?.value || '#ffffff';

  // Display raw payload text for clarity
  const payloadDisplay = document.getElementById('qr-payload-display');
  if (payloadDisplay) {
    payloadDisplay.textContent = payload;
  }

  if (typeof QRCode === 'undefined') {
    if (!window._qrCodeLoading) {
      window._qrCodeLoading = true;
      container.innerHTML = '<div style="font-size:0.85rem;color:var(--text-muted);padding:1rem;">⏳ Loading QR Engine...</div>';
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      script.onload = () => {
        window._qrCodeLoading = false;
        generateQRCode();
      };
      script.onerror = () => {
        window._qrCodeLoading = false;
        container.innerHTML = '<div style="font-size:0.85rem;color:var(--accent-rose);padding:1rem;">⚠️ Failed to load QR engine.</div>';
      };
      document.head.appendChild(script);
    }
    return;
  }

  container.innerHTML = '';

  qrcodeObj = new QRCode(container, {
    text: payload,
    width: size,
    height: size,
    colorDark: colorDark,
    colorLight: colorLight,
    correctLevel: QRCode.CorrectLevel.H
  });
}
