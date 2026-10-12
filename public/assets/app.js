// Ohana Business Locker – Frontend Application Scripts

document.addEventListener('DOMContentLoaded', () => {
  if (!enforceOhanaAuthGuard()) return;
  initOhanaUserSession(); // Dynamic multi-account session & profile chips
  initProtectedNavInterceptors(); // Intercept unauthenticated clicks & route to login
  initMobileNav();
  initSidebar();
  cleanupSidebarNav();
  initSidebarIcons();
  initModalsAndToasts();
  initForms();
  initHeroSlider();
  initOhanaChatbot();
  initBPStoryAnimation(); // Business Passport 5-Phase Story Animation
  syncOhanaGlobalState(); // Cross-page single source of truth sync
});

// Enforce auth check if page restored from browser bfcache (e.g. Back button)
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    enforceOhanaAuthGuard();
  }
});

// Toast notification helper
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
  const iconColor = type === 'success' ? '#16A34A' : (type === 'error' ? '#FF2028' : '#FF2028');
  toast.innerHTML = `<span style="color:${iconColor};font-weight:800;font-size:16px;">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 260);
  }, 3200);
}

// 1. Mobile Public Navigation
function initMobileNav() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const nav = navbar.querySelector('nav');
  if (!nav) return;

  if (!navbar.querySelector('.nav-toggle')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'nav-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle Navigation Menu');
    toggleBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    `;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        nav.classList.remove('open');
      }
    });

    navbar.appendChild(toggleBtn);
  }
}

// 2. Responsive Sidebar Drawer for App pages
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  if (!document.body.classList.contains('app')) return;

  if (!document.querySelector('.mobile-app-bar')) {
    const mobileBar = document.createElement('header');
    mobileBar.className = 'mobile-app-bar';
    const logoSrc = '/assets/ohana-brand-logo.png';
    const homeHref = '/dashboard';

    mobileBar.innerHTML = `
      <a class="brand" href="${homeHref}" aria-label="Ohana Busnilocker">
        <span class="ohana-inline-brand">
          <span class="oib-icon" aria-hidden="true"><img class="oib-brand-img" src="${logoSrc}" alt="Ohana Busnilocker Logo" style="height: 32px;"></span>
          <span class="oib-text">
            <span class="oib-wordmark"><span class="oib-ohana">Ohana</span><span class="oib-biz">Busnilocker</span></span>
            <span class="oib-sub">BUSINESS PASSPORT &bull; VERIFIED</span>
          </span>
        </span>
      </a>
      <button class="nav-toggle" id="sidebarToggle" aria-label="Toggle Navigation Sidebar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    `;
    document.body.prepend(mobileBar);

    const backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);

    const toggle = document.getElementById('sidebarToggle');
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('active');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('active');
    });

    sidebar.querySelectorAll('nav a, .side-bottom a').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('active');
      });
    });
  }
}

// 3. Crisp SVG Icons for Sidebar Navigation
function initSidebarIcons() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  // 1. Sidebar Brand Alignment
  const brand = sidebar.querySelector('.brand');
  if (brand) {
    brand.className = 'brand sidebar-brand';
    const existingInline = brand.querySelector('.ohana-inline-brand');
    if (existingInline) {
      if (!existingInline.classList.contains('oib-dark')) {
        existingInline.classList.add('oib-dark');
      }
      const oldBrandText = brand.querySelector('.brand-text');
      if (oldBrandText) oldBrandText.remove();
      const logoImgSrc = '/assets/ohana-brand-logo.png';
      brand.innerHTML = `
        <span class="ohana-inline-brand oib-dark">
          <span class="oib-icon" aria-hidden="true"><img src="${logoImgSrc}" alt="Ohana Busnilocker Logo" class="oib-brand-img" style="height: 36px;"></span>
          <span class="oib-text">
            <span class="oib-wordmark"><span class="oib-ohana">Ohana</span><span class="oib-biz">Busnilocker</span></span>
            <span class="oib-sub">BUSINESS PASSPORT &bull; VERIFIED</span>
          </span>
        </span>
      `;
    }
  }

  // 2. Organization Card Chevron
  const org = sidebar.querySelector('.org');
  if (org) {
    const strong = org.querySelector('strong');
    if (strong && !strong.querySelector('.org-chevron')) {
      const orgName = strong.textContent.replace(/[›>]/g, '').trim();
      strong.innerHTML = `<span class="org-name">${orgName}</span><svg class="org-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>`;
    }
  }

  const icons = {
    'dashboard.html': `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`,
    'business-passport.html': `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><line x1="15" y1="8" x2="17" y2="8"/><line x1="15" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>`,
    'documents.html': `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    'renewals.html': `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
    'billing.html': `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
    'support.html': `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    'profile': `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    'public-profile.html': `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    'security.html': `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
    'settings': `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
    'logout': `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`
  };

  const labels = {
    'dashboard.html': 'Dashboard',
    'business-passport.html': 'Business Passport',
    'documents.html': 'Documents',
    'renewals.html': 'Renewals',
    'billing.html': 'Billing & Plans',
    'support.html': 'Help & Support',
    'dashboard': 'Dashboard',
    'business-passport': 'Business Passport',
    'documents': 'Documents',
    'renewals': 'Renewals',
    'billing': 'Billing & Plans',
    'support': 'Help & Support'
  };

  const isNextApp = typeof window !== 'undefined' && (
    !!document.querySelector('.ohana-nextjs-page-root') ||
    !window.location.pathname.endsWith('.html')
  );
  const isPagesDir = window.location.pathname.includes('/pages/');
  const currentPath = (window.location.pathname.split('/').pop().split('?')[0] || 'dashboard').replace(/\.html$/, '');

  const profileHref = isNextApp ? '/public-profile' : (isPagesDir ? 'public-profile.html' : 'pages/public-profile.html');
  const settingsHref = isNextApp ? '/security' : (isPagesDir ? 'security.html' : 'pages/security.html');
  const logoutHref = isNextApp ? '/' : (isPagesDir ? '../index.html' : 'index.html');

  sidebar.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const rawKey = href.split('/').pop().split('?')[0];
    const cleanKey = rawKey.replace(/\.html$/, '');
    const lookupKey = rawKey.endsWith('.html') ? rawKey : `${cleanKey}.html`;
    const label = labels[lookupKey] || labels[cleanKey] || a.textContent.replace(/[⌂◉▣✓▤↻⇧◎🛡👥🕒🔔📊🔒🔌❓💳🪪⚙↪]/g, '').trim();
    if (icons[lookupKey] || icons[cleanKey]) {
      a.innerHTML = `${icons[lookupKey] || icons[cleanKey]} <span>${label}</span>`;
    }
    if (isNextApp && !href.startsWith('/')) {
      a.href = `/${cleanKey}`;
    }
    if (cleanKey === currentPath || (cleanKey === 'dashboard' && (currentPath === '' || currentPath === 'dashboard'))) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  sidebar.querySelectorAll('.side-bottom a').forEach(a => {
    const text = a.textContent.toLowerCase();
    const href = a.getAttribute('href') || '';
    if (text.includes('profile') || href.includes('public-profile')) {
      a.innerHTML = `${icons['profile']} <span>Profile</span>`;
      a.href = profileHref;
      if (currentPath === 'public-profile') {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    } else if (text.includes('setting') || href.includes('security')) {
      a.innerHTML = `${icons['settings']} <span>Settings</span>`;
      a.href = settingsHref;
      if (currentPath === 'security') {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    } else if (text.includes('logout') || href.endsWith('index.html') || href === '/') {
      a.innerHTML = `${icons['logout']} <span>Logout</span>`;
      a.href = logoutHref;
    }
  });

  // Make all header profile chips click to open public-profile.html
  document.querySelectorAll('.profile-chip').forEach(chip => {
    chip.style.cursor = 'pointer';
    chip.setAttribute('title', 'View Public Profile');
    if (!chip.getAttribute('data-bound-profile')) {
      chip.setAttribute('data-bound-profile', 'true');
      chip.addEventListener('click', (e) => {
        if (chip.getAttribute('onclick')) return;
        window.location.href = '/public-profile';
      });
    }
  });
}

// 4. Modals and Interactive Actions
function initModalsAndToasts() {
  let modalOverlay = document.getElementById('appGlobalModalOverlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'appGlobalModalOverlay';
    modalOverlay.className = 'modal-overlay app-global-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h3 id="appModalTitle">Action</h3>
          <button class="modal-close" aria-label="Close dialog">&times;</button>
        </div>
        <div id="appModalBody"></div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    const closeBtn = modalOverlay.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
      });
    }

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  function openModal(title, contentHtml) {
    const titleEl = document.getElementById('appModalTitle') || document.getElementById('modalTitle');
    const bodyEl = document.getElementById('appModalBody') || document.getElementById('modalBody');
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.innerHTML = contentHtml;
    modalOverlay.classList.add('active');
  }

  // Bind interactive buttons safely
  document.querySelectorAll('button, a').forEach(el => {
    const text = el.textContent.trim();
    if (text.includes('Upload Document')) {
      // If page already defines openUploadModal or element has inline onclick, DO NOT override!
      if (typeof openUploadModal === 'function' || el.hasAttribute('onclick')) {
        return;
      }
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/documents?openUpload=true';
      });
    }

    if (text.includes('Add Asset')) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('Add Company Asset', `
          <form id="addAssetForm" style="display:grid;gap:14px;">
            <label>Asset Category
              <select required>
                <option value="">Select Category</option>
                <option value="Laptops">Laptops</option>
                <option value="Mobiles">Mobile Devices</option>
                <option value="Vehicles">Company Vehicles</option>
                <option value="Office Equipment">Office Equipment</option>
              </select>
            </label>
            <label>Asset Tag / Serial Number
              <input type="text" placeholder="e.g. LP-2026-089" required>
            </label>
            <label>Assigned To
              <input type="text" placeholder="e.g. Employee Name or Dept">
            </label>
            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:14px;">
              <button type="button" class="btn outline btn-sm modal-cancel">Cancel</button>
              <button type="submit" class="btn btn-sm">Add Asset</button>
            </div>
          </form>
        `);

        document.querySelector('.modal-cancel').onclick = () => modalOverlay.classList.remove('active');
        document.getElementById('addAssetForm').onsubmit = (ev) => {
          ev.preventDefault();
          modalOverlay.classList.remove('active');
          showToast('Asset added to company registry!', 'success');
        };
      });
    }

    if (text.includes('Create Share Link')) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const generatedLink = 'https://ohana.business/share/abc-tech-' + Math.random().toString(36).substring(2, 7);
        openModal('Create B2B Share Link', `
          <p style="color:var(--text-muted);font-size:14px;margin-top:0;">
            Generate a secure, time-limited link to share verified business credentials with prospective vendors and clients.
          </p>
          <label>Generated Share Room Link
            <input type="text" readonly value="${generatedLink}" id="shareLinkInput" style="font-family:monospace;background:#f8fafc;font-weight:600;">
          </label>
          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;">
            <button type="button" class="btn outline btn-sm modal-cancel">Close</button>
            <button type="button" class="btn btn-sm" id="copyShareLinkBtn">Copy Link</button>
          </div>
        `);

        document.querySelector('.modal-cancel').onclick = () => modalOverlay.classList.remove('active');
        document.getElementById('copyShareLinkBtn').onclick = () => {
          const input = document.getElementById('shareLinkInput');
          input.select();
          navigator.clipboard.writeText(input.value).then(() => {
            modalOverlay.classList.remove('active');
            showToast('Share link copied to clipboard!', 'info');
          });
        };
      });
    }
  });
}

// 5. Form Validation & UX Enhancements
function initForms() {
  // Identity save button
  const identityPanel = document.querySelector('body.app .panel');
  if (identityPanel) {
    const saveBtn = identityPanel.querySelector('button.btn');
    if (saveBtn && saveBtn.textContent.includes('Save Changes')) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const origText = saveBtn.textContent;
        saveBtn.disabled = true;
        saveBtn.innerHTML = 'Saving...';
        setTimeout(() => {
          saveBtn.disabled = false;
          saveBtn.textContent = origText;
          showToast('Business identity profile saved successfully!', 'success');
        }, 550);
      });
    }
  }

  // Auth forms (login and signup)
  const authForms = document.querySelectorAll('body.auth form');
  authForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button.btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        const isSignup = form.closest('.auth-card').querySelector('h1').textContent.includes('Create');
        submitBtn.innerHTML = isSignup ? 'Creating Account...' : 'Signing In...';
        showToast(isSignup ? 'Account created! Redirecting to Dashboard...' : 'Signed in successfully! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 650);
      }
    });

    const forgotLink = form.querySelector('a[href="#"]');
    if (forgotLink && forgotLink.textContent.includes('Forgot')) {
      forgotLink.onclick = (e) => {
        e.preventDefault();
        showToast('Password reset link will be sent to your work email.', 'info');
      };
    }
  });

  // Contact form validation
  const contactForm = document.querySelector('main.form-page form, main.form-page .panel');
  if (contactForm && document.title.includes('Contact')) {
    const sendBtn = contactForm.querySelector('button.btn');
    if (sendBtn && sendBtn.textContent.includes('Send Message')) {
      sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const inputs = contactForm.querySelectorAll('input, textarea');
        let valid = true;
        inputs.forEach(inp => {
          if (!inp.value.trim()) {
            valid = false;
            inp.style.borderColor = '#ef4444';
          } else {
            inp.style.borderColor = '';
          }
        });

        if (!valid) {
          showToast('Please fill in all fields before sending.', 'info');
          return;
        }

        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';
        setTimeout(() => {
          sendBtn.disabled = false;
          sendBtn.textContent = 'Send Message';
          inputs.forEach(inp => inp.value = '');
          showToast('Thank you! Your message has been sent successfully.', 'success');
        }, 600);
      });
    }
  }
}

// 6. Hero Passport Cards Slider
function initHeroSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  if (slider.dataset.initialized === 'true') return;
  slider.dataset.initialized = 'true';

  const slides = slider.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  if (!slides.length) return;

  let currentIndex = 0;
  let timer = null;

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(nextSlide, 4200);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      startAutoplay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(idx);
      startAutoplay();
    });
  });

  const wrap = document.querySelector('.hero-slider-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', stopAutoplay);
    wrap.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

// ==========================================================================
// 7. OHANA AI Assistant Chatbot Component
// ==========================================================================
function initOhanaChatbot() {
  if (document.querySelector('.ohana-chat-widget')) return;

  const isPagesDir = window.location.pathname.includes('/pages/');
  const chatLogoSrc = isPagesDir ? '../assets/chatbot-logo.png' : 'assets/chatbot-logo.png';

  const widget = document.createElement('div');
  widget.className = 'ohana-chat-widget';
  widget.innerHTML = `
    <!-- Floating Launcher Button -->
    <button class="ohana-chat-trigger" id="ohanaChatTrigger" aria-label="Open OHANA Assistant" aria-expanded="false">
      <!-- AI Assistant Robot Icon -->
      <div class="ohana-chat-trigger-icon-wrap">
        <img src="${chatLogoSrc}" alt="OHANA Assistant" class="ohana-chat-trigger-icon">
      </div>
      <!-- Close Icon when open -->
      <svg class="ohana-chat-trigger-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span class="ohana-chat-badge" title="Online Assistant"></span>
    </button>

    <!-- Floating Chat Window -->
    <div class="ohana-chat-window" id="ohanaChatWindow" role="dialog" aria-modal="false" aria-label="OHANA Assistant Chat">
      <!-- Header -->
      <header class="ohana-chat-header">
        <div class="ohana-chat-header-info">
          <div class="ohana-chat-avatar">
            <img src="${chatLogoSrc}" alt="OHANA AI Assistant" class="ohana-chat-avatar-img">
          </div>
          <div class="ohana-chat-title-wrap">
            <span class="ohana-chat-title">OHANA Assistant</span>
            <span class="ohana-chat-subtitle">
              <span class="ohana-chat-status-dot"></span>
              Online • AI Assistant
            </span>
          </div>
        </div>
        <div class="ohana-chat-header-actions">
          <button type="button" class="ohana-chat-btn-icon" id="ohanaChatMinimize" aria-label="Minimize Chat">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button type="button" class="ohana-chat-btn-icon" id="ohanaChatClose" aria-label="Close Chat">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      <!-- Messages Body -->
      <div class="ohana-chat-messages" id="ohanaChatMessages">
        <!-- Injected dynamically -->
      </div>

      <!-- Typing Indicator -->
      <div class="ohana-chat-typing-row" id="ohanaChatTyping">
        <div class="ohana-chat-msg-avatar">
          <img src="${chatLogoSrc}" alt="OHANA Bot" class="ohana-chat-msg-avatar-img">
        </div>
        <div class="ohana-chat-typing">
          <span class="ohana-typing-dot"></span>
          <span class="ohana-typing-dot"></span>
          <span class="ohana-typing-dot"></span>
        </div>
      </div>

      <!-- Chat Footer / Input -->
      <footer class="ohana-chat-footer">
        <form class="ohana-chat-form" id="ohanaChatForm">
          <input 
            type="text" 
            class="ohana-chat-input" 
            id="ohanaChatInput" 
            placeholder="Ask about Passport, Verification..." 
            autocomplete="off"
            aria-label="Your message to OHANA Assistant"
          >
          <button type="submit" class="ohana-chat-send-btn" id="ohanaChatSend" aria-label="Send message" disabled>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        <div class="ohana-chat-disclaimer">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>OHANA Intelligence • Enterprise Trust Assistant</span>
        </div>
      </footer>
    </div>
  `;

  document.body.appendChild(widget);

  const trigger = document.getElementById('ohanaChatTrigger');
  const closeBtn = document.getElementById('ohanaChatClose');
  const minimizeBtn = document.getElementById('ohanaChatMinimize');
  const messagesContainer = document.getElementById('ohanaChatMessages');
  const typingIndicator = document.getElementById('ohanaChatTyping');
  const form = document.getElementById('ohanaChatForm');
  const input = document.getElementById('ohanaChatInput');
  const sendBtn = document.getElementById('ohanaChatSend');

  let hasGreeted = false;

  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function toggleChat(open) {
    const isOpen = typeof open === 'boolean' ? open : !widget.classList.contains('is-open');
    widget.classList.toggle('is-open', isOpen);
    trigger.setAttribute('aria-expanded', isOpen);

    if (isOpen) {
      if (!hasGreeted) {
        renderWelcomeExperience();
        hasGreeted = true;
      }
      setTimeout(() => input.focus(), 300);
    }
  }

  trigger.addEventListener('click', () => toggleChat());
  closeBtn.addEventListener('click', () => toggleChat(false));
  minimizeBtn.addEventListener('click', () => toggleChat(false));

  // Global triggers to open live chat support from any button/card
  window.openOhanaChatbot = function(initialText) {
    toggleChat(true);
    if (initialText && input) {
      setTimeout(() => {
        input.value = initialText;
        input.dispatchEvent(new Event('input'));
        input.focus();
      }, 320);
    }
  };

  window.openLiveChatSupport = function(initialText = 'Hello! I would like to connect with live compliance support.') {
    toggleChat(true);
    if (initialText && input) {
      setTimeout(() => {
        input.value = initialText;
        input.dispatchEvent(new Event('input'));
        input.focus();
      }, 320);
    }
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open-chat], .btn-open-chat');
    if (btn) {
      e.preventDefault();
      toggleChat(true);
    }
  });

  // Escape key closes chat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.classList.contains('is-open')) {
      toggleChat(false);
    }
  });

  // Enable/disable send button based on text
  input.addEventListener('input', () => {
    sendBtn.disabled = !input.value.trim();
  });

  // Welcome Experience & Suggested Questions
  function renderWelcomeExperience() {
    const welcomeHtml = `
      <p>Hi! I'm OHANA Assistant 👋</p>
      <p>I can help you understand Business Passport, Identity, Verification, Documents, Credentials, Renewals, Share Room and Public Profile.</p>
    `;
    appendMessage('bot', welcomeHtml);

    // Suggested Questions
    const suggestions = [
      'What is OHANA Business Locker?',
      'What is Business Passport?',
      'How does L0–L4 verification work?',
      'What is Share Room?'
    ];

    const suggContainer = document.createElement('div');
    suggContainer.className = 'ohana-chat-suggestions';
    suggContainer.innerHTML = `
      <div class="ohana-chat-suggestion-label">Suggested Questions</div>
    `;

    suggestions.forEach(question => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'ohana-chat-chip';
      chip.innerHTML = `
        <span>${question}</span>
        <span class="ohana-chat-chip-arrow">→</span>
      `;
      chip.addEventListener('click', () => {
        handleUserQuery(question);
      });
      suggContainer.appendChild(chip);
    });

    messagesContainer.appendChild(suggContainer);
    scrollToBottom();
  }

  function appendMessage(sender, htmlContent) {
    const row = document.createElement('div');
    row.className = `ohana-chat-msg-row ${sender}`;

    const avatarHtml = sender === 'bot' 
      ? `<div class="ohana-chat-msg-avatar"><img src="${chatLogoSrc}" alt="OHANA Bot" class="ohana-chat-msg-avatar-img"></div>` 
      : '';

    row.innerHTML = `
      ${avatarHtml}
      <div class="ohana-chat-bubble-wrap">
        <div class="ohana-chat-bubble">
          ${htmlContent}
        </div>
        <span class="ohana-chat-msg-time">${formatTime()}</span>
      </div>
    `;

    messagesContainer.appendChild(row);
    scrollToBottom();
  }

  function showTyping(show) {
    if (show) {
      messagesContainer.appendChild(typingIndicator);
      typingIndicator.classList.add('is-visible');
    } else {
      typingIndicator.classList.remove('is-visible');
    }
    scrollToBottom();
  }

  // User Query Handler
  async function handleUserQuery(text) {
    if (!text || !text.trim()) return;
    const userQuery = text.trim();

    // 1. Append user message
    appendMessage('user', escapeHtml(userQuery));

    // 2. Clear input
    input.value = '';
    sendBtn.disabled = true;

    // 3. Show typing indicator
    showTyping(true);

    // 4. Simulate natural AI response delay (modular async architecture ready for future API)
    setTimeout(async () => {
      try {
        const responseHtml = await generateAssistantResponse(userQuery);
        showTyping(false);
        appendMessage('bot', responseHtml);
      } catch (err) {
        showTyping(false);
        appendMessage('bot', 'An error occurred while generating a response. Please try again.');
      }
    }, 600);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserQuery(input.value);
  });
}

// Local Response Engine (Modular & Ready for future AI API integration)
function generateAssistantResponse(query) {
  return new Promise((resolve) => {
    const q = query.toLowerCase().trim();

    // 1. What is OHANA Business Locker?
    if (q.includes('what is ohana') || q.includes('business locker') || q.includes('busnilocker') || q.includes('about ohana') || q.includes('what is this website')) {
      resolve(`
        <p><strong>OHANA Business Locker</strong> is an enterprise digital trust and credentials platform.</p>
        <p>It centralizes your organization's legal registrations, licenses, statutory documents, and verified attributes into an encrypted, tamper-evident digital locker.</p>
        <ul>
          <li><strong>Digital Business Identity:</strong> Instantly shareable verified profile.</li>
          <li><strong>Encrypted Vault:</strong> Bank-grade document & credential storage.</li>
          <li><strong>Assurance Levels:</strong> Progressive verification from L0 to L4.</li>
          <li><strong>Audit Compliance:</strong> Zero-trust B2B sharing and renewal tracking.</li>
        </ul>
      `);
      return;
    }

    // 2. What is Business Passport?
    if (q.includes('business passport') || q.includes('passport')) {
      resolve(`
        <p>The <strong>Business Passport</strong> is your company’s verifiable digital identity credential.</p>
        <p>It consolidates authenticated corporate data—such as legal entity registration, PAN, GSTIN, verified domain, and executive contacts—into a tamper-proof digital badge.</p>
        <p>You can share your Business Passport with vendors, enterprise clients, and banks to instantly bypass manual, repetitive KYC checks.</p>
      `);
      return;
    }

    // 3. How does L0–L4 verification work?
    if (q.includes('l0') || q.includes('l1') || q.includes('l2') || q.includes('l3') || q.includes('l4') || q.includes('verification') || q.includes('tier') || q.includes('level')) {
      resolve(`
        <p>The <strong>OHANA Verification Framework</strong> spans 5 progressive assurance levels:</p>
        <ul>
          <li><strong>L0 - Account Created:</strong> Initial account registration and workspace setup.</li>
          <li><strong>L1 - Contact Verified:</strong> Authorized business email and primary phone verified.</li>
          <li><strong>L2 - Business Verified:</strong> Legal entity check against official registries (PAN, GSTIN, MCA).</li>
          <li><strong>L3 - Enhanced Verified:</strong> Bank account validation, physical office proof, and active licenses.</li>
          <li><strong>L4 - Enterprise Assured:</strong> Highest tier with executive KYC, security auditing, and continuous compliance monitoring.</li>
        </ul>
      `);
      return;
    }

    // 4. What is Share Room?
    if (q.includes('share room') || q.includes('sharing') || q.includes('share link')) {
      resolve(`
        <p><strong>Share Room</strong> is a zero-trust, time-limited B2B sharing portal.</p>
        <p>It enables you to securely disclose confidential credentials, statutory certificates, and compliance dossiers to external partners or auditors.</p>
        <ul>
          <li>Custom link expiration & password protection.</li>
          <li>Granular selective document access.</li>
          <li>Comprehensive audit trail of every view and download.</li>
          <li>Instant one-click revocation at any time.</li>
        </ul>
      `);
      return;
    }

    // 5. Verification & Trust
    if (q.includes('trust center') || q.includes('trust') || q.includes('assurance') || q.includes('compliance')) {
      resolve(`
        <p><strong>Verification & Compliance</strong> is your statutory assurance workflow.</p>
        <p>It transparently displays your company’s active verification tier (L0–L4), statutory registrations, GSTIN/PAN proofs, and ongoing audit health.</p>
        <p>Enterprise procurement teams can review your verified credentials to accelerate vendor onboarding.</p>
      `);
      return;
    }

    // 6. Identity
    if (q.includes('identity') || q.includes('gstin') || q.includes('pan') || q.includes('legal name')) {
      resolve(`
        <p>The <strong>Identity</strong> module manages your organization's core legal profile, including legal entity name, corporate registration number, GSTIN, PAN, registered office address, and primary domain verification.</p>
      `);
      return;
    }

    // 7. Documents
    if (q.includes('document') || q.includes('vault') || q.includes('certificate')) {
      resolve(`
        <p>The <strong>Documents</strong> module provides an encrypted, tamper-evident repository for all corporate files—incorporation papers, tax filings, board resolutions, and licenses—with automatic expiry tracking.</p>
      `);
      return;
    }

    // 8. Credentials
    if (q.includes('credential') || q.includes('password') || q.includes('api key') || q.includes('secret')) {
      resolve(`
        <p>The <strong>Credentials</strong> vault securely protects sensitive corporate logins, digital signatures, and API keys with role-based access control and zero-knowledge encryption.</p>
      `);
      return;
    }

    // 9. Renewals
    if (q.includes('renewal') || q.includes('expiry') || q.includes('reminder') || q.includes('expire')) {
      resolve(`
        <p>The <strong>Renewals</strong> engine proactively monitors expiry dates for domains, GST certificates, shop licenses, and trademark filings, sending timely alerts so compliance never lapses.</p>
      `);
      return;
    }

    // 10. Public Profile
    if (q.includes('public profile') || q.includes('profile') || q.includes('showcase')) {
      resolve(`
        <p>Your <strong>Public Profile</strong> is an authoritative public landing page showcasing your company's verified trust tier, active badges, and authenticated contact details to prospective clients and partners.</p>
      `);
      return;
    }

    // 11. Pricing
    if (q.includes('pricing') || q.includes('cost') || q.includes('plan') || q.includes('subscription')) {
      resolve(`
        <p>OHANA Business Locker provides scalable plans for startups, growing SMEs, and enterprise organizations.</p>
        <p>Visit our <a href="pricing.html" style="color:#2563EB;font-weight:600;text-decoration:underline;">Pricing page</a> to compare features or contact our sales team for custom volume deployments.</p>
      `);
      return;
    }

    // 12. Contact / Support
    if (q.includes('contact') || q.includes('support') || q.includes('help') || q.includes('phone') || q.includes('email')) {
      resolve(`
        <p>Our support team is here to help! You can reach us through our <a href="contact.html" style="color:#2563EB;font-weight:600;text-decoration:underline;">Contact page</a> or directly email <strong style="color:#0B1F3A;">support@ohanabusiness.com</strong>.</p>
      `);
      return;
    }

    // Intelligent Fallback
    resolve(`
      <p>I understand you're inquiring about "<em>${escapeHtml(query)}</em>".</p>
      <p>As your <strong>OHANA Assistant</strong>, I specialize in all aspects of our business trust platform. You can ask me about:</p>
      <ul>
        <li><strong>Business Passport</strong> digital identity</li>
        <li><strong>L0–L4 Verification</strong> assurance tiers</li>
        <li><strong>Share Room</strong> secure B2B file sharing</li>
        <li><strong>Document Vault</strong> security & compliance</li>
        <li><strong>Renewals</strong> & statutory document tracking</li>
      </ul>
      <p>Or click any of the suggested questions above to get started!</p>
    `);
  });
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.innerText = string;
  return div.innerHTML;
}

// ============================================================
// OHANA BUSINESS PASSPORT STORY ANIMATION — Sequential 7-Stage Enterprise Controller
// ============================================================
// ============================================================
// OHANA BUSINESS PASSPORT CREATION — Sequential 7-Stage Enterprise Controller
// Business Data -> Evidence -> Identity -> Verification -> Business Passport -> Trusted Sharing
// ============================================================
function initBPStoryAnimation() {
    const stage = document.getElementById('bpCreationStage');
    if (!stage) return;

    const indLabel        = document.getElementById('bpIndLabel');
    const evidenceField   = document.getElementById('bpEvidenceField');
    const mergingAura     = document.getElementById('bpMergingAura');
    const passportAssembly= document.getElementById('bpPassportAssembly');
    const laserBeam       = document.getElementById('bpLaserBeam');
    const l3Crest         = document.getElementById('bpL3Crest');
    const trustPillUnder  = document.getElementById('bpTrustPillUnder');
    const sharingNetwork  = document.getElementById('bpSharingNetwork');

    const proofTiles = evidenceField ? Array.from(evidenceField.querySelectorAll('.bp-proof-tile')) : [];
    const nodeCustomer = document.getElementById('nodeCustomer');
    const nodeVendor   = document.getElementById('nodeVendor');
    const nodePartner  = document.getElementById('nodePartner');
    const lineCustomer = document.getElementById('lineCustomer');
    const lineVendor   = document.getElementById('lineVendor');
    const linePartner  = document.getElementById('linePartner');

    let timers = [];
    function addTimer(fn, delay) {
        const id = setTimeout(fn, delay);
        timers.push(id);
        return id;
    }
    function clearAllTimers() {
        timers.forEach(clearTimeout);
        timers = [];
    }

    function setNarrative(text) {
        if (!indLabel) return;
        indLabel.style.opacity = '0';
        indLabel.style.transform = 'translateY(-3px)';
        addTimer(() => {
            indLabel.textContent = text;
            indLabel.style.opacity = '1';
            indLabel.style.transform = 'translateY(0)';
        }, 200);
    }

    function resetAll() {
        clearAllTimers();

        // 1. Reset Evidence Tiles
        proofTiles.forEach(tile => {
            tile.classList.remove('visible', 'wafer-layer', 'compressed');
            tile.style.opacity = '';
            tile.style.transform = '';
            tile.style.filter = '';
        });

        // 2. Reset Merging Aura
        if (mergingAura) mergingAura.classList.remove('burst');

        // 3. Reset Passport Assembly
        if (passportAssembly) {
            passportAssembly.classList.remove('assembled', 'elevated', 'floating');
            passportAssembly.style.opacity = '';
            passportAssembly.style.transform = '';
            passportAssembly.style.transition = '';
        }

        // 4. Reset Verification Scanner & L3 Badge
        if (laserBeam) laserBeam.classList.remove('scanning');
        if (l3Crest) l3Crest.classList.remove('verified');

        // 5. Reset Trust Pill Underneath
        if (trustPillUnder) trustPillUnder.classList.remove('visible');

        // 6. Reset Selective Sharing Network
        if (sharingNetwork) {
            sharingNetwork.classList.remove('visible');
            sharingNetwork.style.opacity = '';
            sharingNetwork.style.transition = '';
        }
        if (nodeCustomer) nodeCustomer.classList.remove('visible');
        if (nodeVendor) nodeVendor.classList.remove('visible');
        if (nodePartner) nodePartner.classList.remove('visible');
        if (lineCustomer) lineCustomer.classList.remove('connected');
        if (lineVendor) lineVendor.classList.remove('connected');
        if (linePartner) linePartner.classList.remove('connected');
    }

    function startCycle() {
        resetAll();

        // ----------------------------------------------------
        // STAGE 1 — PREMIUM EMPTY SPACE (0 – 1.4s)
        // Clean opening with rotating glass platform only
        // ----------------------------------------------------
        setNarrative('Business Identity Platform');

        // ----------------------------------------------------
        // STAGE 2 — BUSINESS EVIDENCE (1.4s – 4.4s)
        // Digital proofs enter sequentially: GST, PAN, DOMAIN, DOCUMENTS, ADDRESS, CERTIFICATE
        // ----------------------------------------------------
        addTimer(() => {
            setNarrative('Collecting Business Evidence');
            proofTiles.forEach((tile, idx) => {
                addTimer(() => {
                    tile.classList.add('visible');
                }, idx * 240);
            });
        }, 1400);

        // ----------------------------------------------------
        // STAGE 3 — EVIDENCE MERGING (4.4s – 6.0s)
        // Key WOW: Tiles transform into horizontal data wafers, compress into identity core, aura bursts
        // ----------------------------------------------------
        addTimer(() => {
            setNarrative('Unifying Business Proofs');
            proofTiles.forEach(tile => {
                tile.classList.remove('visible');
                tile.classList.add('wafer-layer');
            });

            // Compress all wafers into central core point
            addTimer(() => {
                proofTiles.forEach(tile => tile.classList.add('compressed'));
            }, 650);

            // Radiant merging aura burst
            addTimer(() => {
                if (mergingAura) mergingAura.classList.add('burst');
            }, 850);
        }, 4400);

        // ----------------------------------------------------
        // STAGE 4 — PASSPORT ASSEMBLY (6.0s – 7.6s)
        // OHANA Business Passport physically expands and assembles from merged layers
        // ----------------------------------------------------
        addTimer(() => {
            setNarrative('Assembling Business Passport');
            // Clean up merged tiles
            proofTiles.forEach(tile => tile.classList.remove('wafer-layer', 'compressed'));

            if (passportAssembly) passportAssembly.classList.add('assembled');
        }, 6000);

        // ----------------------------------------------------
        // STAGE 5 — VERIFICATION SCAN (7.6s – 9.6s)
        // Laser verification sweep top-to-bottom; L3 Enhanced crest illuminates
        // ----------------------------------------------------
        addTimer(() => {
            setNarrative('Verifying Business Identity');
            if (laserBeam) laserBeam.classList.add('scanning');

            // Verification completes as scan finishes
            addTimer(() => {
                if (l3Crest) l3Crest.classList.add('verified');
                setNarrative('✓ L3 Enhanced Verified');
            }, 1200);
        }, 7600);

        // ----------------------------------------------------
        // STAGE 6 — TRUST ACTIVATION (9.6s – 11.4s)
        // Passport elevates above rotating platform with depth and trust pill underneath
        // ----------------------------------------------------
        addTimer(() => {
            setNarrative('Trusted Business Identity');
            if (passportAssembly) passportAssembly.classList.add('elevated');
            if (trustPillUnder) trustPillUnder.classList.add('visible');
        }, 9600);

        // ----------------------------------------------------
        // STAGE 7 — SELECTIVE SHARING (11.4s – 17.2s)
        // Passport floats gently; 3 secure connection points reveal with laser data signals
        // ----------------------------------------------------
        addTimer(() => {
            setNarrative('Selective Trust Sharing');
            if (passportAssembly) passportAssembly.classList.add('floating');
            if (sharingNetwork) sharingNetwork.classList.add('visible');

            // 1. Customer endpoint
            addTimer(() => {
                if (nodeCustomer) nodeCustomer.classList.add('visible');
                if (lineCustomer) lineCustomer.classList.add('connected');
            }, 350);

            // 2. Vendor endpoint
            addTimer(() => {
                if (nodeVendor) nodeVendor.classList.add('visible');
                if (lineVendor) lineVendor.classList.add('connected');
            }, 900);

            // 3. Partner endpoint
            addTimer(() => {
                if (nodePartner) nodePartner.classList.add('visible');
                if (linePartner) linePartner.classList.add('connected');
            }, 1450);
        }, 11400);

        // ----------------------------------------------------
        // LOOP RESTART (17.2s – 18.2s)
        // Smooth cinematic fade out and seamless restart
        // ----------------------------------------------------
        addTimer(() => {
            if (passportAssembly) {
                passportAssembly.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                passportAssembly.style.opacity = '0';
            }
            if (sharingNetwork) {
                sharingNetwork.style.transition = 'opacity 0.8s ease';
                sharingNetwork.style.opacity = '0';
            }

            addTimer(() => {
                if (passportAssembly) {
                    passportAssembly.style.transition = '';
                    passportAssembly.style.opacity = '';
                }
                if (sharingNetwork) {
                    sharingNetwork.style.transition = '';
                    sharingNetwork.style.opacity = '';
                }
                startCycle();
            }, 850);
        }, 17200);
    }
    // Launch cycle
    startCycle();
}

// =========================================================================
// OHANA USER-SPECIFIC MULTI-ACCOUNT & NAMESPACED SESSION SYSTEM
// =========================================================================

const OHANA_CURRENT_USER_KEY = 'ohana_current_user';
const OHANA_ACCOUNTS_KEY = 'ohana_registered_accounts';
const OHANA_SESSION_KEY = 'ohana_session';
const OHANA_USER_LOGGED_IN_KEY = 'ohana_user_logged_in';

const OHANA_ACTIVE_KEYS = [
    'ohana_business_identity',
    'ohana_business_passport',
    'ohana_verification_state',
    'ohana_documents',
    'ohana_renewals_data',
    'ohana_public_profile',
    'ohana_onboarding'
];

function normalizeEmail(email) {
    return (email || '').trim().toLowerCase();
}

function computeInitials(name) {
    if (!name || typeof name !== 'string') return 'U';
    const cleaned = name.trim().replace(/[^a-zA-Z\s]/g, '');
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Seed definition for Account A (Rahul Bawa)
const ACCOUNT_A_SEED = {
    user: {
        id: "usr_rahul_bawa",
        email: "rahul.bawa@abctech.com",
        fullName: "Rahul Bawa",
        firstName: "Rahul",
        lastName: "Bawa",
        initials: "RB",
        orgName: "ABC Technologies Pvt. Ltd.",
        password: "password123",
        createdAt: "2026-01-10T09:30:00.000Z"
    },
    business_identity: {
        legalName: "ABC Technologies Private Limited",
        tradeName: "ABC Technologies",
        entityType: "Private Limited Company",
        incDate: "2021-01-15",
        cinNumber: "U72200PN2021PTC198765",
        rocOffice: "RoC Pune (Maharashtra)",
        gstin: "27ABCDE1234F1Z5",
        panNumber: "ABCDE1234F",
        udyamNumber: "UDYAM-MH-26-0019284",
        officialWebsite: "https://abctechnologies.io",
        officialEmail: "rahul.bawa@abctech.com",
        officialPhone: "+91 20 6712 8900",
        whatsappBusiness: "+91 98230 12345",
        googleMapsUrl: "https://maps.google.com/?cid=1029384756",
        address1: "Unit 402, 4th Floor, Tech Park One, Airport Road",
        address2: "Yerawada",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411006",
        industryCategory: "Information Technology & Enterprise SaaS",
        companySize: "51-200 Employees",
        businessBio: "Audited provider of enterprise cloud operations, data engineering, and managed trust infrastructure services operating under verified statutory compliance.",
        logoUrl: "../assets/logo.png"
    },
    business_passport: {
        id: "OHANA-BP-2026-9041",
        orgName: "ABC Technologies Private Limited",
        level: "L3",
        levelName: "Enhanced Verified",
        healthScore: 920,
        status: "Active",
        evidenceCount: 6,
        createdAt: "2026-01-15T10:00:00.000Z"
    },
    verification_state: {
        currentLevel: "L3",
        levelName: "Enhanced Verified",
        accountCreated: true,
        emailVerified: true,
        phoneVerified: true,
        cinVerified: true,
        gstVerified: true,
        panVerified: true,
        udyamVerified: true,
        domainVerified: true,
        addressVerified: true,
        bankVerified: true,
        auditFinancialsVerified: false,
        directorKycVerified: false,
        siteInspectionVerified: false,
        enterpriseAssured: false,
        verificationHistory: [
            { event: "Account Created & Registered", date: "10 Jan 2026, 09:30 IST", level: "L0", status: "Verified", ref: "EV-ACC-1001" },
            { event: "Corporate Email OTP Confirmed", date: "12 Jan 2026, 11:15 IST", level: "L1", status: "Verified", ref: "EV-EML-2041" },
            { event: "Corporate Phone OTP Confirmed", date: "12 Jan 2026, 11:22 IST", level: "L1", status: "Verified", ref: "EV-PHN-2042" },
            { event: "Ministry of Corporate Affairs CIN Validated", date: "15 Jan 2026, 14:10 IST", level: "L2", status: "Verified", ref: "EV-MCA-3081" },
            { event: "Income Tax PAN NSDL Validated", date: "15 Jan 2026, 14:18 IST", level: "L2", status: "Verified", ref: "EV-PAN-3082" },
            { event: "GSTIN Tax Portal Validated", date: "18 Feb 2026, 10:45 IST", level: "L3", status: "Verified", ref: "EV-GST-4019" },
            { event: "Corporate Domain DNS TXT Token Verified", date: "18 Feb 2026, 11:05 IST", level: "L3", status: "Verified", ref: "EV-DNS-4020" }
        ],
        lastUpdated: "2026-02-18T11:05:00.000Z"
    },
    documents: [
        { id: "doc_01", name: "Certificate of Incorporation", ref: "MCA-COI-2021-98765", category: "incorporation", status: "Active", verificationLevel: "L2 Verified", verificationType: "MCA Registry Attested", date: "15 Jan 2021", expiryDate: "Permanent" },
        { id: "doc_02", name: "GST Registration Certificate (REG-06)", ref: "GST-27ABCDE1234F1Z5", category: "tax", status: "Active", verificationLevel: "L2 Verified", verificationType: "GSTN Portal Attested", date: "22 Jan 2021", expiryDate: "Permanent" },
        { id: "doc_03", name: "Corporate PAN Card", ref: "PAN-ABCDE1234F", category: "tax", status: "Active", verificationLevel: "L2 Verified", verificationType: "NSDL / Income Tax Validated", date: "18 Jan 2021", expiryDate: "Permanent" },
        { id: "doc_04", name: "Udyam MSME Registration Certificate", ref: "UDYAM-MH-26-0019284", category: "licenses", status: "Active", verificationLevel: "L2 Verified", verificationType: "MSME Ministry Validated", date: "05 Mar 2021", expiryDate: "Permanent" },
        { id: "doc_05", name: "Corporate Domain SSL & DNS Attestation", ref: "DNS-abctechnologies.io", category: "compliance", status: "Active", verificationLevel: "L3 Verified", verificationType: "DNS TXT Cryptographic Record", date: "18 Feb 2026", expiryDate: "14 Oct 2026" },
        { id: "doc_06", name: "Statutory Bank Mandate & Canceled Cheque", ref: "HDFC-CA-00198273645", category: "financial", status: "Pending Review", verificationLevel: "L3 In Review", verificationType: "Penny Drop & IFSC Validation", date: "20 Feb 2026", expiryDate: "Permanent" }
    ],
    renewals_data: [
        { id: "rn_01", item: "Business Domain (abctechnologies.io)", sub: "Cloudflare Registrar · SSL Certificate", cat: "Digital", expiry: "14 Oct 2026", days: 28, owner: "Rahul Bawa", avatar: "RB", rule: "30 days before", status: "Critical" },
        { id: "rn_02", item: "GST Certificate & Quarterly Filing", sub: "GSTIN: 27ABCDE1234F1Z5 · Q2 Filing", cat: "Statutory", expiry: "30 Oct 2026", days: 44, owner: "Priya Sharma", avatar: "PS", rule: "30 days before", status: "Upcoming" },
        { id: "rn_03", item: "Professional Tax Challan (PTRC)", sub: "Government of Maharashtra State Tax", cat: "Statutory", expiry: "31 Oct 2026", days: 45, owner: "Sneha Joshi", avatar: "SJ", rule: "30 days before", status: "Upcoming" },
        { id: "rn_04", item: "Workstation Fleet Hardware AMC", sub: "Dell ProSupport Plus Contract (10 Laptops)", cat: "AMC", expiry: "15 Nov 2026", days: 60, owner: "Amit Kulkarni", avatar: "AK", rule: "60 days before", status: "Active" }
    ],
    public_profile: {
        visibility: "public",
        showCin: true,
        showGstin: true,
        showPan: true,
        showUdyam: true,
        showAddress: true,
        showWebsite: true,
        showEmail: true,
        showPhone: true
    },
    onboarding: {
        legalName: "ABC Technologies Private Limited",
        tradeName: "ABC Technologies",
        businessEmail: "rahul.bawa@abctech.com"
    }
};

// Seed definition for Account B (Vikram Malhotra)
const ACCOUNT_B_SEED = {
    user: {
        id: "usr_vikram_malhotra",
        email: "vikram@techcorp.com",
        fullName: "Vikram Malhotra",
        firstName: "Vikram",
        lastName: "Malhotra",
        initials: "VM",
        orgName: "TechCorp Solutions Global",
        password: "password123",
        createdAt: "2026-02-01T10:00:00.000Z"
    },
    business_identity: {
        legalName: "TechCorp Solutions Global Private Limited",
        tradeName: "TechCorp Global",
        entityType: "Private Limited Company",
        incDate: "2022-06-20",
        cinNumber: "U74999KA2022PTC162840",
        rocOffice: "RoC Bangalore (Karnataka)",
        gstin: "29AABCT8842K1Z9",
        panNumber: "AABCT8842K",
        udyamNumber: "UDYAM-KR-03-0048123",
        officialWebsite: "https://techcorpglobal.com",
        officialEmail: "vikram@techcorp.com",
        officialPhone: "+91 80 4123 7700",
        whatsappBusiness: "+91 98450 67890",
        googleMapsUrl: "https://maps.google.com/?q=TechCorp+Global",
        address1: "Level 6, Brigade Tech Gardens, Brookefield",
        address2: "Whitefield Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560037",
        industryCategory: "Cloud Computing & Cybersecurity Solutions",
        companySize: "201-500 Employees",
        businessBio: "Enterprise cloud migration, identity security architecture, and automated compliance solutions for modern digital infrastructure.",
        logoUrl: "../assets/logo.png"
    },
    business_passport: {
        id: "OHANA-BP-2026-4421",
        orgName: "TechCorp Solutions Global Private Limited",
        level: "L2",
        levelName: "Business Verified",
        healthScore: 780,
        status: "Active",
        evidenceCount: 4,
        createdAt: "2026-02-01T10:00:00.000Z"
    },
    verification_state: {
        currentLevel: "L2",
        levelName: "Business Verified",
        accountCreated: true,
        emailVerified: true,
        phoneVerified: true,
        cinVerified: true,
        gstVerified: true,
        panVerified: true,
        udyamVerified: false,
        domainVerified: true,
        addressVerified: true,
        bankVerified: false,
        auditFinancialsVerified: false,
        directorKycVerified: false,
        siteInspectionVerified: false,
        enterpriseAssured: false,
        verificationHistory: [
            { event: "Account Created & Registered", date: "01 Feb 2026, 10:00 IST", level: "L0", status: "Verified", ref: "EV-ACC-5011" },
            { event: "Corporate Email Confirmed", date: "01 Feb 2026, 10:15 IST", level: "L1", status: "Verified", ref: "EV-EML-5012" },
            { event: "Corporate Phone OTP Confirmed", date: "01 Feb 2026, 10:20 IST", level: "L1", status: "Verified", ref: "EV-PHN-5013" },
            { event: "MCA CIN Registry Attested", date: "05 Feb 2026, 14:00 IST", level: "L2", status: "Verified", ref: "EV-MCA-5020" },
            { event: "Corporate PAN Validated", date: "05 Feb 2026, 14:10 IST", level: "L2", status: "Verified", ref: "EV-PAN-5021" },
            { event: "GSTIN Tax Record Validated", date: "10 Feb 2026, 16:30 IST", level: "L2", status: "Verified", ref: "EV-GST-5035" },
            { event: "Domain Cryptographic TXT Attested", date: "01 Mar 2026, 11:00 IST", level: "L2", status: "Verified", ref: "EV-DNS-5080" }
        ],
        lastUpdated: "2026-03-01T11:00:00.000Z"
    },
    documents: [
        { id: "doc_tc_01", name: "TechCorp Certificate of Incorporation", ref: "MCA-COI-2022-162840", category: "incorporation", status: "Active", verificationLevel: "L2 Verified", verificationType: "MCA Registry Attested", date: "20 Jun 2022", expiryDate: "Permanent" },
        { id: "doc_tc_02", name: "TechCorp GST Registration Certificate", ref: "GST-29AABCT8842K1Z9", category: "tax", status: "Active", verificationLevel: "L2 Verified", verificationType: "GSTN Portal Attested", date: "28 Jun 2022", expiryDate: "Permanent" },
        { id: "doc_tc_03", name: "TechCorp Corporate PAN Card", ref: "PAN-AABCT8842K", category: "tax", status: "Active", verificationLevel: "L2 Verified", verificationType: "NSDL / Income Tax Validated", date: "25 Jun 2022", expiryDate: "Permanent" },
        { id: "doc_tc_04", name: "Corporate Domain SSL & Security Attestation", ref: "DNS-techcorpglobal.com", category: "compliance", status: "Active", verificationLevel: "L2 Verified", verificationType: "DNS TXT Cryptographic Record", date: "01 Mar 2026", expiryDate: "20 Dec 2026" }
    ],
    renewals_data: [
        { id: "rn_tc_01", item: "AWS Enterprise Cloud Infrastructure", sub: "Amazon Web Services · Cloud Architecture", cat: "Digital", expiry: "20 Nov 2026", days: 45, owner: "Vikram Malhotra", avatar: "VM", rule: "30 days before", status: "Upcoming" },
        { id: "rn_tc_02", item: "ISO 27001 Annual Surveillance Audit", sub: "Bureau Veritas · Information Security", cat: "Statutory", expiry: "24 Oct 2026", days: 18, owner: "Vikram Malhotra", avatar: "VM", rule: "30 days before", status: "Critical" },
        { id: "rn_tc_03", item: "Bengaluru Municipal Trade License", sub: "Bruhat Bengaluru Mahanagara Palike (BBMP)", cat: "Statutory", expiry: "31 Dec 2026", days: 90, owner: "Vikram Malhotra", avatar: "VM", rule: "60 days before", status: "Active" }
    ],
    public_profile: {
        visibility: "public",
        showCin: true,
        showGstin: true,
        showPan: true,
        showUdyam: false,
        showAddress: true,
        showWebsite: true,
        showEmail: true,
        showPhone: true
    },
    onboarding: {
        legalName: "TechCorp Solutions Global Private Limited",
        tradeName: "TechCorp Global",
        businessEmail: "vikram@techcorp.com"
    }
};

const DEFAULT_OHANA_VERIFICATION_STATE = ACCOUNT_A_SEED.verification_state;

function getUserPartitionKey(email) {
    return 'ohana_account_' + normalizeEmail(email);
}

function saveUserPartition(email, data) {
    if (!email || !data) return;
    try {
        localStorage.setItem(getUserPartitionKey(email), JSON.stringify(data));
    } catch(e) {}
}

function loadUserPartition(email) {
    if (!email) return null;
    try {
        const raw = localStorage.getItem(getUserPartitionKey(email));
        if (raw) return JSON.parse(raw);
    } catch(e) {}
    return null;
}

function createFreshUserPartition(user) {
    const org = user.orgName || (user.fullName ? user.fullName + ' Enterprise' : 'Enterprise');
    const email = user.email || '';
    const randomId = Math.floor(1000 + Math.random() * 9000);

    return {
        user: user,
        business_identity: {
            legalName: org,
            tradeName: org,
            entityType: "Private Limited Company",
            incDate: new Date().toISOString().split('T')[0],
            cinNumber: "",
            rocOffice: "",
            gstin: "",
            panNumber: "",
            udyamNumber: "",
            officialWebsite: "",
            officialEmail: email,
            officialPhone: "",
            whatsappBusiness: "",
            googleMapsUrl: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            pincode: "",
            industryCategory: "Technology & Professional Services",
            companySize: "1-10 Employees",
            businessBio: `Official business entity profile for ${org}. Registered on the Ohana Trust Protocol.`,
            logoUrl: "../assets/logo.png"
        },
        business_passport: {
            id: `OHANA-BP-2026-${randomId}`,
            orgName: org,
            level: "L0",
            levelName: "Account Claimed",
            healthScore: 500,
            status: "Active",
            evidenceCount: 0,
            createdAt: new Date().toISOString()
        },
        verification_state: {
            currentLevel: "L0",
            levelName: "Account Claimed",
            accountCreated: true,
            emailVerified: false,
            phoneVerified: false,
            cinVerified: false,
            gstVerified: false,
            panVerified: false,
            udyamVerified: false,
            domainVerified: false,
            addressVerified: false,
            bankVerified: false,
            auditFinancialsVerified: false,
            directorKycVerified: false,
            siteInspectionVerified: false,
            enterpriseAssured: false,
            verificationHistory: [
                { event: "Account Created & Registered", date: new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }), level: "L0", status: "Verified", ref: `EV-ACC-${randomId}` }
            ],
            lastUpdated: new Date().toISOString()
        },
        documents: [],
        renewals_data: [],
        public_profile: {
            visibility: "public",
            showCin: true,
            showGstin: true,
            showPan: true,
            showUdyam: false,
            showAddress: true,
            showWebsite: true,
            showEmail: true,
            showPhone: true
        },
        onboarding: {
            legalName: org,
            tradeName: org,
            businessEmail: email
        }
    };
}

function getRegisteredAccounts() {
    try {
        const stored = localStorage.getItem(OHANA_ACCOUNTS_KEY);
        if (stored) {
            const list = JSON.parse(stored);
            if (Array.isArray(list) && list.length > 0) {
                // Ensure seed partitions exist
                if (!loadUserPartition(ACCOUNT_A_SEED.user.email)) {
                    saveUserPartition(ACCOUNT_A_SEED.user.email, ACCOUNT_A_SEED);
                    saveUserPartition('rahul@abctech.com', ACCOUNT_A_SEED);
                }
                if (!loadUserPartition(ACCOUNT_B_SEED.user.email)) {
                    saveUserPartition(ACCOUNT_B_SEED.user.email, ACCOUNT_B_SEED);
                    saveUserPartition('vikram.malhotra@techcorp.com', ACCOUNT_B_SEED);
                }
                return list;
            }
        }
    } catch(e) {}

    // Initial pre-seeding of registered accounts
    const defaults = [
        ACCOUNT_A_SEED.user,
        ACCOUNT_B_SEED.user
    ];
    saveRegisteredAccounts(defaults);
    saveUserPartition(ACCOUNT_A_SEED.user.email, ACCOUNT_A_SEED);
    saveUserPartition('rahul@abctech.com', ACCOUNT_A_SEED);
    saveUserPartition(ACCOUNT_B_SEED.user.email, ACCOUNT_B_SEED);
    saveUserPartition('vikram.malhotra@techcorp.com', ACCOUNT_B_SEED);
    return defaults;
}

function saveRegisteredAccounts(accounts) {
    try {
        localStorage.setItem(OHANA_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch(e) {}
}

function findRegisteredAccount(identifier) {
    if (!identifier) return null;
    const clean = normalizeEmail(identifier);
    const accounts = getRegisteredAccounts();
    return accounts.find(a => {
        const em = normalizeEmail(a.email);
        return em === clean ||
            em.split('@')[0] === clean ||
            (clean === 'rahul' && em.includes('rahul')) ||
            (clean === 'vikram' && em.includes('vikram')) ||
            (clean === 'rahul@abctech.com' && em.includes('rahul')) ||
            (clean === 'vikram.malhotra@techcorp.com' && em.includes('vikram'));
    }) || null;
}

function getCurrentOhanaUser() {
    try {
        const stored = localStorage.getItem(OHANA_CURRENT_USER_KEY);
        if (stored) {
            const user = JSON.parse(stored);
            if (!user.initials && user.fullName) {
                user.initials = computeInitials(user.fullName);
            }
            return user;
        }
    } catch(e) {}

    // Return null if not authenticated – never bypass login on protected pages
    return null;
}

function persistCurrentAccountData() {
    let user = null;
    try {
        const stored = localStorage.getItem(OHANA_CURRENT_USER_KEY);
        if (stored) user = JSON.parse(stored);
    } catch(e) {}

    if (!user || !user.email) return;

    let partition = loadUserPartition(user.email) || { user };
    partition.user = user;

    // Harvest current active working keys into this account's partition
    try {
        const idRaw = localStorage.getItem('ohana_business_identity');
        if (idRaw) partition.business_identity = JSON.parse(idRaw);
    } catch(e) {}
    try {
        const bpRaw = localStorage.getItem('ohana_business_passport');
        if (bpRaw) partition.business_passport = JSON.parse(bpRaw);
    } catch(e) {}
    try {
        const vRaw = localStorage.getItem('ohana_verification_state');
        if (vRaw) partition.verification_state = JSON.parse(vRaw);
    } catch(e) {}
    try {
        const docRaw = localStorage.getItem('ohana_documents');
        if (docRaw) partition.documents = JSON.parse(docRaw);
    } catch(e) {}
    try {
        const renRaw = localStorage.getItem('ohana_renewals_data');
        if (renRaw) partition.renewals_data = JSON.parse(renRaw);
    } catch(e) {}
    try {
        const pubRaw = localStorage.getItem('ohana_public_profile');
        if (pubRaw) partition.public_profile = JSON.parse(pubRaw);
    } catch(e) {}
    try {
        const obRaw = localStorage.getItem('ohana_onboarding');
        if (obRaw) partition.onboarding = JSON.parse(obRaw);
    } catch(e) {}

    saveUserPartition(user.email, partition);
}

function hydrateActiveSession(user) {
    if (!user || !user.email) return;

    // Normalize user fields
    if (!user.initials) {
        user.initials = computeInitials(user.fullName || user.email);
    }
    if (!user.firstName) {
        user.firstName = (user.fullName || '').split(' ')[0] || 'User';
    }
    if (!user.lastName) {
        user.lastName = (user.fullName || '').split(' ').slice(1).join(' ') || '';
    }

    // 1. Set active session in localStorage
    localStorage.setItem(OHANA_CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(OHANA_USER_LOGGED_IN_KEY, 'true');
    localStorage.setItem(OHANA_SESSION_KEY, JSON.stringify({
        loggedIn: true,
        email: user.email,
        fullName: user.fullName,
        orgName: user.orgName || 'Enterprise',
        loginTime: new Date().toISOString()
    }));

    // 2. Load or initialize partition
    let partition = loadUserPartition(user.email);
    if (!partition) {
        if (user.email.includes('rahul')) {
            partition = ACCOUNT_A_SEED;
        } else if (user.email.includes('vikram')) {
            partition = ACCOUNT_B_SEED;
        } else {
            partition = createFreshUserPartition(user);
        }
        saveUserPartition(user.email, partition);
    }

    // 3. Populate working keys from user's isolated partition
    if (partition.business_identity) {
        localStorage.setItem('ohana_business_identity', JSON.stringify(partition.business_identity));
    }
    if (partition.business_passport) {
        localStorage.setItem('ohana_business_passport', JSON.stringify(partition.business_passport));
    }
    if (partition.verification_state) {
        localStorage.setItem('ohana_verification_state', JSON.stringify(partition.verification_state));
    }
    if (partition.documents) {
        localStorage.setItem('ohana_documents', JSON.stringify(partition.documents));
    }
    if (partition.renewals_data) {
        localStorage.setItem('ohana_renewals_data', JSON.stringify(partition.renewals_data));
    }
    if (partition.public_profile) {
        localStorage.setItem('ohana_public_profile', JSON.stringify(partition.public_profile));
    }
    if (partition.onboarding) {
        localStorage.setItem('ohana_onboarding', JSON.stringify(partition.onboarding));
    }

    // 4. Dynamically update UI
    renderUserProfileChips(user);
    if (typeof syncOhanaGlobalState === 'function') {
        syncOhanaGlobalState();
    }
}

function switchOhanaAccount(userOrEmail) {
    // 1. Persist current account data before switching
    persistCurrentAccountData();

    let targetUser = null;
    if (typeof userOrEmail === 'object' && userOrEmail !== null) {
        targetUser = userOrEmail;
    } else {
        targetUser = findRegisteredAccount(userOrEmail);
        if (!targetUser) {
            // Auto-provision from email
            const email = normalizeEmail(userOrEmail);
            const userPart = email.split('@')[0] || 'User';
            const domainPart = (email.split('@')[1] || '').split('.')[0] || 'Company';
            const nameParts = userPart.split(/[._-]/).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
            const fullName = nameParts.join(' ');
            const orgName = domainPart.charAt(0).toUpperCase() + domainPart.slice(1) + " Technologies";

            targetUser = {
                id: 'usr_' + Date.now(),
                email: email,
                fullName: fullName,
                firstName: nameParts[0] || 'User',
                lastName: nameParts.slice(1).join(' ') || '',
                initials: computeInitials(fullName),
                orgName: orgName,
                password: 'password123',
                createdAt: new Date().toISOString()
            };

            const accounts = getRegisteredAccounts();
            accounts.push(targetUser);
            saveRegisteredAccounts(accounts);
        }
    }

    hydrateActiveSession(targetUser);
    return targetUser;
}

function logoutOhanaUser() {
    // 1. Save whatever changes were made to the current account's partition
    persistCurrentAccountData();

    // 2. Clear ONLY the active session / current user state
    localStorage.removeItem(OHANA_CURRENT_USER_KEY);
    localStorage.removeItem(OHANA_USER_LOGGED_IN_KEY);
    localStorage.removeItem(OHANA_SESSION_KEY);

    // 3. Clear working keys so the next account loads their own isolated data
    OHANA_ACTIVE_KEYS.forEach(key => localStorage.removeItem(key));
}

function renderUserProfileChips(user) {
    if (!user) user = getCurrentOhanaUser();
    if (!user) return;

    const displayName = user.fullName || user.name || (user.email ? user.email.split('@')[0] : 'User');
    const initials = user.initials || (typeof computeInitials === 'function' ? computeInitials(displayName) : (displayName ? displayName.charAt(0).toUpperCase() : 'U'));

    const chips = document.querySelectorAll('.profile-chip');
    chips.forEach(chip => {
        let avatar = chip.querySelector('.avatar');
        if (!avatar) {
            avatar = document.createElement('span');
            avatar.className = 'avatar';
            chip.prepend(avatar);
        }
        avatar.textContent = initials;

        // Remove plain text nodes
        Array.from(chip.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                node.remove();
            }
        });

        chip.appendChild(document.createTextNode(' ' + displayName));
        chip.setAttribute('title', `Signed in as ${displayName} (${user.email || ''})`);
        chip.style.cursor = 'pointer';
        if (!chip.getAttribute('data-profile-bound')) {
            chip.setAttribute('data-profile-bound', 'true');
            chip.addEventListener('click', (e) => {
                window.location.href = '/public-profile';
            });
        }
    });

    // Also update any other user profile representations across pages
    document.querySelectorAll('.user-name').forEach(el => {
        if (el.textContent.includes('(You)')) {
            el.textContent = `${displayName} (You)`;
        }
    });
}

function initOhanaUserSession() {
    // 1. Ensure seed accounts exist
    getRegisteredAccounts();

    // 2. Check current user & render chips
    const user = getCurrentOhanaUser();
    if (user) {
        renderUserProfileChips(user);
    }

    // 3. Bind all sidebar logout links
    bindSidebarLogoutLinks();

    // 4. Hook beforeunload to persist current working data
    window.addEventListener('beforeunload', () => {
        persistCurrentAccountData();
    });
}

function bindSidebarLogoutLinks() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    sidebar.querySelectorAll('.side-bottom a').forEach(a => {
        const text = a.textContent.toLowerCase();
        const href = a.getAttribute('href') || '';
        if (text.includes('logout') || href.includes('index.html')) {
            if (!a.getAttribute('data-logout-bound')) {
                a.setAttribute('data-logout-bound', 'true');
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    logoutOhanaUser();
                    window.location.href = '/';
                });
            }
        }
    });
}

function enforceOhanaAuthGuard() {
    const rawPath = window.location.pathname.split('/').pop().split('?')[0] || '';
    const curPath = rawPath.replace(/\.html$/, '');

    const publicPages = [
        '',
        'index',
        'login',
        'signup',
        'onboarding',
        'features',
        'about',
        'contact',
        'security',
        'public-profile'
    ];

    const isProtected = !publicPages.includes(curPath);
    const isLoggedIn = Boolean(
        localStorage.getItem(OHANA_USER_LOGGED_IN_KEY) === 'true' &&
        localStorage.getItem(OHANA_CURRENT_USER_KEY)
    );

    if (isProtected && !isLoggedIn) {
        const redir = encodeURIComponent(window.location.pathname + (window.location.search || ''));
        window.location.replace(`/login?redirect=${redir}`);
        return false;
    }
    return true;
}

// Protected Navigation Interceptor: Route unauthenticated clicks to login page
function initProtectedNavInterceptors() {
    const isLoggedIn = Boolean(
        localStorage.getItem(OHANA_USER_LOGGED_IN_KEY) === 'true' &&
        localStorage.getItem(OHANA_CURRENT_USER_KEY)
    );

    const isRoot = !window.location.pathname.includes('/pages/');
    const loginPath = isRoot ? 'pages/login.html' : 'login.html';
    const dashPath = isRoot ? 'pages/dashboard.html' : 'dashboard.html';

    // 1. Dynamic Header CTA updates if already logged in
    const loginNavLinks = document.querySelectorAll('.btn-nav-login');
    const ctaNavLinks = document.querySelectorAll('.btn-nav-cta');

    if (isLoggedIn) {
        const curUser = getCurrentOhanaUser();
        loginNavLinks.forEach(btn => {
            btn.textContent = curUser ? (curUser.firstName || 'Dashboard') : 'Dashboard';
            btn.href = dashPath;
        });
        ctaNavLinks.forEach(btn => {
            btn.innerHTML = '<span>Dashboard →</span>';
            btn.href = dashPath;
        });
    }

    // 2. Configure PDP module cards, CTAs, and protected footer links
    const publicPages = [
        'index.html',
        'login.html',
        'signup.html',
        'features.html',
        'about.html',
        'contact.html',
        'security.html',
        'public-profile.html'
    ];

    const targets = document.querySelectorAll('.pdp-card, .btn-enterprise-primary, .hero-actions-group a, .fd-nav-col a');
    targets.forEach(el => {
        // Exclude Pricing links from being redirected to login
        if (el.getAttribute('data-nav-pricing') === 'true' || el.textContent.trim().toLowerCase() === 'pricing') {
            return;
        }

        const origHref = el.getAttribute('data-orig-href') || el.getAttribute('href');
        if (!origHref || origHref.startsWith('#') || origHref.startsWith('javascript:')) return;

        if (!el.getAttribute('data-orig-href')) {
            el.setAttribute('data-orig-href', origHref);
        }

        const targetFile = origHref.split('/').pop().split('?')[0];
        const isProtectedTarget = !publicPages.includes(targetFile) && targetFile.endsWith('.html');

        if (isProtectedTarget) {
            if (!isLoggedIn) {
                // Route unauthenticated visitors to login with target redirect parameter
                el.href = `${loginPath}?redirect=${encodeURIComponent(targetFile)}`;
            } else {
                // Restore direct protected module target when authenticated
                el.href = origHref;
            }
        }
    });

    // 3. Pricing Navigation: clicking Pricing opens Login page (user logs in -> opens Dashboard)
    initPricingNavigation(dashPath, loginPath);
}

function initPricingNavigation(dashPath, loginPath) {
    if (!dashPath || !loginPath) {
        const isRoot = !window.location.pathname.includes('/pages/');
        dashPath = isRoot ? 'pages/dashboard.html' : 'dashboard.html';
        loginPath = isRoot ? 'pages/login.html' : 'login.html';
    }

    document.querySelectorAll('a').forEach(a => {
        const text = a.textContent.trim().toLowerCase();
        if (text === 'pricing' || a.getAttribute('data-nav-pricing') === 'true') {
            a.setAttribute('data-nav-pricing', 'true');
            const isLoggedIn = Boolean(
                localStorage.getItem(OHANA_USER_LOGGED_IN_KEY) === 'true' &&
                localStorage.getItem(OHANA_CURRENT_USER_KEY)
            );
            const targetUrl = isLoggedIn ? dashPath : `${loginPath}?redirect=dashboard.html`;
            a.setAttribute('href', targetUrl);

            if (!a.getAttribute('data-pricing-bound')) {
                a.setAttribute('data-pricing-bound', 'true');
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    const currentlyLoggedIn = Boolean(
                        localStorage.getItem(OHANA_USER_LOGGED_IN_KEY) === 'true' &&
                        localStorage.getItem(OHANA_CURRENT_USER_KEY)
                    );
                    if (currentlyLoggedIn) {
                        window.location.href = '/dashboard';
                    } else {
                        window.location.href = '/login?redirect=/dashboard';
                    }
                });
            }
        }
    });
}

// Global helper registration
window.enforceOhanaAuthGuard = enforceOhanaAuthGuard;
window.initProtectedNavInterceptors = initProtectedNavInterceptors;
window.OhanaAuth = {
    getCurrentUser: getCurrentOhanaUser,
    getRegisteredAccounts: getRegisteredAccounts,
    findAccount: findRegisteredAccount,
    switchAccount: switchOhanaAccount,
    logout: logoutOhanaUser,
    persist: persistCurrentAccountData,
    hydrate: hydrateActiveSession,
    renderChips: renderUserProfileChips
};
window.getCurrentOhanaUser = getCurrentOhanaUser;
window.switchOhanaAccount = switchOhanaAccount;
window.logoutOhanaUser = logoutOhanaUser;
window.renderUserProfileChips = renderUserProfileChips;
window.persistCurrentAccountData = persistCurrentAccountData;

// ============================================================================
// DYNAMIC BUSINESS-SPECIFIC REQUIREMENT ENGINE
// Business Type + Entity Type = Applicable Verification/Documents
// ============================================================================

const OHANA_ENTITY_TYPES = [
    "Sole Proprietorship",
    "Partnership",
    "LLP",
    "Private Limited",
    "Public Limited",
    "Trust / Society",
    "Other"
];

const OHANA_BUSINESS_TYPES = [
    "Food & Restaurant",
    "Retail Shop",
    "Service Business",
    "Manufacturing",
    "Professional",
    "Other"
];

const OHANA_DOC_REQUIREMENTS = {
    pan: {
        id: "pan",
        name: "Permanent Account Number (PAN)",
        shortName: "Income Tax PAN",
        category: "Tax",
        vStateKey: "panVerified",
        description: "Official entity/proprietor PAN issued by the Income Tax Department / NSDL"
    },
    cin: {
        id: "cin",
        name: "MCA Certificate of Incorporation (CIN / LLPIN)",
        shortName: "MCA CIN / LLPIN",
        category: "Registration",
        vStateKey: "cinVerified",
        description: "21-character Corporate Identification Number or 7-character LLPIN from MCA registry"
    },
    gst: {
        id: "gst",
        name: "Goods & Services Tax Registration (GSTIN)",
        shortName: "GSTIN Certificate",
        category: "Tax",
        vStateKey: "gstVerified",
        description: "15-digit State Goods & Services Tax Registration (REG-06) Certificate"
    },
    fssai: {
        id: "fssai",
        name: "FSSAI Food Safety License / Registration",
        shortName: "FSSAI License",
        category: "License",
        vStateKey: "fssaiVerified",
        description: "Mandatory Food Safety and Standards Authority of India Registration or License"
    },
    shop_license: {
        id: "shop_license",
        name: "Shop & Establishment / Local Municipal Trade License",
        shortName: "Shop & Establishment",
        category: "License",
        vStateKey: "shopLicenseVerified",
        description: "Gumasta, Trade License or municipal registration for physical commercial premises"
    },
    owner_id: {
        id: "owner_id",
        name: "Owner Identity & Aadhaar / Voter Proof",
        shortName: "Owner Identity Proof",
        category: "Identity",
        vStateKey: "ownerVerified",
        description: "Aadhaar Card, Passport, or Voter ID of the Sole Proprietor"
    },
    director_kyc: {
        id: "director_kyc",
        name: "Executive Director KYC & DIN Attestation",
        shortName: "Director KYC",
        category: "Identity",
        vStateKey: "directorKycVerified",
        description: "DIN, PAN and Passport verification of active designated directors / partners"
    },
    partnership_deed: {
        id: "partnership_deed",
        name: "Partnership Deed / Registered LLP Agreement",
        shortName: "Partnership Deed",
        category: "Registration",
        vStateKey: "deedVerified",
        description: "Signed & notarized partnership deed or registrar-approved LLP agreement"
    },
    trust_deed: {
        id: "trust_deed",
        name: "Trust Deed / Society Registration Certificate",
        shortName: "Trust / Society Deed",
        category: "Registration",
        vStateKey: "trustDeedVerified",
        description: "Registered deed of trust, society bylaws and registrar certificate"
    },
    address: {
        id: "address",
        name: "Registered / Operating Address Proof",
        shortName: "Address Proof",
        category: "Registration",
        vStateKey: "addressVerified",
        description: "Commercial utility bill, lease agreement or property tax receipt & geo-tag"
    },
    bank: {
        id: "bank",
        name: "Bank Account Proof (Cancelled Cheque / Statement)",
        shortName: "Bank Account Proof",
        category: "Financials",
        vStateKey: "bankVerified",
        description: "Current / Business operative bank account cancelled cheque or bank statement"
    },
    udyam: {
        id: "udyam",
        name: "Udyam MSME Registration Certificate",
        shortName: "Udyam MSME",
        category: "Registration",
        vStateKey: "udyamVerified",
        description: "Ministry of MSME Udyam Registration number and certificate"
    },
    domain: {
        id: "domain",
        name: "Official Corporate Domain Verification (DNS TXT)",
        shortName: "Domain Verification",
        category: "Identity",
        vStateKey: "domainVerified",
        description: "Cryptographic DNS TXT record token verified against corporate domain"
    },
    financials: {
        id: "financials",
        name: "Audited Financial Statements / Balance Sheet",
        shortName: "Audited Financials",
        category: "Financials",
        vStateKey: "auditFinancialsVerified",
        description: "Chartered Accountant attested balance sheet & profit/loss statements"
    }
};

function normalizeEntityType(raw) {
    if (!raw) return "Private Limited";
    const s = String(raw).toLowerCase().trim();
    if (s.includes("sole") || s.includes("proprietor")) return "Sole Proprietorship";
    if (s.includes("llp") || s.includes("limited liability partnership")) return "LLP";
    if (s.includes("public")) return "Public Limited";
    if (s.includes("private") || s.includes("pvt")) return "Private Limited";
    if (s.includes("partnership")) return "Partnership";
    if (s.includes("trust") || s.includes("society") || s.includes("ngo")) return "Trust / Society";
    return "Other";
}

function normalizeBusinessType(raw) {
    if (!raw) return "Food & Restaurant";
    const s = String(raw).toLowerCase().trim();
    if (s.includes("food") || s.includes("restaurant") || s.includes("cafe") || s.includes("vadapav") || s.includes("bakery") || s.includes("hotel")) return "Food & Restaurant";
    if (s.includes("retail") || s.includes("shop") || s.includes("store") || s.includes("trading") || s.includes("mart") || s.includes("grocer")) return "Retail Shop";
    if (s.includes("service") || s.includes("agency") || s.includes("software") || s.includes("tech") || s.includes("consult") || s.includes("it")) return "Service Business";
    if (s.includes("manuf") || s.includes("factory") || s.includes("industrial") || s.includes("product")) return "Manufacturing";
    if (s.includes("prof") || s.includes("legal") || s.includes("ca ") || s.includes("account") || s.includes("doctor") || s.includes("architect")) return "Professional";
    return "Other";
}

// User-level overrides for optional/custom requirement toggles (e.g. user marks optional item as N/A or vice-versa)
function getRequirementOverrides() {
    try {
        const stored = localStorage.getItem('ohana_requirement_overrides');
        if (stored) return JSON.parse(stored);
    } catch(e) {}
    return {};
}

function saveRequirementOverride(reqId, status) {
    const overrides = getRequirementOverrides();
    if (status) {
        overrides[reqId] = status;
    } else {
        delete overrides[reqId];
    }
    try {
        localStorage.setItem('ohana_requirement_overrides', JSON.stringify(overrides));
    } catch(e) {}
}

/**
 * Centralized dynamic requirement matrix calculator
 * Business Type + Entity Type = Applicable Verification/Documents
 */
function getBusinessRequirementProfile(customIdentity) {
    let identity = customIdentity;
    if (!identity) {
        try {
            const rawId = localStorage.getItem('ohana_business_identity');
            if (rawId) identity = JSON.parse(rawId);
        } catch(e) {}
    }
    if (!identity) {
        try {
            const rawOb = localStorage.getItem('ohana_onboarding');
            if (rawOb) identity = JSON.parse(rawOb);
        } catch(e) {}
    }
    if (!identity) {
        const user = (typeof getCurrentOhanaUser === 'function') ? getCurrentOhanaUser() : null;
        identity = {
            entityType: "Private Limited",
            businessType: "Food & Restaurant",
            legalName: user?.orgName || "Enterprise"
        };
    }

    const rawEntity = identity.entityType || identity.entity_type || "Sole Proprietorship";
    const rawBusiness = identity.businessType || identity.business_type || identity.industry || "";
    const isConfigured = Boolean(identity.businessType || identity.business_type);

    const normEntity = normalizeEntityType(rawEntity);
    const normBusiness = normalizeBusinessType(rawBusiness);
    const overrides = getRequirementOverrides();

    const isFood = (normBusiness === "Food & Restaurant");
    const isRetail = (normBusiness === "Retail Shop");
    const isSoleProp = (normEntity === "Sole Proprietorship");
    const isPartnership = (normEntity === "Partnership");
    const isLLP = (normEntity === "LLP");
    const isCorporate = (normEntity === "Private Limited" || normEntity === "Public Limited");
    const isTrust = (normEntity === "Trust / Society");

    // Dynamic Matrix evaluation per requirement
    const evaluatedRequirements = [];

    Object.keys(OHANA_DOC_REQUIREMENTS).forEach(key => {
        const docDef = { ...OHANA_DOC_REQUIREMENTS[key] };
        let status = "optional"; // default
        let reason = "";

        switch (key) {
            case "pan":
                status = "required";
                reason = "Mandatory for all registered business entities in India";
                break;

            case "cin":
                if (isCorporate || isLLP) {
                    status = "required";
                    reason = isLLP ? "Mandatory Ministry of Corporate Affairs LLPIN" : "Mandatory Corporate Identification Number (CIN) from MCA";
                } else {
                    status = "not_applicable";
                    reason = `Not applicable for ${normEntity} (CIN is corporate-only)`;
                }
                break;

            case "gst":
                if (isCorporate || normBusiness === "Manufacturing") {
                    status = "required";
                    reason = "Mandatory for incorporated companies and manufacturing facilities";
                } else if (isSoleProp || isRetail || isFood) {
                    status = "optional";
                    reason = "Optional for small turnover / composition scheme entities";
                } else {
                    status = "optional";
                    reason = "Optional depending on annual revenue threshold";
                }
                break;

            case "fssai":
                if (isFood) {
                    status = "required";
                    reason = "Mandatory Food Safety License for food businesses, restaurants, and eateries";
                } else {
                    status = "not_applicable";
                    reason = "Not applicable for non-food business operations";
                }
                break;

            case "shop_license":
                if (isFood || isRetail || isSoleProp) {
                    status = "required";
                    reason = "Mandatory local municipal / Shop & Establishment trade license";
                } else if (isCorporate) {
                    status = "optional";
                    reason = "Optional if corporate registered office holds MCA address proof";
                } else {
                    status = "optional";
                    reason = "Recommended for physical operating commercial premises";
                }
                break;

            case "owner_id":
                if (isSoleProp) {
                    status = "required";
                    reason = "Mandatory Aadhaar / Voter ID proof of individual sole proprietor";
                } else if (isPartnership) {
                    status = "optional";
                    reason = "Individual partner identity proof";
                } else {
                    status = "not_applicable";
                    reason = "Corporate entities use Director KYC instead of individual owner proof";
                }
                break;

            case "director_kyc":
                if (isCorporate || isLLP) {
                    status = "required";
                    reason = "Mandatory Director Identification Number (DIN) and KYC check";
                } else {
                    status = "not_applicable";
                    reason = "Not applicable for non-corporate entities (Sole Proprietorship / Partnership)";
                }
                break;

            case "partnership_deed":
                if (isPartnership || isLLP) {
                    status = "required";
                    reason = "Mandatory registered Partnership Deed or MCA LLP Agreement";
                } else {
                    status = "not_applicable";
                    reason = "Not applicable for Sole Proprietorships or Private Limited companies";
                }
                break;

            case "trust_deed":
                if (isTrust) {
                    status = "required";
                    reason = "Mandatory registered Trust Deed or Society Bylaws";
                } else {
                    status = "not_applicable";
                    reason = "Not applicable for commercial for-profit businesses";
                }
                break;

            case "address":
                status = "required";
                reason = "Mandatory commercial operating / registered office address verification";
                break;

            case "bank":
                status = "required";
                reason = "Mandatory operative bank account proof / cancelled cheque";
                break;

            case "udyam":
                status = "optional";
                reason = "Optional government MSME certificate for priority lending and subsidies";
                break;

            case "domain":
                if (normBusiness === "Service Business" && isCorporate) {
                    status = "optional";
                    reason = "Recommended cryptographic DNS TXT verification for online operations";
                } else {
                    status = "optional";
                    reason = "Optional website DNS TXT verification token";
                }
                break;

            case "financials":
                status = "optional";
                reason = "Required only for Tier L4 Enterprise Assurance vetting and credit tenders";
                break;

            default:
                status = "optional";
                reason = "Standard supplementary verification";
                break;
        }

        // Apply explicit user override if set (e.g. user toggles optional -> not_applicable)
        if (overrides[key]) {
            // Cannot make mandatory required items N/A if legally required, but allows toggling optional
            if (overrides[key] === "not_applicable" && status === "optional") {
                status = "not_applicable";
                reason = "Marked as Not Applicable by business administrator";
            } else if (overrides[key] === "required") {
                status = "required";
            } else if (overrides[key] === "optional" && status === "not_applicable") {
                status = "optional";
                reason = "Marked as Applicable by business administrator";
            }
        }

        docDef.status = status;
        docDef.statusLabel = (status === "required") ? "Required" : (status === "optional" ? "Optional" : "Not Applicable");
        docDef.reason = reason;
        evaluatedRequirements.push(docDef);
    });

    return {
        entityType: rawEntity,
        businessType: rawBusiness || normBusiness,
        normalizedEntity: normEntity,
        normalizedBusiness: normBusiness,
        isConfigured: isConfigured,
        requirements: evaluatedRequirements
    };
}

function getApplicableRequirements(identity) {
    const profile = getBusinessRequirementProfile(identity);
    return profile.requirements.filter(r => r.status !== "not_applicable");
}

function getRequiredRequirements(identity) {
    const profile = getBusinessRequirementProfile(identity);
    return profile.requirements.filter(r => r.status === "required");
}

function getOptionalRequirements(identity) {
    const profile = getBusinessRequirementProfile(identity);
    return profile.requirements.filter(r => r.status === "optional");
}

function isRequirementApplicable(reqKey, identity) {
    const profile = getBusinessRequirementProfile(identity);
    const req = profile.requirements.find(r => r.id === reqKey);
    return Boolean(req && req.status !== "not_applicable");
}

/**
 * Dynamic Verification Progress Calculator
 * Calculates progress ONLY from applicable requirements
 * Excludes Not Applicable requirements from the denominator so businesses are not penalized
 */
function getVerificationProgress(customIdentity, customVState) {
    const profile = getBusinessRequirementProfile(customIdentity);
    const vState = customVState || getOhanaVerificationState() || {};

    let totalWeight = 0;
    let earnedWeight = 0;

    let requiredCount = 0;
    let completedRequired = 0;

    let optionalCount = 0;
    let completedOptional = 0;

    let notApplicableCount = 0;

    profile.requirements.forEach(req => {
        const isVerified = Boolean(vState[req.vStateKey]);

        if (req.status === "required") {
            requiredCount++;
            totalWeight += 1.0;
            if (isVerified) {
                completedRequired++;
                earnedWeight += 1.0;
            }
        } else if (req.status === "optional") {
            optionalCount++;
            totalWeight += 0.5;
            if (isVerified) {
                completedOptional++;
                earnedWeight += 0.5;
            }
        } else {
            notApplicableCount++;
            // Not Applicable is excluded from totalWeight and earnedWeight!
        }
    });

    const totalApplicable = requiredCount + optionalCount;
    const progressPct = totalWeight > 0 ? Math.min(100, Math.round((earnedWeight / totalWeight) * 100)) : 0;
    const isAllRequiredCompleted = (requiredCount > 0 && completedRequired === requiredCount);

    return {
        profile,
        totalApplicable,
        requiredCount,
        optionalCount,
        notApplicableCount,
        completedRequired,
        completedOptional,
        pendingRequired: Math.max(0, requiredCount - completedRequired),
        progressPct,
        isAllRequiredCompleted
    };
}

// Requirement-Aware Level Calculation Engine (L0 to L4)
function computeOhanaVerificationLevel(state, customIdentity) {
    if (!state) state = getOhanaVerificationState();
    const profile = getBusinessRequirementProfile(customIdentity);
    const isSoleProp = (profile.normalizedEntity === "Sole Proprietorship");
    const isPartnership = (profile.normalizedEntity === "Partnership");
    const isFood = (profile.normalizedBusiness === "Food & Restaurant");
    const isRetail = (profile.normalizedBusiness === "Retail Shop");

    // L1: Contact Verified (Always email + phone)
    const l1Passed = Boolean(state.emailVerified && state.phoneVerified);

    // L2: Statutory Business Identifiers (Requirement-Aware!)
    let l2Passed = false;
    if (l1Passed) {
        if (isSoleProp) {
            // Sole Proprietorship does NOT need CIN! Needs PAN + Owner ID or Address/Shop License
            const hasPan = Boolean(state.panVerified);
            const hasOwnerOrBusinessProof = Boolean(state.ownerVerified || state.panVerified);
            const hasShopOrAddress = Boolean(state.addressVerified || state.shopLicenseVerified || (isFood ? state.fssaiVerified : true));
            l2Passed = Boolean(hasPan && hasOwnerOrBusinessProof && hasShopOrAddress);
        } else if (isPartnership) {
            // Partnership does NOT need CIN! Needs PAN + Partnership Deed + Address
            const hasPan = Boolean(state.panVerified);
            const hasDeed = Boolean(state.deedVerified || state.panVerified);
            const hasAddress = Boolean(state.addressVerified);
            l2Passed = Boolean(hasPan && hasDeed && hasAddress);
        } else {
            // Corporate / LLP: Requires PAN + CIN + GST/MCA
            l2Passed = Boolean(state.cinVerified && state.gstVerified && state.panVerified);
        }
    }

    // L3: Enhanced Verification (Bank + Address + Domain or Specialized License)
    let l3Passed = false;
    if (l2Passed) {
        const hasBank = Boolean(state.bankVerified);
        const hasAddress = Boolean(state.addressVerified);
        const hasDomainOrIndustryProof = (isSoleProp || isRetail || isFood)
            ? Boolean(state.domainVerified || (isFood ? state.fssaiVerified : state.shopLicenseVerified) || true)
            : Boolean(state.domainVerified || state.bankVerified);
        l3Passed = Boolean(hasBank && hasAddress && hasDomainOrIndustryProof);
    }

    // L4: Enterprise Assurance
    let l4Passed = false;
    if (l3Passed) {
        const hasAudits = Boolean(state.auditFinancialsVerified || state.enterpriseAssured);
        const hasKyc = (isSoleProp || isPartnership)
            ? Boolean(state.ownerVerified || state.panVerified)
            : Boolean(state.directorKycVerified);
        l4Passed = Boolean(hasAudits && hasKyc);
    }

    let level = "L0";
    let levelName = "Account Claimed";
    let nextRequirement = "Official Email & Phone OTP";
    let progressPct = 20;

    if (l4Passed) {
        level = "L4";
        levelName = "Enterprise Assured";
        nextRequirement = "Top Assurance Tier Achieved";
        progressPct = 100;
    } else if (l3Passed) {
        level = "L3";
        levelName = "Enhanced Verified";
        nextRequirement = isSoleProp ? "Audited Financials & Biometric KYC (L4)" : "Audited Financials & Director KYC (L4)";
        progressPct = 80;
    } else if (l2Passed) {
        level = "L2";
        levelName = "Business Verified";
        nextRequirement = isSoleProp ? "Bank Account & Premises Geo-tag (L3)" : "Domain DNS, Office Geo-tag & Bank Account (L3)";
        progressPct = 60;
    } else if (l1Passed) {
        level = "L1";
        levelName = "Contact Verified";
        nextRequirement = isSoleProp ? "Proprietor PAN, Owner ID & Shop License (L2)" : "MCA CIN, GSTIN & PAN Attestation (L2)";
        progressPct = 40;
    } else {
        level = "L0";
        levelName = "Account Claimed";
        nextRequirement = "Official Email & Phone OTP (L1)";
        progressPct = 20;
    }

    return {
        level,
        levelName,
        nextRequirement,
        progressPct,
        l1Passed,
        l2Passed,
        l3Passed,
        l4Passed
    };
}

// Retrieve single source of truth for verification state
function getOhanaVerificationState() {
    let state = null;
    try {
        const stored = localStorage.getItem('ohana_verification_state');
        if (stored) {
            state = JSON.parse(stored);
        }
    } catch(e) {}

    if (!state) {
        const currentUser = (typeof getCurrentOhanaUser === 'function') ? getCurrentOhanaUser() : null;
        if (currentUser && currentUser.email && currentUser.email.includes('vikram')) {
            state = { ...ACCOUNT_B_SEED.verification_state };
        } else if (currentUser && currentUser.email && currentUser.email.includes('rahul')) {
            state = { ...ACCOUNT_A_SEED.verification_state };
        } else if (currentUser) {
            state = createFreshUserPartition(currentUser).verification_state;
        } else {
            state = { ...DEFAULT_OHANA_VERIFICATION_STATE };
        }
        try {
            localStorage.setItem('ohana_verification_state', JSON.stringify(state));
        } catch(e) {}
    }
    return state;
}

// Save verification state and cascade to business passport
function saveOhanaVerificationState(state) {
    if (!state) return;
    state.lastUpdated = new Date().toISOString();
    try {
        localStorage.setItem('ohana_verification_state', JSON.stringify(state));
        let bp = JSON.parse(localStorage.getItem('ohana_business_passport') || '{}');
        bp.level = state.currentLevel;
        bp.levelName = state.levelName;
        localStorage.setItem('ohana_business_passport', JSON.stringify(bp));
        persistCurrentAccountData();
    } catch(e) {}
}

// Global synchronization for active organization, verified level badge & sidebar across all pages
function syncOhanaGlobalState() {
    try {
        // 1. Get identity & active user
        const currentUser = (typeof getCurrentOhanaUser === 'function') ? getCurrentOhanaUser() : null;
        let orgName = currentUser ? (currentUser.orgName || "Enterprise") : "ABC Technologies";
        const storedId = localStorage.getItem('ohana_business_identity');
        if (storedId) {
            const idObj = JSON.parse(storedId);
            orgName = idObj.tradeName || idObj.legalName || orgName;
        }

        // 2. Get calculated level
        const vState = getOhanaVerificationState();
        const calc = computeOhanaVerificationLevel(vState);

        // Update vState currentLevel if different
        if (vState.currentLevel !== calc.level || vState.levelName !== calc.levelName) {
            vState.currentLevel = calc.level;
            vState.levelName = calc.levelName;
            saveOhanaVerificationState(vState);
        }

        // 3. Update all sidebars matching .org
        const orgCards = document.querySelectorAll('.sidebar .org');
        orgCards.forEach(card => {
            const nameEl = card.querySelector('.org-name') || card.querySelector('strong');
            if (nameEl) {
                const chevron = card.querySelector('.org-chevron');
                if (card.querySelector('.org-name')) {
                    card.querySelector('.org-name').textContent = orgName;
                } else if (chevron) {
                    nameEl.innerHTML = `<span class="org-name">${orgName}</span>` + chevron.outerHTML;
                } else {
                    nameEl.textContent = orgName;
                }
            }

            const badgeEl = card.querySelector('span:last-child');
            if (badgeEl && !badgeEl.classList.contains('org-name')) {
                badgeEl.textContent = `✓ ${calc.level} Verified`;
            }
        });

        // 4. Update profile chips
        if (currentUser) {
            renderUserProfileChips(currentUser);
        }
    } catch(e) {
        console.warn('Ohana global state sync error:', e);
    }
}

// Clean up sidebar navigation: ensure ONLY allowed items appear in the visible sidebar
function cleanupSidebarNav() {
    try {
        const allowedNavKeys = [
            'dashboard',
            'business-passport',
            'documents',
            'renewals',
            'billing',
            'support',
            'dashboard.html',
            'business-passport.html',
            'documents.html',
            'renewals.html',
            'billing.html',
            'support.html'
        ];

        const hiddenItems = [
            'trust-center.html',
            'admin-review.html',
            'assets.html',
            'team.html',
            'activity.html',
            'notifications.html',
            'security.html',
            'integrations.html',
            'compliance.html',
            'verification.html',
            'share-room.html',
            'analytics.html',
            'identity.html',
            'public-profile.html',
            'trust-center',
            'admin-review',
            'company-assets',
            'team',
            'activity',
            'notifications',
            'security',
            'integrations',
            'compliance',
            'verification',
            'share-room',
            'analytics',
            'identity',
            'public-profile'
        ];

        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        const isNextApp = typeof window !== 'undefined' && (
            !!document.querySelector('.ohana-nextjs-page-root') ||
            !window.location.pathname.endsWith('.html')
        );
        const isPages = window.location.pathname.includes('/pages/');

        // Clean nav links
        sidebar.querySelectorAll('nav a').forEach(a => {
            const href = a.getAttribute('href') || '';
            const rawKey = href.split('/').pop().split('?')[0];
            const cleanKey = rawKey.replace(/\.html$/, '');
            const text = a.textContent.toLowerCase().trim();

            const isForbidden = hiddenItems.some(item => href.endsWith(item) || href.includes('/' + item)) ||
                                text.includes('trust center') ||
                                text.includes('admin review') ||
                                text.includes('assets') ||
                                text.includes('team') ||
                                text.includes('activity') ||
                                text.includes('security center') ||
                                text.includes('integrations') ||
                                text.includes('compliance') ||
                                text.includes('verification') ||
                                text.includes('share room') ||
                                text.includes('reports') ||
                                text.includes('analytics') ||
                                text.includes('identity') ||
                                text.includes('notifications') ||
                                text.includes('public profile');

            const isAllowed = allowedNavKeys.includes(rawKey) || allowedNavKeys.includes(cleanKey);

            if (isForbidden || !isAllowed) {
                a.remove();
            } else if (isNextApp && !href.startsWith('/')) {
                a.href = '/' + cleanKey;
            }
        });

        // Clean side-bottom: must contain Profile, Settings and Logout
        const sideBottom = sidebar.querySelector('.side-bottom');
        if (sideBottom) {
            sideBottom.querySelectorAll('a').forEach(a => {
                const text = a.textContent.toLowerCase();
                const href = a.getAttribute('href') || '';
                const isProfile = text.includes('profile') || href.includes('public-profile');
                const isSettings = text.includes('setting') || href.includes('security');
                const isLogout = text.includes('logout') || href.includes('index.html') || href === '/';
                if (!isProfile && !isSettings && !isLogout) {
                    a.remove();
                }
            });

            const profileHref = isNextApp ? '/public-profile' : (isPages ? 'public-profile.html' : 'pages/public-profile.html');
            const settingsHref = isNextApp ? '/security' : (isPages ? 'security.html' : 'pages/security.html');
            const logoutHref = isNextApp ? '/' : (isPages ? '../index.html' : 'index.html');

            let profileLink = Array.from(sideBottom.querySelectorAll('a')).find(a => 
                a.textContent.toLowerCase().includes('profile') || (a.getAttribute('href') || '').includes('public-profile')
            );
            let settingsLink = Array.from(sideBottom.querySelectorAll('a')).find(a => 
                a.textContent.toLowerCase().includes('setting') || (a.getAttribute('href') || '').includes('security')
            );
            let logoutLink = Array.from(sideBottom.querySelectorAll('a')).find(a => 
                a.textContent.toLowerCase().includes('logout') || (a.getAttribute('href') || '').includes('index.html') || (a.getAttribute('href') || '') === '/'
            );

            if (!profileLink) {
                profileLink = document.createElement('a');
                profileLink.innerHTML = `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> <span>Profile</span>`;
            }
            profileLink.href = profileHref;

            if (!settingsLink) {
                settingsLink = document.createElement('a');
                settingsLink.innerHTML = `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg> <span>Settings</span>`;
            }
            settingsLink.href = settingsHref;

            if (!logoutLink) {
                logoutLink = document.createElement('a');
                logoutLink.innerHTML = `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg> <span>Logout</span>`;
            }
            logoutLink.href = logoutHref;

            logoutLink.onclick = (e) => {
                e.preventDefault();
                logoutOhanaUser();
                if (isNextApp) {
                    window.location.href = '/';
                } else {
                    const isPages = window.location.pathname.includes('/pages/');
                    window.location.href = isPages ? '../index.html' : 'index.html';
                }
            };

            // Ensure exact order: Profile above Settings, then Logout
            sideBottom.innerHTML = '';
            sideBottom.appendChild(profileLink);
            sideBottom.appendChild(settingsLink);
            sideBottom.appendChild(logoutLink);

            const curPage = (window.location.pathname.split('/').pop().split('?')[0] || '').replace(/\.html$/, '');
            if (curPage === 'public-profile') {
                profileLink.classList.add('active');
            } else {
                profileLink.classList.remove('active');
            }
            if (curPage === 'security') {
                settingsLink.classList.add('active');
            } else {
                settingsLink.classList.remove('active');
            }
        }
    } catch(e) {
        console.warn('Sidebar cleanup error:', e);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        syncOhanaGlobalState();
        cleanupSidebarNav();
    });
}

// Global Shared OHANA Trust Certificate Generator
window.downloadOhanaTrustCertificate = async function(btn) {
    const originalHtml = btn ? btn.innerHTML : 'Download Trust Certificate';
    if (btn) {
        btn.innerHTML = `
            <svg class="spin-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            Generating Trust Certificate...
        `;
        btn.disabled = true;
    }

    const scrollBefore = window.scrollY;

    try {
        window.scrollTo(0, 0);

        // 1. Read Live Identity Data
        let identity = {
            legalName: "ABC Technologies Private Limited",
            tradeName: "ABC Technologies",
            entityType: "Private Limited Company",
            cin: "U72200PN2021PTC198765",
            incDate: "2021-01-15",
            gstin: "27ABCDE1234F1Z5",
            pan: "ABCDE1234F",
            udyam: "UDYAM-MH-26-0019284",
            website: "abctechnologies.io",
            industry: "Information Technology & Enterprise SaaS",
            address: "Unit 402, 4th Floor, Tech Park One, Airport Road, Yerawada, Pune, Maharashtra 411006"
        };
        try {
            const stored = localStorage.getItem('ohana_business_identity');
            if (stored) {
                const parsed = JSON.parse(stored);
                identity = {
                    legalName: (parsed.legalName || identity.legalName).trim(),
                    tradeName: (parsed.tradeName || "").trim(),
                    entityType: (parsed.entityType || identity.entityType).trim(),
                    cin: (parsed.cinNumber || parsed.cin || "").trim(),
                    gstin: (parsed.gstin || "").trim(),
                    pan: (parsed.panNumber || parsed.pan || "").trim(),
                    udyam: (parsed.udyamNumber || parsed.udyam || "").trim(),
                    incDate: (parsed.incDate || identity.incDate).trim(),
                    website: (parsed.website || parsed.officialWebsite || identity.website).trim(),
                    industry: (parsed.industry || identity.industry).trim(),
                    address: parsed.address1 
                        ? [parsed.address1, parsed.address2, parsed.city, parsed.state, parsed.pincode].filter(Boolean).join(', ').trim()
                        : (parsed.address || identity.address).trim()
                };
            }
        } catch(e) {}

        // 2. Read Live Verification State
        let vState = {};
        try {
            const storedV = localStorage.getItem('ohana_verification_state');
            if (storedV) vState = JSON.parse(storedV);
        } catch(e) {}
        const calc = typeof computeOhanaVerificationLevel === 'function'
            ? computeOhanaVerificationLevel(vState)
            : { level: vState.currentLevel || "L3", levelName: vState.levelName || "Enhanced Verified" };
        const level = calc.level || "L3";
        const levelName = calc.levelName || "Enhanced Verified";

        // 3. Trust Certificate ID (Distinct from Passport ID)
        let certNumber = "2026-9041";
        try {
            const storedP = localStorage.getItem('ohana_business_passport');
            if (storedP) {
                const pObj = JSON.parse(storedP);
                if (pObj.id) {
                    const parts = pObj.id.split('-');
                    certNumber = parts.slice(2).join('-') || "2026-9041";
                }
            }
        } catch(e) {}
        const trustCertId = `OHANA-TC-${certNumber}`;

        const issueDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const rawName = identity.tradeName || identity.legalName || 'Business';
        const safeName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
        const filename = `OHANA-Trust-Certificate-${safeName}.pdf`;

        // 4. Verified Trust Identifiers Grid
        let credsHtml = '';
        if (identity.cin) {
            credsHtml += `
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; padding:4px 8px;">
                    <span style="display:block; color:#64748B; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">MCA Incorporation (CIN / LLPIN)</span>
                    <strong style="color:#0B1F3A; font-family:monospace; font-size:10.5px; letter-spacing:0.3px;">${identity.cin}</strong>
                    <span style="display:block; color:#16A34A; font-size:8px; font-weight:700; margin-top:1px;">✓ MCA Registry Verified</span>
                </div>
            `;
        }
        if (identity.gstin) {
            credsHtml += `
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; padding:4px 8px;">
                    <span style="display:block; color:#64748B; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">GSTIN Tax Identification</span>
                    <strong style="color:#0B1F3A; font-family:monospace; font-size:10.5px; letter-spacing:0.3px;">${identity.gstin}</strong>
                    <span style="display:block; color:#16A34A; font-size:8px; font-weight:700; margin-top:1px;">✓ GSTN Portal Attested</span>
                </div>
            `;
        }
        if (identity.pan) {
            credsHtml += `
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; padding:4px 8px;">
                    <span style="display:block; color:#64748B; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Permanent Account Number (PAN)</span>
                    <strong style="color:#0B1F3A; font-family:monospace; font-size:10.5px; letter-spacing:0.3px;">${identity.pan}</strong>
                    <span style="display:block; color:#16A34A; font-size:8px; font-weight:700; margin-top:1px;">✓ Income Tax / NSDL Validated</span>
                </div>
            `;
        }
        if (identity.udyam) {
            credsHtml += `
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; padding:4px 8px;">
                    <span style="display:block; color:#64748B; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Udyam MSME Registration</span>
                    <strong style="color:#0B1F3A; font-family:monospace; font-size:10.5px; letter-spacing:0.3px;">${identity.udyam}</strong>
                    <span style="display:block; color:#16A34A; font-size:8px; font-weight:700; margin-top:1px;">✓ MSME Registry Verified</span>
                </div>
            `;
        }
        if (identity.website) {
            credsHtml += `
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; padding:4px 8px;">
                    <span style="display:block; color:#64748B; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Corporate Domain & Website</span>
                    <strong style="color:#0B1F3A; font-size:10px; letter-spacing:0.2px;">${identity.website.replace(/^https?:\/\//, '')}</strong>
                    <span style="display:block; color:#16A34A; font-size:8px; font-weight:700; margin-top:1px;">✓ DNS & SSL Cryptographically Attested</span>
                </div>
            `;
        }
        if (identity.address) {
            credsHtml += `
                <div style="${identity.website ? '' : 'grid-column: span 2;'} background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; padding:4px 8px;">
                    <span style="display:block; color:#64748B; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Registered Corporate Office</span>
                    <strong style="color:#0B1F3A; font-size:9.5px; line-height:1.2; display:block;">${identity.address}</strong>
                </div>
            `;
        }

        // 5. Construct Wall Certificate Host Wrapper & Stage (1000px x 690px)
        const stageWidth = 1000;
        const stageHeight = 690;

        const hostWrapper = document.createElement('div');
        hostWrapper.id = 'ohanaTrustCertHostGlobal';
        hostWrapper.style.cssText = `
            position: fixed;
            left: -99999px;
            top: 0;
            width: ${stageWidth}px;
            height: ${stageHeight}px;
            overflow: hidden;
            pointer-events: none;
            z-index: -1;
        `;

        const certStage = document.createElement('div');
        certStage.id = 'ohanaTrustCertStageGlobal';
        certStage.style.cssText = `
            width: ${stageWidth}px;
            height: ${stageHeight}px;
            box-sizing: border-box;
            background: #0B1F3A;
            padding: 7px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #0B1F3A;
            overflow: hidden;
        `;

        certStage.innerHTML = `
            <div style="border:5px solid #0B1F3A; height:100%; box-sizing:border-box; padding:6px; position:relative; background:#FFFFFF;">
                <div style="border:2px solid #FF2028; height:100%; box-sizing:border-box; padding:14px 24px 12px; position:relative; display:flex; flex-direction:column; justify-content:space-between; background:linear-gradient(135deg, #FFFFFF 0%, #FAFCFF 50%, #FFFFFF 100%);">
                    
                    <!-- Ornate Corner Filigrees -->
                    <div style="position:absolute; top:4px; left:4px; width:22px; height:22px; border-top:3px solid #0B1F3A; border-left:3px solid #0B1F3A;"></div>
                    <div style="position:absolute; top:8px; left:8px; width:11px; height:11px; border-top:1.5px solid #FF2028; border-left:1.5px solid #FF2028;"></div>
                    <div style="position:absolute; top:4px; right:4px; width:22px; height:22px; border-top:3px solid #0B1F3A; border-right:3px solid #0B1F3A;"></div>
                    <div style="position:absolute; top:8px; right:8px; width:11px; height:11px; border-top:1.5px solid #FF2028; border-right:1.5px solid #FF2028;"></div>
                    <div style="position:absolute; bottom:4px; left:4px; width:22px; height:22px; border-bottom:3px solid #0B1F3A; border-left:3px solid #0B1F3A;"></div>
                    <div style="position:absolute; bottom:8px; left:8px; width:11px; height:11px; border-bottom:1.5px solid #FF2028; border-left:1.5px solid #FF2028;"></div>
                    <div style="position:absolute; bottom:4px; right:4px; width:22px; height:22px; border-bottom:3px solid #0B1F3A; border-right:3px solid #0B1F3A;"></div>
                    <div style="position:absolute; bottom:8px; right:8px; width:11px; height:11px; border-bottom:1.5px solid #FF2028; border-right:1.5px solid #FF2028;"></div>

                    <!-- Header: Trust Network Branding & Credential Meta -->
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #E2E8F0; padding-bottom:8px;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:38px; height:38px; flex-shrink:0;">
                                <svg viewBox="0 0 100 100" width="38" height="38" fill="none">
                                    <defs>
                                        <linearGradient id="trustCertRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stop-color="#FF3840" />
                                            <stop offset="100%" stop-color="#DE0C14" />
                                        </linearGradient>
                                        <linearGradient id="trustCertNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stop-color="#142B4E" />
                                            <stop offset="100%" stop-color="#0B1F3A" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M 8 68 C 4 88 38 98 62 92 C 84 86 98 70 96 54 C 94 42 82 38 72 43" stroke="#FF2028" stroke-width="5" stroke-linecap="round" fill="none" />
                                    <rect x="32" y="12" width="52" height="44" rx="10" transform="rotate(9 58 34)" fill="url(#trustCertNavyGrad)" />
                                    <rect x="15" y="27" width="65" height="52" rx="12" fill="url(#trustCertRedGrad)" />
                                    <circle cx="73" cy="53" r="2.8" fill="#FFFFFF" />
                                    <g transform="translate(35, 43)">
                                        <path d="M 6 10 V 6 C 6 2.7 8.7 0 12 0 C 15.3 0 18 2.7 18 6 V 10" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" fill="none" />
                                        <rect x="2" y="9" width="20" height="17" rx="4.5" fill="#FFFFFF" />
                                        <circle cx="12" cy="15.5" r="2.2" fill="#0B1F3A" />
                                    </g>
                                </svg>
                            </div>
                            <div>
                                <div style="font-size:16.5px; font-weight:900; letter-spacing:0.5px; color:#0B1F3A; line-height:1.1;">
                                    OHANA <span style="color:#FF2028;">TRUST ASSURANCE NETWORK</span>
                                </div>
                                <div style="font-size:8.5px; font-weight:700; color:#64748B; letter-spacing:1.5px; text-transform:uppercase; margin-top:2px;">
                                    National Corporate Trust Registry &bull; Statutory Credibility Protocol
                                </div>
                            </div>
                        </div>

                        <div style="text-align:right;">
                            <div style="display:inline-block; background:#0B1F3A; color:#FFFFFF; font-size:9px; font-weight:800; padding:3px 9px; border-radius:4px; letter-spacing:1px; text-transform:uppercase;">
                                OFFICIAL STATUTORY TRUST ATTESTATION
                            </div>
                            <div style="font-size:10px; font-weight:700; color:#475569; margin-top:2px; font-family:monospace;">
                                TRUST CERTIFICATE ID: <span style="color:#0B1F3A;">${trustCertId}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Title & Trust Statement -->
                    <div style="text-align:center; margin:3px 0 1px;">
                        <div style="font-size:9.5px; font-weight:800; color:#FF2028; letter-spacing:2.5px; text-transform:uppercase; margin-bottom:1px;">
                            CORPORATE TRUST & VERIFICATION PROTOCOL
                        </div>
                        <h1 style="margin:0; font-size:22px; font-weight:900; color:#0B1F3A; letter-spacing:1px; text-transform:uppercase;">
                            OHANA TRUST CERTIFICATE
                        </h1>
                        <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin:3px auto;">
                            <div style="width:45px; height:1.5px; background:linear-gradient(90deg, transparent, #FF2028);"></div>
                            <span style="color:#FF2028; font-size:9px; letter-spacing:2px;">★ ★ ★ ★ ★</span>
                            <div style="width:45px; height:1.5px; background:linear-gradient(90deg, #FF2028, transparent);"></div>
                        </div>
                        <p style="margin:0 auto; max-width:800px; font-size:10.5px; color:#64748B; font-style:italic; line-height:1.3;">
                            This official Trust Certificate certifies that the enterprise identified below has successfully validated its statutory records, corporate credentials, and verified operational standing under the Ohana Trust Protocol, maintaining authentic compliance credentials and validated business integrity.
                        </p>
                    </div>

                    <!-- Enterprise Granted Trust Certification Box -->
                    <div style="text-align:center; padding:6px 14px; background:linear-gradient(90deg, rgba(248,250,252,0.5) 0%, rgba(254,242,242,0.8) 50%, rgba(248,250,252,0.5) 100%); border-radius:8px; border:1px solid #FFE4E6; margin:2px 0 4px;">
                        <div style="font-size:8.5px; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:1.5px;">
                            ENTERPRISE GRANTED TRUST CERTIFICATION
                        </div>
                        <h2 style="margin:1px 0 2px; font-size:20.5px; font-weight:900; color:#0B1F3A; letter-spacing:-0.3px; text-transform:uppercase;">
                            ${identity.legalName}
                        </h2>
                        ${identity.tradeName && identity.tradeName !== identity.legalName ? `
                        <div style="font-size:10.5px; color:#475569; font-weight:600;">
                            Operating Trade Name: <strong style="color:#0B1F3A;">${identity.tradeName}</strong>
                        </div>` : ''}
                        <div style="font-size:10px; color:#64748B;">
                            ${identity.entityType ? `<span>Entity Type: <strong style="color:#0B1F3A;">${identity.entityType}</strong></span>` : ''}
                            ${identity.incDate ? ` &bull; <span>Incorporated: <strong style="color:#0B1F3A;">${identity.incDate}</strong></span>` : ''}
                            ${identity.industry ? ` &bull; <span>Domain: <strong style="color:#0B1F3A;">${identity.industry}</strong></span>` : ''}
                        </div>
                    </div>

                    <!-- Verified Trust Credentials Grid & Trust Seal -->
                    <div style="display:grid; grid-template-columns: 1fr 190px; gap:14px; align-items:center; margin:2px 0;">
                        <!-- Left: Verified Trust Attributes Grid -->
                        <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:5px 8px;">
                            ${credsHtml}
                        </div>

                        <!-- Right: Official Trust Assurance Seal -->
                        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
                            <div style="width:110px; height:110px; border-radius:50%; border:3px solid #0B1F3A; position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; background:radial-gradient(circle, #FFFFFF 50%, #FFF5F5 100%); box-shadow:0 4px 12px rgba(11,31,58,0.1);">
                                <div style="position:absolute; inset:4px; border-radius:50%; border:1.5px dashed #FF2028;"></div>
                                <span style="font-size:7px; font-weight:800; letter-spacing:1px; color:#FF2028; text-transform:uppercase;">OHANA TRUST</span>
                                <strong style="font-size:25px; font-weight:900; line-height:1; color:#0B1F3A; margin:2px 0;">${level}</strong>
                                <span style="font-size:7px; font-weight:800; letter-spacing:0.5px; color:#16A34A; text-transform:uppercase; text-align:center; padding:0 4px;">${levelName}</span>
                                <span style="font-size:6px; font-weight:700; color:#64748B; margin-top:1px;">AUTHENTICATED</span>
                            </div>
                            <div style="background:#16A34A; color:#FFFFFF; font-size:8.5px; font-weight:800; padding:2px 10px; border-radius:10px; margin-top:4px; letter-spacing:0.5px;">
                                ✓ ACTIVE TRUST SEAL
                            </div>
                        </div>
                    </div>

                    <!-- Footer: Date, Trust Fingerprint & Registrar Signature -->
                    <div style="border-top:1.5px solid #E2E8F0; padding-top:6px; display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; align-items:flex-end;">
                        <div>
                            <div style="font-size:8px; color:#64748B; font-weight:700; text-transform:uppercase;">Date of Trust Attestation</div>
                            <div style="font-size:11px; font-weight:800; color:#0B1F3A;">${issueDate}</div>
                            <div style="font-size:8.5px; color:#16A34A; font-weight:600;">● Trust Ledger Verified & Active</div>
                        </div>

                        <div style="text-align:center;">
                            <div style="font-size:8px; color:#64748B; font-weight:700; text-transform:uppercase; margin-bottom:2px;">Security Verification Fingerprint</div>
                            <div style="display:inline-block; background:#F1F5F9; border:1px solid #CBD5E1; padding:2px 7px; border-radius:4px; font-family:monospace; font-size:8.5px; font-weight:700; color:#0B1F3A;">
                                SHA256-OHANATC-${safeName.substring(0, 10).toUpperCase()}-VERIFIED
                            </div>
                            <div style="font-size:7.5px; color:#64748B; margin-top:2px;">Attested on Ohana Distributed Trust Protocol</div>
                        </div>

                        <div style="text-align:right;">
                            <div style="display:inline-block; text-align:center;">
                                <div style="font-family:'Brush Script MT', cursive, Georgia, serif; font-size:20px; color:#0B1F3A; line-height:1; font-weight:600;">
                                    Rahul Bawa
                                </div>
                                <div style="width:130px; height:1px; background:#0B1F3A; margin:0 auto 2px;"></div>
                                <div style="font-size:8.5px; font-weight:800; color:#0B1F3A; text-transform:uppercase; letter-spacing:0.5px;">Registrar of Corporate Trust</div>
                                <div style="font-size:7px; color:#64748B; font-weight:600;">Directorate of Statutory Compliance</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;

        hostWrapper.appendChild(certStage);
        document.body.appendChild(hostWrapper);

        if (typeof html2pdf !== 'function') {
            throw new Error('html2pdf library is not loaded');
        }

        const opt = {
            margin: [8, 12, 8, 12],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        await html2pdf().set(opt).from(certStage).save();

        if (hostWrapper.parentNode) {
            hostWrapper.parentNode.removeChild(hostWrapper);
        }

        if (typeof showToast === 'function') {
            showToast('OHANA Trust Certificate downloaded successfully!', 'success');
        }
    } catch(err) {
        console.error('Error generating trust certificate PDF:', err);
        const host = document.getElementById('ohanaTrustCertHostGlobal');
        if (host && host.parentNode) host.parentNode.removeChild(host);
        if (typeof showToast === 'function') {
            showToast('Could not generate PDF: ' + err.message, 'error');
        }
    } finally {
        window.scrollTo(0, scrollBefore);
        if (btn) {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    }
};

// Expose dynamic requirement engine functions globally
window.OHANA_ENTITY_TYPES = OHANA_ENTITY_TYPES;
window.OHANA_BUSINESS_TYPES = OHANA_BUSINESS_TYPES;
window.OHANA_DOC_REQUIREMENTS = OHANA_DOC_REQUIREMENTS;
window.normalizeEntityType = normalizeEntityType;
window.normalizeBusinessType = normalizeBusinessType;
window.getBusinessRequirementProfile = getBusinessRequirementProfile;
window.getApplicableRequirements = getApplicableRequirements;
window.getRequiredRequirements = getRequiredRequirements;
window.getOptionalRequirements = getOptionalRequirements;
window.isRequirementApplicable = isRequirementApplicable;
window.getVerificationProgress = getVerificationProgress;
window.computeOhanaVerificationLevel = computeOhanaVerificationLevel;
window.getRequirementOverrides = getRequirementOverrides;
window.saveRequirementOverride = saveRequirementOverride;

// =========================================================================
// OHANA 3-LEVEL DOCUMENT VALIDATION & AUTOMATED RENEWAL ENGINE
// =========================================================================

const OHANA_DOC_SPECS = {
    aadhaar: {
        id: 'aadhaar',
        displayName: 'Aadhaar',
        category: 'Business Identity',
        icon: '🪪',
        validKeywords: ['aadhaar', 'aadhar', 'uidai', 'identity', 'proprietor_id', 'govt_id', 'id_card', 'unique_identification'],
        rejectKeywords: ['passport_photo', 'passport_size', 'photo', 'selfie', 'avatar', 'profile_pic', 'portrait', 'electricity', 'utility', 'bill', 'receipt', 'invoice', 'gst', 'pan', 'cheque', 'bank_statement', 'balance_sheet', 'driving_license', 'car_rc'],
        paramName: 'Aadhaar Number',
        paramPattern: /^\d{4}\s?\d{4}\s?\d{4}$/,
        paramExample: '1234 5678 9012 (12 digits)',
        hasExpiry: false,
        defaultExpiry: 'Permanent'
    },
    pan: {
        id: 'pan',
        displayName: 'Corporate PAN Card',
        category: 'Business Identity',
        icon: '🪪',
        validKeywords: ['pan', 'nsdl', 'uti', 'income_tax', 'permanent_account_number'],
        rejectKeywords: ['aadhaar', 'aadhar', 'passport_photo', 'passport_size', 'selfie', 'avatar', 'electricity', 'utility', 'bill', 'cheque', 'bank_statement', 'fssai'],
        paramName: 'PAN Number',
        paramPattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        paramExample: 'ABCDE1234F (10 characters)',
        hasExpiry: false,
        defaultExpiry: 'Permanent'
    },
    gst: {
        id: 'gst',
        displayName: 'GST Certificate',
        category: 'Tax',
        icon: '🧾',
        validKeywords: ['gst', 'gstin', 'reg-06', 'reg06', 'goods_and_services_tax', 'tax_registration'],
        rejectKeywords: ['aadhaar', 'aadhar', 'passport_photo', 'passport_size', 'selfie', 'avatar', 'pan_card', 'cheque', 'bank_statement', 'electricity', 'utility'],
        paramName: 'GSTIN',
        paramPattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        paramExample: '27ABCDE1234F1Z5 (15 characters)',
        hasExpiry: false,
        defaultExpiry: 'Permanent'
    },
    cin: {
        id: 'cin',
        displayName: 'Certificate of Incorporation (CIN / MCA)',
        category: 'Business Identity',
        icon: '🏛️',
        validKeywords: ['cin', 'incorporation', 'coi', 'mca', 'roc', 'companies_act', 'certificate_of_incorporation'],
        rejectKeywords: ['aadhaar', 'aadhar', 'passport_photo', 'passport_size', 'selfie', 'avatar', 'electricity', 'utility', 'bill', 'pan', 'fssai'],
        paramName: 'Corporate Identity Number (CIN)',
        paramPattern: /^[UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
        paramExample: 'U72200PN2021PTC198765 (21 characters)',
        hasExpiry: false,
        defaultExpiry: 'Permanent'
    },
    udyam: {
        id: 'udyam',
        displayName: 'Udyam Registration Certificate',
        category: 'Licenses & Certificates',
        icon: '📜',
        validKeywords: ['udyam', 'msme', 'udyog', 'ministry_of_msme', 'small_enterprises'],
        rejectKeywords: ['aadhaar', 'passport_photo', 'passport_size', 'selfie', 'pan_card', 'cheque', 'electricity'],
        paramName: 'Udyam Registration Number',
        paramPattern: /^UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}$/,
        paramExample: 'UDYAM-MH-26-0019284',
        hasExpiry: false,
        defaultExpiry: 'Permanent'
    },
    fssai: {
        id: 'fssai',
        displayName: 'FSSAI License',
        category: 'Licenses & Certificates',
        icon: '📜',
        validKeywords: ['fssai', 'food', 'food_safety', 'foscos', 'food_license'],
        rejectKeywords: ['aadhaar', 'passport_photo', 'passport_size', 'selfie', 'pan', 'gst', 'cheque', 'electricity', 'cin', 'mca'],
        paramName: 'FSSAI License Number',
        paramPattern: /^\d{14}$/,
        paramExample: '11521019000123 (14 digits)',
        hasExpiry: true,
        defaultExpiryMonths: 36 // 3 years
    },
    shop_license: {
        id: 'shop_license',
        displayName: 'Shop & Establishment / Trade License',
        category: 'Licenses & Certificates',
        icon: '📜',
        validKeywords: ['shop', 'trade', 'establishment', 'gumasta', 'municipal', 'license'],
        rejectKeywords: ['aadhaar', 'passport_photo', 'passport_size', 'selfie', 'cheque', 'pan'],
        paramName: 'Trade License Number',
        paramPattern: /^[A-Z0-9\-\/]{5,25}$/,
        paramExample: 'PMC/2026/0491',
        hasExpiry: true,
        defaultExpiryMonths: 12
    },
    bank: {
        id: 'bank',
        displayName: 'Bank Proof (Statement / Cheque)',
        category: 'Bank & Financial',
        icon: '🏦',
        validKeywords: ['bank', 'cheque', 'statement', 'passbook', 'mandate', 'hdfc', 'icici', 'sbi', 'axis', 'account'],
        rejectKeywords: ['aadhaar', 'passport_photo', 'passport_size', 'selfie', 'fssai', 'electricity', 'cin', 'mca'],
        paramName: 'Account Number / IFSC',
        paramPattern: /^[A-Z0-9\s]{8,25}$/,
        paramExample: 'A/C 50200019283741 or IFSC HDFC0001234',
        hasExpiry: false,
        defaultExpiry: 'Permanent'
    },
    address: {
        id: 'address',
        displayName: 'Office Address Proof',
        category: 'Address',
        icon: '🏢',
        validKeywords: ['address', 'utility', 'electricity', 'bill', 'rent', 'lease', 'telecom', 'water', 'property_tax'],
        rejectKeywords: ['aadhaar', 'passport_photo', 'passport_size', 'selfie', 'cheque', 'pan', 'fssai'],
        paramName: 'Consumer / Meter / Lease Ref',
        paramPattern: /^[A-Z0-9\-\/\s]{5,30}$/,
        paramExample: 'MSEDCL-0192830192',
        hasExpiry: false,
        defaultExpiry: 'Permanent'
    },
    domain: {
        id: 'domain',
        displayName: 'Corporate Domain DNS Record',
        category: 'Other',
        icon: '🌐',
        validKeywords: ['domain', 'dns', 'whois', 'registrar', 'cloudflare', 'ssl'],
        rejectKeywords: ['aadhaar', 'passport_photo', 'passport_size', 'selfie', 'pan', 'cheque'],
        paramName: 'Domain Name',
        paramPattern: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
        paramExample: 'abctechnologies.io',
        hasExpiry: true,
        defaultExpiryMonths: 12
    },
    email: {
        id: 'email',
        displayName: 'Corporate Email Token',
        category: 'Other',
        icon: '✉️',
        validKeywords: ['email', 'corporate_email', 'otp', 'verification'],
        rejectKeywords: [],
        paramName: 'Email Address',
        paramPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        paramExample: 'admin@abctech.com',
        hasExpiry: false,
        defaultExpiry: 'Permanent'
    },
    other: {
        id: 'other',
        displayName: 'Other Statutory Certificate',
        category: 'Other',
        icon: '📄',
        validKeywords: ['certificate', 'statutory', 'compliance', 'audit', 'tax', 'filing', 'challan'],
        rejectKeywords: ['passport_photo', 'passport_size', 'selfie', 'avatar', 'profile_pic'],
        paramName: 'Reference',
        paramPattern: null,
        hasExpiry: false,
        defaultExpiry: 'Permanent'
    }
};

/**
 * 3-Level Document Validation:
 * Level 1: File format & size
 * Level 2: Document type validation (e.g. Aadhaar selected + passport photo uploaded -> Reject)
 * Level 3: Parameter format check
 */
function validateDocumentUpload(file, docTypeId, title = '', ref = '') {
    const spec = OHANA_DOC_SPECS[docTypeId] || OHANA_DOC_SPECS.other;

    // LEVEL 1: File Validation
    if (!file) {
        return { valid: false, level: 1, error: "Please select a document file to upload (PDF, JPG, JPEG, PNG)." };
    }
    const fileName = (file.name || '').trim().toLowerCase();
    const ext = fileName.split('.').pop().toLowerCase();
    const allowed = ['pdf', 'jpg', 'jpeg', 'png'];
    if (!allowed.includes(ext)) {
        return { valid: false, level: 1, error: `Unsupported file format (.${ext}). Only PDF, JPG, JPEG, and PNG files are accepted.` };
    }
    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size && file.size > maxSize) {
        return { valid: false, level: 1, error: `File size exceeds the 15 MB limit. Please upload a smaller file.` };
    }

    // LEVEL 2: Document Type Validation
    const cleanFileName = fileName.replace(/[\-_.]/g, ' ').toLowerCase();
    const cleanTitle = (title || '').replace(/[\-_.]/g, ' ').toLowerCase();

    // Check rejection keywords for the selected document type
    if (spec.rejectKeywords && spec.rejectKeywords.length > 0) {
        for (const badWord of spec.rejectKeywords) {
            const pattern = new RegExp(`\\b${badWord.replace(/_/g, '[\\s_-]?')}\\b`, 'i');
            if (pattern.test(cleanFileName) || pattern.test(cleanTitle)) {
                return {
                    valid: false,
                    level: 2,
                    error: `This document does not appear to match ${spec.displayName}.`
                };
            }
        }
    }

    // LEVEL 3: Parameter / Identifier Format Validation
    const trimmedRef = (ref || '').trim();
    if (trimmedRef && spec.paramPattern) {
        // Strip common prefixes like "PAN: ", "GSTIN: ", etc.
        const cleanRef = trimmedRef.replace(/^(pan|gstin|gst|cin|udyam|ref|fssai|lic|licence|license)\s*[:#-]?\s*/i, '').trim();
        if (!spec.paramPattern.test(cleanRef)) {
            return {
                valid: false,
                level: 3,
                error: `Invalid format for ${spec.paramName}. Expected: ${spec.paramExample}`
            };
        }
    }

    return { valid: true, spec: spec };
}

/**
 * Intelligent Extraction & Simulation:
 * Extracts structured metadata and determines appropriate expiry date.
 */
function extractDocumentInfo(file, docTypeId, userTitle, userRef, userExpiry) {
    const spec = OHANA_DOC_SPECS[docTypeId] || OHANA_DOC_SPECS.other;
    const fileName = file ? file.name : `${docTypeId}_evidence.pdf`;

    let title = (userTitle || '').trim();
    if (!title) {
        title = spec.displayName;
    }

    let ref = (userRef || '').trim();
    if (!ref) {
        if (docTypeId === 'aadhaar') ref = 'Aadhaar: **** **** 9012';
        else if (docTypeId === 'pan') ref = 'PAN: ABCDE1234F · NSDL Validated';
        else if (docTypeId === 'gst') ref = 'GSTIN: 27ABCDE1234F1Z5';
        else if (docTypeId === 'cin') ref = 'CIN: U72200PN2021PTC198765';
        else if (docTypeId === 'udyam') ref = 'UDYAM-MH-26-0019284';
        else if (docTypeId === 'fssai') ref = `FSSAI Lic # 115${Math.floor(10000000000 + Math.random() * 90000000000)}`;
        else if (docTypeId === 'shop_license') ref = `Trade License PMC/2026/${Math.floor(1000 + Math.random() * 9000)}`;
        else if (docTypeId === 'domain') ref = 'DNS TXT Cryptographic Record';
        else ref = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    // Determine Expiry Date
    let expiryDate = (userExpiry || '').trim();
    if (!expiryDate || expiryDate.toLowerCase() === 'permanent') {
        if (spec.hasExpiry) {
            // Auto-compute future date based on default validity
            const exp = new Date();
            exp.setMonth(exp.getMonth() + (spec.defaultExpiryMonths || 12));
            expiryDate = exp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        } else {
            expiryDate = 'Permanent';
        }
    }

    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    return {
        id: 'DOC-' + Date.now(),
        name: title,
        category: spec.category,
        verificationType: docTypeId,
        ref: ref,
        uploadedDate: todayStr,
        expiryDate: expiryDate,
        status: 'Uploaded', // Status flow: Uploaded, NOT Verified immediately!
        verificationLevel: 'Unverified',
        fileName: fileName,
        icon: spec.icon || '📄'
    };
}

/**
 * Calculates calendar days remaining until an expiry date string.
 * Returns null if permanent, missing, or invalid.
 */
function computeDaysRemaining(expiryStr) {
    if (!expiryStr || typeof expiryStr !== 'string') return null;
    const lower = expiryStr.toLowerCase().trim();
    if (lower === 'permanent' || lower === 'n/a' || lower === 'none' || lower === 'lifetime') return null;
    const target = new Date(expiryStr);
    if (isNaN(target.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

/**
 * Maps a document category to Renewals Centre Category
 */
function mapDocCategoryToRenewalCat(docCat) {
    if (!docCat) return 'Statutory';
    const lower = docCat.toLowerCase();
    if (lower.includes('tax') || lower.includes('identity')) return 'Statutory';
    if (lower.includes('license') || lower.includes('cert')) return 'License';
    if (lower.includes('financial') || lower.includes('bank')) return 'Financial';
    if (lower.includes('address')) return 'Compliance';
    return 'Statutory';
}

/**
 * Synchronizes renewals in ohana_renewals_data with ohana_documents:
 * 1. For any document with a valid, non-permanent expiry date:
 *    - Automatically creates or updates a linked renewal record.
 * 2. If a document has NO expiry date (or 'Permanent'):
 *    - Removes any linked renewal (does not create fake renewals).
 * 3. If a document is updated or replaced with new expiry:
 *    - Automatically updates the linked renewal.
 * 4. If a document was deleted:
 *    - Automatically removes the linked renewal.
 * 5. Preserves purely manual renewals.
 * 6. Computes days, status, and urgency dynamically from real dates.
 */
function syncRenewalsWithDocuments(providedDocs = null) {
    let docs = providedDocs;
    if (!docs) {
        try {
            const rawDocs = localStorage.getItem('ohana_documents');
            docs = rawDocs ? JSON.parse(rawDocs) : [];
        } catch(e) {
            docs = [];
        }
    }

    let renewals = [];
    try {
        const rawRen = localStorage.getItem('ohana_renewals_data');
        renewals = rawRen ? JSON.parse(rawRen) : [];
    } catch(e) {
        renewals = [];
    }

    const currentDocIds = new Set(docs.map(d => d.id));

    // 1. Remove renewals linked to deleted documents
    renewals = renewals.filter(r => {
        if (!r.sourceDocId) return true; // Keep manual unlinked renewals
        return currentDocIds.has(r.sourceDocId);
    });

    // 2. Sync renewals for each document
    docs.forEach(doc => {
        const days = computeDaysRemaining(doc.expiryDate);
        const hasValidExpiry = (days !== null);

        const existingIdx = renewals.findIndex(r => r.sourceDocId === doc.id);

        if (hasValidExpiry) {
            // Determine status from days
            let status = 'Active';
            if (days < 0) status = 'Expired';
            else if (days <= 30) status = 'Critical';
            else if (days <= 60) status = 'Upcoming';

            const formattedExpiry = new Date(doc.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

            const renewalPayload = {
                id: existingIdx !== -1 ? renewals[existingIdx].id : ('RN-' + doc.id.replace(/[^a-zA-Z0-9]/g, '')),
                sourceDocId: doc.id,
                item: doc.name,
                sub: doc.ref || (`Evidence File: ${doc.fileName || 'document.pdf'}`),
                cat: mapDocCategoryToRenewalCat(doc.category),
                expiry: formattedExpiry,
                days: days,
                owner: (existingIdx !== -1 && renewals[existingIdx].owner) ? renewals[existingIdx].owner : 'Rahul Bawa',
                avatar: (existingIdx !== -1 && renewals[existingIdx].avatar) ? renewals[existingIdx].avatar : 'RB',
                rule: (existingIdx !== -1 && renewals[existingIdx].rule) ? renewals[existingIdx].rule : '30 days before',
                status: status,
                autoTracked: true
            };

            if (existingIdx !== -1) {
                renewals[existingIdx] = Object.assign({}, renewals[existingIdx], renewalPayload);
            } else {
                renewals.unshift(renewalPayload);
            }
        } else {
            // Document has NO expiry date (or 'Permanent') -> Ensure no fake renewal exists
            if (existingIdx !== -1) {
                renewals.splice(existingIdx, 1);
            }
        }
    });

    // 3. Recalculate days for any manual entries as well
    renewals.forEach(r => {
        if (r.expiry && !r.sourceDocId) {
            const d = computeDaysRemaining(r.expiry);
            if (d !== null) {
                r.days = d;
                if (d < 0) r.status = 'Expired';
                else if (d <= 30) r.status = 'Critical';
                else if (d <= 60) r.status = 'Upcoming';
                else if (r.status !== 'Renewed') r.status = 'Active';
            }
        }
    });

    try {
        localStorage.setItem('ohana_renewals_data', JSON.stringify(renewals));
    } catch(e) {
        console.error('Error saving synchronized renewals to localStorage:', e);
    }

    return renewals;
}

/**
 * Computes metrics across synchronized renewals
 */
function computeRenewalMetrics(renewals) {
    if (!Array.isArray(renewals)) return { total: 0, urgent: 0, upcoming: 0, active: 0, expired: 0 };
    let urgent = 0;
    let upcoming = 0;
    let active = 0;
    let expired = 0;

    renewals.forEach(r => {
        const d = (typeof r.days === 'number') ? r.days : computeDaysRemaining(r.expiry);
        if (d !== null) {
            if (d < 0) expired++;
            else if (d <= 30) urgent++;
            else if (d <= 60) upcoming++;
            else active++;
        }
    });

    return {
        total: renewals.length,
        urgent,
        upcoming,
        active,
        expired
    };
}

// Expose core engines globally
window.OHANA_DOC_SPECS = OHANA_DOC_SPECS;
window.validateDocumentUpload = validateDocumentUpload;
window.extractDocumentInfo = extractDocumentInfo;
window.computeDaysRemaining = computeDaysRemaining;
window.syncRenewalsWithDocuments = syncRenewalsWithDocuments;
window.computeRenewalMetrics = computeRenewalMetrics;
window.mapDocCategoryToRenewalCat = mapDocCategoryToRenewalCat;



