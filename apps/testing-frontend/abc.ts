// import nodemailer from 'nodemailer';
// import type Mail from 'nodemailer/lib/mailer';
// import PdfPrinter from 'pdfmake';
// import fs from 'node:fs';
// import type { TDocumentDefinitions } from 'pdfmake/interfaces';
// import QRCode from 'qrcode';

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: 587,
//   secure: false,
//   // secure: true,
//   // port: 465,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
//   tls: {
//     ciphers: 'SSLv3',
//   },
// });

// // Define font files
// const fonts = {
//   Courier: {
//     normal: 'Courier',
//     bold: 'Courier-Bold',
//     italics: 'Courier-Oblique',
//     bolditalics: 'Courier-BoldOblique',
//   },
//   Helvetica: {
//     normal: 'Helvetica',
//     bold: 'Helvetica-Bold',
//     italics: 'Helvetica-Oblique',
//     bolditalics: 'Helvetica-BoldOblique',
//   },
//   Times: {
//     normal: 'Times-Roman',
//     bold: 'Times-Bold',
//     italics: 'Times-Italic',
//     bolditalics: 'Times-BoldItalic',
//   },
//   Symbol: {
//     normal: 'Symbol',
//   },
//   ZapfDingbats: {
//     normal: 'ZapfDingbats',
//   },
// };

// const printer = new PdfPrinter(fonts);

// const {
//   title,
//   achievement,
//   personFullName,
//   shortDescription,
//   value,
//   unit,
//   awardingBody,
// } = {
//   title: 'Certificate of Achievement',
//   achievement: 'Achievement',
//   personFullName: 'John Doe',
//   shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//   awardingBody: 'Blockchain Lab:UM',
//   value: 10,
//   unit: 'ects',
// };

// const qrCode = (await QRCode.toBuffer('location')).toString('base64');
// const qrCodeBase64 = `data:image/png;base64,${qrCode}`;

// const docDefinition: TDocumentDefinitions = {
//   pageSize: 'A4',
//   pageOrientation: 'landscape',
//   background: [
//     {
//       svg: '<svg width="900" height="*"><rect width="100%" height="100%" style="fill:rgb(248,248,248)"/></svg>',
//     },
//   ],

//   content: [
//     {
//       columns: [
//         {
//           margin: [0, 12],
//           alignment: 'center',
//           stack: [
//             {
//               alignment: 'center',
//               margin: [0, 128, 0, 0],
//               columns: [
//                 {
//                   alignment: 'right',
//                   margin: [0, 9, 0, 0],
//                   svg: '<svg height="1" width="10"><line x1="0" y1="0" x2="10" y2="0" stroke="#1A1502" stroke-width="0.8"/></svg>',
//                 },
//                 {
//                   width: 'auto',
//                   text: achievement,
//                   margin: [6, 0, 6, 0],
//                   fontSize: 16,
//                 },
//                 {
//                   alignment: 'left',
//                   margin: [0, 9, 0, 0],
//                   svg: '<svg height="1" width="10"><line x1="0" y1="0" x2="10" y2="0" stroke="#1A1502" stroke-width="0.8"/></svg>',
//                 },
//               ],
//             },
//             {
//               text: title,
//               margin: [30, 16, 30, 0],
//               fontSize: 40,
//               bold: true,
//             },
//             {
//               text: 'ISSUED TO',
//               margin: [30, 12, 30, 0],
//               fontSize: 14,
//               color: '#BDBDBD',
//             },
//             {
//               text: personFullName,
//               margin: [30, 12, 30, 0],
//               fontSize: 24,
//               bold: true,
//             },
//             {
//               text: 'ISSUED BY',
//               margin: [30, 12, 30, 0],
//               fontSize: 14,
//               color: '#BDBDBD',
//             },
//             {
//               text: awardingBody,
//               margin: [30, 12, 30, 0],
//               fontSize: 24,
//               bold: true,
//             },
//             // {
//             //   alignment: 'center',
//             //   svg: '<svg height="1" width="500"><line x1="40" y1="0" x2="460" y2="0" stroke="#1A1502" stroke-width="0.8"/></svg>',
//             //   margin: [0, 9, 0, 0],
//             // },
//             // {
//             //   text: shortDescription,
//             //   margin: [30, 12, 30, 0],
//             //   fontSize: 13,
//             //   color: '#4F4F4F',
//             // },
//             {
//               margin: [0, 128, 0, 0],
//               columns: [
//                 // {
//                 //   stack: [
//                 //     {
//                 //       text: 'MEASUREMENT UNIT',
//                 //       fontSize: 14,
//                 //       bold: true,
//                 //       color: '#BDBDBD',
//                 //       alignment: 'center',
//                 //     },
//                 //     {
//                 //       text: `${value} ${unit}`,
//                 //       fontSize: 14,
//                 //       alignment: 'center',
//                 //       margin: [0, 2, 0, 0],
//                 //     },
//                 //   ],
//                 // },
//                 {
//                   stack: [
//                     {
//                       text: 'CERTIFICATE ISSUED',
//                       fontSize: 14,
//                       bold: true,
//                       color: '#BDBDBD',
//                       alignment: 'center',
//                     },
//                     {
//                       text: new Date().toLocaleString(),
//                       fontSize: 14,
//                       alignment: 'center',
//                       margin: [0, 2, 0, 0],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],

//   pageMargins: [0, 30, 0, 30],

//   defaultStyle: {
//     font: 'Helvetica',
//   },
// };

// const pdfBuffer = await new Promise<Buffer>((resolve) => {
//   const pdfDoc = printer.createPdfKitDocument(docDefinition);
//   const buffs: unknown[] = [];
//   pdfDoc.on('data', (d) => {
//     buffs.push(d as readonly Uint8Array[]);
//   });
//   pdfDoc.on('end', () => {
//     resolve(Buffer.concat(buffs as readonly Uint8Array[]));
//   });
//   pdfDoc.end();
// });

// fs.writeFileSync('test.pdf', pdfBuffer.toString('binary'), 'binary');

// // const emailOptions: Mail.Options = {
// //   from: process.env.EMAIL_USERNAME,
// //   to: 'domajnko.martin@gmail.com',
// //   subject: 'Blockchain Lab:UM (EduCTX)',
// //   html: '<p>Hello world!</p>',
// //   attachments: [
// //     {
// //       filename: 'test.pdf',
// //       content: pdfBuffer,
// //       contentType: 'application/pdf',
// //     },
// //   ],
// // };

// // // // Send email with credential offer request
// // const sendMessageInfo = await transporter.sendMail(emailOptions);

// // console.log('Message sent: %s', sendMessageInfo.messageId);
