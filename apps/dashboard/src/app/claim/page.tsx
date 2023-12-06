'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { ClaimView } from '@/components/ClaimView';
import { useGeneralStore } from '@/stores';

export default function Page() {
  const router = useRouter();
  const { isConnected } = useGeneralStore((state) => ({
    isConnected: state.isConnected,
  }));

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  return (
    <div className="">
      <ClaimView />
    </div>
  );
}
