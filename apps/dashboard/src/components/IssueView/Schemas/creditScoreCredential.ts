import type { Schema, SchemaNode } from '../schemaTypes';

export const CreditScoreCredential = {
  $id: '#creditScoreCredential',
  type: 'object',
  format: 'jwt_vc_json',
  properties: {
    credentialSubject: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        idCardNumber: {
          type: 'string',
        },
        creditScore: {
          type: 'number',
        },
        assessmentDate: {
          type: 'string',
          format: 'date',
        },
        scoringAgency: {
          type: 'string',
        },
      },
      required: ['firstName', 'lastName', 'idCardNumber', 'creditScore'],
    },
  },
  required: ['credentialSubject'],
};

export const CreditScoreCredentialSchema = {
  title: 'Credit Score Credential',
  type: '#creditScoreCredential',
  format: 'jwt_vc_json',
  fields: [
    {
      title: 'Credential Subject',
      type: 'object',
      propertyName: 'credentialSubject',
      fields: [
        {
          title: 'First Name',
          propertyName: 'firstName',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Last Name',
          propertyName: 'lastName',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'ID Card Number',
          propertyName: 'idCardNumber',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Credit Score',
          propertyName: 'creditScore',
          type: 'number',
          required: true,
        } as SchemaNode,
        {
          title: 'Assessment Date',
          propertyName: 'assessmentDate',
          type: 'string',
          required: false,
        } as SchemaNode,
        {
          title: 'Scoring Agency',
          propertyName: 'scoringAgency',
          type: 'string',
          required: false,
        } as SchemaNode,
      ],
      required: true,
    },
  ],
  required: true,
} as Schema;
