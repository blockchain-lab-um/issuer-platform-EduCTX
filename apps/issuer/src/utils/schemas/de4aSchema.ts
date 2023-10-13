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
              required: [
                'id',
                'title',
                'volumeOfLearning',
                'iSCEDFCode',
                'eCTSCreditPoints',
              ],
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
                awardingDate: {
                  type: 'string',
                },
                awardingLocation: {
                  type: 'string',
                },
              },
              required: [
                'id',
                'awardingBody',
                'awardingDate',
                'awardingLocation',
              ],
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
              required: ['id', 'title', 'grade', 'issuedDate'],
            },
            associatedLearningOpportunity: {
              type: 'string',
            },
          },
          required: [
            'id',
            'title',
            'specifiedBy',
            'wasAwardedBy',
            'wasDerivedFrom',
            'associatedLearningOpportunity',
          ],
        },
      },
      required: [
        'currentFamilyName',
        'currentGivenName',
        'dateOfBirth',
        'personIdentifier',
        'achieved',
      ],
    },
  },
  required: ['credentialSubject'],
};
