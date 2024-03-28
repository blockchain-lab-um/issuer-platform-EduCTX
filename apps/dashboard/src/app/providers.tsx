'use client';

import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';

import ToastWrapper from '../components/ToastWrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath={`${process.env.NEXT_PUBLIC_BASE_PATH}/api/auth`}>
      <NextUIProvider>{children}</NextUIProvider>
      <ToastWrapper />
    </SessionProvider>
  );
}
