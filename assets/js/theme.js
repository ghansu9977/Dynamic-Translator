/**
 * RozgarTools - Universal Theme Controller
 * Handles dark/light theme switching with localStorage and prefers-color-scheme support.
 */
(function() {
  function getPreferredTheme() {
    const saved = localStorage.getItem('site-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icons = document.querySelectorAll('#theme-icon, .theme-icon');
    icons.forEach(icon => {
      icon.textContent = theme === 'light' ? '🌙' : '☀️';
    });
  }

  // Apply immediately to prevent flash
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  document.addEventListener('DOMContentLoaded', function() {
    applyTheme(getPreferredTheme());

    const toggleBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-btn, .theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('site-theme', next);
        applyTheme(next);
      });
    });
  });
})();
