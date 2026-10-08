import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const PAGES_DIR = path.join(ROOT_DIR, 'pages');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DATA_DIR = path.join(SRC_DIR, 'data', 'pages');
const APP_DIR = path.join(SRC_DIR, 'app');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(APP_DIR, { recursive: true });

// Map of file names to route slugs
const routeMapping = {
  'index.html': { slug: 'home', route: '/', isHome: true },
  'about.html': { slug: 'about', route: '/about' },
  'activity.html': { slug: 'activity', route: '/activity' },
  'admin-review.html': { slug: 'admin-review', route: '/admin-review' },
  'analytics.html': { slug: 'analytics', route: '/analytics' },
  'assets.html': { slug: 'company-assets', route: '/company-assets', altRoute: '/pages/assets' },
  'billing.html': { slug: 'billing', route: '/billing' },
  'business-passport.html': { slug: 'business-passport', route: '/business-passport' },
  'compliance.html': { slug: 'compliance', route: '/compliance' },
  'contact.html': { slug: 'contact', route: '/contact' },
  'dashboard.html': { slug: 'dashboard', route: '/dashboard' },
  'documents.html': { slug: 'documents', route: '/documents' },
  'features.html': { slug: 'features', route: '/features' },
  'identity.html': { slug: 'identity', route: '/identity' },
  'integrations.html': { slug: 'integrations', route: '/integrations' },
  'login.html': { slug: 'login', route: '/login' },
  'notifications.html': { slug: 'notifications', route: '/notifications' },
  'onboarding.html': { slug: 'onboarding', route: '/onboarding' },
  'public-profile.html': { slug: 'public-profile', route: '/public-profile' },
  'renewals.html': { slug: 'renewals', route: '/renewals' },
  'security.html': { slug: 'security', route: '/security' },
  'share-room.html': { slug: 'share-room', route: '/share-room' },
  'signup.html': { slug: 'signup', route: '/signup' },
  'support.html': { slug: 'support', route: '/support' },
  'team.html': { slug: 'team', route: '/team' },
  'trust-center.html': { slug: 'trust-center', route: '/trust-center' },
  'verification.html': { slug: 'verification', route: '/verification' },
};

function normalizeHtml(html) {
  let res = html;

  // Normalize asset paths
  res = res.replace(/(?:src|href)=["'](?:\.\.\/)?assets\/([^"']+)["']/g, 'src="/assets/$1"');
  // Re-fix href for assets if it was href="../assets/..."
  res = res.replace(/href=["'](?:\.\.\/)?assets\/([^"']+)["']/g, 'href="/assets/$1"');

  // Normalize page links to Next.js routes
  res = res.replace(/href=["'](?:\.\.\/)?index\.html(["'#?])/g, 'href="/$1');
  res = res.replace(/href=["']index\.html(["'#?])/g, 'href="/$1');

  // Normalize pages/*.html links
  Object.keys(routeMapping).forEach(filename => {
    if (filename === 'index.html') return;
    const { route } = routeMapping[filename];
    // replace href="pages/filename" or href="../pages/filename" or href="filename"
    const pattern = new RegExp(`href=["'](?:(?:\\.\\.\\/)?pages\\/|\\.\\.\\/)?${filename.replace('.', '\\.')}(["'#?])`, 'g');
    res = res.replace(pattern, `href="${route}$1`);
  });

  return res;
}

const allPages = [];

Object.keys(routeMapping).forEach(filename => {
  const info = routeMapping[filename];
  const filePath = filename === 'index.html' ? path.join(ROOT_DIR, 'index.html') : path.join(PAGES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn('File not found:', filePath);
    return;
  }

  const rawContent = fs.readFileSync(filePath, 'utf8');
  const titleMatch = rawContent.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Ohana Busnilocker';

  const bodyMatch = rawContent.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    console.error('No body tag in:', filePath);
    return;
  }

  const bodyAttrsRaw = bodyMatch[1].trim();
  let bodyClass = '';
  let bodyId = '';

  const classMatch = bodyAttrsRaw.match(/class=["']([^"']*)["']/i);
  if (classMatch) bodyClass = classMatch[1].trim();

  const idMatch = bodyAttrsRaw.match(/id=["']([^"']*)["']/i);
  if (idMatch) bodyId = idMatch[1].trim();

  const bodyContent = bodyMatch[2];
  const inlineScripts = [];

  // Extract inline scripts and strip them from the body HTML
  const cleanedBody = bodyContent.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptCode) => {
    if (!match.includes('src=')) {
      inlineScripts.push(scriptCode);
    }
    return '';
  });

  const normalizedHtml = normalizeHtml(cleanedBody);
  const combinedScript = inlineScripts.join('\n\n;\n\n');

  const pageData = {
    slug: info.slug,
    route: info.route,
    title: title,
    bodyClass: bodyClass,
    bodyId: bodyId,
    html: normalizedHtml,
    script: combinedScript,
  };

  // Write page data file as JS module
  const pageDataFilePath = path.join(DATA_DIR, `${info.slug}.js`);
  fs.writeFileSync(pageDataFilePath, `export const pageData = ${JSON.stringify(pageData, null, 2)};\n`, 'utf8');

  allPages.push(info);
});

console.log(`Successfully generated data modules for ${allPages.length} pages in ${DATA_DIR}`);
