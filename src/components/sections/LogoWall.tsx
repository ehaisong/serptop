interface LogoWallProps {
  title?: string;
  logos?: Array<{ name: string; src?: string; href?: string }>;
}

export default function LogoWall({ title, logos = [] }: LogoWallProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {title && <p className="text-center text-sm text-gray-500 mb-8">{title}</p>}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {logos.map((logo) => {
            const content = logo.src ? (
              <img src={logo.src} alt={logo.name} className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" />
            ) : (
              <span className="inline-flex items-center h-8 md:h-10 px-4 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors tracking-wide">
                {logo.name}
              </span>
            );
            return logo.href ? (
              <a key={logo.name} href={logo.href} target="_blank" rel="noopener noreferrer">{content}</a>
            ) : (
              <div key={logo.name}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}