import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const APP_DIR = path.join(ROOT_DIR, 'src', 'app');
const DATA_DIR = path.join(ROOT_DIR, 'src', 'data', 'pages');

const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const slug = file.replace('.js', '');
  const folder = slug === 'home' ? APP_DIR : path.join(APP_DIR, slug);
  fs.mkdirSync(folder, { recursive: true });

  const componentContent = `import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/${slug}';

export const metadata = {
  title: pageData.title,
};

export default function ${slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Page() {
  return <PageRenderer data={pageData} />;
}
`;

  const pageFile = path.join(folder, 'page.jsx');
  fs.writeFileSync(pageFile, componentContent, 'utf8');
  console.log(`Generated: ${path.relative(ROOT_DIR, pageFile)}`);
});

// Also create catch-all pages/[slug]/page.jsx for legacy /pages/* routes
const pagesFolder = path.join(APP_DIR, 'pages', '[slug]');
fs.mkdirSync(pagesFolder, { recursive: true });

const pagesCatchAll = `'use client';

import { use } from 'react';
import PageRenderer from '@/components/PageRenderer';

const pageModules = {
  about: () => import('@/data/pages/about'),
  activity: () => import('@/data/pages/activity'),
  'admin-review': () => import('@/data/pages/admin-review'),
  analytics: () => import('@/data/pages/analytics'),
  assets: () => import('@/data/pages/company-assets'),
  'company-assets': () => import('@/data/pages/company-assets'),
  billing: () => import('@/data/pages/billing'),
  'business-passport': () => import('@/data/pages/business-passport'),
  compliance: () => import('@/data/pages/compliance'),
  contact: () => import('@/data/pages/contact'),
  dashboard: () => import('@/data/pages/dashboard'),
  documents: () => import('@/data/pages/documents'),
  features: () => import('@/data/pages/features'),
  identity: () => import('@/data/pages/identity'),
  integrations: () => import('@/data/pages/integrations'),
  login: () => import('@/data/pages/login'),
  notifications: () => import('@/data/pages/notifications'),
  onboarding: () => import('@/data/pages/onboarding'),
  'public-profile': () => import('@/data/pages/public-profile'),
  renewals: () => import('@/data/pages/renewals'),
  security: () => import('@/data/pages/security'),
  'share-room': () => import('@/data/pages/share-room'),
  signup: () => import('@/data/pages/signup'),
  support: () => import('@/data/pages/support'),
  team: () => import('@/data/pages/team'),
  'trust-center': () => import('@/data/pages/trust-center'),
  verification: () => import('@/data/pages/verification'),
};

import { useState, useEffect } from 'react';

export default function LegacyPagesCatchAll({ params }) {
  const unwrappedParams = use(params);
  const rawSlug = unwrappedParams.slug || '';
  const cleanSlug = rawSlug.replace(/\\.html$/, '');
  const [data, setData] = useState(null);

  useEffect(() => {
    const loader = pageModules[cleanSlug];
    if (loader) {
      loader().then(mod => setData(mod.pageData));
    }
  }, [cleanSlug]);

  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return <PageRenderer data={data} />;
}
`;

fs.writeFileSync(path.join(pagesFolder, 'page.jsx'), pagesCatchAll, 'utf8');
console.log('Generated: src/app/pages/[slug]/page.jsx');
