import { createClient } from '@supabase/supabase-js';
import { SectionRenderer } from '@/components/SectionRenderer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getPageData(slug: string) {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  if (!projectId) return { sections: [], theme: undefined };

  const { data: blueprint } = await supabase
    .from('site_blueprints')
    .select('id, theme')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!blueprint) return { sections: [], theme: undefined };

  const { data: sections } = await supabase
    .from('page_sections')
    .select('*')
    .eq('blueprint_id', blueprint.id)
    .eq('page_slug', slug)
    .order('section_order', { ascending: true });

  const t = blueprint.theme as Record<string, any> | null;
  const theme = t ? {
    primaryColor: t.primary_color,
    accentColor: t.accent_color,
    fontHeading: t.heading_font,
    fontBody: t.body_font,
  } : undefined;

  return { sections: sections || [], theme };
}

export default async function Home() {
  const { sections, theme } = await getPageData('index');

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
