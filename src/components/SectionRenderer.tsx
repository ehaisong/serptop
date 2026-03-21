'use client';

import dynamic from 'next/dynamic';

// Lazy-load all section components
const components: Record<string, React.ComponentType<any>> = {
  navbar: dynamic(() => import('./sections/Navbar')),
  hero: dynamic(() => import('./sections/Hero')),
  logo_wall: dynamic(() => import('./sections/LogoWall')),
  feature_grid: dynamic(() => import('./sections/FeatureGrid')),
  product_gallery: dynamic(() => import('./sections/ProductGallery')),
  spec_table: dynamic(() => import('./sections/SpecTable')),
  comparison_table: dynamic(() => import('./sections/ComparisonTable')),
  testimonial: dynamic(() => import('./sections/Testimonial')),
  faq: dynamic(() => import('./sections/FAQ')),
  cta: dynamic(() => import('./sections/CTA')),
  rich_content: dynamic(() => import('./sections/RichContent')),
  footer: dynamic(() => import('./sections/Footer')),
  stats_grid: dynamic(() => import('./sections/StatsGrid')),
  team: dynamic(() => import('./sections/Team')),
  timeline: dynamic(() => import('./sections/Timeline')),
};

interface SectionRendererProps {
  componentType: string;
  props: Record<string, any>;
  theme?: {
    primaryColor?: string;
    accentColor?: string;
    fontHeading?: string;
    fontBody?: string;
  };
}

export function SectionRenderer({ componentType, props, theme }: SectionRendererProps) {
  const Component = components[componentType];

  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 text-sm">
          Unknown component: {componentType}
        </div>
      );
    }
    return null;
  }

  // Merge theme into props
  const mergedProps = theme ? { ...props, theme } : props;

  return <Component {...mergedProps} />;
}
