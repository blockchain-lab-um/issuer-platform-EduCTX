import clsx from 'clsx';

import '../styles/globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduCTX Testing Frontend',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head />
      <body
        className={clsx(
          inter.className,
          'h-full w-full p-8 bg-gray-50 overflow-auto',
        )}
      >
        <Providers>
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
