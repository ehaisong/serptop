interface ThemeProps {
  primaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
}

interface SpecTableProps {
  title?: string;
  specs?: Array<{ label: string; value: string }>;
  backgroundColor?: string;
  theme?: ThemeProps;
}

export default function SpecTable({ title, specs = [], backgroundColor, theme }: SpecTableProps) {
  return (
    <section className="py-20" style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-4xl mx-auto px-6">
        {title && <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: theme?.fontHeading }}>{title}</h2>}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {specs.map((spec, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="w-1/3 px-6 py-4 font-medium text-gray-700 border-r border-gray-200" style={{ fontFamily: theme?.fontHeading }}>{spec.label}</div>
              <div className="w-2/3 px-6 py-4 text-gray-600" style={{ fontFamily: theme?.fontBody, fontVariantNumeric: 'tabular-nums' }}>{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
