export const johnDoeEuropeanDigitalCredential = {
  credentialSubject: {
    id: 'urn:epass:person:1',
    type: 'Person',
    givenName: {
      en: ['John'],
    },
    familyName: {
      en: ['Doe'],
    },
    fullName: {
      en: ['John Doe'],
    },
    dateOfBirth: '1999-01-01T00:00:00',
    hasClaim: [
      {
        id: 'urn:epass:entitlement:1',
        type: 'LearningEntitlement',
        awardedBy: {
          id: 'urn:epass:awardingProcess:1',
          type: 'AwardingProcess',
          awardingBody: [
            {
              id: 'urn:epass:org:1',
              type: 'Organisation',
              location: [
                {
                  id: 'urn:epass:location:1',
                  type: 'Location',
                  address: [
                    {
                      id: 'urn:epass:address:1',
                      type: 'Address',
                      countryCode: {
                        id: 'http://publications.europa.eu/resource/authority/country/SVN',
                        type: 'Concept',
                        inScheme: {
                          id: 'http://publications.europa.eu/resource/authority/country',
                          type: 'ConceptScheme',
                        },
                        prefLabel: {
                          en: ['Slovenia'],
                        },
                        notation: 'country',
                      },
                      fullAddress: {
                        id: 'urn:epass:note:1',
                        type: 'Note',
                        noteLiteral: {
                          en: ['Slomskov trg 15, 2000 Maribor'],
                        },
                      },
                    },
                  ],
                },
              ],
              legalName: {
                en: ['University of Maribor'],
              },
              registration: {
                id: 'urn:epass:legalIdentifier:2',
                type: 'LegalIdentifier',
                notation: '001',
                spatial: {
                  id: 'http://publications.europa.eu/resource/authority/country/SVN',
                  type: 'Concept',
                  inScheme: {
                    id: 'http://publications.europa.eu/resource/authority/country',
                    type: 'ConceptScheme',
                  },
                  prefLabel: {
                    en: ['Slovenia'],
                  },
                  notation: 'country',
                },
              },
            },
          ],
        },
        title: {
          en: ['Bachelor in Computer Science'],
        },
        specifiedBy: {
          id: 'urn:epass:learningEntitlementSpec:1',
          type: 'LearningEntitlementSpecification',
          title: {
            en: ['Bachelor in Computer Science'],
          },
          dcType: [
            {
              id: 'http://data.europa.eu/snb/entitlement/64aad92881',
              type: 'Concept',
              inScheme: {
                id: 'http://data.europa.eu/snb/entitlement/25831c2',
                type: 'ConceptScheme',
              },
              prefLabel: {
                en: ['learning opportunity'],
              },
            },
          ],
          entitlementStatus: {
            id: 'http://data.europa.eu/snb/entitlement-status/b7015a8a8c',
            type: 'Concept',
            inScheme: {
              id: 'http://data.europa.eu/snb/entitlement-status/25831c2',
              type: 'ConceptScheme',
            },
            prefLabel: {
              en: ['actual'],
            },
          },
        },
      },
    ],
  },
  extraFields: {
    credentialProfiles: [
      {
        id: 'http://data.europa.eu/snb/credential/e34929035b',
        type: 'Concept',
        inScheme: {
          id: 'http://data.europa.eu/snb/credential/25831c2',
          type: 'ConceptScheme',
        },
        prefLabel: {
          en: ['Generic'],
        },
      },
    ],
    displayParameter: {
      id: 'urn:epass:displayParameter:1',
      type: 'DisplayParameter',
      language: [
        {
          id: 'http://publications.europa.eu/resource/authority/language/ENG',
          type: 'Concept',
          inScheme: {
            id: 'http://publications.europa.eu/resource/authority/language',
            type: 'ConceptScheme',
          },
          prefLabel: {
            en: ['English'],
          },
          notation: 'language',
        },
      ],
      individualDisplay: [
        {
          id: 'urn:epass:individualDisplay:eee3f8bd-5447-4461-be72-15a54b4d18f7',
          type: 'IndividualDisplay',
          language: {
            id: 'http://publications.europa.eu/resource/authority/language/ENG',
            type: 'Concept',
            inScheme: {
              id: 'http://publications.europa.eu/resource/authority/language',
              type: 'ConceptScheme',
            },
            prefLabel: {
              en: ['English'],
            },
            notation: 'language',
          },
          displayDetail: [
            {
              id: 'urn:epass:displayDetail:74f68503-e4b1-4a08-9f4e-0b19282662f0',
              type: 'DisplayDetail',
              image: {
                id: 'urn:epass:mediaObject:826058e8-7ec0-4417-bc5c-72664313c446',
                type: 'MediaObject',
                content:
                  '/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCARjAxoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKzLbxHod5cJb2us6dPO5wscV0jMx9gDk0AadFFFABRRRQAUUVm3XiHRLG5e2vNY0+3nTG6Ka5RGXIyMgnI4INAGlRSKwZQykFSMgjoaWgAooooAKKKKACiiobq7trG2e5u7iK3gTG6WZwirk4GSeByQKAJqKpWOsaZqjOun6jaXbIAXFvOshXPTOCcVdoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKrXuoWWmwia/vLe1iLbQ88qopbrjJPXg/lSWOpWGpxtJYXttdxqdrNBKsgB9CQaALVFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAfKMdk2peI1sUcI9zdiFWboCz4yfzrq/EXw21nwnpL6uNQhkihZQ5hZldckAH8yPzrlI2u08Rq9hk3i3YMG0AnzN/wAuAeDziun8T3fxCu9JZfEEd99gVgXzbqiZzxuKAd/X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f5ivMPgn/wAjTf8A/Xkf/Q0r2rULC11Swmsb2LzbaZdsibiuR9QQay9E8HaD4cupLnSrD7PNInls3nSPlcg4wzEdQKAPGPixolxp3jGe+KH7LfASRvjjcAAy/XIz9CK9B0H4teHptHg/tS5ktLxECyoYXcMwHJUqDwffFd1f6dZ6paPaX9tFcQN1jkXI+v1965GT4TeEXl3iymQZ+4tw+P1OaALkep2nxB8H6vHpokWOTzLWN5Rt3PsBDY7DLD8q8K8PLpGm+JDb+K7CV7Vd0UqZdWhfP3sKQTjGMe9fSGjaHp3h+x+xaXbC3gLFyoYtliACSSSewqlrng7QPET+bqWnxyTAY85CUf8AEqRn8c0AefXCfB6CHzAglOMhI5Lksf14/Gut+HX9gT6PdXnh/TZLG2kuDGyyys7PtAwTknH3ugNRQfCfwjDJvaxml/2ZLh8foRXWafpllpNotrp9rFbQA52RLgZ9T6n3oAtUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABWbdeHtEvrl7m80fT7id8bpZrZHZsDAySMngAVpUUAIqhVCqAFAwAOgpaKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKgvLuKxs5rqckRxIXbAyTjsB3NT1Q1q0lvdIuIIApmwHjDHAZlIYAnsCRigBsNzqrujS6bbxwsRn/Sy0ig+q7NuR7MfxpkmpXc17PbabZxT/AGchZpJ5zEgcgNtGFYk4IJ4A565zT4dYimkSL7LfpKxAKvaSAKe+Xxt49QSPTNZT2NvZajfNeJqmy4m86OS0kuCpBVQQViPBBB6jkY564AL0+vrBokuoPayB4JVhmt8/MrbwpwRnPXI9Rjpmqut3msJpDyraQQHz4AuLxg+DIoIOEwOwIBIwTzxyXNnF/YLixtrseddwysJvMaRsSx5Y7yWxtXv0ArQ16CW40eVIIzJIrRyhF6tsdWIHuQtADb26mh0vzdQsrdj9oiQRRzF15kQBslByCc4x2HPpR8QC6uNU0uzWztbm1kd2aOeYqHYIeGGxgQM578444zVnVJv7S0bNtDcEi6t/leB0biVCTtYA4A5z04PpU1/FI+taTIsbMiNLvYDIXKEDJ7UARadNIurSWc+nWltJFaxlHt5S42bmAXlFwBg/nSjVL66aZ9O0+Ke3ido/MlufLMjKSG2AK2QCCMkjkenNSJFIPE803lt5Rs41D44JDucZ9eRWPbWNppqSWt5HrAdZZGVraS6aN1ZiwI8skKcHkHHOe3NAGq+tCS1sXs7cyzXpKxxyv5YQgEtvODjGCOAefzq9aSXjq32y3hhcH5RDMZAR9Sq/yrNkh0220m3hlsLs2xYuoEUkskbkk7iVy4Yknn3p2itM1xdhPtn9ngIIDeKwk3fNvxv+fb9zG7nO7tigBuv3F9BcaSLJI28y72uHnaMN+7cgHCnI4z+A49ItbuLiJdFlmtgbj7eB5MMm8EmOQDDEL7ZJAxzVvW45NtjcpE8q2t0ssixrubbtZSQBycbs4HPFMv2N7Jo88EUxRb3c26JkKjy5BkggEDJHX1HrQBLBqF0uoR2d/aRQPMjNC8M5kVtuMg5VSDznoeAeafcT6ms7ra2FvJEuMPNdGMtxngBG+nJHT8ajv4pH1rSZFjZkRpd7AZC5QgZPas2WK3/tO/8A7W02e9dpAbXNq00fl7FwF4Kod27OceucYoAk1fU7i48NJeaehSRriJHWSUxshEwVlyoPO4FT2xnr0O1atdPETdwwxSZ4WKUyDHrkqv8AKubs9PvE8EvbG08u4S7lmFvGu0YF00m1QccEDjsciuktbqO8iMkazKoOMTQvEfyYA/jQBPRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUjEKpY5wBngZNAC0VzT+PvDkepjTHu7lb4sFFubCfzCTyPl2Z6V0isHRWGcEZGQQfyPSqlCUfiViYyjLZi0UVU1LUbfSrJ7y683yYwSxiheQgYzkhQSBx16Ukm3ZDbtqy3RWZoOvWXiPTRqGn+YbYuyK0ibd2OpA9P8K06GnF2YJpq6CiiikMKKKx9a8UaT4dVX1Wea3jbAEn2WV0ye25VIzx0zmnGLk7RVxOSirs2KK5tPHnh6S1W6W6ufszDInNhOI8eu4pj9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P1N+Sf8AxNHkSf8AP1N+Sf8AxNTUUAQ+RJ/z9Tfkn/xNHkSf8/U35J/8TU1FAEPkSf8AP1N+Sf8AxNHkSf8AP1N+Sf8AxNTUUAQ+RJ/z9Tfkn/xNHkSf8/U35J/8TU1FAEPkSf8AP1N+Sf8AxNHkSf8AP1N+Sf8AxNTUUAQ+RJ/z9Tfkn/xNHkSf8/U35J/8TU1FAEPkSf8AP1N+Sf8AxNHkSf8AP1N+Sf8AxNTUUAQ+RJ/z9Tfkn/xNHkSf8/U35J/8TU1FAEPkSf8AP1N+Sf8AxNHkSf8AP1N+Sf8AxNTUUAQ+RJ/z9Tfkn/xNKkTqwJnkYehC4P5CpaKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==',
                contentEncoding: {
                  id: 'http://data.europa.eu/snb/encoding/6146cde7dd',
                  type: 'Concept',
                  inScheme: {
                    id: 'http://data.europa.eu/snb/encoding/25831c2',
                    type: 'ConceptScheme',
                  },
                  prefLabel: {
                    en: ['base64'],
                  },
                },
                contentType: {
                  id: 'http://publications.europa.eu/resource/authority/file-type/JPEG',
                  type: 'Concept',
                  inScheme: {
                    id: 'http://publications.europa.eu/resource/authority/file-type',
                    type: 'ConceptScheme',
                  },
                  prefLabel: {
                    en: ['JPEG'],
                  },
                  notation: 'file-type',
                },
              },
              page: 1,
            },
          ],
        },
      ],
      primaryLanguage: {
        id: 'http://publications.europa.eu/resource/authority/language/ENG',
        type: 'Concept',
        inScheme: {
          id: 'http://publications.europa.eu/resource/authority/language',
          type: 'ConceptScheme',
        },
        prefLabel: {
          en: ['English'],
        },
        notation: 'language',
      },
      title: {
        en: ['Bachelor in Computer Science'],
      },
    },
  },
};
