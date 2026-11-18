import type { Schema } from '../schemaTypes';

export const EHICCredential = {
  $id: '#ehicCredential',
  type: 'object',
  properties: {},
  required: [],
};

export const EHICCredentialSchema = {
  title: 'EHIC Credential',
  type: '#ehicCredential',
  fields: [],
  required: false,
} as Schema;
