'use client';

import { useState } from 'react';

interface ThemeProps {
  primaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
}

interface NavbarProps {
  logo?: { text?: string; src?: string };
  links?: Array<{ label: string; href: string }>;
  cta?: { label: string; href: string };
  theme?: ThemeProps;
}

export default function Navbar({ logo, links = [], cta, theme }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const primaryColor = theme?.primaryColor;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {logo?.src && <img src={logo.src} alt={logo.text || ''} className="h-8" />}
          {logo?.text && <span className="text-xl font-bold" style={{ fontFamily: theme?.fontHeading }}>{logo.text}</span>}
        </div>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors" style={{ fontFamily: theme?.fontBody }}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {cta && (
            <a href={cta.href} className="hidden md:inline-block px-4 py-2 text-white text-sm rounded-lg hover:opacity-90 transition-colors" style={{ backgroundColor: primaryColor || '#000', fontFamily: theme?.fontBody }}>
              {cta.label}
            </a>
          )}
          <button className="md:hidden p-2 text-gray-600 hover:text-gray-900" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-6 py-4 space-y-3">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="block text-sm text-gray-600 hover:text-gray-900 transition-colors" onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            ))}
            {cta && (
              <a href={cta.href} className="block text-center px-4 py-2 text-white text-sm rounded-lg hover:opacity-90 transition-colors mt-2" style={{ backgroundColor: primaryColor || '#000' }} onClick={() => setMobileOpen(false)}>
                {cta.label}
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
