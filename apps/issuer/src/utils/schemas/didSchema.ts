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
  type: 'object',
  properties: {
    credentialSubjects: {
      type: 'array',
      items: {
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
      },
    },
  },
  required: ['credentialSubjects'],
};
