import React from 'react';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';

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
  const a = 'a';
  return (
    <div className="mt-1 rounded-xl  p-1">
      <Card isBlurred className="p-2">
        <CardHeader>{schema.title}</CardHeader>
        <CardBody>
          {schema.fields.map((field: any, key: any) => {
            if (field.type === 'object') {
              return (
                <div key={key}>
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
        </CardBody>
      </Card>
    </div>
  );
};

export const CredentialForm = ({
  schema,
  handleInputValueChange,
  submitForm,
}: CredentialFormProps) => {
  const a = 'A';

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitForm();
        }}
      >
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
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};
