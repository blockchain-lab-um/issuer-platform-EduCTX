import type { EducationCredentialType } from '@/lib/credentialSubjectTypes';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

export const EducationCredentialPDF = ({
  currentFamilyName,
  currentGivenName,
  achieved: {
    title: achievementTitle,
    wasAwardedBy: { awardingBody },
  },
}: EducationCredentialType) => {
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    background: [
      {
        svg: '<svg width="900" height="*"><rect width="100%" height="100%" style="fill:rgb(248,248,248)"/></svg>',
      },
    ],

    content: [
      {
        columns: [
          {
            margin: [0, 12],
            alignment: 'center',
            stack: [
              {
                alignment: 'center',
                margin: [0, 128, 0, 0],
                columns: [
                  {
                    alignment: 'right',
                    margin: [0, 9, 0, 0],
                    svg: '<svg height="1" width="10"><line x1="0" y1="0" x2="10" y2="0" stroke="#1A1502" stroke-width="0.8"/></svg>',
                  },
                  {
                    width: 'auto',
                    text: 'Achievement',
                    margin: [6, 0, 6, 0],
                    fontSize: 16,
                  },
                  {
                    alignment: 'left',
                    margin: [0, 9, 0, 0],
                    svg: '<svg height="1" width="10"><line x1="0" y1="0" x2="10" y2="0" stroke="#1A1502" stroke-width="0.8"/></svg>',
                  },
                ],
              },
              {
                text: achievementTitle,
                margin: [30, 16, 30, 0],
                fontSize: 40,
                bold: true,
              },
              {
                text: 'ISSUED TO',
                margin: [30, 12, 30, 0],
                fontSize: 14,
                color: '#BDBDBD',
              },
              {
                text: `${currentFamilyName} ${currentGivenName}`,
                margin: [30, 12, 30, 0],
                fontSize: 24,
                bold: true,
              },
              {
                text: 'ISSUED BY',
                margin: [30, 12, 30, 0],
                fontSize: 14,
                color: '#BDBDBD',
              },
              {
                text: awardingBody,
                margin: [30, 12, 30, 0],
                fontSize: 24,
                bold: true,
              },
              {
                margin: [0, 128, 0, 0],
                columns: [
                  {
                    stack: [
                      {
                        text: 'CERTIFICATE ISSUED',
                        fontSize: 14,
                        bold: true,
                        color: '#BDBDBD',
                        alignment: 'center',
                      },
                      {
                        text: new Date().toLocaleString(),
                        fontSize: 14,
                        alignment: 'center',
                        margin: [0, 2, 0, 0],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],

    pageMargins: [0, 30, 0, 30],

    defaultStyle: {
      font: 'Helvetica',
    },
  };

  return docDefinition;
};
