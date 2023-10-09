'use client';

import { NextUIProvider } from '@nextui-org/react';
import clsx from 'clsx';

import '../styles/globals.css';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          <div
            className={clsx(inter.className, 'flex w-screen justify-center')}
          >
            <div className="w-full max-w-6xl bg-red-100">{children}</div>
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}
