'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

function prepareIsolatedScript(rawScript) {
  if (!rawScript || !rawScript.trim()) return '';

  // Extract top-level function declarations (including async)
  const funcRegex = /(?:^|\n)\s*(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(/g;
  const funcs = [];
  let m;
  while ((m = funcRegex.exec(rawScript)) !== null) {
    if (!funcs.includes(m[1])) funcs.push(m[1]);
  }

  // Extract top-level variable declarations that may be needed globally
  const varRegex = /(?:^|\n)\s*(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=/g;
  const vars = [];
  while ((m = varRegex.exec(rawScript)) !== null) {
    if (!vars.includes(m[1])) vars.push(m[1]);
  }

  // 1. Hoisted exports to window: ensure inline HTML handlers (e.g. onclick="openUploadModal()") work immediately
  const hoistedExports = funcs
    .map(f => `try { if (typeof ${f} !== 'undefined') window.${f} = ${f}; } catch(e){}`)
    .join('\n');

  // 2. Post-execution exports: export variables and functions after execution
  const postExports = [
    ...funcs.map(f => `try { if (typeof ${f} !== 'undefined') window.${f} = ${f}; } catch(e){}`),
    ...vars.map(v => `try { if (typeof ${v} !== 'undefined') window.${v} = ${v}; } catch(e){}`)
  ].join('\n');

  return `(function() {
// 1. Hoisted function exports to window
${hoistedExports}

// 2. Main page script execution
${rawScript}

// 3. Post-execution exports
${postExports}
})();`;
}

export default function PageRenderer({ data }) {
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!data) return;

    // Immediate auth check for protected routes in Next.js
    const currentSlug = (data.slug || '').toLowerCase();
    const publicSlugs = [
      '',
      'home',
      'index',
      'login',
      'signup',
      'features',
      'about',
      'contact',
      'security',
      'documentation'
    ];
    const isProtected = !publicSlugs.includes(currentSlug);
    const isLoggedIn = typeof window !== 'undefined' && Boolean(
      localStorage.getItem('ohana_user_logged_in') === 'true' &&
      localStorage.getItem('ohana_current_user')
    );

    if (isProtected && !isLoggedIn) {
      const targetParam = '/' + (currentSlug === 'company-assets' ? 'company-assets' : currentSlug);
      const queryPart = typeof window !== 'undefined' ? window.location.search : '';
      const redirParam = encodeURIComponent(targetParam + queryPart);
      router.replace(`/login?redirect=${redirParam}`);
      return;
    }

    // 1. Synchronize document title and body attributes
    if (data.title) {
      document.title = data.title;
    }
    if (data.bodyClass) {
      document.body.className = data.bodyClass;
    } else {
      document.body.className = '';
    }
    if (data.bodyId) {
      document.body.id = data.bodyId;
    } else {
      document.body.removeAttribute('id');
    }

    // 1.5. Inject page-specific styles if present
    let styleEl = null;
    if (data.style && data.style.trim()) {
      try {
        styleEl = document.createElement('style');
        styleEl.type = 'text/css';
        styleEl.setAttribute('data-ohana-style', data.slug);
        styleEl.textContent = data.style;
        document.head.appendChild(styleEl);
      } catch (err) {
        console.error(`[Ohana] Error executing styles for ${data.slug}:`, err);
      }
    }

    // 2. Execute page-specific script safely with scope isolation and listener tracking
    // This prevents "Identifier '...' has already been declared" and duplicate event listeners
    const pageInitCallbacks = [];
    const pageCleanupFns = [];
    const activeIntervals = [];

    if (data.script && data.script.trim()) {
      const origDocAddEventListener = document.addEventListener;
      const origWinAddEventListener = window.addEventListener;
      const origSetInterval = window.setInterval;

      // Intercept document.addEventListener to capture DOMContentLoaded and track listeners for cleanup
      document.addEventListener = function (type, listener, options) {
        if (type === 'DOMContentLoaded' && typeof listener === 'function') {
          pageInitCallbacks.push(listener);
          return;
        }
        pageCleanupFns.push(() => {
          document.removeEventListener(type, listener, options);
        });
        return origDocAddEventListener.call(document, type, listener, options);
      };

      // Intercept window.addEventListener to track listeners for cleanup
      window.addEventListener = function (type, listener, options) {
        pageCleanupFns.push(() => {
          window.removeEventListener(type, listener, options);
        });
        return origWinAddEventListener.call(window, type, listener, options);
      };

      // Track intervals registered by the page script
      window.setInterval = function (fn, ms, ...args) {
        const id = origSetInterval.call(window, fn, ms, ...args);
        activeIntervals.push(id);
        return id;
      };

      try {
        const isolatedScript = prepareIsolatedScript(data.script);
        // Execute synchronously so all functions and state are defined immediately
        (0, eval)(isolatedScript);
      } catch (err) {
        console.error(`[Ohana] Error executing script for ${data.slug}:`, err);
      } finally {
        document.addEventListener = origDocAddEventListener;
        window.addEventListener = origWinAddEventListener;
        window.setInterval = origSetInterval;
      }

      // Execute captured page-specific init logic once now that the page DOM is rendered
      pageInitCallbacks.forEach((initFn) => {
        try {
          initFn();
        } catch (initErr) {
          console.error(`[Ohana] Error running page initializer for ${data.slug}:`, initErr);
        }
      });
    }

    // 3. Run global Ohana application initializers
    if (typeof window !== 'undefined') {
      try {
        if (window.enforceOhanaAuthGuard && !window.enforceOhanaAuthGuard()) {
          return;
        }
        if (window.initOhanaUserSession) window.initOhanaUserSession();
        if (window.initProtectedNavInterceptors) window.initProtectedNavInterceptors();
        if (window.initMobileNav) window.initMobileNav();
        if (window.initSidebar) window.initSidebar();
        if (window.cleanupSidebarNav) window.cleanupSidebarNav();
        if (window.initSidebarIcons) window.initSidebarIcons();
        if (window.initModalsAndToasts) window.initModalsAndToasts();
        if (window.initForms) window.initForms();
        if (window.initHeroSlider) window.initHeroSlider();
        if (window.initOhanaChatbot) window.initOhanaChatbot();
        if (window.initBPStoryAnimation) window.initBPStoryAnimation();
        if (window.syncOhanaGlobalState) window.syncOhanaGlobalState();
      } catch (appErr) {
        console.error('[Ohana] App initialization error:', appErr);
      }
    }

    // 4. Cleanup when navigating away: remove styles, event listeners, intervals, and lingering backdrops
    return () => {
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
      pageCleanupFns.forEach((cleanup) => {
        try {
          cleanup();
        } catch (e) {}
      });
      activeIntervals.forEach((id) => clearInterval(id));

      const backdrops = document.querySelectorAll('.sidebar-backdrop, .modal-backdrop');
      backdrops.forEach(b => b.remove());
    };
  }, [data]);

  // Handle client-side navigation for legacy .html or relative links
  const handleContainerClick = (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Trigger logout session cleanup only if an explicit logout link is clicked
    const linkText = link.textContent.trim().toLowerCase();
    const isLogoutLink = linkText.includes('logout') || link.getAttribute('data-action') === 'logout';
    if (isLogoutLink) {
      if (typeof window !== 'undefined' && window.logoutOhanaUser) {
        window.logoutOhanaUser();
      }
    }

    // Skip external, fragment, or protocol links
    if (
      href.startsWith('#') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:')
    ) {
      return;
    }

    if (link.getAttribute('target') === '_blank') return;
    if (link.hasAttribute('data-nav-pricing')) return; // handled by special app.js modal handler

    // Normalize relative / legacy paths
    let target = href;
    target = target.replace(/^\.\.\//, '/');
    target = target.replace(/^pages\//, '/');

    const [pathPart, queryPart] = target.split('?');
    let cleanPath = pathPart.replace(/\.html$/, '');
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    if (cleanPath === '/index') cleanPath = '/';
    if (cleanPath === '/assets' || cleanPath === '/pages/assets') cleanPath = '/company-assets';

    const targetSlug = cleanPath.replace(/^\//, '').toLowerCase();
    const publicSlugs = [
      '',
      'index',
      'login',
      'signup',
      'features',
      'about',
      'contact',
      'security',
      'documentation'
    ];
    const isPublic = publicSlugs.includes(targetSlug);

    const isLoggedIn = typeof window !== 'undefined' && Boolean(
      localStorage.getItem('ohana_user_logged_in') === 'true' &&
      localStorage.getItem('ohana_current_user')
    );

    let finalUrl = queryPart ? `${cleanPath}?${queryPart}` : cleanPath;

    // If destination requires authentication and user is not logged in, prompt to log in first
    if (!isPublic && !isLoggedIn && cleanPath !== '/login') {
      finalUrl = `/login?redirect=${encodeURIComponent(finalUrl)}`;
    }

    e.preventDefault();
    router.push(finalUrl);
  };

  return (
    <div
      ref={containerRef}
      className="ohana-nextjs-page-root"
      onClick={handleContainerClick}
      dangerouslySetInnerHTML={{ __html: data.html }}
    />
  );
}
