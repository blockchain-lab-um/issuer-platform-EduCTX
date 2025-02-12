'use client';

import { Button, Input } from '@nextui-org/react';
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
  const [did, setDid] = useState('');

  const getCredentialOfferInTime = async () => {
    try {
      const response = await fetch('/api/credential-offer', {
        method: 'POST',
        body: JSON.stringify({
          credentialType: 'InTimeIssuance',
          client_id: did,
        }),
      });

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
      const response = await fetch('/api/credential-offer', {
        method: 'POST',
        body: JSON.stringify({
          credentialType: 'DefferedIssuance',
          client_id: did,
        }),
      });

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
      const response = await fetch('/api/credential-offer', {
        method: 'POST',
        body: JSON.stringify({
          credentialType: 'PreAuthIssuance',
          client_id: did,
        }),
      });

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
      <div className="w-full mt-4">
        <label className="font-bold text-lg">DID</label>
        <Input
          color="default"
          variant="bordered"
          value={did}
          onChange={(e) => setDid(e.target.value)}
          fullWidth
        />
      </div>
      <div className="flex justify-between items-center bg-gradient-to-tr from-blue-50 to-green-50 p-4 rounded-xl w-full min-h-64">
        <div className="flex flex-col items-center gap-y-2">
          <div className="font-bold text-lg">In Time flow</div>
          <Button
            className="disabled:cursor-not-allowed"
            color="default"
            variant="bordered"
            onClick={async () => await getCredentialOfferInTime()}
            disabled={!did}
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
              className="disabled:cursor-not-allowed"
              color="default"
              variant="bordered"
              onClick={getCredentialOfferDeffered}
              disabled={!did}
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
              className="disabled:cursor-not-allowed"
              color="default"
              variant="bordered"
              onClick={getCredentialOfferPreAuth}
              disabled={!did}
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
              className="disabled:cursor-not-allowed"
              color="default"
              variant="bordered"
              onClick={getVerificationRequest}
              disabled={!did}
            >
              {!verificationRequest ? 'Start' : 'Refresh'}
            </Button>
          </div>
        </div>
        {verificationRequest && disabled && (
          <Button onClick={() => setIsDisabled(false)}>Check status</Button>
        )}
        {!false && (
          <div className="flex flex-col justify-center items-center">
            {authRequestStatus?.status === 'Pending' && <div>Loading...</div>}
            {authRequestStatus?.status === 'Success' && (
              <div className="flex flex-col justify-center items-center text-green-600">
                <div>Successfully presented credentials.</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <title>Checkmark</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
              </div>
            )}
            {authRequestStatus?.status === 'Failed' && (
              <div className="text-red-600">Verification failed. Error: </div>
            )}
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
