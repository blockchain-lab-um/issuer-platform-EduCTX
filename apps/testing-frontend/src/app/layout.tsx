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
      <body className={clsx(inter.className, 'h-full w-full bg-gray-50')}>
        <Providers>
          <main className="flex h-full w-full items-center justify-center">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
