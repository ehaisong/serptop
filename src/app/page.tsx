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
  const [theme, setTheme] = useState<ThemeData | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Step 1: Resolve project ID by domain
        let projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '';

        if (!projectId && typeof window !== 'undefined') {
          const { data } = await supabase.rpc('resolve_project_by_domain', {
            _domain: window.location.hostname,
          });
          if (data) projectId = data;
        }

        if (!projectId) { setLoading(false); return; }

        // Step 2: Fetch all site data via single RPC call (bypasses RLS)
        const { data: siteData, error } = await supabase.rpc('get_site_data', {
          _project_id: projectId,
        });

        if (error || !siteData) {
          console.error('get_site_data error:', error);
          setLoading(false);
          return;
        }

        // Parse theme
        const t = siteData.theme;
        if (t) {
          setTheme({
            primaryColor: t.primary_color,
            accentColor: t.accent_color,
            fontHeading: t.heading_font,
            fontBody: t.body_font,
          });
        }

        setSections(siteData.sections || []);
      } catch (err) {
        console.error('Failed to load site:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
