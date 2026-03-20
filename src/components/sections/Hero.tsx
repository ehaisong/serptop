'use client';
import { useState, useEffect, type CSSProperties } from "react";

interface ThemeProps {
  primaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
}

interface HeroProps {
  headline?: string;
  subheadline?: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  cta?: {
    primary?: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
  stats?: Array<{ value: string; label: string }>;
  theme?: ThemeProps;
}

function unwrapCloudinaryFetchUrl(url?: string): string | undefined {
  if (!url || !url.includes("/image/fetch/")) return url;
  const match = url.match(/\/image\/fetch\/[^/]+\/(.+)$/);
  if (!match?.[1]) return url;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return url;
  }
}

export default function Hero({ headline, subheadline, backgroundImage, backgroundGradient, cta, stats, theme }: HeroProps) {
  const resolvedBackgroundImage = unwrapCloudinaryFetchUrl(backgroundImage);
  const [imageLoaded, setImageLoaded] = useState(!resolvedBackgroundImage);

  useEffect(() => {
    if (!resolvedBackgroundImage) {
      setImageLoaded(true);
      return;
    }
    let active = true;
    setImageLoaded(false);
    const img = new Image();
    const finish = () => { if (active) setImageLoaded(true); };
    const timeout = window.setTimeout(finish, 3500);
    img.onload = finish;
    img.onerror = finish;
    img.src = resolvedBackgroundImage;
    if (img.complete) finish();
    return () => { active = false; window.clearTimeout(timeout); };
  }, [resolvedBackgroundImage]);

  const bgStyle: CSSProperties = {};
  if (resolvedBackgroundImage && imageLoaded) {
    bgStyle.backgroundImage = `url("${resolvedBackgroundImage}")`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = 'center';
  } else if (backgroundGradient) {
    bgStyle.background = backgroundGradient;
  }
  if (resolvedBackgroundImage && !imageLoaded) {
    bgStyle.background = "linear-gradient(135deg, hsl(220 20% 20%), hsl(220 30% 35%))";
  }

  const hasBgImage = !!resolvedBackgroundImage;
  const primaryColor = theme?.primaryColor;

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center" style={bgStyle}>
      {hasBgImage && imageLoaded && <div className="absolute inset-0 bg-black/40" />}
      {hasBgImage && !imageLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      )}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {headline && (
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 leading-tight ${hasBgImage ? 'text-white' : ''}`} style={{ fontFamily: theme?.fontHeading }}>
            {headline}
          </h1>
        )}
        {subheadline && (
          <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${hasBgImage ? 'text-white/80' : 'text-gray-600'}`} style={{ fontFamily: theme?.fontBody }}>
            {subheadline}
          </p>
        )}
        {cta && (
          <div className="flex items-center justify-center gap-4">
            {cta.primary && (
              <a href={cta.primary.href} className="px-8 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-colors" style={{ backgroundColor: primaryColor || '#000', fontFamily: theme?.fontBody }}>
                {cta.primary.label}
              </a>
            )}
            {cta.secondary && (
              <a href={cta.secondary.href} className={`px-8 py-3 border rounded-lg font-medium transition-colors ${hasBgImage ? 'border-white/60 text-white hover:bg-white/10' : 'border-gray-300 hover:bg-gray-50'}`} style={{ fontFamily: theme?.fontBody }}>
                {cta.secondary.label}
              </a>
            )}
          </div>
        )}
        {stats && stats.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className={`text-3xl md:text-4xl font-bold ${hasBgImage ? 'text-white' : ''}`}
                  style={{ ...((!hasBgImage && primaryColor) ? { color: primaryColor } : {}), fontVariantNumeric: 'tabular-nums', fontFamily: theme?.fontHeading }}
                >
                  {stat.value}
                </div>
                <div className={`text-sm mt-1 ${hasBgImage ? 'text-white/70' : 'text-gray-500'}`} style={{ fontFamily: theme?.fontBody }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
