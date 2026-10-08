'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function PageRenderer({ data }) {
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!data) return;

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

    // 2. Execute page-specific inline script in browser global context
    let scriptEl = null;
    if (data.script && data.script.trim()) {
      try {
        scriptEl = document.createElement('script');
        scriptEl.type = 'text/javascript';
        scriptEl.setAttribute('data-ohana-script', data.slug);
        scriptEl.text = data.script;
        document.body.appendChild(scriptEl);
      } catch (err) {
        console.error(`[Ohana] Error executing script for ${data.slug}:`, err);
      }
    }

    // 3. Dispatch DOMContentLoaded to trigger registered listeners
    try {
      document.dispatchEvent(new Event('DOMContentLoaded'));
    } catch (e) {}

    // 4. Run global Ohana application initializers
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

    // Cleanup when navigating away
    return () => {
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
      // Remove any lingering sidebar backdrops
      const backdrops = document.querySelectorAll('.sidebar-backdrop');
      backdrops.forEach(b => b.remove());
    };
  }, [data]);

  // Handle client-side navigation for legacy .html or relative links
  const handleContainerClick = (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

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

    const finalUrl = queryPart ? `${cleanPath}?${queryPart}` : cleanPath;

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
