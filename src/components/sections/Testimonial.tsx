interface ThemeProps {
  primaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
}

interface TestimonialProps {
  title?: string;
  testimonials?: Array<{ quote: string; author: string; role?: string; avatar?: string; company?: string }>;
  backgroundColor?: string;
  theme?: ThemeProps;
}

export default function Testimonial({ title, testimonials = [], backgroundColor, theme }: TestimonialProps) {
  return (
    <section className="py-20" style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-7xl mx-auto px-6">
        {title && <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: theme?.fontHeading }}>{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-xl bg-white/80 border border-gray-100 shadow-sm">
              <p className="text-gray-700 leading-relaxed mb-6" style={{ fontFamily: theme?.fontBody }}>"{t.quote}"</p>
              <div className="flex items-center gap-3">
                {t.avatar && <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />}
                <div>
                  <p className="font-semibold text-sm">{t.author}</p>
                  {(t.role || t.company) && (
                    <p className="text-xs text-gray-500">{[t.role, t.company].filter(Boolean).join(' · ')}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
