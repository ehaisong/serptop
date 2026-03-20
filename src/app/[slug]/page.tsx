import { createClient } from '@supabase/supabase-js';
import { SectionRenderer } from '@/components/SectionRenderer';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateStaticParams() {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  if (!projectId) return [];

  const { data: blueprint } = await supabase
    .from('site_blueprints')
    .select('id')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!blueprint) return [];

  const { data: sections } = await supabase
    .from('page_sections')
    .select('page_slug')
    .eq('blueprint_id', blueprint.id);

  if (!sections) return [];

  const slugs = [...new Set(sections.map((s: any) => s.page_slug))].filter(
    (s) => s !== 'index'
  );

  return slugs.map((slug) => ({ slug }));
}

async function getPageData(slug: string) {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  if (!projectId) return { sections: [], theme: null };

  const { data: blueprint } = await supabase
    .from('site_blueprints')
    .select('id, theme')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!blueprint) return { sections: [], theme: null };

  const { data: sections } = await supabase
    .from('page_sections')
    .select('*')
    .eq('blueprint_id', blueprint.id)
    .eq('page_slug', slug)
    .order('section_order', { ascending: true });

  const t = blueprint.theme as Record<string, any> | null;
  const theme = t
    ? {
        primaryColor: t.primary_color,
        accentColor: t.accent_color,
        fontHeading: t.heading_font,
        fontBody: t.body_font,
      }
    : undefined;

  return { sections: sections || [], theme };
}

export default async function DynamicPage({
  params,
}: {
  params: { slug: string };
}) {
  const { sections, theme } = await getPageData(params.slug);

  if (!sections.length) {
    notFound();
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
