import type { Schema, SchemaNode } from '../schemaTypes';

export const HealthInsuranceCardCredential = {
  $id: '#healthInsuranceCardCredential',
  type: 'object',
  format: 'jwt_vc_json',
  properties: {
    credentialSubject: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        healthInsuranceCardNumber: {
          type: 'string',
        },
      },
      required: ['id', 'healthInsuranceCardNumber'],
    },
  },
  required: ['credentialSubject'],
};

export const HealthInsuranceCardCredentialSchema = {
  title: 'Health Insurance Card',
  type: '#healthInsuranceCardCredential',
  format: 'jwt_vc_json',
  fields: [
    {
      title: 'Credential Subject',
      type: 'object',
      propertyName: 'credentialSubject',
      fields: [
        {
          title: 'Health Insurance Card Number',
          propertyName: 'healthInsuranceCardNumber',
          type: 'string',
          required: true,
        } as SchemaNode,
      ],
      required: true,
    },
  ],
  required: true,
} as Schema;
