'use client';

import React, { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  DocumentPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Button, Select, SelectItem } from '@nextui-org/react';
import clsx from 'clsx';
import { signOut } from 'next-auth/react';

import { Logo } from '@/components/Logo';
import { useToastStore } from '@/stores';
import { CredentialForm } from './CredentialForm';
import { EducationalCredentialSchema } from './educationCredential';

interface SchemaNode {
  title: string;
  type: 'string' | 'number';
  isCredentialSubject?: boolean;
  required?: boolean;
  propertyName: string;
}

interface SchemaObject {
  title: string;
  type: 'object';
  fields: SchemaNode[] | SchemaObject[];
  required?: boolean;
  propertyName: string;
}

interface Schema {
  title: string;
  type?: string;
  fields: SchemaNode[] | SchemaObject[];
}

const SCHEMAS: Schema[] = [EducationalCredentialSchema];

export const IssueView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(
    SCHEMAS[0]
  );
  const [next, setNext] = useState(false);
  const [inputs, setInputs] = useState<any>({});
  const [_, setIsFilled] = useState(false);
  const [credentialIssued, setCredentialIssued] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);

  const router = useRouter();

  const handleSelectionChange = (e: { target: { value: string } }) => {
    const selectedShema = SCHEMAS.find(
      (schema) => schema.title === e.target.value
    );
    if (selectedShema) {
      setSelectedSchema(selectedShema);
    }
  };

  const handleNext = () => {
    const buildInputObject = (schema: Schema) => {
      const inputObject: Record<string, any> = {};
      schema.fields.forEach((field) => {
        inputObject[field.propertyName] =
          field.type === 'object' ? buildInputObject(field) : null;
      });
      return inputObject;
    };
    const newInputs = buildInputObject(selectedSchema!);
    setInputs(newInputs);
    setIsFilled(false);
    setNext(true);
  };

  const handleInputValueChange = (e: string, path: string) => {
    const newInputs = { ...inputs };
    const pathArray = path.split('/').filter((p) => p !== '');
    let currentObject = newInputs;
    pathArray.forEach((key, index) => {
      if (index === pathArray.length - 1) {
        currentObject[key] = e;
      } else {
        currentObject = currentObject[key];
      }
    });
    setInputs(newInputs);
  };

  const goBack = () => {
    setCredentialIssued(false);
    setNext(false);
  };

  const issue = async () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('schemaType', selectedSchema!.type || '');
    const body = inputs;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH}/api/issue-deferred`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      setCredentialIssued(true);
      useToastStore.setState({
        open: true,
        title: 'Credential Issued',
        type: 'success',
        loading: false,
        link: null,
      });
    } else {
      const responseBody = await response.json();
      console.error(responseBody.error);
      useToastStore.setState({
        open: true,
        title: response.statusText,
        type: 'error',
        loading: false,
        link: null,
      });
    }
  };

  return (
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
                    Welcome
                  </span>
                  {/* <span className="block text-center text-lg font-semibold text-gray-800">
                    Mr. Professor
                  </span> */}
                </div>

                <nav className="mt-8 space-y-1 px-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsIssuing(true);
                      setSidebarOpen(false);
                    }}
                    className={clsx(
                      'bg-green-50 text-green-500 hover:bg-green-50/80 hover:text-green-600',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium'
                    )}
                  >
                    <DocumentPlusIcon
                      className={clsx(
                        'text-green-500 hover:text-green-600',
                        'mr-3 h-6 w-6 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    Issue Credential
                  </button>
                </nav>
                <div className="flex justify-center p-4">
                  <Button
                    size="md"
                    color="danger"
                    onClick={() => {
                      signOut()
                        .then(() => {
                          router.push('/');
                        })
                        .catch(() => {});
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
                Welcome
              </span>
              {/* <span className="block text-center text-lg font-semibold text-gray-800">
                Mr. Professor
              </span> */}
            </div>

            <nav className="mt-8 flex-1 space-y-1 px-2 pb-4">
              <button
                type="button"
                onClick={() => {
                  setIsIssuing(true);
                }}
                className={clsx(
                  'bg-green-50 text-green-500 hover:bg-green-50/80 hover:text-green-600',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium'
                )}
              >
                <DocumentPlusIcon
                  className={clsx(
                    ' text-green-500 hover:text-green-600',
                    'mr-3 h-6 w-6 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
                Issue Credential
              </button>
            </nav>
          </div>
          <div className="flex justify-center p-4">
            <Button
              size="md"
              color="danger"
              onClick={() => {
                signOut()
                  .then(() => {
                    router.push('/');
                  })
                  .catch(() => {});
              }}
            >
              Logout
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
              {isIssuing ? (
                <div className="py-4">
                  <div className="rounded-lg border-2 border-gray-300 bg-white">
                    <h1 className="p-6 text-3xl font-semibold text-gray-800">
                      Issue Credential
                    </h1>
                    <div className="flex w-full flex-col justify-center py-4">
                      {!next && (
                        <div className="flex w-full justify-center">
                          <div className="flex w-full max-w-xs flex-col items-center">
                            <Select
                              label="Select a credential Schema"
                              className="max-w-xs"
                              onChange={handleSelectionChange}
                              defaultSelectedKeys={['Education Credential']}
                            >
                              {SCHEMAS.map((schema) => (
                                <SelectItem
                                  key={schema.title}
                                  value={schema.title}
                                >
                                  {schema.title}
                                </SelectItem>
                              ))}
                            </Select>
                            {selectedSchema && (
                              <div className="mt-8 flex w-full justify-end">
                                <Button
                                  color="primary"
                                  variant="flat"
                                  className="text-md bg-green-100 font-medium text-green-500 hover:bg-green-50/80"
                                  onClick={() => {
                                    handleNext();
                                  }}
                                >
                                  Next
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {next && (
                        <div className="px-4">
                          <div className="flex items-center gap-x-4">
                            <div className="flex flex-col">
                              <span className="text-xs text-green-600">
                                Selected Schema
                              </span>
                              <span className="font-semibold">
                                {(selectedSchema as unknown as Schema).title}
                              </span>
                            </div>
                          </div>
                          <div className="mt-8">
                            <CredentialForm
                              schema={selectedSchema as unknown as Schema}
                              handleInputValueChange={handleInputValueChange}
                              submitForm={() => {
                                issue()
                                  .then(() => goBack())
                                  .catch((error) => {
                                    console.error(
                                      'Error enabling Masca:',
                                      error
                                    );
                                  });
                              }}
                              isIssued={credentialIssued}
                              goBack={() => goBack()}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <div className="h-96 rounded-lg border-2 border-gray-300 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
                      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        <span className="block font-bold">
                          Ready to dive in?
                        </span>
                        <span className="text-xl font-semibold">
                          Issue a new credential
                        </span>
                      </h2>
                      <div className="mt-8 flex justify-center">
                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsIssuing(true);
                            }}
                            className={clsx(
                              'bg-green-100 text-green-600 hover:bg-green-50 ',
                              'group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium'
                            )}
                          >
                            <DocumentPlusIcon
                              className={clsx(
                                ' text-green-600',
                                'mr-3 h-6 w-6 flex-shrink-0'
                              )}
                              aria-hidden="true"
                            />
                            Issue Credential
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
