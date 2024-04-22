import React, { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isError } from '@blockchain-lab-um/masca-connector';
import { Dialog, Transition } from '@headlessui/react';
import { DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Bars3Icon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';

import { useGeneralStore, useMascaStore } from '@/stores';
import { Logo } from '../Logo';

interface MappedCredentials {
  credential: any;
  claimed: boolean;
  date: string;
  id: string;
}

export const ClaimView = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<MappedCredentials[]>([]);
  const { currDID, api } = useMascaStore((state) => ({
    currDID: state.currDID,
    api: state.mascaApi,
  }));
  const [noCredentials, setNoCredentials] = useState(false);

  async function getProof(): Promise<string | undefined> {
    const url = `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/query/nonce/${currDID}`;
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

    const claimUrl = `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/query/claim`;

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

    const mappedCredentials: MappedCredentials[] = credData
      .map((obj: any) => ({
        credential: obj.credential,
        claimed: false,
        date: obj.created_at,
        id: obj.id,
      }))
      .sort((a: any, b: any) => {
        return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
      });

    setCredentials(mappedCredentials);
    setIsSelected(false);
  };

  const requestDeletion = async (id: string) => {
    const proof = await getProof();
    if (!proof) {
      console.error('No proof');
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/query/${id}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'x-pop': proof,
        },
      });
      if (!response.ok) {
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
      return;
    }

    const updatedCredentials = credentials.map((obj) => {
      if (obj.id === id) {
        return { ...obj, claimed: true };
      }
      return obj;
    });

    setCredentials(updatedCredentials);
  };

  const { changeIsConnected } = useGeneralStore((state) => ({
    changeIsConnected: state.changeIsConnected,
  }));

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-40 flex md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pb-4 pt-5">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute right-0 top-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <Logo />
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  <div>
                    <span className="text-md block text-center font-medium text-gray-600">
                      Connected with
                    </span>
                    <div className="flex items-center px-2">
                      <span className="truncate text-center text-lg font-semibold text-gray-800">
                        {currDID}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard
                            .writeText(currDID)
                            .catch(() => {});
                        }}
                      >
                        <DocumentDuplicateIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center p-4">
                    <Button
                      size="sm"
                      variant="light"
                      onClick={() => {
                        changeIsConnected(false);
                        router.push('/');
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true" />
          </Dialog>
        </Transition.Root>

        <div className="hidden bg-white md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <div className="flex flex-grow flex-col overflow-y-auto border-r-2 border-gray-300 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <Logo />
            </div>
            <div className="mt-5 flex flex-grow flex-col">
              <div>
                <span className="text-md block text-center font-medium text-gray-600">
                  Connected with
                </span>
                <div className="flex items-center px-2">
                  <span className="truncate text-center text-lg font-semibold text-gray-800">
                    {currDID}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currDID).catch(() => {});
                    }}
                  >
                    <DocumentDuplicateIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-center p-4">
              <Button
                size="md"
                color="danger"
                onClick={() => {
                  changeIsConnected(false);
                  router.push('/');
                }}
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="py-4">
                  <div className="rounded-lg border-2 border-gray-300 bg-white">
                    <h1 className="p-6 text-3xl font-semibold text-gray-800">
                      Claim Credentials
                    </h1>
                    {isSelected && (
                      <div className="flex flex-col items-center py-6">
                        <Button
                          size="lg"
                          color="success"
                          variant="flat"
                          isLoading={isLoading}
                          onClick={() => {
                            setIsLoading(true);
                            checkForCredentials()
                              .then(() => {
                                setIsLoading(false);
                              })
                              .catch(() => {
                                setIsLoading(false);
                              });
                          }}
                          className="font-medium"
                        >
                          Check for New Credentials
                        </Button>
                        {noCredentials && (
                          <label className="mt-4 text-red-500">
                            Sorry, it seems that there are no new credentials
                            for you to claim. Try again later.
                          </label>
                        )}
                      </div>
                    )}
                    {!isSelected && (
                      <div className="p-8">
                        <div>
                          <div className="flex justify-between">
                            <Button
                              variant="bordered"
                              size="sm"
                              color="success"
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
                              <TableColumn>DATE</TableColumn>
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
                                    {new Date(obj.date).toLocaleDateString(
                                      'sl-SI'
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {obj.claimed ? (
                                      <Button
                                        color="success"
                                        endContent={
                                          <CheckIcon className="h-4 w-4" />
                                        }
                                        disabled
                                      >
                                        Claimed
                                      </Button>
                                    ) : (
                                      <Button
                                        color="success"
                                        variant="flat"
                                        onClick={() => {
                                          claimCredential(
                                            obj.credential,
                                            obj.id
                                          )
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
                                      <button
                                        type="button"
                                        onClick={() => {
                                          deleteCredential(obj.id).catch(
                                            () => {}
                                          );
                                        }}
                                      >
                                        <TrashIcon className="h-6 w-6 text-red-500" />
                                      </button>
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
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
