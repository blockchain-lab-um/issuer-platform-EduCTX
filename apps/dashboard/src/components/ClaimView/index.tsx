'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';

import { useGeneralStore, useMascaStore } from '@/stores';

const CREDENTIALS = ['MatLabUserScore', 'SuperCoolKidDiploma'];

export const ClaimView = () => {
  const router = useRouter();
  const { currDID } = useMascaStore((state) => ({
    currDID: state.currDID,
  }));

  const { changeIsConnected } = useGeneralStore((state) => ({
    changeIsConnected: state.changeIsConnected,
  }));

  return (
    <div>
      ClaimView
      <button
        onClick={() => {
          changeIsConnected(false);
          router.push('/');
        }}
      >
        Connected: {currDID}
      </button>
      <div className="flex justify-center pt-16">
        <button>Check for New Credentials</button>
      </div>
      <div>
        Credentials
        <button>Mark claimed credentials</button>
        <ul>
          {CREDENTIALS.map((credential) => (
            <li key={credential}>
              {credential} <Button color="primary">Claim</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
