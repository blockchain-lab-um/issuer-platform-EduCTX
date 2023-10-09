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
    }
  },
};
