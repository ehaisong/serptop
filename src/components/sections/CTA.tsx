interface ThemeProps {
  primaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
}

interface CTAProps {
  headline?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  backgroundGradient?: string;
  theme?: ThemeProps;
}

export default function CTA({ headline, description, buttonLabel, buttonHref, backgroundGradient, theme }: CTAProps) {
  const primaryColor = theme?.primaryColor;
  const hasBg = !!backgroundGradient;

  return (
    <section className="py-20" style={backgroundGradient ? { background: backgroundGradient } : undefined}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        {headline && <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${hasBg ? 'text-white' : ''}`} style={{ fontFamily: theme?.fontHeading }}>{headline}</h2>}
        {description && <p className={`text-lg mb-8 ${hasBg ? 'text-white/80' : 'text-gray-600'}`} style={{ fontFamily: theme?.fontBody }}>{description}</p>}
        {buttonLabel && (
          <a
            href={buttonHref || '#'}
            className={`inline-block px-8 py-3 rounded-lg font-medium transition-colors ${hasBg ? 'bg-white text-gray-900 hover:bg-gray-100' : 'text-white hover:opacity-90'}`}
            style={!hasBg ? { backgroundColor: primaryColor || '#000' } : undefined}
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </section>
  );
}
