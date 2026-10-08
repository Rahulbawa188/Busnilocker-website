'use client';

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
  const cleanSlug = rawSlug.replace(/\.html$/, '');
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
