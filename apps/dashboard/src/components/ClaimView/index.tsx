import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isError } from '@blockchain-lab-um/masca-connector';
import { CheckIcon } from '@heroicons/react/24/solid';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';

import { ISSUER_ENDPOINT } from '@/config/api';
import { useGeneralStore, useMascaStore } from '@/stores';

interface MappedCredentials {
  credential: any;
  claimed: boolean;
  created_at: string;
  id: string;
}

export const ClaimView = () => {
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(true);
  const [credentials, setCredentials] = useState<MappedCredentials[]>([]);
  const { currDID, api } = useMascaStore((state) => ({
    currDID: state.currDID,
    api: state.mascaApi,
  }));
  const [noCredentials, setNoCredentials] = useState(false);

  async function getProof(): Promise<string | undefined> {
    const url = `${ISSUER_ENDPOINT}/query/nonce/${currDID}`;
    const res = await fetch(url);

    const data = await res.json();

    const signedData = await api?.signData({
      type: 'JWT',
      data: {
        header: {
          typ: 'JWT',
        },
        payload: data,
      },
    });

    if (isError(signedData!)) {
      console.error('Error signing data');
      return;
    }

    const proof = signedData?.data;
    if (!proof) {
      console.error('No proof');
      return;
    }

    return proof;
  }

  const checkForCredentials = async () => {
    setNoCredentials(false);

    const claimUrl = `${ISSUER_ENDPOINT}/query/claim`;

    const proof = await getProof();
    if (!proof) {
      console.error('No proof');
      return;
    }

    const issuedCredentials = await fetch(claimUrl, {
      method: 'GET',
      headers: {
        'x-pop': proof,
      },
    });

    const credData = await issuedCredentials.json();

    if (credData.length === 0) {
      setNoCredentials(true);
      return;
    }

    const mappedCredentials: MappedCredentials[] = credData.map((obj: any) => ({
      credential: obj.credential,
      claimed: false,
      date: obj.created_at,
      id: obj.id,
    }));

    setCredentials(mappedCredentials);
    setIsSelected(false);
  };

  const requestDeletion = async (id: string) => {
    const proof = await getProof();
    if (!proof) {
      console.error('No proof');
      return;
    }
    console.log('Deleting...');
    const url = `${ISSUER_ENDPOINT}/query/${id}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'x-pop': proof,
        },
      });
      if (!response.ok) {
        console.log('Deletion failed');
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const deleteCredential = async (id: string) => {
    requestDeletion(id)
      .then(() => {
        const updatedCredentials = credentials.filter((obj2) => obj2.id !== id);
        setCredentials(updatedCredentials);
      })
      .catch(() => {});
  };

  const claimCredential = async (credential: any, id: string) => {
    const result = await api?.saveCredential(credential);

    if (isError(result!)) {
      console.error(result);
      if (result.error === 'Error: User rejected save credential request.') {
        console.log('User rejected save credential request.');
        deleteCredential(id).catch(() => {});
        return;
      }
      return;
    }

    const updatedCredentials = credentials.map((obj) => {
      if (obj.id === id) {
        return { ...obj, claimed: true };
      }
      return obj;
    });

    setCredentials(updatedCredentials);

    requestDeletion(id).catch(() => {});
  };

  const { changeIsConnected } = useGeneralStore((state) => ({
    changeIsConnected: state.changeIsConnected,
  }));

  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center"
      style={{
        backgroundImage: 'linear-gradient(115deg, #9F7AEA, #FEE2FE)',
      }}
    >
      <div className="w-3/4 max-w-7xl rounded-3xl bg-white p-4 text-gray-900">
        <div className="flex justify-between">
          <div>Connected with: {currDID}</div>
          <Button
            variant="bordered"
            onClick={() => {
              changeIsConnected(false);
              router.push('/');
            }}
            size="sm"
            className="text-gray-900"
          >
            Disconnect
          </Button>
        </div>
        <div className="flex w-full items-center justify-center  py-16">
          {isSelected && (
            <div className="flex flex-col items-center">
              <Button
                size="lg"
                color="primary"
                onClick={() => {
                  checkForCredentials()
                    .then(() => {})
                    .catch(() => {});
                }}
                className="font-medium"
              >
                Check for New Credentials
              </Button>
              {noCredentials && (
                <label className="mt-4 text-red-500">
                  No Credentials found...
                </label>
              )}
            </div>
          )}
          {!isSelected && (
            <div className="w-full">
              <div>
                <div className="flex justify-between">
                  <Button
                    variant="bordered"
                    size="sm"
                    color="secondary"
                    onClick={() => {
                      checkForCredentials()
                        .then(() => {})
                        .catch(() => {});
                    }}
                  >
                    Refresh credentials
                  </Button>
                </div>
                <Table
                  className="mt-8"
                  aria-label="Example static collection table"
                >
                  <TableHeader>
                    <TableColumn>TITLE</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>REJECT</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {credentials.map((obj) => (
                      <TableRow key={obj.id}>
                        <TableCell>
                          {Array.isArray(obj.credential.type)
                            ? obj.credential.type[
                                obj.credential.type.length - 1
                              ]
                            : obj.credential.type.toString()}
                        </TableCell>
                        <TableCell>Course Participant</TableCell>
                        <TableCell>
                          {obj.claimed ? (
                            <Button
                              color="success"
                              endContent={<CheckIcon className="h-4 w-4" />}
                              disabled
                            >
                              Claimed
                            </Button>
                          ) : (
                            <Button
                              color="primary"
                              onClick={() => {
                                claimCredential(obj.credential, obj.id)
                                  .then(() => {})
                                  .catch(() => {});
                              }}
                            >
                              Claim
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {!obj.claimed && (
                            <Button
                              color="danger"
                              onClick={() => {
                                deleteCredential(obj.id).catch(() => {});
                              }}
                            >
                              Delete
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
