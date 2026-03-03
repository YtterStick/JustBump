import './globals.css';
import { Inter, Roboto, Outfit, Playfair_Display } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ weight: ['400', '700', '900'], subsets: ['latin'], variable: '--font-roboto' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'JustBump',
  description: 'JustBump — Next.js app (TypeScript)',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${outfit.variable} ${playfair.variable}`} style={{ backgroundColor: 'white' }}>
      <body className={`${inter.className} bg-white`} style={{ backgroundColor: 'white' }}>{children}</body>
    </html>
  );
}
