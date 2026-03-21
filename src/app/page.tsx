'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SectionRenderer } from '@/components/SectionRenderer';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key);
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

  useEffect(() => {
    const supabase = getSupabase();
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
    if (!supabase || !projectId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      const { data: blueprint } = await supabase!
        .from('site_blueprints')
        .select('id, theme')
        .eq('project_id', projectId!)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!blueprint) { setLoading(false); return; }

      const t = blueprint.theme as Record<string, any> | null;
      if (t) {
        setTheme({
          primaryColor: t.primary_color,
          accentColor: t.accent_color,
          fontHeading: t.heading_font,
          fontBody: t.body_font,
        });
      }

      const { data: secs } = await supabase!
        .from('page_sections')
        .select('*')
        .eq('blueprint_id', blueprint.id)
        .eq('page_slug', 'index')
        .order('section_order', { ascending: true });

      setSections(secs || []);
      setLoading(false);
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
