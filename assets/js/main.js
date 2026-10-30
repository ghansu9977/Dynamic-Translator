/**
 * Multi-Tool Web Portal - Core App Logic
 * Handles Theme Toggling, Mobile Menu, Live Tool Search, Category Filters, Back to Top, FAQ Accordion, and Toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initNavDropdown();
  initNavSearchTrigger();
  initToolSearchAndFilters();
  initBackToTop();
  initFaqAccordion();
});

/* ==========================================================================
   Theme Toggle (Dark / Light) with LocalStorage Persistence
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('site-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const activeTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', activeTheme);
  updateThemeIcon(activeTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('site-theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(newTheme === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
    });
  }
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
  }
}

/* ==========================================================================
   Desktop Navigation Dropdown
   ========================================================================== */
function initNavDropdown() {
  const dropdownBtn = document.getElementById('all-tools-dropdown-btn');
  const dropdown = dropdownBtn ? dropdownBtn.closest('.nav-dropdown') : null;

  if (dropdownBtn && dropdown) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('active');
      dropdownBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        dropdownBtn.setAttribute('aria-expanded', 'false');
        dropdownBtn.focus();
      }
    });
  }
}

/* ==========================================================================
   Nav Quick Search Trigger
   ========================================================================== */
function initNavSearchTrigger() {
  const searchTrigger = document.getElementById('nav-search-trigger');
  const searchInput = document.getElementById('tool-search-input');

  if (searchTrigger) {
    searchTrigger.addEventListener('click', () => {
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          searchInput.focus();
          searchInput.select();
        }, 300);
      } else {
        const isSubdir = window.location.pathname.includes('/tools/');
        window.location.href = (isSubdir ? '../index.html' : 'index.html') + '#tool-search-input';
      }
    });
  }

  // Auto-focus search if arrived with hash
  if (window.location.hash === '#tool-search-input' && searchInput) {
    setTimeout(() => {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInput.focus();
    }, 400);
  }
}

/* ==========================================================================
   Mobile Navigation Drawer (Touch-Friendly, Full-Screen Overlay, Live Search)
   ========================================================================== */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawerSearch = document.getElementById('drawer-search-input');
  const drawerToolsList = document.getElementById('drawer-tools-list');

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (drawerSearch) {
        setTimeout(() => drawerSearch.focus(), 300);
      }
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (drawerSearch) {
        drawerSearch.value = '';
        filterDrawerTools('');
      }
    }
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Close when clicking any drawer item
  if (drawer) {
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // Live filter inside mobile drawer
  function filterDrawerTools(query) {
    if (!drawerToolsList) return;
    const items = drawerToolsList.querySelectorAll('li');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = !query || text.includes(query) ? 'block' : 'none';
    });
  }

  if (drawerSearch) {
    drawerSearch.addEventListener('input', (e) => {
      filterDrawerTools(e.target.value.toLowerCase().trim());
    });
  }
}

/* ==========================================================================
   Homepage Live Tool Search & Category Filter Pills
   ========================================================================== */
function initToolSearchAndFilters() {
  const searchInput = document.getElementById('tool-search-input');
  const clearSearchBtn = document.getElementById('search-clear-btn');
  const toolCards = document.querySelectorAll('.tool-card');
  const catPills = document.querySelectorAll('.cat-pill');
  const resultsCountEl = document.getElementById('tools-count-badge');

  let activeCategory = 'all';
  let activeSearchQuery = '';

  function applyFilter() {
    let visibleCount = 0;

    toolCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || 'all';
      const title = card.querySelector('.tool-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.tool-desc')?.textContent.toLowerCase() || '';
      const tags = Array.from(card.querySelectorAll('.tag-badge')).map(t => t.textContent.toLowerCase()).join(' ');

      const matchesCategory = (activeCategory === 'all') || (cardCategory === activeCategory);
      const matchesSearch = !activeSearchQuery || 
        title.includes(activeSearchQuery) || 
        desc.includes(activeSearchQuery) || 
        tags.includes(activeSearchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.25s ease-out';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultsCountEl) {
      resultsCountEl.textContent = `${visibleCount} Tools Available`;
    }
  }

  // Live search input
  if (clearSearchBtn) {
    clearSearchBtn.style.display = 'none';
  }

  if (searchInput && toolCards.length > 0) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value.toLowerCase().trim();
      if (clearSearchBtn) {
        clearSearchBtn.style.display = activeSearchQuery.length > 0 ? 'flex' : 'none';
      }
      applyFilter();
    });

    // Clear search
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        activeSearchQuery = '';
        clearSearchBtn.style.display = 'none';
        searchInput.focus();
        applyFilter();
      });
    }

    // Shortcut: Press '/' key to focus search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }

  // Category filter pills
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });

      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      activeCategory = pill.getAttribute('data-category') || 'all';

      applyFilter();
    });
  });
}

/* ==========================================================================
   Back to Top Floating Button
   ========================================================================== */
function initBackToTop() {
  let backBtn = document.getElementById('back-to-top');
  
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'back-to-top';
    backBtn.className = 'back-to-top-btn';
    backBtn.title = 'Back to top';
    backBtn.setAttribute('aria-label', 'Scroll to top');
    backBtn.innerHTML = '↑';
    document.body.appendChild(backBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   Global Toast Notification
   ========================================================================== */
function showToast(message, type = 'success') {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  const icon = type === 'error' ? '⚠️' : '✅';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
window.showToast = showToast;
