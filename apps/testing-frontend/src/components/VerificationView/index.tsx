'use client';

import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuthRequestStatus } from '@/hooks';
import { useGetVerificationDefinitions } from '@/hooks/useGetVerificationDefinitions';
import { decodeJwt } from 'jose';
import { useModalStore } from '@/stores';
import { JsonModal } from './JsonModal';
export const VerificationView = () => {
  const isCredentialModalOpen = useModalStore.use.isCredentialModalOpen();
  const setIsCredentialModalOpen = useModalStore.use.setIsCredentialModalOpen();
  const isPresentationModalOpen = useModalStore.use.isPresentationModalOpen();
  const setIsPresentationModalOpen =
    useModalStore.use.setIsPresentationModalOpen();

  const [verificationRequest, setVerificationRequest] = useState('');
  const [verificationRequestId, setVerificationRequestId] = useState('');
  const [disabled, setIsDisabled] = useState(true);
  const [
    selectedVerificationDefinitionId,
    setSelectedVerificationDefinitionId,
  ] = useState('');

  const [verifiablePresentation, setVerifiablePresentation] =
    useState<any>(null);
  const [verifiableCredentials, setVerifiableCredentials] = useState<any[]>([]);

  const {
    data: verificationDefinitions,
    isLoading: isLoadingVerificationDefinitions,
  } = useGetVerificationDefinitions();

  const { data: authRequestStatus } = useAuthRequestStatus(
    verificationRequestId,
    disabled,
  );

  const getVerificationRequest = async () => {
    try {
      setIsDisabled(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/interop-test?verificationDefinitionId=${selectedVerificationDefinitionId}`,
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

  useEffect(() => {
    if (authRequestStatus?.status === 'Success') {
      try {
        console.log(authRequestStatus.data);
        const decodedVp = decodeJwt(authRequestStatus.data) as any;
        console.log(decodedVp);
        setVerifiablePresentation(decodedVp);

        const vcs = Array.isArray(decodedVp.vp.verifiableCredential)
          ? decodedVp.vp.verifiableCredential
          : [decodedVp.vp.verifiableCredential];

        const decodedVcs = vcs.map((vc: any) => decodeJwt(vc));

        for (const vc of decodedVcs) {
          console.log(vc);
        }

        setVerifiableCredentials(decodedVcs);
      } catch (error) {
        console.error(error);
      }
    }
  }, [authRequestStatus]);

  return (
    <div className="h-full flex flex-col gap-y-8 items-center bg-gradient-to-tr from-blue-50 to-blue-50 p-4 rounded-xl w-full min-h-64">
      <div className=" w-full flex flex-col items-center gap-x-4">
        <div className="w-full flex items-center justify-center gap-x-4">
          <Button
            className="disabled:cursor-not-allowed"
            color="default"
            variant="bordered"
            onClick={getVerificationRequest}
          >
            {!verificationRequest ? 'Start' : 'Refresh'}
          </Button>
          <Select
            className="max-w-xs"
            label={
              isLoadingVerificationDefinitions
                ? 'Loading...'
                : 'Select an option'
            }
            disabled={!verificationDefinitions}
            value={selectedVerificationDefinitionId}
            onChange={(e) =>
              setSelectedVerificationDefinitionId(e.target.value)
            }
          >
            {(verificationDefinitions ?? []).map((verificationDefinition) => (
              <SelectItem key={verificationDefinition.id}>
                {verificationDefinition.name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      {verificationRequest && disabled && (
        <div className="w-full flex justify-center items-center">
          <Button onClick={() => setIsDisabled(false)}>Check status</Button>
        </div>
      )}
      <div className="flex flex-col justify-center items-center">
        {authRequestStatus?.status === 'Pending' && <div>Loading...</div>}
        {authRequestStatus?.status === 'Success' && (
          <div className="flex flex-col justify-center items-center text-blue-600">
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
            <div className="flex flex-row gap-x-4 mt-4">
              <Button onClick={() => setIsPresentationModalOpen(true)}>
                View Presentation
              </Button>
              <Button onClick={() => setIsCredentialModalOpen(true)}>
                View Credentials
              </Button>
            </div>
          </div>
        )}
        {authRequestStatus?.status === 'Failed' && (
          <div className="text-red-600">Verification failed. Error: </div>
        )}
        {authRequestStatus?.status === 'Failed' && authRequestStatus?.error && (
          <div className="max-w-xs max-h-32 overflow-y-auto">
            {JSON.stringify(authRequestStatus?.error, null, 2)}
          </div>
        )}
      </div>
      {verificationRequest && disabled && (
        <div className="flex justify-center items-center gap-x-4">
          <QRCodeCanvas value={verificationRequest} size={192} />
        </div>
      )}
      <JsonModal
        isOpen={isPresentationModalOpen}
        setIsOpen={setIsPresentationModalOpen}
        title="Verifiable Presentation"
        data={verifiablePresentation}
      />
      <JsonModal
        isOpen={isCredentialModalOpen}
        setIsOpen={setIsCredentialModalOpen}
        title="Verifiable Credentials"
        data={verifiableCredentials}
      />
    </div>
  );
};
