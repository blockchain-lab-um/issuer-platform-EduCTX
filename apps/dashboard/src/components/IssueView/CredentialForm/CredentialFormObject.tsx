import React, { useState } from 'react';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { CredentialFormNode } from './CredentialFormNode';
import clsx from 'clsx';
import type { SchemaObject } from '../schemaTypes';

interface CredentialFormObjectProps {
  path: string;
  schema: SchemaObject;
  handleInputValue: (e: string, path: string) => void;
  setDateValidity: (dateValidity: any) => void;
}

export const CredentialFormObject = ({
  path,
  schema,
  handleInputValue,
  setDateValidity,
}: CredentialFormObjectProps) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div
      className={clsx(
        'mt-2 rounded-none',
        path !== '' && 'border-l-2 border-gray-300 p-1',
      )}
    >
      {path === '' ? (
        <div className="font-medium text-gray-800">{schema.title}</div>
      ) : (
        <div className="flex items-center gap-x-2 text-green-600">
          {isOpen ? (
            <div
              className="cursor-pointer text-green-600"
              onClick={() => setIsOpen(false)}
            >
              <MinusCircleIcon className="h-6 w-6" />
            </div>
          ) : (
            <div
              className="cursor-pointer text-green-600"
              onClick={() => setIsOpen(true)}
            >
              <PlusCircleIcon className="h-6 w-6" />
            </div>
          )}
          {schema.title}
        </div>
      )}

      <div className={`${!isOpen && 'hidden'}`}>
        {schema.fields.map((field: any, key: number) => {
          if (field.type === 'object') {
            return (
              <div key={key.toString()} className="ml-4">
                <CredentialFormObject
                  path={`${path}/${schema.propertyName}`}
                  schema={field}
                  handleInputValue={handleInputValue}
                  setDateValidity={setDateValidity}
                />
              </div>
            );
          }
          return (
            <div key={key.toString()}>
              <CredentialFormNode
                path={`${path}/${schema.propertyName}`}
                schema={field}
                handleInputValue={handleInputValue}
                date={field.propertyName
                  .toString()
                  .toLowerCase()
                  .includes('date')}
                setDateValidity={setDateValidity}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
