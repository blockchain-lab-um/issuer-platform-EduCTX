import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import { signIn, useSession } from 'next-auth/react';

import { MascaDescription } from './MascaDescription';
import ConnectButton from './MetaMaskConnectButton';

export const LoginView = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userType, setUserType] = useState<number>(0);

  useEffect(() => {
    if (session) {
      router.push('/issue');
    }
  }, [session]);

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-50">
      <div className="flex h-screen w-screen items-center justify-center text-gray-900">
        <div className="min-h-3/5 mx-auto flex w-8/12 max-w-7xl overflow-hidden rounded-xl border-2 border-gray-300 bg-white shadow-lg">
          {userType === 0 && (
            <div className="w-full">
              <div className="flex h-min w-full items-center justify-between p-2">
                <div>
                  <Image
                    src={'/images/EDU-Coin.png'}
                    alt="Logo"
                    width={64}
                    height={64}
                  />
                </div>
                <div>
                  <Image
                    src={'/images/blockchain-lab.svg'}
                    alt="Logo"
                    width={64}
                    height={64}
                  />
                </div>
              </div>
              <div className="m-32 mx-24 flex">
                <div>
                  <div>
                    <span className="text-xl font-bold text-gray-700 md:text-5xl">
                      EduCTX
                    </span>
                    <span className="text-md font-bold text-green-500 md:text-3xl">
                      2.0
                    </span>
                  </div>
                  <div className="text-md mt-4 font-medium text-gray-600 md:text-xl">
                    A robust and decentralized tool for managing digital
                    documents (e.g., micro-credentials) in the form of
                    Verifiable Credentials
                  </div>
                  <div className="mt-4 flex gap-x-2">
                    <Button
                      className="font-medium text-white"
                      color="success"
                      onClick={() => setUserType(2)}
                    >
                      User Login
                    </Button>
                    <Button
                      className="font-medium"
                      color="success"
                      variant="bordered"
                      onClick={() => setUserType(1)}
                    >
                      Administrator Login
                    </Button>
                  </div>
                </div>
                <div>
                  <Image
                    src={'/images/hero.svg'}
                    alt="Logo"
                    width={361}
                    height={306}
                  />
                </div>
              </div>
            </div>
          )}
          {userType === 1 && (
            <div className="flex h-full w-full items-center justify-center py-16">
              <div>
                For the purpose of login we will redirect you to your Corporate
                Digital Identity Provider
                <div className="mt-4 flex justify-center gap-x-2">
                  <Button
                    size="md"
                    variant="flat"
                    onClick={() => setUserType(0)}
                  >
                    Back
                  </Button>
                  <Button
                    size="md"
                    color="success"
                    variant="flat"
                    onClick={() =>
                      signIn(undefined, {
                        callbackUrl: '/issue',
                      })
                    }
                  >
                    Login
                  </Button>
                </div>
              </div>
            </div>
          )}

          {userType === 2 && (
            <div className="h-full w-full p-4">
              <div className="">
                <Button size="sm" variant="flat" onClick={() => setUserType(0)}>
                  Back
                </Button>
              </div>
              <div className="flex items-center justify-evenly max-md:flex-col-reverse">
                <div className="">
                  <ConnectButton />
                </div>
                <div className="">
                  <MascaDescription />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
