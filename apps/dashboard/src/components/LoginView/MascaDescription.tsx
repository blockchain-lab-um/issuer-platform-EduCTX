import React from 'react';
import Image from 'next/image';
import {
  CreditCardIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid';

const MascaLogo = () => (
  <div className="relative h-[24px] w-[28px] sm:h-[36px] sm:w-[40px] lg:h-[46px] lg:w-[50px] xl:h-[48px] xl:w-[54px]">
    <Image
      className="dark:hidden"
      src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/masca_black.png`}
      alt="Masca Logo"
      fill={true}
    />
    <Image
      className="hidden dark:block"
      src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/masca_black.png`}
      alt="Masca Logo"
      fill={true}
      sizes="(max-width: 640px) 28px, (max-width: 768px) 36px, (max-width: 1024px) 46px, (max-width: 1280px) 48px, 54px"
    />
  </div>
);

export const MascaDescription = () => (
  <div>
    <div className="flex flex-col items-center p-12">
      <div className=" text-lg text-gray-900">
        EduCTX requires MetaMask with plugin Masca installed to work
      </div>
      <div className="mt-8 min-w-[10em] rounded-3xl border-2 border-gray-300 px-12 py-8 lg:min-w-[30em]">
        <div className="flex items-center gap-x-6">
          <div className="hidden sm:block">
            <MascaLogo />
          </div>
          <div>
            <div className=" text-xl font-bold">Masca</div>
            <div className="mt-2 text-lg">
              Manage Decentralized Identity in MetaMask
            </div>
          </div>
        </div>
        <hr className="mt-4" />
        <div className="flex justify-start">
          <ul className="flex flex-col items-start text-xl tracking-normal">
            <li className="mt-12">
              <div className=" flex items-center gap-x-4">
                <LockClosedIcon className="h-8 w-8 text-green-500" />
                <div className="text-lg font-medium text-gray-900 ">
                  Own your Identity
                </div>
              </div>
            </li>
            <li className="mt-12">
              <div className=" flex items-center gap-x-4">
                <CreditCardIcon className="h-8 w-8 text-green-500" />
                <div className="text-lg font-medium text-gray-900 ">
                  Manage Credentials securely
                </div>
              </div>
            </li>
            <li className="mt-12">
              <div className=" flex items-center gap-x-4">
                <GlobeAltIcon className="h-8 w-8 text-green-500" />
                <div className=" text-start text-lg font-medium text-gray-900 ">
                  Universal Compatibility with Identity Flows
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);
