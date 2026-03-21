'use client';

import { useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SectionRenderer } from '@/components/SectionRenderer';

// These are public/anon credentials - safe to hardcode
const SUPABASE_URL = 'https://uezkylxjzqswskmttxmb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlemt5bHhqenFzd3NrbXR0eG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDI2NjgsImV4cCI6MjA4OTAxODY2OH0.jGCKLS44JnQpdl7lhYZVsiaFQvDpTEA8rIULEEjdm08';

function getSupabase(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();

    async function fetchData() {
      try {
        // Step 1: Resolve PROJECT_ID
        // Try env var first (works if set at build time), then lookup by deploy domain
        let projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '';

        if (!projectId && typeof window !== 'undefined') {
          const currentDomain = window.location.hostname;
          const { data: resolvedId } = await supabase
            .rpc('resolve_project_by_domain', { _domain: currentDomain });

          if (resolvedId) {
            projectId = resolvedId;
          }
        }

        if (!projectId) {
          setError('无法确定项目 ID');
          setLoading(false);
          return;
        }

        // Step 2: Fetch blueprint
        const { data: blueprint } = await supabase
          .from('site_blueprints')
          .select('id, theme')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!blueprint) {
          setLoading(false);
          return;
        }

        const t = blueprint.theme as Record<string, any> | null;
        if (t) {
          setTheme({
            primaryColor: t.primary_color,
            accentColor: t.accent_color,
            fontHeading: t.heading_font,
            fontBody: t.body_font,
          });
        }

        // Step 3: Fetch sections
        const { data: secs } = await supabase
          .from('page_sections')
          .select('*')
          .eq('blueprint_id', blueprint.id)
          .eq('page_slug', 'index')
          .order('section_order', { ascending: true });

        setSections(secs || []);
      } catch (err: any) {
        console.error('Failed to load site data:', err);
        setError(err.message || '加载失败');
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">加载出错</h1>
          <p className="text-gray-500">{error}</p>
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
