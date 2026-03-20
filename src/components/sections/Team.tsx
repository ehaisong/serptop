interface ThemeProps {
  primaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
}

interface TeamMember {
  name: string;
  role?: string;
  avatar?: string;
  bio?: string;
  socials?: Array<{ platform: string; href: string }>;
}

interface TeamProps {
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
  columns?: 2 | 3 | 4;
  backgroundColor?: string;
  theme?: ThemeProps;
}

export default function Team({ title, subtitle, members = [], columns = 3, backgroundColor, theme }: TeamProps) {
  const gridCols = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

  return (
    <section className="py-20" style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-7xl mx-auto px-6">
        {title && <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: theme?.fontHeading }}>{title}</h2>}
        {subtitle && <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto" style={{ fontFamily: theme?.fontBody }}>{subtitle}</p>}
        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {members.map((member, i) => (
            <div key={i} className="text-center group">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: theme?.primaryColor || '#6b7280' }}>
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold" style={{ fontFamily: theme?.fontHeading }}>{member.name}</h3>
              {member.role && <p className="text-sm mt-1" style={{ color: theme?.primaryColor || '#6b7280', fontFamily: theme?.fontBody }}>{member.role}</p>}
              {member.bio && <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto" style={{ fontFamily: theme?.fontBody }}>{member.bio}</p>}
              {member.socials && member.socials.length > 0 && (
                <div className="flex justify-center gap-3 mt-3">
                  {member.socials.map((s) => (
                    <a key={s.platform} href={s.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">
                      {s.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
