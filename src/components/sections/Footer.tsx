interface ThemeProps {
  primaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
}

interface FooterProps {
  logo?: { text?: string; src?: string };
  columns?: Array<{ title: string; links: Array<{ label: string; href: string }> }>;
  copyright?: string;
  socials?: Array<{ platform: string; href: string }>;
  theme?: ThemeProps;
}

export default function Footer({ logo, columns = [], copyright, socials = [], theme }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {logo?.src && <img src={logo.src} alt={logo?.text || ''} className="h-8" />}
              {logo?.text && <h3 className="text-xl font-bold" style={{ fontFamily: theme?.fontHeading }}>{logo.text}</h3>}
            </div>
            {socials.length > 0 && (
              <div className="flex gap-3 mt-4">
                {socials.map((s) => (
                  <a key={s.platform} href={s.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
          {columns.map((col, i) => (
            <div key={i}>
              <h4 className="font-semibold mb-4 text-sm" style={{ fontFamily: theme?.fontHeading }}>{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm" style={{ fontFamily: theme?.fontBody }}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {copyright && <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm" style={{ fontFamily: theme?.fontBody }}>{copyright}</div>}
      </div>
    </footer>
  );
}
