import './globals.css';
import { inter } from './fonts';
import { ReactNode } from 'react';

export const metadata = {
  title: 'JustBump',
  description: 'JustBump — Next.js app (TypeScript)',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} style={{ backgroundColor: 'white' }}>
      <body className="bg-white" style={{ backgroundColor: 'white' }}>{children}</body>
    </html>
  );
}
