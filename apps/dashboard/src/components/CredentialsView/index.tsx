'use client';

import { useModalStore } from '@/stores/modalStore';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { CredentialModal } from './CredentialModal';

export const CredentialsView = ({
  credentials,
}: {
  credentials: any[];
}) => {
  const { refresh } = useRouter();

  const setIsCredentialModalOpen = useModalStore.use.setIsCredentialModalOpen();
  const setSelectedCredential = useModalStore.use.setSelectedCredential();

  const handleRevoke = async (id: string) => {
    try {
      const response = await fetch(`/api/revoke-credential/${id}`, {
        method: 'POST',
        headers: {
          'x-api-key': process.env.API_KEY || '',
        },
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-full max-w-[1920px] mx-auto h-full flex flex-col p-8">
        <div className="bg-green-500 text-white py-4 px-6 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">Issued Credentials</h1>
        </div>
        <div className="flex-grow overflow-auto bg-white shadow-md rounded-b-lg">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-4 px-6 text-left">ID</th>
                <th className="py-4 px-6 text-left">Types</th>
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-left">Issued At</th>
                <th className="py-4 px-6 text-left">Claimed At</th>
                <th className="py-4 px-6 text-left">Subject</th>
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {credentials.map(
                (
                  { email, types, issuedAt, claimedAt, credential, isRevoked },
                  index,
                ) => (
                  <tr
                    key={index}
                    className={clsx(
                      'border-b border-gray-100 transition-colors',
                      isRevoked
                        ? 'bg-red-50 hover:bg-red-100'
                        : index % 2 === 0
                          ? 'bg-white hover:bg-gray-50'
                          : 'bg-gray-50 hover:bg-gray-100',
                    )}
                  >
                    <td className="py-4 px-6">
                      <div className="text-xs font-mono truncate max-w-[150px] md:max-w-[250px]">
                        {credential ? credential.vc.id : 'No ID'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                        {types.slice(1).join(', ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {email ?? 'No email'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {new Date(issuedAt).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {claimedAt
                          ? new Date(claimedAt).toLocaleString()
                          : 'Not claimed'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-gray-800">
                        {credentialSubject(credential)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                          onClick={() => {
                            setSelectedCredential(credential);
                            setIsCredentialModalOpen(true);
                          }}
                        >
                          View
                        </button>{' '}
                        {isRevoked ? (
                          <span className="px-4 py-2 bg-red-200 text-red-800 rounded-md">
                            Revoked
                          </span>
                        ) : (
                          <button
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                            type="button"
                            disabled={isRevoked || !credential}
                            onClick={() => handleRevoke(credential.vc.id)}
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
      <CredentialModal />
    </>
  );
};

const credentialSubject = (credential: any) => {
  if (!credential) {
    return 'No credential';
  }

  const credentialSubject = credential.vc.credentialSubject;

  if (credential.vc.type.includes('EducationCredential')) {
    return (
      <div>
        {credentialSubject.currentFamilyName}{' '}
        {credentialSubject.currentGivenName}
      </div>
    );
  }

  if (credential.vc.type.includes('CouponCredential')) {
    return (
      <div>
        {credentialSubject.couponId} {credentialSubject.couponName}
      </div>
    );
  }

  return JSON.stringify(credentialSubject);
};
