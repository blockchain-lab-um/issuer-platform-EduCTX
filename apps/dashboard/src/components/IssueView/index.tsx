'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { signOut } from 'next-auth/react';

import { ISSUER_ENDPOINT } from '@/config/api';
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

const SCHEMAS: Schema[] = [
  {
    title: 'Schema A',
    fields: [{ title: 'test', type: 'string', propertyName: 'test' }],
    type: '#didSchema',
  },
  EducationalCredentialSchema,
];

export const IssueView = () => {
  const [selectedSchema, setSelectedSchema] = useState({} as Schema);
  const [next, setNext] = useState(false);
  const [inputs, setInputs] = useState<any>({});
  const [_, setIsFilled] = useState(false);
  const [credentialIssued, setCredentialIssued] = useState(false);

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
    const newInputs = buildInputObject(selectedSchema);
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

  const issue = async () => {
    const body = inputs;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('schemaType', selectedSchema.type || '');
    try {
      const response = await fetch(`${ISSUER_ENDPOINT}/issue-deferred`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (response.ok) {
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
    <div
      className="flex min-h-screen w-screen items-center justify-center"
      style={{
        backgroundImage: 'linear-gradient(115deg, #9F7AEA, #FEE2FE)',
      }}
    >
      <div className="w-3/4 max-w-7xl rounded-3xl bg-white p-4 text-gray-900">
        <div className="flex w-full items-center justify-between">
          Welcome, Mr. Professor
          <Button
            size="sm"
            variant="bordered"
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
        <div className="flex w-full flex-col items-center justify-center py-16">
          {!next && (
            <>
              <Select
                label="Select a credential Schema"
                className="max-w-xs"
                onChange={handleSelectionChange}
              >
                {SCHEMAS.map((schema) => (
                  <SelectItem key={schema.title} value={schema.title}>
                    {schema.title}
                  </SelectItem>
                ))}
              </Select>
              {selectedSchema && (
                <Button
                  color="primary"
                  onClick={() => {
                    handleNext();
                  }}
                  className="mt-8"
                >
                  Next
                </Button>
              )}
            </>
          )}

          {next && (
            <>
              <div className="flex items-center gap-x-4">
                <Button
                  color="primary"
                  variant="bordered"
                  size="sm"
                  onClick={() => {
                    setCredentialIssued(false);
                    setNext(false);
                  }}
                >
                  Back
                </Button>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-700">Selected Schema</span>
                  <span className="font-semibold">{selectedSchema.title}</span>
                </div>
              </div>
              <div className="mt-8">
                <CredentialForm
                  schema={selectedSchema}
                  handleInputValueChange={handleInputValueChange}
                  submitForm={() => issue()}
                />
              </div>
              <div>
                {credentialIssued ? (
                  <Button color="primary" className="mt-8" isDisabled={true}>
                    Credential Issued
                  </Button>
                ) : (
                  <div></div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
