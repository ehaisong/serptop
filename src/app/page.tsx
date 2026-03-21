'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SectionRenderer } from '@/components/SectionRenderer';

// Public/anon credentials - safe to hardcode
const SUPABASE_URL = 'https://uezkylxjzqswskmttxmb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlemt5bHhqenFzd3NrbXR0eG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDI2NjgsImV4cCI6MjA4OTAxODY2OH0.jGCKLS44JnQpdl7lhYZVsiaFQvDpTEA8rIULEEjdm08';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface ThemeData {
  primaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
}

// Helper: update or create a meta tag
function setMeta(name: string, content: string, property = false) {
  if (!content) return;
  const attr = property ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

const SUPABASE_STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/raw-assets`;

// Helper: set favicon dynamically
function setFavicon(faviconPath: string | null) {
  if (!faviconPath) return;
  const url = `${SUPABASE_STORAGE_URL}/${faviconPath}`;
  let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = url;
  // Also set apple-touch-icon
  let apple = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
  if (!apple) {
    apple = document.createElement('link');
    apple.rel = 'apple-touch-icon';
    document.head.appendChild(apple);
  }
  apple.href = url;
}

// Build JSON-LD structured data from sections and site data
function buildJsonLd(sections: any[], siteData: any, currentSlug: string) {
  const schemas: any[] = [];
  const projectName = siteData?.project_name || 'Website';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  // 1. WebSite schema (index page only)
  if (currentSlug === 'index') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: projectName,
      url: siteUrl,
    });
  }

  // 2. Organization schema - extract from navbar/footer
  const navbar = sections.find((s: any) => s.component_type === 'navbar');
  const footer = sections.find((s: any) => s.component_type === 'footer');
  if (currentSlug === 'index' && (navbar || footer)) {
    const org: any = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: navbar?.props?.logo?.text || footer?.props?.logo?.text || projectName,
      url: siteUrl,
    };
    // Logo from navbar
    if (navbar?.props?.logo?.src) {
      const logoSrc = navbar.props.logo.src;
      org.logo = logoSrc.startsWith('http') ? logoSrc : `${SUPABASE_STORAGE_URL}/${logoSrc}`;
    }
    // Social links from footer
    const socials = footer?.props?.socials;
    if (socials?.length) {
      org.sameAs = socials.map((s: any) => s.href).filter((h: string) => h?.startsWith('http'));
    }
    schemas.push(org);
  }

  // 3. FAQPage schema - extract from FAQ sections
  const faqSections = sections.filter((s: any) => s.component_type === 'faq');
  for (const faq of faqSections) {
    const items = faq.props?.items || [];
    if (items.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item: any) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      });
    }
  }

  // 4. Product schema - from product_gallery
  const productSections = sections.filter((s: any) => s.component_type === 'product_gallery');
  for (const pg of productSections) {
    const products = pg.props?.products || [];
    for (const product of products) {
      if (!product.name) continue;
      const p: any = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
      };
      if (product.description) p.description = product.description;
      if (product.image) {
        p.image = product.image.startsWith('http') ? product.image : `${SUPABASE_STORAGE_URL}/${product.image}`;
      }
      if (product.price) {
        p.offers = {
          '@type': 'Offer',
          price: product.price.replace(/[^0-9.]/g, ''),
          priceCurrency: product.price.includes('¥') || product.price.includes('元') ? 'CNY' : 'USD',
          availability: 'https://schema.org/InStock',
        };
      }
      schemas.push(p);
    }
  }

  // 5. BreadcrumbList (non-index pages)
  if (currentSlug !== 'index') {
    const pageSeo = siteData?.page_seo?.[currentSlug];
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '首页', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: pageSeo?.title || currentSlug, item: pageUrl },
      ],
    });
  }

  // 6. WebPage schema for every page
  const pageSeo = siteData?.page_seo?.[currentSlug];
  const hero = sections.find((s: any) => s.component_type === 'hero');
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageSeo?.seo_title || hero?.props?.headline || projectName,
    description: pageSeo?.seo_description || hero?.props?.subheadline || '',
    url: pageUrl,
    isPartOf: { '@type': 'WebSite', name: projectName, url: siteUrl },
  });

  return schemas;
}

// Inject JSON-LD into document head
function injectJsonLd(schemas: any[]) {
  // Remove old JSON-LD scripts we injected previously
  document.querySelectorAll('script[data-jsonld="auto"]').forEach(el => el.remove());

  for (const schema of schemas) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-jsonld', 'auto');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}

// Inject sitemap link and dynamic robots hints
function injectSitemapMeta(siteData: any) {
  if (!siteData?.sections?.length) return;
  const sitemapUrl = `${SUPABASE_URL}/functions/v1/sitemap-generator?domain=${encodeURIComponent(window.location.hostname)}`;

  // Add <link rel="sitemap">
  if (!document.querySelector('link[rel="sitemap"]')) {
    const link = document.createElement('link');
    link.rel = 'sitemap';
    link.type = 'application/xml';
    link.title = 'Sitemap';
    link.href = sitemapUrl;
    document.head.appendChild(link);
  }

  // Ensure robots meta allows indexing
  let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
  if (robotsMeta) {
    robotsMeta.content = 'index, follow';
  } else {
    robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'index, follow';
    document.head.appendChild(robotsMeta);
  }

  // Add canonical link
  if (!document.querySelector('link[rel="canonical"]')) {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = window.location.href.split('?')[0];
    document.head.appendChild(canonical);
  }
}

// Extract SEO-relevant text from hero section props
function extractSEO(sections: any[], projectName: string) {
  const hero = sections.find((s: any) => s.component_type === 'hero');
  const title = hero?.props?.headline || hero?.props?.title || projectName;
  const description = hero?.props?.subheadline || hero?.props?.subtitle || hero?.props?.description || `${projectName} - 专业网站`;
  return { title, description };
}

export default function Home() {
  const [sections, setSections] = useState<any[]>([]);
  const [allSections, setAllSections] = useState<any[]>([]);
  const [theme, setTheme] = useState<ThemeData | undefined>();
  const [loading, setLoading] = useState(true);
  const [currentSlug, setCurrentSlug] = useState('index');
  const [siteData, setSiteData] = useState<any>(null);

  // Determine page slug from URL pathname
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
      setCurrentSlug(path || 'index');
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '';

        if (!projectId && typeof window !== 'undefined') {
          const { data } = await supabase.rpc('resolve_project_by_domain', {
            _domain: window.location.hostname,
          });
          if (data) projectId = data;
        }

        if (!projectId) { setLoading(false); return; }

        const { data: result, error } = await supabase.rpc('get_site_data', {
          _project_id: projectId,
        });

        if (error || !result) {
          console.error('get_site_data error:', error);
          setLoading(false);
          return;
        }

        setSiteData(result);

        const t = result.theme;
        if (t) {
          setTheme({
            primaryColor: t.primary_color,
            accentColor: t.accent_color,
            fontHeading: t.heading_font,
            fontBody: t.body_font,
          });
        }

        setAllSections(result.sections || []);
      } catch (err) {
        console.error('Failed to load site:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter sections by current slug
  useEffect(() => {
    const filtered = allSections.filter((s: any) => {
      const slug = (s.page_slug || 'index').replace(/^\/+/, '') || 'index';
      return slug === currentSlug;
    });
    setSections(filtered);
  }, [allSections, currentSlug]);

  // Dynamic SEO: prefer stored page_seo, fallback to hero extraction
  useEffect(() => {
    if (!siteData || !sections.length) return;
    const projectName = siteData.project_name || 'SiteForge Site';
    const pageSeo = siteData.page_seo?.[currentSlug];
    const url = typeof window !== 'undefined' ? window.location.href : '';

    let pageTitle: string;
    let pageDescription: string;

    if (pageSeo?.seo_title) {
      // Use AI-generated SEO metadata
      pageTitle = pageSeo.seo_title;
      pageDescription = pageSeo.seo_description || pageSeo.title || projectName;
    } else {
      // Fallback: extract from hero section
      const { title, description } = extractSEO(sections, projectName);
      pageTitle = currentSlug === 'index' ? title : `${currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1)} - ${projectName}`;
      pageDescription = description;
    }

    document.title = pageTitle;
    setMeta('description', pageDescription);
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', pageDescription, true);
    setMeta('og:url', url, true);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', projectName, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', pageDescription);

    // SEO keywords
    if (pageSeo?.seo_keywords) {
      setMeta('keywords', pageSeo.seo_keywords);
    }

    // Dynamic favicon
    setFavicon(siteData.favicon_path || null);

    // JSON-LD structured data
    const jsonLdSchemas = buildJsonLd(sections, siteData, currentSlug);
    injectJsonLd(jsonLdSchemas);

    // Sitemap & robots meta
    injectSitemapMeta(siteData);
  }, [sections, currentSlug, siteData]);


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return;
      e.preventDefault();
      const newSlug = href.replace(/^\/+|\/+$/g, '') || 'index';
      setCurrentSlug(newSlug);
      window.history.pushState(null, '', href);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handler = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
      setCurrentSlug(path || 'index');
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!sections.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">站点构建中</h1>
          <p className="text-gray-500">AI 正在生成您的网站内容...</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      {sections.map((section: any) => (
        <SectionRenderer
          key={section.id}
          componentType={section.component_type}
          props={section.props}
          theme={theme}
        />
      ))}
    </main>
  );
}
