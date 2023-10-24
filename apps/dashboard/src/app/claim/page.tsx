'use client';

import Link from 'next/link';

import { ClaimView } from '@/components/ClaimView';
import { useGeneralStore } from '@/stores';

export default function Page() {
  const { isConnected } = useGeneralStore((state) => ({
    isConnected: state.isConnected,
  }));

  return (
    <div className="">
      {!isConnected && (
        <div>
          <Link href="/">Connect MetaMask to continue </Link>
        </div>
      )}
      {isConnected && <ClaimView />}
    </div>
  );
}
