import type { Schema, SchemaNode, SchemaObject } from '../schemaTypes';

export const EducationCredentialNOO = {
  $id: '#educationCredentialNOO',
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
              required: ['title', 'eCTSCreditPoints'],
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
              required: [
                'awardingBody',
                'awardingBodyDescription',
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

export const EducationalCredentialSchemaNOO = {
  title: 'Education Credential NOO',
  type: '#educationCredentialNOO',
  fields: [
    {
      title: 'Credential Subject',
      type: 'object',
      propertyName: 'credentialSubject',
      fields: [
        {
          title: 'Current Family Name',
          propertyName: 'currentFamilyName',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Current Given Name',
          propertyName: 'currentGivenName',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Date of Birth',
          propertyName: 'dateOfBirth',
          type: 'string',
          required: false,
        } as SchemaNode,
        {
          title: 'Person Identifier',
          propertyName: 'personIdentifier',
          type: 'string',
          required: false,
        } as SchemaNode,
        {
          title: 'Achieved',
          propertyName: 'achieved',
          type: 'object',
          fields: [
            {
              title: 'ID',
              propertyName: 'id',
              type: 'string',
              required: false,
            } as SchemaNode,
            {
              title: 'Title',
              propertyName: 'title',
              type: 'string',
              required: true,
            } as SchemaNode,
            {
              title: 'Specified By',
              propertyName: 'specifiedBy',
              type: 'object',
              fields: [
                {
                  title: 'ID',
                  type: 'string',
                  propertyName: 'id',
                  required: false,
                } as SchemaNode,
                {
                  title: 'Title',
                  propertyName: 'title',
                  type: 'string',
                  required: true,
                } as SchemaNode,
                {
                  title: 'Volume of Learning',
                  propertyName: 'volumeOfLearning',
                  type: 'string',
                  required: false,
                } as SchemaNode,
                {
                  title: 'ISCEDF Code',
                  propertyName: 'iSCEDFCode',
                  type: 'string',
                  required: false,
                } as SchemaNode,
                {
                  title: 'ECTS Credit Points',
                  propertyName: 'eCTSCreditPoints',
                  type: 'number',
                  required: true,
                } as SchemaNode,
              ],
              required: true,
            } as SchemaObject,
            {
              title: 'Was Awarded By',
              propertyName: 'wasAwardedBy',
              type: 'object',
              fields: [
                {
                  title: 'ID',
                  propertyName: 'id',
                  type: 'string',
                  required: false,
                } as SchemaNode,
                {
                  title: 'Awarding Body',
                  propertyName: 'awardingBody',
                  type: 'string',
                  required: true,
                } as SchemaNode,
                {
                  title: 'Awarding Body Description',
                  propertyName: 'awardingBodyDescription',
                  type: 'string',
                  required: true,
                } as SchemaNode,
                {
                  title: 'Awarding Date',
                  propertyName: 'awardingDate',
                  type: 'string',
                  required: true,
                } as SchemaNode,
                {
                  title: 'Awarding Location',
                  propertyName: 'awardingLocation',
                  type: 'string',
                  required: true,
                } as SchemaNode,
              ],
              required: true,
            } as SchemaObject,
            {
              title: 'Was Derived From',
              type: 'object',
              propertyName: 'wasDerivedFrom',
              fields: [
                {
                  title: 'ID',
                  type: 'string',
                  propertyName: 'id',
                  required: false,
                },
                {
                  title: 'Title',
                  propertyName: 'title',
                  type: 'string',
                  required: true,
                },
                {
                  title: 'Grade',
                  propertyName: 'grade',
                  type: 'string',
                  required: true,
                },
                {
                  title: 'Issued Date',
                  propertyName: 'issuedDate',
                  type: 'string',
                  required: false,
                },
              ],
              required: true,
            } as SchemaObject,
            {
              title: 'Associated Learning Opportunity',
              propertyName: 'associatedLearningOpportunity',
              type: 'string',
              required: false,
            } as SchemaNode,
          ],
          required: true,
        } as SchemaObject,
      ],
      required: true,
    } as SchemaObject,
  ],
  required: true,
} as Schema;
