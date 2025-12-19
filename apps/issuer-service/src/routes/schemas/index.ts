import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

const idCardSchema = {
  $id: 'https://raw.githubusercontent.com/blockchain-lab-um/credential-schema-registry/refs/heads/main/schemas/id-card-credential-schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'ID Card Credential',
  description: 'Schema for ID Card Verifiable Credentials',
  type: 'object',
  properties: {
    '@context': {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    id: {
      type: 'string',
    },
    type: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    issuer: {
      type: 'string',
    },
    issuanceDate: {
      type: 'string',
      format: 'date-time',
    },
    validFrom: {
      type: 'string',
      format: 'date-time',
    },
    credentialSubject: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
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
    credentialSchema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          type: {
            type: 'string',
          },
        },
      },
    },
  },
  required: [
    '@context',
    'id',
    'type',
    'issuer',
    'issuanceDate',
    'credentialSubject',
  ],
};

const creditScoreSchema = {
  $id: 'https://raw.githubusercontent.com/blockchain-lab-um/credential-schema-registry/refs/heads/main/schemas/credit-score-credential-schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Credit Score Credential',
  description: 'Schema for Credit Score Verifiable Credentials',
  type: 'object',
  properties: {
    '@context': {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    id: {
      type: 'string',
    },
    type: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    issuer: {
      type: 'string',
    },
    issuanceDate: {
      type: 'string',
      format: 'date-time',
    },
    validFrom: {
      type: 'string',
      format: 'date-time',
    },
    credentialSubject: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
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
          minimum: 300,
          maximum: 850,
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
    credentialSchema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          type: {
            type: 'string',
          },
        },
      },
    },
  },
  required: [
    '@context',
    'id',
    'type',
    'issuer',
    'issuanceDate',
    'credentialSubject',
  ],
};

const schemas: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get(
    '/id-card-credential-schema.json',
    {
      config: {
        description: 'Returns ID Card credential JSON schema',
      },
    },
    async (_, reply) => {
      return reply.code(200).send(idCardSchema);
    },
  );

  fastify.get(
    '/credit-score-credential-schema.json',
    {
      config: {
        description: 'Returns Credit Score credential JSON schema',
      },
    },
    async (_, reply) => {
      return reply.code(200).send(creditScoreSchema);
    },
  );
};

export default schemas;
