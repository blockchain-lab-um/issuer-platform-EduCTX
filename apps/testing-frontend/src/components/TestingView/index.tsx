'use client';

import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuthRequestStatus } from '@/hooks';

export const TestingView = () => {
  const [credentialOfferInTime, setCredentialOfferInTime] = useState('');
  const [credentialOfferDeffered, setCredentialOfferDeffered] = useState('');
  const [credentialOfferPreAuth, setCredentialOfferPreAuth] = useState('');
  const [credentialOfferPreAuthPin, setCredentialOfferPreAuthPin] =
    useState('');
  const [verificationRequest, setVerificationRequest] = useState('');
  const [verificationRequestId, setVerificationRequestId] = useState('');
  const [disabled, setIsDisabled] = useState(true);
  const { data: authRequestStatus, isLoading } = useAuthRequestStatus(
    verificationRequestId,
    disabled,
  );

  const getCredentialOfferInTime = async () => {
    try {
      const response = await fetch(
        '/api/credential-offer?credentialType=InTimeIssuance',
      );

      if (!response.ok) {
        console.error(`Error fetching credential offer: ${response.status}`);
        console.error(await response.text());
        return;
      }

      const { location } = await response.json();

      setCredentialOfferInTime(location);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const getCredentialOfferDeffered = async () => {
    try {
      const response = await fetch(
        '/api/credential-offer?credentialType=DefferedIssuance',
      );

      if (!response.ok) {
        console.error(`Error fetching credential offer: ${response.status}`);
        console.error(await response.text());
        return;
      }

      const { location } = await response.json();
      console.log(location);
      setCredentialOfferDeffered(location);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const getCredentialOfferPreAuth = async () => {
    try {
      const response = await fetch(
        '/api/credential-offer?credentialType=PreAuthIssuance',
      );

      if (!response.ok) {
        console.error(`Error fetching credential offer: ${response.status}`);
        console.error(await response.text());
        return;
      }

      const { location, pin } = await response.json();

      setCredentialOfferPreAuth(location);
      setCredentialOfferPreAuthPin(pin);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const getVerificationRequest = async () => {
    try {
      setIsDisabled(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/interop-test`,
      );

      if (!response.ok) {
        console.error(
          `Error fetching verification request: ${response.status}`,
        );
        console.error(await response.text());
        return;
      }

      const { location, authRequestId } = await response.json();
      setVerificationRequest(location);
      setVerificationRequestId(authRequestId);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <div className="flex flex-col gap-y-8 w-full justify-center items-center">
      <div className="flex justify-between items-center bg-gradient-to-tr from-blue-50 to-green-50 p-4 rounded-xl w-full min-h-64">
        <div className="flex flex-col items-center gap-y-2">
          <div className="font-bold text-lg">In Time flow</div>
          <Button
            color="default"
            variant="bordered"
            onClick={async () => await getCredentialOfferInTime()}
          >
            {!credentialOfferInTime ? 'Start' : 'Refresh'}
          </Button>
        </div>
        <div className="flex justify-center items-center gap-x-4">
          {credentialOfferInTime && (
            <QRCodeCanvas value={credentialOfferInTime} size={192} />
          )}
        </div>
      </div>
      <div className="flex justify-between items-center bg-gradient-to-tr from-blue-50 to-green-50 p-4 rounded-xl w-full min-h-64">
        <div className="flex flex-col items-center gap-y-2">
          <div className="font-bold text-lg">Deffered flow</div>
          <div>
            <Button
              color="default"
              variant="bordered"
              onClick={getCredentialOfferDeffered}
            >
              {!credentialOfferDeffered ? 'Start' : 'Refresh'}
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center gap-x-4">
          {credentialOfferDeffered && (
            <QRCodeCanvas value={credentialOfferDeffered} size={192} />
          )}
        </div>
      </div>
      <div className="flex justify-between items-center bg-gradient-to-tr from-blue-50 to-green-50 p-4 rounded-xl w-full min-h-64">
        <div className="flex flex-col items-center gap-y-2">
          <div className="font-bold text-lg">Pre-auth flow</div>
          <div>
            <Button
              color="default"
              variant="bordered"
              onClick={getCredentialOfferPreAuth}
            >
              {!credentialOfferPreAuth ? 'Start' : 'Refresh'}
            </Button>
          </div>
        </div>
        {credentialOfferPreAuthPin && (
          <div>PIN: {credentialOfferPreAuthPin}</div>
        )}
        <div className="flex justify-center items-center gap-x-4">
          {credentialOfferPreAuth && (
            <QRCodeCanvas value={credentialOfferPreAuth} size={192} />
          )}
        </div>
      </div>
      <div className="flex justify-between items-center bg-gradient-to-tr from-blue-50 to-green-50 p-4 rounded-xl w-full min-h-64">
        <div className="flex flex-col items-center gap-y-2">
          <div className="font-bold text-lg">Verification flow</div>
          <div>
            <Button
              color="default"
              variant="bordered"
              onClick={getVerificationRequest}
            >
              {!verificationRequest ? 'Start' : 'Refresh'}
            </Button>
          </div>
        </div>
        {!false && (
          <div className="flex flex-col justify-center items-center">
            {isLoading && <div>Loading...</div>}
            {<div>Success</div>}
            {authRequestStatus?.status === 'Failed' && <div>Failed</div>}
            {authRequestStatus?.status === 'Failed' &&
              authRequestStatus?.error && (
                <div className="max-w-xs max-h-32 overflow-y-auto">
                  {JSON.stringify(authRequestStatus?.error, null, 2)}
                </div>
              )}
          </div>
        )}
        {verificationRequest && disabled && (
          <div className="flex justify-center items-center gap-x-4">
            <QRCodeCanvas value={verificationRequest} size={192} />
          </div>
        )}
      </div>
    </div>
  );
};
