import type { EducationCredentialType } from '@/lib/credentialSubjectTypes';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { otherGray } from './images/otherGray';
import { bclabum } from './images/bclabum';
import { eductx } from './images/eductx';
import { masca } from './images/masca';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const EducationCredentialPDF = ({
  achieved: {
    title: achievementTitle,
    specifiedBy: { title: specifiedTitle, eCTSCreditPoints },
    wasAwardedBy: { awardingBodyDescription, awardingDate, awardingLocation },
    wasDerivedFrom: { grade, title: derivedTitle },
  },
  currentFamilyName,
  currentGivenName,
}: EducationCredentialType) => {
  const issuedTo = `${currentFamilyName} ${currentGivenName}`;
  const date = dayjs(awardingDate, 'YYYY-MM-DD').format('DD. MM. YYYY');
  const issuedDate = `${date}, ${awardingLocation}`;
  const obseg = `${eCTSCreditPoints} ECTS`;

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    content: [
      {
        table: {
          widths: ['auto', '*', 'auto'],
          body: [
            [
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 12,
                    w: 57,
                    h: 30,
                    color: '#F4D280',
                  },
                ],
              },
              {
                text: 'Potrdilo',
                fontSize: 16,
                bold: true,
                color: '#1A1502',
                margin: [10, 19, 0, 0],
                alignment: 'left',
              },
              {
                image: eductx,
                width: 54,
                alignment: 'right',
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0,
        },
        margin: [0, 0, 0, 0],
      },
      {
        text: achievementTitle,
        fontSize: 13,
        color: '#5F6060',
        alignment: 'left',
        margin: [0, 36, 0, 0],
      },
      {
        text: specifiedTitle,
        fontSize: 32,
        bold: true,
        color: '#1A1502',
        alignment: 'left',
        margin: [0, 6, 0, 0],
      },
      {
        text: derivedTitle,
        fontSize: 14,
        bold: false,
        color: '#156166',
        alignment: 'left',
        margin: [0, 6, 0, 0],
      },
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                table: {
                  widths: ['*'],
                  body: [
                    [
                      {
                        text: 'Potrdilo prejme:',
                        fontSize: 13,
                        color: '#1A1502',
                        alignment: 'left',
                        margin: [0, 0, 0, 10],
                      },
                    ],
                    [
                      {
                        stack: [
                          {
                            canvas: [
                              {
                                type: 'rect',
                                x: -80,
                                y: 0,
                                w: 545,
                                h: 32,
                                color: '#F4D280',
                              },
                            ],
                            margin: [0, 5, 0, 0],
                          },
                          {
                            text: issuedTo,
                            fontSize: 18,
                            bold: true,
                            alignment: 'left',
                            color: '#1A1502',
                            margin: [0, -27, 0, 2],
                          },
                        ],
                      },
                    ],
                    [
                      {
                        columns: [
                          {
                            width: '67%',
                            stack: [
                              {
                                text: 'OBSEG',
                                fontSize: 14,
                                color: '#BDBDBD',
                                margin: [0, 0, 0, 0],
                              },
                              {
                                text: obseg,
                                fontSize: 28,
                                color: '#333333',
                                margin: [0, 4, 0, 0],
                              },
                              {
                                text: 'POTRDILO IZDAJA',
                                fontSize: 14,
                                color: '#BDBDBD',
                                margin: [0, 24, 0, 0],
                              },
                              {
                                text: awardingBodyDescription,
                                fontSize: 15,
                                color: '#000000',
                                margin: [0, 5, 20, 0],
                              },
                            ],
                          },
                          {
                            width: '33%',
                            stack: [
                              {
                                text: 'OCENA',
                                fontSize: 14,
                                color: '#BDBDBD',
                                margin: [0, 0, 0, 2],
                              },
                              {
                                text: grade,
                                fontSize: 16,
                                color: '#333333',
                                margin: [0, 9, 0, 0],
                              },
                              {
                                text: 'DATUM IN KRAJ',
                                fontSize: 14,
                                color: '#BDBDBD',
                                margin: [0, 31, 0, 0],
                              },
                              {
                                text: issuedDate,
                                fontSize: 14,
                                color: '#000000',
                                margin: [0, 5, 0, 0],
                              },
                            ],
                            alignment: 'left',
                          },
                        ],
                        margin: [0, 18, 0, 0],
                      },
                    ],
                  ],
                },
                layout: 'noBorders',
                margin: [28, 27, 0, 24],
              },
            ],
          ],
        },
        layout: 'noBorders',
        margin: [0, 26, 0, 10],
        fillColor: '#F8F8F8',
      },
      {
        columns: [
          {
            image: bclabum,
            width: 113,
            alignment: 'left',
            margin: [0, 10, 0, 0],
          },
          {
            width: 16,
            text: '',
          },
          {
            image: masca,
            width: 43,
            alignment: 'right',
            margin: [0, 10, 0, 10],
          },
        ],
        margin: [0, 40, 0, 0],
      },
      {
        image: otherGray,
        width: 495,
        alignment: 'center',
        margin: [0, 25, 0, 10],
      },
    ],
    pageMargins: [50, 40, 52, 40],
    defaultStyle: {
      font: 'Inter',
    },
  };

  return docDefinition;
};
