'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import { useSession } from 'next-auth/react';

import { IssueView } from '@/components/IssueView';

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <div className="">
      {session && <IssueView />}
      {!session && (
        <div>
          Login to continue
          <Button
            variant="bordered"
            size="sm"
            onClick={() => {
              router.push('/');
            }}
          >
            Login
          </Button>
        </div>
      )}
    </div>
  );
}
