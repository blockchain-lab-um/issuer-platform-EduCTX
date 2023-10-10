import React, { useState } from 'react';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  Select,
  SelectItem,
} from '@nextui-org/react';

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
  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center"
      style={{
        backgroundImage: 'linear-gradient(115deg, #9F7AEA, #FEE2FE)',
      }}
    >
      <div className="w-3/4 rounded-3xl bg-white p-4 text-gray-900">
        <div className="flex w-full items-center justify-between">
          Welcome, Mr. Professor
          <Button size="sm" variant="bordered">
            Logout
          </Button>
        </div>
        <div className="flex w-full flex-col items-center justify-center py-16">
          <Select
            label="Select a credential Schema"
            className="max-w-xs"
            onSelectionChange={setSelectedSchema}
          >
            {SCHEMAS.map((schema) => (
              <SelectItem key={schema.title} value={schema.title}>
                {schema.title}
              </SelectItem>
            ))}
          </Select>
          {selectedSchema && (
            <Button color="primary" className="mt-8">
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
