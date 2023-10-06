export const DidSchema = {
  $id: '#didSchema',
  type: 'object',
  properties: {
    did: {
      type: 'string',
    },
  },
  required: ['did'],
};
