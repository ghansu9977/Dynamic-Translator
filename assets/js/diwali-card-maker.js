/**
 * Diwali Wishing Card & WhatsApp Status Maker Engine
 * 100% In-Browser HTML5 Canvas Generator
 * Author: RozgarTools & Dynamic AI
 */

document.addEventListener('DOMContentLoaded', () => {
  initDiwaliCardMaker();
});

function initDiwaliCardMaker() {
  const canvas = document.getElementById('diwali-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Form Controls
  const nameInput = document.getElementById('card-user-name');
  const festivalTypeSelect = document.getElementById('card-festival-type');
  const customMessageInput = document.getElementById('card-custom-msg');
  const photoInput = document.getElementById('card-photo-input');
  const photoRemoveBtn = document.getElementById('card-photo-remove-btn');
  const photoPreviewBox = document.getElementById('card-photo-preview-box');
  const photoPreviewImg = document.getElementById('card-photo-preview-img');
  const themeBtns = document.querySelectorAll('.theme-select-btn');
  const presetBtns = document.querySelectorAll('.preset-wish-btn');
  
  // Action Buttons
  const downloadBtn = document.getElementById('card-download-btn');
  const whatsappBtn = document.getElementById('card-whatsapp-btn');
  const copyLinkBtn = document.getElementById('card-copy-link-btn');

  // State
  let currentTheme = 'maroon-gold';
  let userPhotoImg = null;
  let userName = 'राहुल साहू एवं परिवार';
  let festivalTitle = 'शुभ दीपावली';
  let customMessage = 'दीयों की रोशनी से झिलमिलाता रहे आपका घर-आंगन, सुख, समृद्धि और खुशियों से भरा हो आपका हर क्षण। दीपावली की हार्दिक शुभकामनाएँ!';

  // Preset Messages dictionary
  const PRESET_MESSAGES = {
    'wish-1': 'दीयों की रोशनी से झिलमिलाता रहे आपका घर-आंगन, सुख, समृद्धि और खुशियों से भरा हो आपका हर क्षण। दीपावली की हार्दिक शुभकामनाएँ!',
    'wish-2': 'माँ लक्ष्मी का हाथ हो, सरस्वती का साथ हो, गणेश जी का निवास हो, और खुशियों का प्रकाश हो! आपको सपरिवार दीपावली की बधाई!',
    'wish-3': 'दीप जलते रहें, मन खिलते रहें, इस पावन अवसर पर सबके दिल मिलते रहें। धन, धान्य और ऐश्वर्य से परिपूर्ण रहे आपका जीवन!',
    'wish-4': 'May the divine lights of Diwali illuminate your life with peace, prosperity, good health and grand success. Happy Diwali!',
    'wish-5': 'Wishing you a sparkling Festival of Lights filled with joy, warmth, and memorable moments with loved ones. Happy Deepawali!',
    'wish-6': 'धनतेरस व दीपावली के पावन पर्व पर आपके जीवन में अपार खुशियाँ, व्यापार में बरकत और सुख-समृद्धि आएँ। शुभ धनतेरस व दीपावली!'
  };

  // 1. Initial Listeners
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      userName = e.target.value.trim() || 'शुभकामना प्रेषक';
      drawCard();
    });
  }

  if (festivalTypeSelect) {
    festivalTypeSelect.addEventListener('change', (e) => {
      festivalTitle = e.target.value;
      drawCard();
    });
  }

  if (customMessageInput) {
    customMessageInput.addEventListener('input', (e) => {
      customMessage = e.target.value.trim();
      drawCard();
    });
  }

  // Preset Wish Buttons
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const wishKey = btn.getAttribute('data-wish');
      if (PRESET_MESSAGES[wishKey]) {
        customMessage = PRESET_MESSAGES[wishKey];
        if (customMessageInput) customMessageInput.value = customMessage;
        drawCard();
      }
    });
  });

  // Theme Select Buttons
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTheme = btn.getAttribute('data-theme') || 'maroon-gold';
      drawCard();
    });
  });

  // Photo Upload Handler
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            userPhotoImg = img;
            if (photoPreviewImg) photoPreviewImg.src = event.target.result;
            if (photoPreviewBox) photoPreviewBox.style.display = 'flex';
            drawCard();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Remove Photo Button
  if (photoRemoveBtn) {
    photoRemoveBtn.addEventListener('click', () => {
      userPhotoImg = null;
      if (photoInput) photoInput.value = '';
      if (photoPreviewBox) photoPreviewBox.style.display = 'none';
      drawCard();
    });
  }

  // Action: Download Card as PNG
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      const cleanName = (userName || 'Diwali').replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `Happy_Diwali_Wishes_${cleanName}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      if (window.showToast) {
        window.showToast('✅ HD Diwali Card Downloaded Successfully!');
      }
    });
  }

  // Action: Share on WhatsApp
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const shareUrl = 'https://www.rozgartools.store/tools/diwali-card-maker.html';
      const text = `🪔 *${userName}* ने आपके लिए एक खास दीपावली शुभकामना कार्ड भेजा है! ✨\n\n"${customMessage.slice(0, 90)}..."\n\n👉 *आप भी अपने नाम और फोटो वाला दिवाली कार्ड 1 मिनट में बिल्कुल फ्री बनाएँ:* \n${shareUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  // Action: Copy Share Link
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      const shareUrl = 'https://www.rozgartools.store/tools/diwali-card-maker.html';
      navigator.clipboard.writeText(shareUrl).then(() => {
        if (window.showToast) {
          window.showToast('📋 Link Copied! Share with friends on WhatsApp & Social Media');
        } else {
          alert('Link copied to clipboard!');
        }
      });
    });
  }

  // Initial Card Render
  setTimeout(() => {
    drawCard();
  }, 150);

  // Core Drawing Function (1080 x 1080 HD Square)
  function drawCard() {
    const W = canvas.width;  // 1080
    const H = canvas.height; // 1080

    ctx.clearRect(0, 0, W, H);
    ctx.save();

    // 1. Draw Themed Background
    drawThemeBackground(ctx, W, H, currentTheme);

    // 2. Draw Decorative Border Frame
    drawDecorativeFrame(ctx, W, H, currentTheme);

    // 3. Draw Hanging Lanterns / Toran Motifs at Top
    drawTopToranLanterns(ctx, W, H, currentTheme);

    // 4. Draw Festival Main Header (e.g., शुभ दीपावली / HAPPY DIWALI)
    drawFestivalHeader(ctx, W, 230, festivalTitle, currentTheme);

    // 5. Draw Photo or Center Diya Art
    const photoY = 460;
    if (userPhotoImg) {
      drawUserPhoto(ctx, W / 2, photoY, 110, userPhotoImg);
    } else {
      drawGrandCenterDiya(ctx, W / 2, photoY - 10, currentTheme);
    }

    // 6. Draw Greeting Wishes / Shayari (Auto-wrapping)
    drawWishesText(ctx, W / 2, 650, customMessage, W - 200, currentTheme);

    // 7. Draw Divider
    drawDecorativeDivider(ctx, W / 2, 785, 260);

    // 8. Draw Sender Name Block
    drawSenderName(ctx, W / 2, 850, userName, currentTheme);

    // 9. Draw Base Decorative Rangoli & Diyas
    drawBaseRangoli(ctx, W, H, currentTheme);

    // 10. Subtle Watermark / Branding
    drawWatermark(ctx, W / 2, H - 25);

    ctx.restore();
  }

  // Background Styles
  function drawThemeBackground(ctx, W, H, theme) {
    let grad;
    if (theme === 'maroon-gold') {
      grad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, W * 0.72);
      grad.addColorStop(0, '#660b1b');
      grad.addColorStop(0.5, '#40040f');
      grad.addColorStop(1, '#1a0106');
    } else if (theme === 'navy-gold') {
      grad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, W * 0.72);
      grad.addColorStop(0, '#15254a');
      grad.addColorStop(0.5, '#0b1329');
      grad.addColorStop(1, '#030612');
    } else if (theme === 'fireworks-rangoli') {
      grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#120421');
      grad.addColorStop(0.6, '#210836');
      grad.addColorStop(1, '#0d0217');
    } else if (theme === 'black-gold') {
      grad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, W * 0.72);
      grad.addColorStop(0, '#222326');
      grad.addColorStop(0.6, '#131316');
      grad.addColorStop(1, '#070708');
    } else if (theme === 'dhanteras-saffron') {
      grad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, W * 0.72);
      grad.addColorStop(0, '#7a2205');
      grad.addColorStop(0.5, '#4a1202');
      grad.addColorStop(1, '#240600');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Add Sparkles & Golden Stars
    drawSparkleField(ctx, W, H, theme);

    // Special Fireworks for fireworks theme
    if (theme === 'fireworks-rangoli') {
      drawFireworksBurst(ctx, 180, 190, '#f43f5e', '#fbbf24', 60);
      drawFireworksBurst(ctx, W - 180, 190, '#06b6d4', '#fbbf24', 60);
      drawFireworksBurst(ctx, W / 2, 110, '#a855f7', '#fbbf24', 70);
    }
  }

  // Sparkles & Glitter
  function drawSparkleField(ctx, W, H, theme) {
    ctx.save();
    const starCount = theme === 'fireworks-rangoli' ? 85 : 55;
    for (let i = 0; i < starCount; i++) {
      const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * W;
      const y = (Math.cos(i * 678.91) * 0.5 + 0.5) * H;
      const size = (i % 3 === 0) ? 3 : 1.5;
      const opacity = 0.2 + (i % 7) * 0.1;

      ctx.fillStyle = `rgba(255, 235, 150, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Cross sparkle on select stars
      if (i % 9 === 0) {
        ctx.strokeStyle = `rgba(255, 240, 180, ${opacity * 0.8})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 7, y); ctx.lineTo(x + 7, y);
        ctx.moveTo(x, y - 7); ctx.lineTo(x, y + 7);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Fireworks Burst
  function drawFireworksBurst(ctx, cx, cy, color1, color2, radius) {
    ctx.save();
    const rays = 16;
    for (let i = 0; i < rays; i++) {
      const angle = (i * (Math.PI * 2)) / rays;
      const x2 = cx + Math.cos(angle) * radius;
      const y2 = cy + Math.sin(angle) * radius;
      
      const grad = ctx.createLinearGradient(cx, cy, x2, y2);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, color1);
      grad.addColorStop(1, color2);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Sparkle tip
      ctx.fillStyle = '#fff7ed';
      ctx.beginPath();
      ctx.arc(x2, y2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Decorative Border Frame
  function drawDecorativeFrame(ctx, W, H, theme) {
    ctx.save();
    const margin = 35;
    
    // Outer Border
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(margin, margin, W - margin * 2, H - margin * 2);

    // Inner Delicate Border
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin + 12, margin + 12, W - (margin + 12) * 2, H - (margin + 12) * 2);

    // Corner Ornaments
    drawCornerOrnament(ctx, margin + 12, margin + 12, 0);
    drawCornerOrnament(ctx, W - margin - 12, margin + 12, Math.PI / 2);
    drawCornerOrnament(ctx, W - margin - 12, H - margin - 12, Math.PI);
    drawCornerOrnament(ctx, margin + 12, H - margin - 12, -Math.PI / 2);

    ctx.restore();
  }

  function drawCornerOrnament(ctx, x, y, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(30, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 30);
    ctx.arc(15, 15, 10, Math.PI, Math.PI * 1.5);
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(12, 12, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Hanging Lanterns (Toran & Kandil)
  function drawTopToranLanterns(ctx, W, H, theme) {
    ctx.save();
    // Swag garland line at top
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 70);
    ctx.quadraticCurveTo(W / 4, 110, W / 2, 75);
    ctx.quadraticCurveTo(3 * W / 4, 110, W - 70, 70);
    ctx.stroke();

    // Hanging Lanterns
    drawLantern(ctx, 140, 75);
    drawLantern(ctx, W / 4, 98);
    drawLantern(ctx, W / 2, 75);
    drawLantern(ctx, 3 * W / 4, 98);
    drawLantern(ctx, W - 140, 75);

    ctx.restore();
  }

  function drawLantern(ctx, x, y) {
    ctx.save();
    // Hanging Thread
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 25);
    ctx.stroke();

    // Lantern Body (Diamond or Oval)
    const ly = y + 35;
    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.moveTo(x, ly - 10);
    ctx.lineTo(x + 12, ly);
    ctx.lineTo(x, ly + 14);
    ctx.lineTo(x - 12, ly);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Hanging Tassel
    ctx.strokeStyle = '#ffc107';
    ctx.beginPath();
    ctx.moveTo(x, ly + 14);
    ctx.lineTo(x, ly + 26);
    ctx.stroke();

    // Center Glow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x, ly, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Festival Main Header
  function drawFestivalHeader(ctx, x, y, title, theme) {
    ctx.save();
    ctx.textAlign = 'center';

    // Little Auspicious Shlok / Sub-tagline
    ctx.font = '600 20px "Outfit", sans-serif';
    ctx.fillStyle = '#fde68a';
    ctx.letterSpacing = '3px';
    ctx.fillText('✨ || ॐ श्री गणेशाय नमः || ✨', x, y - 55);

    // Main Festival Title
    ctx.font = '800 64px "Rozha One", "Yatra One", "Outfit", serif';
    
    // Golden Gradient Text
    const goldGrad = ctx.createLinearGradient(x - 200, y, x + 200, y);
    goldGrad.addColorStop(0, '#fff4cc');
    goldGrad.addColorStop(0.3, '#fcd34d');
    goldGrad.addColorStop(0.7, '#f59e0b');
    goldGrad.addColorStop(1, '#fbbf24');

    // Outer Glow
    ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = goldGrad;
    ctx.fillText(title, x, y);

    // Subtitle Line
    ctx.shadowBlur = 0;
    ctx.font = '500 22px "Outfit", sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('FESTIVAL OF LIGHTS, PEACE & PROSPERITY', x, y + 42);

    ctx.restore();
  }

  // Draw User Photo in Circular Golden Locket
  function drawUserPhoto(ctx, cx, cy, radius, img) {
    ctx.save();

    // Outer Glowing Halo
    const haloGrad = ctx.createRadialGradient(cx, cy, radius, cx, cy, radius + 35);
    haloGrad.addColorStop(0, 'rgba(255, 215, 0, 0.5)');
    haloGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 35, 0, Math.PI * 2);
    ctx.fill();

    // Circular Photo Clipping
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw Image Cover (center-cropped)
    const imgAspect = img.width / img.height;
    let sWidth = img.width;
    let sHeight = img.height;
    let sx = 0;
    let sy = 0;

    if (imgAspect > 1) {
      sWidth = img.height;
      sx = (img.width - img.height) / 2;
    } else {
      sHeight = img.width;
      sy = (img.height - img.width) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();

    // Ornate Golden Border around Photo
    ctx.save();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 7;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 3, 0, Math.PI * 2);
    ctx.stroke();

    // Decorative Beads around frame
    const beads = 28;
    for (let i = 0; i < beads; i++) {
      const angle = (i * Math.PI * 2) / beads;
      const bx = cx + Math.cos(angle) * (radius + 12);
      const by = cy + Math.sin(angle) * (radius + 12);
      ctx.fillStyle = (i % 2 === 0) ? '#ffecb3' : '#ffa000';
      ctx.beginPath();
      ctx.arc(bx, by, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Center Diya (when no photo uploaded)
  function drawGrandCenterDiya(ctx, cx, cy, theme) {
    ctx.save();

    // Golden Radiant Aura
    const aura = ctx.createRadialGradient(cx, cy, 30, cx, cy, 180);
    aura.addColorStop(0, 'rgba(255, 235, 59, 0.65)');
    aura.addColorStop(0.5, 'rgba(255, 152, 0, 0.3)');
    aura.addColorStop(1, 'rgba(255, 152, 0, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0, Math.PI * 2);
    ctx.fill();

    // Diya Base (Brass / Clay Oil Lamp)
    const diyaWidth = 140;
    const diyaHeight = 45;
    
    // Clay / Brass Gradient
    const brassGrad = ctx.createLinearGradient(cx - diyaWidth / 2, cy, cx + diyaWidth / 2, cy);
    brassGrad.addColorStop(0, '#d97706');
    brassGrad.addColorStop(0.3, '#fde68a');
    brassGrad.addColorStop(0.7, '#d97706');
    brassGrad.addColorStop(1, '#78350f');

    ctx.fillStyle = brassGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 25, diyaWidth / 2, diyaHeight / 2, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Oil Surface
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 25, diyaWidth / 2 - 6, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Grand Flame
    const flameY = cy - 25;
    const flameGrad = ctx.createLinearGradient(cx, flameY + 45, cx, flameY - 45);
    flameGrad.addColorStop(0, '#ef4444');
    flameGrad.addColorStop(0.4, '#f59e0b');
    flameGrad.addColorStop(0.8, '#fef08a');
    flameGrad.addColorStop(1, '#ffffff');

    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 35;

    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(cx, flameY - 45);
    ctx.bezierCurveTo(cx + 35, flameY - 10, cx + 30, flameY + 40, cx, flameY + 45);
    ctx.bezierCurveTo(cx - 30, flameY + 40, cx - 35, flameY - 10, cx, flameY - 45);
    ctx.closePath();
    ctx.fill();

    // Inner White Core Flame
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx, flameY - 15);
    ctx.bezierCurveTo(cx + 12, flameY + 5, cx + 10, flameY + 30, cx, flameY + 35);
    ctx.bezierCurveTo(cx - 10, flameY + 30, cx - 12, flameY + 5, cx, flameY - 15);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Wishes Text with Intelligent Line Wrapping
  function drawWishesText(ctx, x, y, text, maxWidth, theme) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '500 27px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 8;

    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    // Render lines (max 4 lines)
    const lineHeight = 42;
    const startY = y - ((lines.length - 1) * lineHeight) / 2;

    lines.slice(0, 4).forEach((l, index) => {
      ctx.fillText(l, x, startY + index * lineHeight);
    });

    ctx.restore();
  }

  // Golden Ornate Divider
  function drawDecorativeDivider(ctx, cx, cy, width) {
    ctx.save();
    const half = width / 2;
    const grad = ctx.createLinearGradient(cx - half, cy, cx + half, cy);
    grad.addColorStop(0, 'rgba(255, 215, 0, 0)');
    grad.addColorStop(0.5, '#ffd700');
    grad.addColorStop(1, 'rgba(255, 215, 0, 0)');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - half, cy);
    ctx.lineTo(cx + half, cy);
    ctx.stroke();

    // Center Diamond
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 6);
    ctx.lineTo(cx + 6, cy);
    ctx.lineTo(cx, cy + 6);
    ctx.lineTo(cx - 6, cy);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Best Wishes Sender Name
  function drawSenderName(ctx, x, y, name, theme) {
    ctx.save();
    ctx.textAlign = 'center';

    // Label: "शुभकामनाएँ प्रेषक / With Best Compliments From:"
    ctx.font = '600 20px "Outfit", sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.letterSpacing = '1px';
    ctx.fillText('✨ सस्नेह शुभकामनाएँ प्रेषक: ✨', x, y);

    // Name in Large Golden Typography
    ctx.font = '800 44px "Rozha One", "Yatra One", "Outfit", sans-serif';
    
    const nameGrad = ctx.createLinearGradient(x - 200, y + 45, x + 200, y + 45);
    nameGrad.addColorStop(0, '#ffffff');
    nameGrad.addColorStop(0.4, '#fef08a');
    nameGrad.addColorStop(0.7, '#facc15');
    nameGrad.addColorStop(1, '#ffffff');

    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = nameGrad;
    ctx.fillText(name, x, y + 50);

    ctx.restore();
  }

  // Base Rangoli & 5 Glow Diyas
  function drawBaseRangoli(ctx, W, H, theme) {
    ctx.save();
    const baseY = H - 85;

    // 5 Decorative Small Diyas along bottom
    const diyaPositions = [180, 360, W / 2, W - 360, W - 180];
    diyaPositions.forEach(x => {
      drawSmallDiya(ctx, x, baseY);
    });

    ctx.restore();
  }

  function drawSmallDiya(ctx, x, y) {
    ctx.save();
    // Diya Body
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(x, y + 8, 22, 9, 0, 0, Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Small Flame
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.moveTo(x, y - 14);
    ctx.bezierCurveTo(x + 10, y - 4, x + 8, y + 8, x, y + 8);
    ctx.bezierCurveTo(x - 8, y + 8, x - 10, y - 4, x, y - 14);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Subtle Classy Watermark
  function drawWatermark(ctx, x, y) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '500 15px "Outfit", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.letterSpacing = '1px';
    ctx.fillText('🪔 Created Free on RozgarTools.store', x, y);
    ctx.restore();
  }
}
