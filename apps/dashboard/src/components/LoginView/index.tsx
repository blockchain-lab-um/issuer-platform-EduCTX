import React, { useState } from 'react';
// import { Button } from '@nextui-org/react';
import { Button } from '@nextui-org/react';

import { useGeneralStore } from '@/stores';
import { MascaDescription } from './MascaDescription';
import ConnectButton from './MetaMaskConnectButton';

export const LoginView = () => {
  const [userType, setUserType] = useState<number>(0);
  const { hasMM } = useGeneralStore((state) => ({
    hasMM: state.hasMetaMask,
  }));

  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center"
      style={{
        backgroundImage: 'linear-gradient(115deg, #9F7AEA, #FEE2FE)',
      }}
    >
      <div className="flex h-screen w-screen items-center justify-center text-gray-900">
        <div className="mx-auto flex h-3/5 w-8/12 max-w-7xl overflow-hidden rounded-xl bg-white shadow-lg">
          {userType === 0 && (
            <>
              <div className="flex w-1/3 flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <h2 className="text-xl font-medium">Login for Providers</h2>
                  <Button
                    className="mt-4"
                    color="secondary"
                    onClick={() => setUserType(1)}
                  >
                    Course Provider Login
                  </Button>
                </div>
                <div className="mt-16 flex flex-col items-center justify-center">
                  <h2 className="text-xl font-medium">
                    Login for Participants
                  </h2>
                  <Button
                    color="primary"
                    className="mt-4"
                    onClick={() => setUserType(2)}
                  >
                    Course Participant Login
                  </Button>
                </div>
              </div>
              <div className="relative w-2/3">
                <div
                  className={`absolute flex h-full w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white`}
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80")',
                  }}
                >
                  <div className=" w-2/3 rounded-xl bg-gray-500/50 p-4 backdrop-blur-xl">
                    <h2 className="text-center text-3xl font-bold">
                      Welcome to EduCTX Issuer!
                    </h2>
                    <p className="mt-4 text-center">
                      This is a demo application for the EduCTX Issuer. If
                      you&apos;re a Professor or an Administrator, please login
                      using the Course Provider Login. If you&apos;re a Student,
                      please login using the Course Participant Login.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          {userType === 1 && (
            <div>
              <h2>Finish on other page...</h2>
              <button onClick={() => setUserType(0)}>Back</button>
            </div>
          )}

          {userType === 2 && (
            <div className="flex h-full w-full">
              <div className="flex h-full w-1/3 flex-col justify-between p-4 ">
                <div className="">
                  <Button
                    size="sm"
                    variant="bordered"
                    onClick={() => setUserType(0)}
                  >
                    Back
                  </Button>
                </div>
                <ConnectButton />
                <div></div>
              </div>
              <div className="w-2/3 bg-purple-100/50">
                <MascaDescription />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
