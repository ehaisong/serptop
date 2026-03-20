interface ThemeProps {
  primaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
}

interface StatsGridProps {
  title?: string;
  subtitle?: string;
  stats?: Array<{ value: string; label: string; description?: string; icon?: string }>;
  columns?: 2 | 3 | 4;
  backgroundColor?: string;
  theme?: ThemeProps;
}

export default function StatsGrid({ title, subtitle, stats = [], columns = 4, backgroundColor, theme }: StatsGridProps) {
  const gridCols = columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4';

  return (
    <section className="py-20" style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-7xl mx-auto px-6">
        {title && <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: theme?.fontHeading }}>{title}</h2>}
        {subtitle && <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto" style={{ fontFamily: theme?.fontBody }}>{subtitle}</p>}
        <div className={`grid grid-cols-2 ${gridCols} gap-8`}>
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6">
              {stat.icon && <div className="text-3xl mb-3">{stat.icon}</div>}
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: theme?.primaryColor || undefined, fontVariantNumeric: 'tabular-nums', fontFamily: theme?.fontHeading }}
              >
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: theme?.fontHeading }}>{stat.label}</div>
              {stat.description && <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: theme?.fontBody }}>{stat.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
