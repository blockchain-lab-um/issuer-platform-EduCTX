import React from 'react';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '@nextui-org/react';

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

interface CredentialFormProps {
  schema: Schema;
  handleInputValueChange: (e: string, path: string) => void;
  submitForm: () => void;
}

interface CredentialFormNodeProps {
  path: string;
  schema: SchemaNode;
  handleInputValue: (e: string, path: string) => void;
}

export const CredentialFormNode = ({
  path,
  schema,
  handleInputValue,
}: CredentialFormNodeProps) => {
  const a = 'a';
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

interface CredentialFormObjectProps {
  path: string;
  schema: SchemaObject;
  handleInputValue: (e: string, path: string) => void;
}

export const CredentialFormObject = ({
  path,
  schema,
  handleInputValue,
}: CredentialFormObjectProps) => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div
      className={`mt-2 rounded-none ${
        path !== '' && 'border-l-2 border-gray-300 p-1'
      }`}
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
        {schema.fields.map((field: any, key: any) => {
          if (field.type === 'object') {
            return (
              <div key={key} className="ml-4">
                <CredentialFormObject
                  path={`${path}/${schema.propertyName}`}
                  schema={field}
                  handleInputValue={handleInputValue}
                />
              </div>
            );
          }
          return (
            <div key={key}>
              <CredentialFormNode
                path={`${path}/${schema.propertyName}`}
                schema={field}
                handleInputValue={handleInputValue}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CredentialForm = ({
  schema,
  handleInputValueChange,
  submitForm,
}: CredentialFormProps) => (
  <div>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
    >
      <div className="">
        {schema.fields.map((field: any, key: any) => {
          if (field.type === 'object') {
            return (
              <div key={key}>
                <CredentialFormObject
                  path={''}
                  schema={field}
                  handleInputValue={handleInputValueChange}
                />
              </div>
            );
          }
          return (
            <div key={key}>
              <CredentialFormNode
                path={''}
                schema={field}
                handleInputValue={handleInputValueChange}
              />
            </div>
          );
        })}
      </div>
      <div className="flex w-full justify-end">
        <Button
          color="primary"
          variant="flat"
          className="text-md  bg-green-100 font-medium text-green-500 hover:bg-green-50/80"
          type="submit"
        >
          Issue Credential
        </Button>
      </div>
    </form>
  </div>
);
