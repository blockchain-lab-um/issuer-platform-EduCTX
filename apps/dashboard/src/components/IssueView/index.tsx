import React, { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  DocumentPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Button, Select, SelectItem } from '@nextui-org/react';
import axios from 'axios';
import clsx from 'clsx';
import { signOut } from 'next-auth/react';

import { Logo } from '@/components/Logo';
import { ISSUER_ENDPOINT } from '@/config/api';
import { CredentialForm } from './CredentialForm';
import { EduCredentialSchema } from './educationCredential';

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

const SCHEMAS: Schema[] = [
  {
    title: 'Schema A',
    fields: [{ title: 'test', type: 'string', propertyName: 'test' }],
    type: '#didSchema',
  },
  EduCredentialSchema,
];

export const IssueView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [next, setNext] = useState(false);
  const [inputs, setInputs] = useState<any>({});
  const [isFilled, setIsFilled] = useState(false);
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
    // Builds the input object with all the fields from the schema correctly nested
    const buildInputObject = (schema: Schema) => {
      const inputObject: Record<string, any> = {};
      schema.fields.forEach((field) => {
        if (field.type === 'object') {
          inputObject[field.propertyName] = buildInputObject(field);
        } else {
          inputObject[field.propertyName] = undefined;
        }
      });
      return inputObject;
    };

    console.log('Built Schema:', selectedSchema);
    console.log(buildInputObject(selectedSchema!));

    const newInputs = buildInputObject(selectedSchema!);

    setInputs(newInputs);
    setIsFilled(false);
    setNext(true);
  };

  const handleInputValueChange = (e: string, path: string) => {
    console.log('e', e);
    console.log('path', path);
    // Update the correct field in inpuitsObject with the new value. Mind the path
    const newInputs = { ...inputs };

    console.log(newInputs);
    const pathArray = path.split('/').filter((p) => p !== '');
    console.log(pathArray);
    let currentObject = newInputs;
    pathArray.forEach((key, index) => {
      if (index === pathArray.length - 1) {
        currentObject[key] = e;
      } else {
        currentObject = currentObject[key];
      }
    });
    console.log('Updated inputs:', newInputs);
    setInputs(newInputs);
  };

  const issue = async () => {
    // const body = { credentialSubject: {} };
    // body.credentialSubject = { id: inputs.subject };
    // body.credentialSubject = { ...body.credentialSubject, ...inputs };
    const body = inputs;
    console.log('body', body);
    console.log('type', selectedSchema!.type);

    try {
      const response = await axios.post(
        `${ISSUER_ENDPOINT}/issue-deferred`,
        JSON.stringify(body),
        {
          headers: {
            schemaType: selectedSchema!.type,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data === true) {
        setCredentialIssued(true);
      }
    } catch (error: any) {
      console.error('Error making POST request:', error.message);
      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Response Status:', error.response.status);
        console.error('Response Headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Axios config error:', error.config);
      }
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
                <div>Welcome Mr. Professor</div>

                <nav className="space-y-1 px-2">
                  <button
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
                        ' text-green-500 hover:text-green-600',
                        'mr-3 h-6 w-6 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    Issue Credential
                  </button>
                </nav>
                <div className="flex justify-center p-4">
                  <Button
                    size="sm"
                    variant="light"
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
          <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
        </Dialog>
      </Transition.Root>

      <div className="hidden bg-white md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r-2 border-gray-300 pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <Logo />
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <div>Welcome Mr. Professor</div>

            <nav className="flex-1 space-y-1 px-2 pb-4">
              <button
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
              size="sm"
              variant="light"
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
                            <Button
                              color="default"
                              variant="flat"
                              size="sm"
                              onClick={() => {
                                setCredentialIssued(false);
                                setNext(false);
                                setSelectedSchema(null);
                              }}
                            >
                              Back
                            </Button>
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
                              submitForm={() => issue()}
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
                    Welcome
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
