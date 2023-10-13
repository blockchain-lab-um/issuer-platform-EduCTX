'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';

interface Schema {
  title: string;
  fields: {
    title: string;
    type: 'string' | 'number';
  }[];
}

const SCHEMAS: Schema = [
  {
    title: 'Schema A',
    fields: [
      { title: 'Field A', type: 'string' },
      { title: 'Field B', type: 'string' },
    ],
  },
  {
    title: 'Schema B',
    fields: [
      { title: 'Field A', type: 'string' },
      { title: 'Field B', type: 'number' },
    ],
  },
];

export const IssueView = () => {
  const [selectedSchema, setSelectedSchema] = useState(undefined);
  const [next, setNext] = useState(false);
  const [inputs, setInputs] = useState(undefined);
  const [isFilled, setIsFilled] = useState(false);

  const handleSelectionChange = (e) => {
    setSelectedSchema(
      SCHEMAS.find((schema) => schema.title === e.target.value)
    );
  };

  const handleNext = () => {
    const newInputs = {};
    selectedSchema.fields.forEach((field) => {
      newInputs[field.title] = undefined;
    });
    newInputs.subject = undefined;
    setInputs(newInputs);
    setIsFilled(false);
    setNext(true);
  };

  const handleInputValueChange = (e, field) => {
    setInputs({ ...inputs, [field]: e });
  };

  useEffect(() => {
    console.log(inputs);
    if (
      inputs &&
      Object.values(inputs).every(
        (input) => input !== undefined && input !== ''
      )
    ) {
      console.log('all filled');
      setIsFilled(true);
    } else {
      console.log('not all filled');
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
          <Button size="sm" variant="bordered">
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
                <Button color="primary" className="mt-8" isDisabled={!isFilled}>
                  Issue
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
