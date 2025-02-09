import './globals.css';

import type { Metadata } from 'next';
// eslint-disable-next-line camelcase
import { Jura } from 'next/font/google';
import { PropsWithChildren } from 'react';

import { cn } from '@/utils/style.utils';

export const metadata: Metadata = {
  title: 'Science Parking',
  description: 'META-INF Science Park Parking',
};

const JuraFont = Jura({
  subsets: ['latin'],
  weight: 'variable',
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en'>
      <body className={cn(JuraFont.className, 'antialiased')}>{children}</body>
    </html>
  );
}
