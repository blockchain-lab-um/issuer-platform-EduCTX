import React from 'react';
import Image from 'next/image';

export const Logo = () => (
  <div className="flex items-center gap-x-2">
    <Image
      src="/interop-testing-frontend/images/EDU-Coin.png"
      alt="Logo"
      width={64}
      height={64}
    />
    <div>
      <span className="text-3xl font-bold text-gray-700">EduCTX</span>
      <span className="text-xl font-bold text-green-500">2.0</span>
    </div>
  </div>
);
