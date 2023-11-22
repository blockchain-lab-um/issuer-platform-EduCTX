export const EducationCredential = {
  $id: '#educationCredential',
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
        id: {
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
      required: ['currentFamilyName', 'currentGivenName', 'achieved', 'id'],
    },
  },
  required: ['credentialSubject'],
};

export const EducationCredentialBatch = {
  $id: '#educationCredentialBatch',
  type: 'array',
  items: { $ref: '#educationCredential' },
};
