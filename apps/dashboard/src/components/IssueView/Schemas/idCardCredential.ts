import type { Schema, SchemaNode } from '../schemaTypes';

export const IDCardCredential = {
  $id: '#idCardCredential',
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
        dateOfBirth: {
          type: 'string',
          format: 'date',
        },
        placeOfBirth: {
          type: 'string',
        },
        country: {
          type: 'string',
        },
        idNumber: {
          type: 'string',
        },
        nationality: {
          type: 'string',
        },
        issueDate: {
          type: 'string',
          format: 'date',
        },
        expiryDate: {
          type: 'string',
          format: 'date',
        },
        address: {
          type: 'string',
        },
      },
      required: [
        'firstName',
        'lastName',
        'dateOfBirth',
        'placeOfBirth',
        'country',
        'idNumber',
        'nationality',
        'issueDate',
        'expiryDate',
      ],
    },
  },
  required: ['credentialSubject'],
};

export const IDCardCredentialSchema = {
  title: 'ID Card Credential',
  type: '#idCardCredential',
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
          title: 'Date of Birth',
          propertyName: 'dateOfBirth',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Place of Birth',
          propertyName: 'placeOfBirth',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Country',
          propertyName: 'country',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'ID Number',
          propertyName: 'idNumber',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Nationality',
          propertyName: 'nationality',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Issue Date',
          propertyName: 'issueDate',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Expiry Date',
          propertyName: 'expiryDate',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Address',
          propertyName: 'address',
          type: 'string',
          required: false,
        } as SchemaNode,
      ],
      required: true,
    },
  ],
  required: true,
} as Schema;
