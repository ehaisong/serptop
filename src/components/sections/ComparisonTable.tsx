interface ThemeProps {
  primaryColor?: string;
  accentColor?: string;
}

interface ComparisonTableProps {
  title?: string;
  headers?: string[];
  rows?: Array<{ feature: string; values: string[] }>;
  theme?: ThemeProps;
}

export default function ComparisonTable({ title, headers = [], rows = [], theme }: ComparisonTableProps) {
  const primaryColor = theme?.primaryColor;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr style={{ backgroundColor: primaryColor || '#111827' }}>
                <th className="px-6 py-4 text-left font-medium text-white">特性</th>
                {headers.map((h, i) => (
                  <th key={i} className="px-6 py-4 text-center font-medium text-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 font-medium text-gray-700">{row.feature}</td>
                  {row.values.map((v, j) => (
                    <td key={j} className="px-6 py-4 text-center text-gray-600">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
