/**
 * Dynamic AI Language Translator - Client Logic
 * Connects to Dynamic Translator API (https://translater-free-api.onrender.com/api/v1/translate)
 * Supports real-time translation, text-to-speech, clipboard copy, sample chips, and developer code snippets.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTranslator();
  initDeveloperTabs();
});

const API_ENDPOINT = 'https://translater-free-api.onrender.com/api/v1/translate';
const DEMO_API_KEY = 'dt_live_demo_test_key_12345';

function initTranslator() {
  const sourceInput = document.getElementById('source-text');
  const targetOutput = document.getElementById('target-text');
  const sourceLangSelect = document.getElementById('source-lang');
  const targetLangSelect = document.getElementById('target-lang');
  const translateBtn = document.getElementById('translate-btn');
  const swapBtn = document.getElementById('swap-lang-btn');
  const clearBtn = document.getElementById('clear-btn');
  const copyBtn = document.getElementById('copy-btn');
  const speakSourceBtn = document.getElementById('speak-source-btn');
  const speakTargetBtn = document.getElementById('speak-target-btn');
  const charCountEl = document.getElementById('char-count');
  const wordCountEl = document.getElementById('word-count');
  const speedBadge = document.getElementById('speed-badge');
  const statusBadge = document.getElementById('status-badge');
  const sampleChips = document.querySelectorAll('.sample-chip');
  const downloadBtn = document.getElementById('download-btn');

  // Input typing metrics
  if (sourceInput) {
    sourceInput.addEventListener('input', () => {
      const text = sourceInput.value;
      const chars = text.length;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;

      if (charCountEl) charCountEl.textContent = `${chars} chars`;
      if (wordCountEl) wordCountEl.textContent = `${words} words`;
    });
  }

  // Clear button
  if (clearBtn && sourceInput && targetOutput) {
    clearBtn.addEventListener('click', () => {
      sourceInput.value = '';
      targetOutput.value = '';
      if (charCountEl) charCountEl.textContent = '0 chars';
      if (wordCountEl) wordCountEl.textContent = '0 words';
      if (statusBadge) statusBadge.textContent = 'Ready';
      if (speedBadge) speedBadge.textContent = '⚡ Instant';
      sourceInput.focus();
    });
  }

  // Swap Languages
  if (swapBtn && sourceLangSelect && targetLangSelect) {
    swapBtn.addEventListener('click', () => {
      const sourceVal = sourceLangSelect.value;
      const targetVal = targetLangSelect.value;

      if (sourceVal === 'auto') {
        // If source was auto, swap to target and make target English or Hindi
        sourceLangSelect.value = targetVal;
        targetLangSelect.value = targetVal === 'en' ? 'hi' : 'en';
      } else {
        sourceLangSelect.value = targetVal;
        targetLangSelect.value = sourceVal;
      }

      // Also swap texts if target has translated content
      if (targetOutput && targetOutput.value.trim()) {
        const temp = sourceInput.value;
        sourceInput.value = targetOutput.value;
        targetOutput.value = temp;
      }

      showToast('⇄ Languages Swapped');
    });
  }

  // Sample Chips
  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (sourceInput) {
        sourceInput.value = chip.getAttribute('data-text') || chip.textContent.trim();
        sourceInput.dispatchEvent(new Event('input'));
        handleTranslation();
      }
    });
  });

  // Main Translate Action
  if (translateBtn) {
    translateBtn.addEventListener('click', handleTranslation);
  }

  // Keyboard shortcut: Ctrl + Enter or Cmd + Enter to translate
  if (sourceInput) {
    sourceInput.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleTranslation();
      }
    });
  }

  async function handleTranslation() {
    if (!sourceInput || !targetOutput) return;

    const rawText = sourceInput.value.trim();
    if (!rawText) {
      showToast('⚠️ Please enter text to translate');
      sourceInput.focus();
      return;
    }

    const targetLang = targetLangSelect ? targetLangSelect.value : 'hi';

    // Set UI loading state
    if (translateBtn) {
      translateBtn.disabled = true;
      translateBtn.innerHTML = '<span class="spinner-sm"></span> Translating...';
    }
    if (statusBadge) statusBadge.textContent = 'Processing...';

    const startTime = performance.now();

    try {
      // Split by newlines so paragraph structure is preserved
      const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const textsToTranslate = lines.length > 0 ? lines : [rawText];

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': DEMO_API_KEY
        },
        body: JSON.stringify({
          texts: textsToTranslate,
          targetLanguage: targetLang
        })
      });

      const duration = Math.round(performance.now() - startTime);
      if (speedBadge) speedBadge.textContent = `⚡ ${duration}ms`;

      const data = await response.json();

      if (response.ok && data.success && data.translations) {
        // Reassemble translated paragraphs in order
        const translatedLines = textsToTranslate.map(orig => data.translations[orig] || orig);
        targetOutput.value = translatedLines.join('\n\n');

        if (statusBadge) statusBadge.textContent = '200 OK';
        showToast('✅ Translation Complete!');
      } else {
        const errorMsg = data.error || 'Translation failed. Please try again.';
        targetOutput.value = `[Error] ${errorMsg}`;
        if (statusBadge) statusBadge.textContent = 'API Error';
        showToast(`❌ ${errorMsg}`);
      }
    } catch (err) {
      console.error('Translation network error:', err);
      targetOutput.value = `[Network Error] Could not connect to API server. Please check your internet connection.`;
      if (statusBadge) statusBadge.textContent = 'Offline / Error';
      showToast('❌ Network connection failed');
    } finally {
      if (translateBtn) {
        translateBtn.disabled = false;
        translateBtn.innerHTML = '⚡ Translate Now';
      }
    }
  }

  // Copy to Clipboard
  if (copyBtn && targetOutput) {
    copyBtn.addEventListener('click', async () => {
      const text = targetOutput.value.trim();
      if (!text) {
        showToast('⚠️ No translation to copy');
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        showToast('📋 Copied to clipboard!');
      } catch (e) {
        targetOutput.select();
        document.execCommand('copy');
        showToast('📋 Copied to clipboard!');
      }
    });
  }

  // Text to Speech for Input Text
  if (speakSourceBtn && sourceInput) {
    speakSourceBtn.addEventListener('click', () => {
      const text = sourceInput.value.trim();
      if (!text) {
        showToast('⚠️ No text to read out');
        return;
      }
      const lang = sourceLangSelect.value === 'auto' ? 'en' : sourceLangSelect.value;
      speakText(text, lang);
    });
  }

  // Text to Speech for Output Text
  if (speakTargetBtn && targetOutput) {
    speakTargetBtn.addEventListener('click', () => {
      const text = targetOutput.value.trim();
      if (!text) {
        showToast('⚠️ No translation to read out');
        return;
      }
      const lang = targetLangSelect.value || 'hi';
      speakText(text, lang);
    });
  }

  // Download translated text as .txt file
  if (downloadBtn && targetOutput) {
    downloadBtn.addEventListener('click', () => {
      const text = targetOutput.value.trim();
      if (!text) {
        showToast('⚠️ No translated text to download');
        return;
      }
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translation_${targetLangSelect.value || 'output'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('💾 Translation downloaded!');
    });
  }
}

// Browser Web Speech API Utility
function speakText(text, langCode) {
  if (!('speechSynthesis' in window)) {
    showToast('⚠️ Speech synthesis not supported in this browser');
    return;
  }

  window.speechSynthesis.cancel(); // Stop any ongoing speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Language mapping for speech synthesis
  const voiceLangMap = {
    'hi': 'hi-IN',
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'mr': 'mr-IN',
    'gu': 'gu-IN',
    'ta': 'ta-IN',
    'te': 'te-IN',
    'bn': 'bn-IN',
    'pa': 'pa-IN',
    'ur': 'ur-PK',
    'ar': 'ar-SA',
    'ja': 'ja-JP',
    'ru': 'ru-RU',
    'zh-CN': 'zh-CN',
    'it': 'it-IT',
    'pt': 'pt-BR'
  };

  utterance.lang = voiceLangMap[langCode] || langCode;

  utterance.onstart = () => showToast('🔊 Playing audio...');
  utterance.onerror = () => showToast('⚠️ Could not play audio for this language');

  window.speechSynthesis.speak(utterance);
}

// Developer Code Tabs
function initDeveloperTabs() {
  const tabBtns = document.querySelectorAll('.code-tab-btn');
  const codeBlocks = document.querySelectorAll('.dev-code-block');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      codeBlocks.forEach(c => c.style.display = 'none');

      btn.classList.add('active');
      const targetId = `code-${btn.getAttribute('data-lang')}`;
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.style.display = 'block';
    });
  });
}

// Simple Toast Notification
function showToast(message) {
  let toast = document.getElementById('portal-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portal-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: rgba(17, 24, 39, 0.95);
      color: #fff;
      padding: 12px 20px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      font-size: 0.9rem;
      font-weight: 500;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.25s ease;
      opacity: 0;
      transform: translateY(10px);
      backdrop-filter: blur(10px);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 2800);
}
