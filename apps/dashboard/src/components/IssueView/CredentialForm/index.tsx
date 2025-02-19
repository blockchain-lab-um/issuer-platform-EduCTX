import React from 'react';
import { Button } from '@nextui-org/react';
import { useToastStore } from '@/stores';

import { CredentialFormNode } from './CredentialFormNode';
import { CredentialFormObject } from './CredentialFormObject';
import type { Schema } from '../schemaTypes';

interface CredentialFormProps {
  schema: Schema;
  handleInputValueChange: (e: string, path: string) => void;
  submitForm: () => void;
  submitFormByEmail: () => void;
  goBack: () => void;
}

export const CredentialForm = ({
  schema,
  handleInputValueChange,
  submitForm,
  submitFormByEmail,
  goBack,
}: CredentialFormProps) => {
  const [dateValidity, setDateValidity] = React.useState({});

  const handleFormSubmit = (byEmail: boolean) => {
    const hasInvalidDate = Object.values(dateValidity).some(
      (isInvalid) => isInvalid,
    );

    if (hasInvalidDate) {
      useToastStore.setState({
        open: true,
        title: 'One or more date fields are invalid. Please correct them.',
        type: 'error',
        loading: false,
        link: null,
      });
      return;
    }

    if (byEmail) {
      submitFormByEmail();
      return;
    }
    submitForm();
  };

  return (
    <div>
      <form>
        <div className="">
          {schema.fields.map((field: any, key: number) => {
            if (field.type === 'object') {
              return (
                <div key={key.toString()}>
                  <CredentialFormObject
                    path={''}
                    schema={field}
                    handleInputValue={handleInputValueChange}
                    setDateValidity={setDateValidity}
                  />
                </div>
              );
            }
            return (
              <div key={key.toString()}>
                <CredentialFormNode
                  path={''}
                  schema={field}
                  handleInputValue={handleInputValueChange}
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
        <div className="flex justify-end gap-x-2">
          <Button
            color="default"
            variant="flat"
            className="text-md font-medium"
            onClick={() => {
              goBack();
            }}
          >
            Back
          </Button>
          {/* <Button
            color="primary"
            variant="flat"
            className="text-md bg-green-100 font-medium text-green-500 hover:bg-green-50/80"
            type="button"
            onClick={() => handleFormSubmit(false)}
          >
            Issue Credential
          </Button> */}
          <Button
            color="primary"
            variant="flat"
            className="text-md bg-green-100 font-medium text-green-500 hover:bg-green-50/80"
            type="button"
            onClick={() => handleFormSubmit(true)}
          >
            Issue by Email
          </Button>
        </div>
      </form>
    </div>
  );
};
