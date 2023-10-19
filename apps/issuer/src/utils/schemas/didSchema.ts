export const DidSchema = {
  $id: '#didSchema',
  type: 'object',
  properties: {
    credentialSubject: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
      required: ['id'],
    },
  },
  required: ['credentialSubject'],
};

export const DidSchemaBatch = {
  $id: '#didSchemaBatch',
  type: 'array',
  items: { $ref: '#didSchema' },
};
