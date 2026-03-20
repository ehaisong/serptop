import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SiteForge Site',
  description: 'Built with SiteForge AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
