export const de4aSchema = {
  $id: '#de4aSchema',
  type: 'object',
  properties: {
    credentialSubject: {
      type: 'object',
      properties: {
        currentFamilyName: {
          type: 'string',
        },
        currentGivenName: {
          type: 'string',
        },
        dateOfBirth: {
          type: 'string',
        },
        personIdentifier: {
          type: 'string',
        },
        achieved: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            title: {
              type: 'string',
            },
            specifiedBy: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                title: {
                  type: 'string',
                },
                volumeOfLearning: {
                  type: 'string',
                },
                iSCEDFCode: {
                  type: 'string',
                },
                eCTSCreditPoints: {
                  type: 'number',
                },
              },
              required: ['title'],
            },
            wasAwardedBy: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                awardingBody: {
                  type: 'string',
                },
                awardingBodyDescription: {
                  type: 'string',
                },
                awardingDate: {
                  type: 'string',
                },
                awardingLocation: {
                  type: 'string',
                },
              },
              required: ['awardingBody', 'awardingBodyDescription'],
            },
            wasDerivedFrom: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                title: {
                  type: 'string',
                },
                grade: {
                  type: 'string',
                },
                issuedDate: {
                  type: 'string',
                },
              },
              required: ['title', 'grade'],
            },
            associatedLearningOpportunity: {
              type: 'string',
            },
          },
          required: ['title', 'specifiedBy', 'wasAwardedBy', 'wasDerivedFrom'],
        },
      },
      required: ['currentFamilyName', 'currentGivenName', 'achieved'],
    },
  },
  required: ['credentialSubject'],
};

export const de4aSchemaBatch = {
  $id: '#de4aSchemaBatch',
  type: 'array',
  items: { $ref: '#de4aSchema' },
};
