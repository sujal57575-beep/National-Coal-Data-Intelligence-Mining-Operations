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
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-sky-100 selection:text-sky-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
