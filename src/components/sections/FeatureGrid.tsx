interface ThemeProps {
  primaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
}

interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  features?: Array<{ icon?: string; title: string; description: string; image?: string }>;
  columns?: 2 | 3 | 4;
  backgroundColor?: string;
  theme?: ThemeProps;
}

export default function FeatureGrid({ title, subtitle, features = [], columns = 3, backgroundColor, theme }: FeatureGridProps) {
  const gridCols = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
  const hasImages = features.some(f => f.image);

  return (
    <section className="py-20" style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-7xl mx-auto px-6">
        {title && <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: theme?.fontHeading }}>{title}</h2>}
        {subtitle && <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto" style={{ fontFamily: theme?.fontBody }}>{subtitle}</p>}
        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {features.map((feature, i) => (
            <div key={i} className={`rounded-xl border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden ${hasImages ? '' : 'p-6'}`}>
              {feature.image && <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover" />}
              <div className={hasImages ? 'p-5' : ''}>
                {feature.icon && !feature.image && (
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4" style={{ backgroundColor: theme?.primaryColor ? `${theme.primaryColor}15` : '#f3f4f6' }}>
                    {feature.icon}
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: theme?.fontHeading }}>{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: theme?.fontBody }}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
