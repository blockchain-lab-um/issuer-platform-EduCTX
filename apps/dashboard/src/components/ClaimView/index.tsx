'use client';

import { useAuthRequestStatus } from '@/hooks';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useGetAllCoupons } from '@/hooks/getAllCoupons';

export const ClaimView = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [authRequestId, setAuthRequestId] = useState<string>('');
  const [step, setStep] = useState<number>(0);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const { data: authRequestStatus, isLoading } = useAuthRequestStatus(
    authRequestId,
    isDisabled,
  );

  const { data: coupons, isLoading: isLoadingCoupons } = useGetAllCoupons();

  const handleClaim = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/${selectedOption}`,
      );

      const data = await response.json();

      setAuthRequestId(data.authRequestId);
      setQrCode(data.location);
    } catch (error) {
      console.error(error);
    }
  };

  const reset = useCallback(() => {
    setAuthRequestId('');
    setQrCode('');
    setIsDisabled(true);
    setStep(0);
  }, []);

  useEffect(() => {
    if (
      authRequestStatus?.status === 'Success' ||
      authRequestStatus?.status === 'Failed'
    ) {
      setIsDisabled(true);
    }
  }, [authRequestStatus]);

  return (
    <div className="h-full w-full flex flex-col items-center">
      <div>
        {isLoadingCoupons && <div>Loading...</div>}
        {!isLoadingCoupons && coupons && (
          <div className="w-full max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
            <h2 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">
              <span className="block font-bold">
                Select what you want to claim
              </span>
            </h2>
            <div className="mt-8 flex gap-x-4 justify-center items-center">
              <Select
                className="max-w-xs"
                label="Select an option"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                {coupons.map((coupon) => (
                  <SelectItem key={coupon.id}>{coupon.name}</SelectItem>
                ))}
              </Select>
              <div className="flex gap-x-2">
                <Button
                  disabled={selectedOption === '' || !!authRequestId}
                  color="default"
                  variant="flat"
                  onClick={handleClaim}
                >
                  Claim
                </Button>
                <Button color="default" variant="bordered" onClick={reset}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
        {qrCode && step === 0 && (
          <div className="flex flex-col items-center justify-center gap-4">
            <div>Scan QR Code to authenticate</div>
            <div className="w-[512] h-[512] bg-red-400">
              <QRCodeCanvas value={qrCode} size={512} />
            </div>
            <div>
              <Button
                onClick={() => {
                  setStep(1);
                  setIsDisabled(false);
                }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center gap-4">
            {isLoading ||
              (authRequestStatus?.status === 'Pending' && (
                <div className="flex flex-col items-center justify-center gap-4">
                  <div>Authenticating...</div>
                </div>
              ))}
            {authRequestStatus?.status === 'Success' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <div>Authentication successful</div>
                <div>{authRequestStatus?.data.coupon}</div>
              </div>
            )}
            {authRequestStatus?.status === 'Failed' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <div>Authentication failed</div>
                <div>{authRequestStatus?.error}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
