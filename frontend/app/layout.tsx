import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CMPDI / CIL AI Data Intelligence Platform | Ministry of Coal',
  description: 'Enterprise AI-Powered Geological, Mining & Production Data Intelligence and Automated Reporting Platform for CMPDI/CIL & Ministry of Coal, Govt. of India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Leaflet CSS fallback */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
