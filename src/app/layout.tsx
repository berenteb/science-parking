import './globals.css';

import type { Metadata } from 'next';
// eslint-disable-next-line camelcase
import { Hubot_Sans } from 'next/font/google';
import { PropsWithChildren } from 'react';

import { cn } from '@/utils/style.utils';

export const metadata: Metadata = {
  title: 'Science Parking',
  description: 'META-INF Science Park Parking',
};

const HubotSans = Hubot_Sans({
  subsets: ['latin'],
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en'>
      <body className={cn(HubotSans.className, 'antialiased')}>{children}</body>
    </html>
  );
}
