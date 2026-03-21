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

export default function Home() {
  const [sections, setSections] = useState<any[]>([]);
  const [allSections, setAllSections] = useState<any[]>([]);
  const [theme, setTheme] = useState<ThemeData | undefined>();
  const [loading, setLoading] = useState(true);
  const [currentSlug, setCurrentSlug] = useState('index');

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

        const { data: siteData, error } = await supabase.rpc('get_site_data', {
          _project_id: projectId,
        });

        if (error || !siteData) {
          console.error('get_site_data error:', error);
          setLoading(false);
          return;
        }

        const t = siteData.theme;
        if (t) {
          setTheme({
            primaryColor: t.primary_color,
            accentColor: t.accent_color,
            fontHeading: t.heading_font,
            fontBody: t.body_font,
          });
        }

        setAllSections(siteData.sections || []);
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

  // Intercept internal link clicks for SPA navigation
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
