import clsx from 'clsx';

import '../styles/globals.css';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from './providers';
import NextAuthProvider from '@/components/NextAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduCTX Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head />
      <body className={clsx(inter.className, 'w-screen')}>
      <NextAuthProvider><Providers>
          <div>{children}</div>
        </Providers>
        </NextAuthProvider>
      </body>
    </html>
  );
}
