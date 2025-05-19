import React from 'react';
import Image from 'next/image';

export const Logo = () => (
  <div className="flex flex-col items-center gap-y-4">
    <Image src="/images/etf-unsa-logo.png" alt="Logo" width={64} height={64} />
    <div>
      <span className="text-lg font-bold text-gray-700">
        Elektrotehnički fakultet Univerziteta u Sarajevu
      </span>
    </div>
  </div>
);
