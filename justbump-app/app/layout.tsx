import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'JustBump',
  description: 'JustBump — Next.js app (TypeScript)'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
          <strong>JustBump</strong>
        </header>
        <main style={{ padding: '1.5rem' }}>{children}</main>
      </body>
    </html>
  );
}
