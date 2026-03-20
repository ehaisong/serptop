interface ThemeProps {
  primaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
}

interface TimelineItem {
  year?: string;
  date?: string;
  title: string;
  description?: string;
  icon?: string;
}

interface TimelineProps {
  title?: string;
  subtitle?: string;
  items?: TimelineItem[];
  backgroundColor?: string;
  theme?: ThemeProps;
}

export default function Timeline({ title, subtitle, items = [], backgroundColor, theme }: TimelineProps) {
  const primaryColor = theme?.primaryColor || '#2563eb';

  return (
    <section className="py-20" style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-4xl mx-auto px-6">
        {title && <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: theme?.fontHeading }}>{title}</h2>}
        {subtitle && <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto" style={{ fontFamily: theme?.fontBody }}>{subtitle}</p>}
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5" style={{ backgroundColor: `${primaryColor}20` }} />
          <div className="space-y-12">
            {items.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className="relative flex items-start md:items-center">
                  <div className={`hidden md:flex w-full items-center ${isLeft ? '' : 'flex-row-reverse'}`}>
                    <div className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      {(item.year || item.date) && (
                        <span className="text-sm font-semibold" style={{ color: primaryColor, fontFamily: theme?.fontBody }}>{item.year || item.date}</span>
                      )}
                      <h3 className="text-lg font-bold mt-1" style={{ fontFamily: theme?.fontHeading }}>{item.title}</h3>
                      {item.description && <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: theme?.fontBody }}>{item.description}</p>}
                    </div>
                    <div className="w-2/12 flex justify-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold z-10 shadow-md" style={{ backgroundColor: primaryColor }}>
                        {item.icon || (i + 1)}
                      </div>
                    </div>
                    <div className="w-5/12" />
                  </div>
                  <div className="flex md:hidden items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold z-10 shadow-md flex-shrink-0 mt-0.5" style={{ backgroundColor: primaryColor }}>
                      {item.icon || (i + 1)}
                    </div>
                    <div className="flex-1">
                      {(item.year || item.date) && <span className="text-sm font-semibold" style={{ color: primaryColor }}>{item.year || item.date}</span>}
                      <h3 className="text-lg font-bold mt-0.5" style={{ fontFamily: theme?.fontHeading }}>{item.title}</h3>
                      {item.description && <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: theme?.fontBody }}>{item.description}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
