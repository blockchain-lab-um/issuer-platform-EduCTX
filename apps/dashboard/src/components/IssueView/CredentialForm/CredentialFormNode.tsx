import React, { useState } from 'react';
import { Input } from '@nextui-org/react';
import type { SchemaNode } from '../schemaTypes';

interface CredentialFormNodeProps {
  path: string;
  schema: SchemaNode;
  handleInputValue: (e: string, path: string) => void;
  setDateValidity: (dateValidity: any) => void;
  date?: boolean;
}

export const CredentialFormNode = ({
  path,
  schema,
  handleInputValue,
  setDateValidity,
  date = false,
}: CredentialFormNodeProps) => {
  const [dateError, setDateError] = useState(false);
  const [dateErrorText, setDateErrorText] = useState('');

  if (date) {
    return (
      <div className="mt-2">
        <Input
          className="max-w-xs"
          label={schema.title}
          isRequired={schema.required}
          type={schema.type}
          isClearable={true}
          onClear={() => {
            setDateError(false);
            setDateErrorText('');
            setDateValidity((prevState: any) => ({
              ...prevState,
              [path]: false,
            }));
          }}
          isInvalid={dateError}
          errorMessage={dateErrorText}
          onChange={(e) => {
            const date = e.target.value.trim();
            if (!date) {
              setDateError(false);
              setDateErrorText('');
              setDateValidity((prevState: any) => ({
                ...prevState,
                [path]: false,
              }));
              return;
            }
            // Check date format
            const regEx = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
            const invalidDate =
              !regEx.test(date) || Number.isNaN(Date.parse(date));
            setDateValidity((prevState: any) => ({
              ...prevState,
              [path]: invalidDate,
            }));
            invalidDate
              ? (() => {
                  setDateError(true);
                  setDateErrorText(
                    'Invalid date format. Please use YYYY-MM-DD.',
                  );
                })()
              : (() => {
                  setDateError(false);
                  setDateErrorText('');
                  handleInputValue(date, `${path}/${schema.propertyName}`);
                })();
          }}
        />
      </div>
    );
  }

  return (
    <div className="mt-2">
      <Input
        className="max-w-xs"
        label={schema.title}
        isRequired={schema.required}
        type={schema.type}
        isClearable={true}
        onChange={(e) => {
          handleInputValue(e.target.value, `${path}/${schema.propertyName}`);
        }}
      />
    </div>
  );
};
