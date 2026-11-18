import type { Schema, SchemaNode } from '../schemaTypes';

export const DiplomaCredential = {
  $id: '#diplomaCredential',
  type: 'object',
  properties: {
    credentialSubject: {
      type: 'object',
      properties: {
        studentName: {
          type: 'string',
        },
        birthDate: {
          type: 'string',
          format: 'date',
        },
        university: {
          type: 'string',
        },
        degree: {
          type: 'string',
        },
        issueDate: {
          type: 'string',
          format: 'date',
        },
      },
      required: [
        'studentName',
        'birthDate',
        'university',
        'degree',
        'issueDate',
      ],
    },
  },
  required: ['credentialSubject'],
};

export const DiplomaCredentialSchema = {
  title: 'Diploma Credential',
  type: '#diplomaCredential',
  fields: [
    {
      title: 'Credential Subject',
      type: 'object',
      propertyName: 'credentialSubject',
      fields: [
        {
          title: 'Student Name',
          propertyName: 'studentName',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Birth Date',
          propertyName: 'birthDate',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'University',
          propertyName: 'university',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Degree',
          propertyName: 'degree',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Issue Date',
          propertyName: 'issueDate',
          type: 'string',
          required: true,
        } as SchemaNode,
      ],
    },
  ],
  required: true,
} as Schema;
