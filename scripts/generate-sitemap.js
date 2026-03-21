/**
 * Post-build script: generates sitemap.xml and robots.txt in the out/ directory.
 * Works with or without NEXT_PUBLIC_PROJECT_ID by scanning deploy records.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://uezkylxjzqswskmttxmb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlemt5bHhqenFzd3NrbXR0eG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDI2NjgsImV4cCI6MjA4OTAxODY2OH0.jGCKLS44JnQpdl7lhYZVsiaFQvDpTEA8rIULEEjdm08';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '');
const outDir = path.join(__dirname, '..', 'out');

function rpcCall(fnName, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const parsed = new URL(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`);
    const options = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { reject(new Error('Invalid JSON: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  let pid = projectId;

  // If no PROJECT_ID env var, try to resolve from SITE_URL domain
  if (!pid && siteUrl) {
    try {
      const domain = new URL(siteUrl).hostname;
      console.log(`[sitemap] Resolving project from domain: ${domain}`);
      pid = await rpcCall('resolve_project_by_domain', { _domain: domain });
    } catch (e) {
      console.log('[sitemap] Domain resolution failed:', e.message);
    }
  }

  if (!pid) {
    console.log('[sitemap] No project ID available, skipping sitemap generation');
    return;
  }

  console.log(`[sitemap] Generating for project ${pid}`);

  let siteData;
  try {
    siteData = await rpcCall('get_site_data', { _project_id: pid });
  } catch (err) {
    console.error('[sitemap] Failed to fetch site data:', err.message);
    return;
  }

  if (!siteData || !siteData.sections) {
    console.log('[sitemap] No site data found, skipping');
    return;
  }

  // Extract unique page slugs
  const slugs = new Set();
  for (const section of siteData.sections) {
    const slug = (section.page_slug || 'index').replace(/^\/+/, '') || 'index';
    slugs.add(slug);
  }

  const baseUrl = siteUrl || '';
  const today = new Date().toISOString().split('T')[0];

  // Build sitemap XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const slug of slugs) {
    const loc = slug === 'index' ? `${baseUrl}/` : `${baseUrl}/${slug}/`;
    const priority = slug === 'index' ? '1.0' : '0.8';
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
  }
  xml += '</urlset>\n';

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf-8');
  console.log(`[sitemap] Generated sitemap.xml with ${slugs.size} URLs`);

  // Build robots.txt
  let robots = 'User-agent: *\nAllow: /\n';
  if (baseUrl) {
    robots += `\nSitemap: ${baseUrl}/sitemap.xml\n`;
  }
  robots += '\nCrawl-delay: 1\n';

  fs.writeFileSync(path.join(outDir, 'robots.txt'), robots, 'utf-8');
  console.log('[sitemap] Generated robots.txt');
}

main().catch((err) => {
  console.error('[sitemap] Error:', err);
  process.exit(0); // Don't fail the build
});
