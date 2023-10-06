export const ProgramSchema = {
  $id: '#programCompletionSchema',
  type: 'object',
  properties: {
    credential: {
      type: 'object',
      properties: {
        '@context': {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'https://www.w3.org/2018/credentials/v1',
              'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
            ],
          },
          minItems: 2,
          uniqueItems: true,
        },
        type: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['VerifiableCredential', 'ProgramCompletionCertificate'],
          },
          minItems: 2,
          uniqueItems: true,
        },
        credentialSubject: {
          type: 'object',
          properties: {
            accomplishmentType: {
              type: 'string',
            },
            learnerName: {
              type: 'string',
            },
            achievement: {
              type: 'string',
            },
            courseProvider: {
              type: 'string',
            },
            id: {
              type: 'string',
            },
          },
          required: [
            'accomplishmentType',
            'learnerName',
            'achievement',
            'courseProvider',
            'id',
          ],
        },
        credentialSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            type: {
              type: 'string',
              enum: ['JsonSchemaValidator2018'],
            },
          },
          required: ['id', 'type'],
        },
      },
      required: ['@context', 'type', 'credentialSubject', 'credentialSchema'],
    },
  },
  required: ['credential'],
};
