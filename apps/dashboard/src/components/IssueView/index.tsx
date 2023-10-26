import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ISSUER_ENDPOINT } from '@/config/api';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import axios from 'axios';
import { signOut } from 'next-auth/react';

interface Schema {
  type?: string;
  title: string;
  fields: {
    title: string;
    type: 'string' | 'number';
  }[];
}

const SCHEMAS: Schema[] = [
  {
    title: 'Schema A',
    fields: [{ title: 'test', type: 'string' }],
    type: '#didSchema',
  },
  {
    title: 'Schema B',
    fields: [
      { title: 'fieldA', type: 'string' },
      { title: 'fieldB', type: 'number' },
    ],
  },
];

export const IssueView = () => {
  const [selectedSchema, setSelectedSchema] = useState({} as Schema);
  const [next, setNext] = useState(false);
  const [inputs, setInputs] = useState<any>({});
  const [isFilled, setIsFilled] = useState(false);
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
    const newInputs: Record<string, any> = {};
    selectedSchema.fields.forEach((field) => {
      newInputs[field.title] = undefined;
    });
    newInputs.subject = undefined;
    setInputs(newInputs);
    setIsFilled(false);
    setNext(true);
  };

  const handleInputValueChange = (e: string, field: string) => {
    setInputs({ ...inputs, [field]: e });
  };

  const issue = async () => {
    const body = { credentialSubject: {} };
    body.credentialSubject = { id: inputs.subject };
    body.credentialSubject = { ...body.credentialSubject, ...inputs };

    try {
      const response = await axios.post(
        `${ISSUER_ENDPOINT}}/issue-deferred`,
        JSON.stringify(body),
        {
          headers: {
            schemaType: selectedSchema.type,
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

  useEffect(() => {
    if (
      inputs &&
      Object.values(inputs).every(
        (input) => input !== undefined && input !== ''
      )
    ) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [inputs]);

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
                <Input
                  key=""
                  label="Subject DID"
                  type="text"
                  className="mt-2"
                  onValueChange={(e) => handleInputValueChange(e, 'subject')}
                />
                {selectedSchema.fields.map((field) => (
                  <Input
                    key={field.title}
                    label={field.title}
                    type={field.type}
                    className="mt-2"
                    onValueChange={(e) =>
                      handleInputValueChange(e, field.title)
                    }
                  />
                ))}
              </div>
              <div>
                {credentialIssued ? (
                  <Button color="primary" className="mt-8" isDisabled={true}>
                    Credential Issued
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onClick={() => issue()}
                    className="mt-8"
                    isDisabled={!isFilled}
                  >
                    Issue
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
