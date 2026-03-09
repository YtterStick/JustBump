import { Inter, Roboto, Outfit, Playfair_Display } from 'next/font/google';

export const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

export const roboto = Roboto({ 
  weight: ['400', '700', '900'], 
  subsets: ['latin'], 
  variable: '--font-roboto', 
  preload: false,
  display: 'swap',
});

export const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-outfit', 
  preload: false,
  display: 'swap',
});

export const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair', 
  preload: false,
  display: 'swap',
});
