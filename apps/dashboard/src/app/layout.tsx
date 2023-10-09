import clsx from 'clsx';

import { Providers } from './providers';

import '../styles/globals.css';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          {
            <div
              className={clsx(inter.className, 'flex w-screen justify-center')}
            >
              <div className="w-full max-w-6xl bg-red-900">{children}</div>
            </div>
          }
        </Providers>
      </body>
    </html>
  );
}
